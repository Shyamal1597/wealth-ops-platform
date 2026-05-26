import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);

    const blog = blogs.find((b: any) => b.slug === slug);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error reading blog data:", error);
    return NextResponse.json(
      { error: "Failed to load blog" },
      { status: 500 }
    );
  }
}
