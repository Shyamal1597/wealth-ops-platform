import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
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

    return NextResponse.json({ reports: filteredReports });
  } catch (error) {
    console.error('Error fetching research reports:', error);
    return NextResponse.json({ reports: [] });
  }
}

// Upload a new research report
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const description = formData.get('description') as string;

    if (!file || !title || !category || !subcategory) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const researchDir = path.join(process.cwd(), 'public', 'research-files');
    const dataDir = path.join(process.cwd(), 'public', 'research-data');

    if (!existsSync(researchDir)) {
      await mkdir(researchDir, { recursive: true });
    }
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(researchDir, fileName);

    await writeFile(filePath, buffer);

    // Read existing reports
    const dataFile = path.join(dataDir, 'reports.json');
    let reports: ResearchReport[] = [];

    if (existsSync(dataFile)) {
      const fileContent = await require('fs').promises.readFile(dataFile, 'utf-8');
      reports = JSON.parse(fileContent);
    }

    // Add new report
    const newReport: ResearchReport = {
      id: Date.now().toString(),
      title,
      category: category as any,
      subcategory: subcategory as any,
      fileName: file.name,
      filePath: `/research-files/${fileName}`,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      reportDate: new Date().toLocaleDateString('en-GB').split('/').join('-'),
      description: description || undefined
    };

    reports.push(newReport);

    // Save updated reports
    await writeFile(dataFile, JSON.stringify(reports, null, 2));

    return NextResponse.json({ success: true, report: newReport });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Delete a research report
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'public', 'research-data');
    const dataFile = path.join(dataDir, 'reports.json');

    if (!existsSync(dataFile)) {
      return NextResponse.json({ error: 'No reports found' }, { status: 404 });
    }

    const fileContent = await require('fs').promises.readFile(dataFile, 'utf-8');
    const reports: ResearchReport[] = JSON.parse(fileContent);

    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const report = reports[reportIndex];

    // Delete the file
    const filePath = path.join(process.cwd(), 'public', report.filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Remove from array
    reports.splice(reportIndex, 1);

    // Save updated reports
    await writeFile(dataFile, JSON.stringify(reports, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
