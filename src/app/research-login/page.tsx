import type { Metadata } from "next";
import ResearchLoginPageClient from "./ResearchLoginPageClient";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Log in to access research reports, SIP portfolios, and other premium client-only content on Sunidhi Securities.",
};

export default function ResearchLoginPage() {
  return <ResearchLoginPageClient />;
}
