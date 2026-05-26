import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export interface Award {
  id: string;
  year: string;
  title: string;
  description: string;
}

// GET - List all awards (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Load awards
    const awardsFile = path.join(process.cwd(), "data", "awards.json");
    let awards: Award[] = [];
    try {
      const data = await readFile(awardsFile, "utf-8");
      awards = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty, return empty array
      return NextResponse.json({ awards: [] });
    }

    // Sort by year (newest first)
    awards.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return NextResponse.json({ awards });
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json({ awards: [] });
  }
}
