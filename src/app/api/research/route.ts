import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import path from 'path';
import { ResearchReport } from '@/lib/research-types';

// Get all research reports (public endpoint - no authentication required)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');

    // Read from the same data file as admin API
    const dataFile = path.join(process.cwd(), 'data', 'research-reports.json');

    if (!existsSync(dataFile)) {
      return NextResponse.json({ reports: [] });
    }

    const fileContent = await require('fs').promises.readFile(dataFile, 'utf-8');
    let reports: ResearchReport[] = JSON.parse(fileContent);

    // Sort by upload date (newest first)
    reports.sort((a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    let filteredReports = reports;

    // Filter by category
    if (category) {
      filteredReports = filteredReports.filter(r => r.category === category);
    }

    // Filter by subcategory
    if (subcategory) {
      filteredReports = filteredReports.filter(r => r.subcategory === subcategory);
    }

    // Search in title and description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = filteredReports.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        (r.description && r.description.toLowerCase().includes(searchLower))
      );
    }

    // TDL-003: don't hand out the raw file path — premium PDFs are only
    // reachable via the authenticated /api/research/download gate.
    const publicReports = filteredReports.map(({ filePath, ...rest }) => rest);

    return NextResponse.json({ reports: publicReports });
  } catch (error) {
    console.error('Error fetching research reports:', error);
    return NextResponse.json({ reports: [] });
  }
}
