import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Manage Research",
};

export default function AdminResearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
