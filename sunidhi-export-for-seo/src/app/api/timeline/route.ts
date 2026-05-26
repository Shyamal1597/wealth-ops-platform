import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "timeline.json");
    const data = await readFile(filePath, "utf-8");
    const timeline = JSON.parse(data);
    // Sort by order
    timeline.sort((a: any, b: any) => a.order - b.order);
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Error loading timeline:", error);
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
