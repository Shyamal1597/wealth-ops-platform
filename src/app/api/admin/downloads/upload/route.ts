import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { addForm, type DownloadsTabId } from "@/lib/downloads-store";

const TAB_IDS: DownloadsTabId[] = ["equity", "depository", "ap-support", "mandatory", "policies"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const admin = await verifyAdminPermission(token, "manage_downloads");
    if (!admin) {
      return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tabId = formData.get("tabId") as DownloadsTabId | null;
    const name = (formData.get("name") as string | null)?.trim();

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!tabId || !TAB_IDS.includes(tabId)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Document name is required" }, { status: 400 });
    }
    if (path.extname(file.name).toLowerCase() !== ".pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File must be under 10 MB" }, { status: 400 });
    }

    const headerBytes = await file.slice(0, 5).arrayBuffer();
    if (Buffer.from(headerBytes).toString("ascii") !== "%PDF-") {
      return NextResponse.json({ error: "Invalid file: content does not match PDF format" }, { status: 400 });
    }

    const saveDir = path.join(process.cwd(), "public", "forms");
    await mkdir(saveDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, "")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(saveDir, filename), buffer);

    const item = addForm(tabId, name, filename);
    return NextResponse.json({ message: "Uploaded successfully", item });
  } catch (error) {
    console.error("Downloads form upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
