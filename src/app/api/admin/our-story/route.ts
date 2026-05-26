import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "data", "our-story.json");
    const data = await readFile(filePath, "utf-8");
    return NextResponse.json({ story: JSON.parse(data) });
  } catch (error) {
    console.error("Error loading our story:", error);
    return NextResponse.json({ error: "Failed to load story" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const filePath = path.join(process.cwd(), "data", "our-story.json");
    await writeFile(filePath, JSON.stringify(body, null, 2));

    return NextResponse.json({ message: "Story updated successfully" });
  } catch (error) {
    console.error("Error updating our story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}
