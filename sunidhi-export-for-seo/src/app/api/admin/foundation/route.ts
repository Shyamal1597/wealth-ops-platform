import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "data", "foundation.json");
    const data = await readFile(filePath, "utf-8");

    return NextResponse.json({ foundation: JSON.parse(data) });
  } catch (error) {
    console.error("Error reading Foundation data:", error);
    return NextResponse.json(
      { error: "Failed to load Foundation data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    const filePath = path.join(process.cwd(), "data", "foundation.json");

    await writeFile(filePath, JSON.stringify(updates, null, 2));

    return NextResponse.json({ success: true, message: "Foundation content updated successfully" });
  } catch (error) {
    console.error("Error updating Foundation data:", error);
    return NextResponse.json(
      { error: "Failed to update Foundation data" },
      { status: 500 }
    );
  }
}
