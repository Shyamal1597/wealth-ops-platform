import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, analysis, and expert advice on investing and financial markets from Sunidhi Securities.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
