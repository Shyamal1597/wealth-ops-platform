import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Analytics",
};

export default function AdminAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
