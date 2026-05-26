import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { ResearchReport } from "@/lib/research-types";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // TDL-001 fix: verify permission from the DATABASE, not from client-supplied data
    const authorizedAdmin = await verifyAdminPermission(token, "upload_reports");
    if (!authorizedAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const subcategory = formData.get("subcategory") as string;
    const secondaryCategory = formData.get("secondaryCategory") as string;
    const secondarySubcategory = formData.get("secondarySubcategory") as string;
    const analystName = formData.get("analystName") as string;
    const reportDate = formData.get("reportDate") as string;
    const description = formData.get("description") as string;

    // Auto-determine report type based on subcategory
    // If subcategory is "Daily", route to daily-updates.json
    const reportType = subcategory === "Daily" ? "daily" : "research";

    if (!file || !title || !category || !subcategory || !reportDate) {
      return NextResponse.json(
        { error: "Missing required fields (title, category, subcategory, reportDate, and file are required)" },
        { status: 400 }
      );
    }

    // TDL-002 fix: validate file type via Content-Type header AND magic bytes.
    // Attackers can spoof Content-Type in Burp Suite (text/html → application/pdf).
    // Reading the first 5 bytes of the actual file content is unforgeable.
    const fileExtension = path.extname(file.name).toLowerCase();
    if (fileExtension !== ".pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed (.pdf extension required)" },
        { status: 400 }
      );
    }

    // Read the first 5 bytes to verify the PDF magic signature (%PDF-)
    const headerBytes = await file.slice(0, 5).arrayBuffer();
    const magic = Buffer.from(headerBytes).toString("ascii");
    if (magic !== "%PDF-") {
      return NextResponse.json(
        { error: "Invalid file: content does not match PDF format" },
        { status: 400 }
      );
    }

    // Create unique ID and filename (force .pdf extension regardless of original)
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sanitizedFilename = `${reportId}.pdf`;

    // Ensure directory exists
    const uploadsDir = path.join(process.cwd(), "public", "research-reports");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Directory already exists
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, sanitizedFilename);
    await writeFile(filePath, buffer);

    // Create report metadata
    const report: ResearchReport = {
      id: reportId,
      title,
      category: category as any,
      subcategory: subcategory as any,
      secondaryCategory: secondaryCategory ? (secondaryCategory as any) : undefined,
      secondarySubcategory: secondarySubcategory ? (secondarySubcategory as any) : undefined,
      fileName: file.name,
      filePath: `/research-reports/${sanitizedFilename}`,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      reportDate: reportDate,
      analystName: analystName || undefined,
      description: description || undefined,
    };

    // Determine which file to save to based on report type
    const fileName = reportType === "daily" ? "daily-updates.json" : "research-reports.json";
    const dataKey = reportType === "daily" ? "updates" : undefined;
    const reportsFile = path.join(process.cwd(), "data", fileName);

    let reports: ResearchReport[] = [];
    try {
      const data = await readFile(reportsFile, "utf-8");
      const parsed = JSON.parse(data);
      // For daily-updates.json, extract the 'updates' array
      reports = dataKey ? (parsed[dataKey] || []) : (Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Add new report
    reports.push(report);

    // Save updated reports
    const outputData = dataKey ? { [dataKey]: reports } : reports;
    await writeFile(reportsFile, JSON.stringify(outputData, null, 2));

    return NextResponse.json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    console.error("Error uploading research report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
