import type { Metadata } from "next";
import NSERSSPageClient from "./NSERSSPageClient";

export const metadata: Metadata = {
  title: "NSE RSS Feeds",
  description: "Real-time NSE corporate announcements, financial results, and regulatory disclosures across 13 live feed streams with company search.",
};

export default function NSERSSPage() {
  return <NSERSSPageClient />;
}
