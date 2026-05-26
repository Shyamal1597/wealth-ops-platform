import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export interface Leader {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  order: number;
}

// GET - List all leaders (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Load leaders
    const leadersFile = path.join(process.cwd(), "data", "leadership.json");
    let leaders: Leader[] = [];
    try {
      const data = await readFile(leadersFile, "utf-8");
      leaders = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty, return empty array
      return NextResponse.json({ leaders: [] });
    }

    // Sort by order
    leaders.sort((a, b) => a.order - b.order);

    return NextResponse.json({ leaders });
  } catch (error) {
    console.error("Error fetching leaders:", error);
    return NextResponse.json({ leaders: [] });
  }
}
