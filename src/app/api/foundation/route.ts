import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
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
