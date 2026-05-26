import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminPermission } from '@/lib/admin-auth';
import {
  parseSipRows,
  type AnyParsedReport,
} from '@/lib/sip-parser';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set(['xlsx', 'csv']);

/**
 * POST /api/admin/sip-products/parse
 *
 * Accepts a multipart upload (field name: "file") containing a rebalancing
 * or performance report in XLSX or CSV format.
 * Optional form fields: "profile" (hint when file lacks profile header)
 *                       "tier"    (hint when file lacks tier amount)
 *
 * Returns parsed tier data for admin review — does NOT write to disk.
 * VAPT: admin-only, in-memory processing, strict file-type + size checks.
 */
export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  // TDL-001: permission read from DB on every request — not trusted from token
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-token')?.value;
  if (!adminToken || !(await verifyAdminPermission(adminToken, 'manage_sip_products'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse multipart form ────────────────────────────────────────────────────
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

  // Hints from the admin UI (selected profile/tier in the dropdown)
  const uiProfileHint = String(formData.get('profile') ?? '').trim().toLowerCase();
  const uiTierHint    = String(formData.get('tier')    ?? '').trim();
  // Optional kind hint: 'rebalancing' | 'performance' — when set, the parsed
  // result MUST match this kind, otherwise the request is rejected. This lets
  // the admin UI show two separate upload cards and prevent cross-uploads.
  const kindHint      = String(formData.get('kind')    ?? '').trim().toLowerCase();

  // Filename-derived hints (e.g. "SIP_Performance_Aggressive_1L_24042026.xlsx")
  // These take precedence over the UI dropdown so the admin doesn't have to
  // pick the right portfolio before uploading.
  const fname = file.name;
  // Use [^A-Za-z] boundaries (not \b) because underscore is a word char in regex
  const profileFromName = fname.match(/(?:^|[^A-Za-z])(Conservative|Moderate|Aggressive)(?:[^A-Za-z]|$)/i)?.[1].toLowerCase() ?? '';
  let tierFromName = '';
  const tierMatch = fname.match(/(?:^|[^A-Za-z0-9])(\d+)\s*([KkLl])(?:[^A-Za-z]|$)/);
  if (tierMatch) {
    const n = parseInt(tierMatch[1], 10);
    const unit = tierMatch[2].toUpperCase();
    tierFromName = unit === 'L' ? String(n * 100000) : String(n * 1000);
  }

  const profileHint = profileFromName || uiProfileHint;
  const tierHint    = tierFromName    || uiTierHint;

  // ── Validate file type ──────────────────────────────────────────────────────
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: XLSX, CSV' },
      { status: 400 }
    );
  }

  // ── Validate file size ──────────────────────────────────────────────────────
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File too large (max 10 MB)' },
      { status: 400 }
    );
  }

  // ── Read into buffer (in-memory only — never written to disk) ──────────────
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let result: AnyParsedReport;

    if (ext === 'xlsx') {
      result = parseXlsx(buffer, profileHint, tierHint);
    } else {
      result = parseCsv(buffer.toString('utf-8'), profileHint, tierHint);
    }

    // Apply hints when file itself carries no profile / tier info
    if (!result.profile && profileHint) result.profile = profileHint;
    if (result.profile && Object.keys(result.tiers).length > 0 && tierHint) {
      const keys = Object.keys(result.tiers);
      if (keys.length === 1 && keys[0] === '' ) {
        result.tiers[tierHint] = result.tiers[''];
        delete result.tiers[''];
      }
    }

    if (!result.profile || Object.keys(result.tiers).length === 0) {
      return NextResponse.json(
        { error: 'Could not extract data from file. Check the file format.' },
        { status: 422 }
      );
    }

    // Enforce kind hint: reject mismatched uploads (e.g. performance file in
    // the rebalancing card)
    if (kindHint && result.type !== kindHint) {
      const expected = kindHint === 'rebalancing' ? 'rebalancing' : 'performance';
      const got      = result.type;
      return NextResponse.json(
        { error: `Wrong report type — this card expects a ${expected} report, but the file looks like a ${got} report.` },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[sip-parse] Error parsing file:', msg);
    return NextResponse.json(
      { error: `Failed to parse file: ${msg}` },
      { status: 422 }
    );
  }
}

// ─── XLSX ─────────────────────────────────────────────────────────────────────

function parseXlsx(buffer: Buffer, profileHint: string, tierHint: string): AnyParsedReport {
  const XLSX = require('xlsx'); // eslint-disable-line
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
  });
  return parseSipRows(rows, profileHint, tierHint);
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function parseCsv(text: string, profileHint: string, tierHint: string): AnyParsedReport {
  const rows: string[][] = text
    .split(/\r?\n/)
    .map((line) =>
      line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim())
    );
  return parseSipRows(rows, profileHint, tierHint);
}
