import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminPermission } from '@/lib/admin-auth';
import { bulkCreateClients } from '@/lib/client-db';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set(['xlsx', 'csv']);
const MAX_ROWS = 50000; // sanity ceiling per upload — split larger imports into batches
const CLIENT_ID_RE = /^[A-Za-z0-9_-]{2,30}$/;

interface RawRow {
  clientId?: string;
  name?: string;
  email?: string;
  mobile?: string;
}

/**
 * POST /api/admin/clients/bulk
 * Accepts a multipart upload (field name: "file") — CSV or XLSX with columns
 * clientId, name, email, mobile (header names case-insensitive; email/mobile
 * optional per-row but at least one required, matching the single-add rule).
 * Processed entirely in memory — never written to disk.
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  const admin = adminToken ? await verifyAdminPermission(adminToken, 'manage_clients') : null;
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: XLSX, CSV' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let rows: string[][];
  try {
    rows = ext === 'xlsx' ? parseXlsxRows(buffer) : parseCsvRows(buffer.toString('utf-8'));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to parse file: ${msg}` }, { status: 422 });
  }

  if (rows.length < 2) {
    return NextResponse.json({ error: 'File has no data rows (needs a header row plus at least one client)' }, { status: 422 });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const colIndex = {
    clientId: header.findIndex((h) => ['clientid', 'client id', 'client_id'].includes(h)),
    name: header.findIndex((h) => h === 'name'),
    email: header.findIndex((h) => h === 'email'),
    mobile: header.findIndex((h) => ['mobile', 'phone', 'mobile number', 'phone number'].includes(h)),
  };

  if (colIndex.clientId === -1 || colIndex.name === -1) {
    return NextResponse.json(
      { error: 'File must have "clientId" and "name" columns (email/mobile columns optional, but at least one is needed per row)' },
      { status: 422 }
    );
  }

  const dataRows = rows.slice(1);
  if (dataRows.length > MAX_ROWS) {
    return NextResponse.json(
      { error: `Too many rows (${dataRows.length}). Split into batches of ${MAX_ROWS} or fewer.` },
      { status: 422 }
    );
  }

  const parsedRecords: Array<{ clientId: string; name: string; email?: string; mobile?: string }> = [];
  const preValidationSkipped: Array<{ clientId: string; reason: string }> = [];

  for (const row of dataRows) {
    const clientId = (row[colIndex.clientId] ?? '').trim();
    const name = (row[colIndex.name] ?? '').trim();
    const email = colIndex.email !== -1 ? (row[colIndex.email] ?? '').trim() || undefined : undefined;
    const mobile = colIndex.mobile !== -1 ? (row[colIndex.mobile] ?? '').trim() || undefined : undefined;

    if (!clientId && !name && !email && !mobile) continue; // blank row

    if (!clientId || !name) {
      preValidationSkipped.push({ clientId: clientId || '(missing)', reason: 'Missing Client ID or name' });
      continue;
    }
    if (!CLIENT_ID_RE.test(clientId)) {
      preValidationSkipped.push({ clientId, reason: 'Client ID must be 2-30 chars, letters/numbers/underscore/hyphen only' });
      continue;
    }
    if (!email && !mobile) {
      preValidationSkipped.push({ clientId, reason: 'Needs at least one of email or mobile' });
      continue;
    }
    if (email && !email.includes('@')) {
      preValidationSkipped.push({ clientId, reason: 'Invalid email address' });
      continue;
    }
    if (mobile && mobile.replace(/\D/g, '').length < 10) {
      preValidationSkipped.push({ clientId, reason: 'Invalid mobile number' });
      continue;
    }

    parsedRecords.push({ clientId, name, email, mobile });
  }

  try {
    const result = bulkCreateClients(parsedRecords, admin.username);
    return NextResponse.json({
      message: `${result.inserted} client(s) added.`,
      inserted: result.inserted,
      skipped: [...preValidationSkipped, ...result.skipped],
      totalRows: dataRows.length,
    });
  } catch (error) {
    console.error('Error bulk-creating clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function parseXlsxRows(buffer: Buffer): string[][] {
  const XLSX = require('xlsx'); // eslint-disable-line
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  return rows.map((r) => r.map((c) => String(c ?? '')));
}

/**
 * Quote-aware CSV parser. A naive line.split(',') breaks on any quoted field
 * containing a comma (e.g. a name like "Doe, John") — it silently shifts every
 * column after it, which can misassign a client's email/mobile from the wrong
 * cell. This handles quoted fields (with embedded commas and escaped "" quotes)
 * and quoted newlines within a field.
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field.trim());
      field = '';
    } else if (c === '\r') {
      // skip — paired \n (or a lone \r) below flushes the row
    } else if (c === '\n') {
      row.push(field.trim());
      field = '';
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  // final field/row if the file doesn't end with a newline
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}
