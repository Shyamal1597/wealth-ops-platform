import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);

    // Sort by publishedAt date (newest first)
    const sortedBlogs = blogs.sort((a: any, b: any) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({ blogs: sortedBlogs });
  } catch (error) {
    console.error("Error reading blogs data:", error);
    return NextResponse.json(
      { error: "Failed to load blogs" },
      { status: 500 }
    );
  }
}
