import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

const FEEDBACK_DIR = path.join(process.cwd(), "feedback-submissions");

async function authenticate(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // "open" | "closed" | null (all)

    try {
      const files = await readdir(FEEDBACK_DIR);
      const jsonFiles = files.filter((f) => f.endsWith(".json"));

      const feedbacks = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(FEEDBACK_DIR, file);
          const content = await readFile(filePath, "utf-8");
          const data = JSON.parse(content);
          // Inject id from filename for older records that don't have it
          if (!data.id) {
            data.id = file.replace(/\.json$/, "");
          }
          // Default status for older records that pre-date this field
          if (!data.status) {
            data.status = "open";
          }
          return data;
        })
      );

      // Sort by submission date (newest first)
      feedbacks.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      const filtered = statusFilter
        ? feedbacks.filter((f) => f.status === statusFilter)
        : feedbacks;

      return NextResponse.json({
        feedbacks: filtered,
        total: feedbacks.length,
        open: feedbacks.filter((f) => f.status === "open").length,
        closed: feedbacks.filter((f) => f.status === "closed").length,
      });
    } catch {
      return NextResponse.json({ feedbacks: [], total: 0, open: 0, closed: 0 });
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !["open", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "id and status (open|closed) are required" },
        { status: 400 }
      );
    }

    const filePath = path.join(FEEDBACK_DIR, `${id}.json`);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    data.status = status;
    if (!data.id) data.id = id;

    await writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const jsonPath = path.join(FEEDBACK_DIR, `${id}.json`);
    const docxPath = path.join(FEEDBACK_DIR, `${id}.docx`);

    if (!existsSync(jsonPath)) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // Delete JSON record
    await unlink(jsonPath);

    // Delete Word document if it exists
    if (existsSync(docxPath)) {
      await unlink(docxPath);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
