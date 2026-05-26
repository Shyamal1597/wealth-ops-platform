import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { ResearchReport } from "@/lib/research-types";

// PUT - Update a report's metadata
export async function PUT(request: NextRequest) {
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

    // Get request body
    const body = await request.json();
    const {
      id,
      title,
      category,
      subcategory,
      secondaryCategory,
      secondarySubcategory,
      analystName,
      reportDate,
      description,
    } = body;

    if (!id || !title || !category || !subcategory || !reportDate) {
      return NextResponse.json(
        { error: "Missing required fields (id, title, category, subcategory, reportDate are required)" },
        { status: 400 }
      );
    }

    // Load reports
    const reportsFile = path.join(process.cwd(), "data", "research-reports.json");
    let reports: ResearchReport[] = [];
    try {
      const data = await readFile(reportsFile, "utf-8");
      reports = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No reports found" },
        { status: 404 }
      );
    }

    // Find report to update
    const reportIndex = reports.findIndex((r) => r.id === id);
    if (reportIndex === -1) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // Update report metadata (keep file info unchanged)
    const updatedReport: ResearchReport = {
      ...reports[reportIndex],
      title,
      category: category as any,
      subcategory: subcategory as any,
      secondaryCategory: secondaryCategory ? (secondaryCategory as any) : undefined,
      secondarySubcategory: secondarySubcategory ? (secondarySubcategory as any) : undefined,
      reportDate,
      analystName: analystName || undefined,
      description: description || undefined,
    };

    reports[reportIndex] = updatedReport;

    // Save updated reports
    await writeFile(reportsFile, JSON.stringify(reports, null, 2));

    return NextResponse.json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating research report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
