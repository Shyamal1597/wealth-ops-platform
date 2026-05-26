import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyClientToken } from '@/lib/auth';
import { verifyAdminToken } from '@/lib/admin-auth';
import { ResearchReport } from '@/lib/research-types';

// TDL-003: Single authoritative download gate.
// Streams the PDF bytes directly — the raw file URL is never sent to the client,
// so premium PDFs are genuinely inaccessible without a valid session.
// Free reports (>1 year old) are exempt from the auth check.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
  }

  // Load report metadata
  const dataFile = path.join(process.cwd(), 'data', 'research-reports.json');
  if (!existsSync(dataFile)) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  const reports: ResearchReport[] = JSON.parse(
    await readFile(dataFile, 'utf-8')
  );
  const report = reports.find((r) => r.id === id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Free reports (older than 1 year) — no auth required
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const isFree = report.reportDate
    ? new Date(report.reportDate) < oneYearAgo
    : false;

  if (!isFree) {
    // Premium report — require a valid session
    const cookieStore = await cookies();

    const clientToken = cookieStore.get('client-token')?.value;
    const adminToken = cookieStore.get('admin-token')?.value;

    const clientOk = clientToken && verifyClientToken(clientToken);
    const adminOk = !clientOk && adminToken && (await verifyAdminToken(adminToken));

    if (!clientOk && !adminOk) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Map stored URL path (e.g. "/research-reports/file.pdf") to filesystem path.
  const relativePath = report.filePath.replace(/^\/+/, '');
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.resolve(publicDir, relativePath);

  // Guard against path traversal — resolved path must stay inside public/
  if (!filePath.startsWith(publicDir + path.sep)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBytes = await readFile(filePath);
  const filename = path.basename(filePath);

  return new Response(fileBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': fileBytes.length.toString(),
      'Cache-Control': 'no-store',
    },
  });
}
