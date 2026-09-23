import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { getSegmentData, recordPdfUpload, type ComplaintsSegment } from "@/lib/investor-complaints-store";

const SEGMENTS: ComplaintsSegment[] = ["stock-broker", "research-analyst", "depository-participant"];

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const admin = await verifyAdminPermission(token, "manage_investor_complaints");
    if (!admin) {
      return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const segment = formData.get("segment") as ComplaintsSegment | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!segment || !SEGMENTS.includes(segment)) {
      return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
    }
    if (path.extname(file.name).toLowerCase() !== ".pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const headerBytes = await file.slice(0, 5).arrayBuffer();
    if (Buffer.from(headerBytes).toString("ascii") !== "%PDF-") {
      return NextResponse.json({ error: "Invalid file: content does not match PDF format" }, { status: 400 });
    }

    const saveDir = path.join(process.cwd(), "public", "legal-documents");
    await mkdir(saveDir, { recursive: true });

    const { pdfFileName } = getSegmentData(segment);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(saveDir, pdfFileName), buffer);

    const updated = recordPdfUpload(segment);
    return NextResponse.json({ message: "Uploaded successfully", segment: updated[segment] });
  } catch (error) {
    console.error("Investor complaints PDF upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
