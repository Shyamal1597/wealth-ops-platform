import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
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
