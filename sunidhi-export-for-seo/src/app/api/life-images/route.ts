import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export interface LifeImage {
  id: string;
  title: string;
  category: string;
  image: string;
  order: number;
}

// GET - List all life images (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Load life images
    const imagesFile = path.join(process.cwd(), "data", "life-images.json");
    let images: LifeImage[] = [];
    try {
      const data = await readFile(imagesFile, "utf-8");
      images = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty, return empty array
      return NextResponse.json({ images: [] });
    }

    // Sort by order
    images.sort((a, b) => a.order - b.order);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching life images:", error);
    return NextResponse.json({ images: [] });
  }
}
