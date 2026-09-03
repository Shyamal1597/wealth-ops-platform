import type { Metadata } from "next";
import ResearchPageClient from "./ResearchPageClient";

export const metadata: Metadata = {
  title: "Research Reports",
  description: "Expert analysis and investment recommendations — fundamental, technical, and economic research reports from Sunidhi Securities.",
};

export default function ResearchPage() {
  return <ResearchPageClient />;
}
