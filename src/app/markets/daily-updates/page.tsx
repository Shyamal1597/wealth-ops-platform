import type { Metadata } from "next";
import DailyUpdatesPageClient from "./DailyUpdatesPageClient";

export const metadata: Metadata = {
  title: "Daily Market Updates",
  description: "Morning Buzz — daily market news, trends, and analysis to start your trading day informed.",
};

export default function DailyUpdatesPage() {
  return <DailyUpdatesPageClient />;
}
