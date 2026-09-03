import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import BlogPostPageClient from "./BlogPostPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Dynamic per-post title/description — mirrors the read pattern used by
// src/app/api/blogs/[slug]/route.ts so both stay in sync with the data file.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const filePath = path.join(process.cwd(), "data", "blogs.json");
    const data = await readFile(filePath, "utf-8");
    const blogs = JSON.parse(data);
    const blog = blogs.find((b: any) => b.slug === slug);

    if (blog) {
      return {
        title: blog.title,
        description: blog.excerpt,
      };
    }
  } catch {
    // Fall through to the default metadata below
  }

  return {
    title: "Blog Post",
    description: "Read the latest insights and analysis from Sunidhi Securities.",
  };
}

export default function BlogPostPage() {
  return <BlogPostPageClient />;
}
