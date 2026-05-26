import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

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

    // Read all feedback files
    const feedbackDir = path.join(process.cwd(), "feedback-submissions");

    try {
      const files = await readdir(feedbackDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      const feedbacks = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(feedbackDir, file);
          const content = await readFile(filePath, "utf-8");
          return JSON.parse(content);
        })
      );

      // Sort by submission date (newest first)
      feedbacks.sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      return NextResponse.json({
        feedbacks,
        total: feedbacks.length,
      });
    } catch (err) {
      // Directory doesn't exist or is empty
      return NextResponse.json({
        feedbacks: [],
        total: 0,
      });
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
