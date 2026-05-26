import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const dataFile = path.join(process.cwd(), "data", "daily-updates.json");

    const fileContent = await fs.readFile(dataFile, "utf-8");
    const data = JSON.parse(fileContent);

    // Sort by report date (newest first)
    const sortedUpdates = data.updates.sort((a: any, b: any) => {
      const dateA = new Date(a.reportDate || a.uploadDate).getTime();
      const dateB = new Date(b.reportDate || b.uploadDate).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      updates: sortedUpdates,
      total: sortedUpdates.length
    });
  } catch (error: any) {
    console.error("Error fetching daily updates:", error);
    return NextResponse.json(
      { success: false, error: error.message, updates: [] },
      { status: 500 }
    );
  }
}
