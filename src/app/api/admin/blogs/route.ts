import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { sanitize } from "isomorphic-dompurify";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error reading blogs:", error);
    return NextResponse.json(
      { error: "Failed to load blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newBlog = await request.json();

    // SANITIZE INPUT: Prevent XSS
    if (newBlog.content) {
      newBlog.content = sanitize(newBlog.content);
    }

    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);

    // Generate ID and slug from title
    const id = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = id;

    const blogToAdd = {
      id,
      slug,
      ...newBlog,
      publishedAt: new Date().toISOString().split("T")[0],
    };

    blogs.unshift(blogToAdd);
    await writeFile(filePath, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ success: true, blog: blogToAdd });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
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

    const updatedBlog = await request.json();

    // SANITIZE INPUT: Prevent XSS
    if (updatedBlog.content) {
      updatedBlog.content = sanitize(updatedBlog.content);
    }

    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);

    const index = blogs.findIndex((b: any) => b.id === updatedBlog.id);
    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blogs[index] = updatedBlog;
    await writeFile(filePath, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    let blogs = JSON.parse(data);

    blogs = blogs.filter((b: any) => b.id !== id);
    await writeFile(filePath, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
