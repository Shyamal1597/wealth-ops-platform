import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse multipart body ────────────────────────────────────────────────
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── Validate type ────────────────────────────────────────────────────────
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WEBP images are allowed" },
        { status: 400 }
      );
    }

    // ── Validate size ────────────────────────────────────────────────────────
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 5 MB" },
        { status: 400 }
      );
    }

    // ── Build a safe, unique filename ────────────────────────────────────────
    // Use timestamp so filenames never collide and the original name is not
    // reflected into the filesystem (prevents path traversal).
    const filename = `blog-${Date.now()}.${ext}`;
    const saveDir  = path.join(process.cwd(), "public", "images", "blog");
    const savePath = path.join(saveDir, filename);

    // Ensure directory exists (safe on every call)
    await mkdir(saveDir, { recursive: true });

    // ── Write file ───────────────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(savePath, buffer);

    // Return the public URL path (relative to /public)
    return NextResponse.json({ path: `/images/blog/${filename}` });

  } catch (error) {
    console.error("Blog image upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
