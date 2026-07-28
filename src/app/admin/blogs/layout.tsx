import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Manage Blogs",
};

export default function AdminBlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
