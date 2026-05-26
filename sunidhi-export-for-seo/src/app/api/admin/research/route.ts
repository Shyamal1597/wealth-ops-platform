import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { ResearchReport } from "@/lib/research-types";

// GET - List all reports
export async function GET(request: NextRequest) {
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

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Load reports
    const reportsFile = path.join(process.cwd(), "data", "research-reports.json");
    let reports: ResearchReport[] = [];
    try {
      const data = await readFile(reportsFile, "utf-8");
      reports = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by upload date (newest first)
    reports.sort((a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return NextResponse.json({
      reports,
      total: reports.length,
    });
  } catch (error) {
    console.error("Error fetching research reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a report
export async function DELETE(request: NextRequest) {
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

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get report ID from query
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    // Try to find and delete from both research-reports.json and daily-updates.json
    let foundInResearch = false;
    let foundInDaily = false;

    // Check research-reports.json
    const researchFile = path.join(process.cwd(), "data", "research-reports.json");
    let researchReports: ResearchReport[] = [];
    try {
      const data = await readFile(researchFile, "utf-8");
      researchReports = JSON.parse(data);
      const reportIndex = researchReports.findIndex((r) => r.id === reportId);

      if (reportIndex !== -1) {
        foundInResearch = true;
        const report = researchReports[reportIndex];

        // Delete physical file
        const filePath = path.join(process.cwd(), "public", report.filePath);
        try {
          await unlink(filePath);
        } catch (err) {
          console.error("Error deleting file:", err);
        }

        // Remove from array
        researchReports.splice(reportIndex, 1);

        // Save updated reports
        await writeFile(researchFile, JSON.stringify(researchReports, null, 2));
      }
    } catch (err) {
      // File doesn't exist or error reading
    }

    // Check daily-updates.json
    const dailyFile = path.join(process.cwd(), "data", "daily-updates.json");
    if (!foundInResearch) {
      try {
        const data = await readFile(dailyFile, "utf-8");
        const parsed = JSON.parse(data);
        const dailyUpdates: ResearchReport[] = parsed.updates || [];
        const reportIndex = dailyUpdates.findIndex((r) => r.id === reportId);

        if (reportIndex !== -1) {
          foundInDaily = true;
          const report = dailyUpdates[reportIndex];

          // Delete physical file
          const filePath = path.join(process.cwd(), "public", report.filePath);
          try {
            await unlink(filePath);
          } catch (err) {
            console.error("Error deleting file:", err);
          }

          // Remove from array
          dailyUpdates.splice(reportIndex, 1);

          // Save updated reports
          await writeFile(dailyFile, JSON.stringify({ updates: dailyUpdates }, null, 2));
        }
      } catch (err) {
        // File doesn't exist or error reading
      }
    }

    if (!foundInResearch && !foundInDaily) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting research report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
