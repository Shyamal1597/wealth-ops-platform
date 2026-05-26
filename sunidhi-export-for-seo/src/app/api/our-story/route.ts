import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "our-story.json");
    const data = await readFile(filePath, "utf-8");
    const story = JSON.parse(data);
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error loading our story:", error);
    return NextResponse.json({ error: "Failed to load story" }, { status: 500 });
  }
}
