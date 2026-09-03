import type { Metadata } from "next";
import LeadershipPageClient from "./LeadershipPageClient";

export const metadata: Metadata = {
  title: "Leadership Team",
  description: "Meet the leadership team driving Sunidhi Securities' vision — board of directors and senior management.",
};

export default function LeadershipPage() {
  return <LeadershipPageClient />;
}
