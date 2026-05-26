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

    const filePath = path.join(process.cwd(), "data", "csr.json");
    const data = await readFile(filePath, "utf-8");

    return NextResponse.json({ csr: JSON.parse(data) });
  } catch (error) {
    console.error("Error reading CSR data:", error);
    return NextResponse.json(
      { error: "Failed to load CSR data" },
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
    const filePath = path.join(process.cwd(), "data", "csr.json");

    await writeFile(filePath, JSON.stringify(updates, null, 2));

    return NextResponse.json({ success: true, message: "CSR content updated successfully" });
  } catch (error) {
    console.error("Error updating CSR data:", error);
    return NextResponse.json(
      { error: "Failed to update CSR data" },
      { status: 500 }
    );
  }
}
