import type { Metadata } from "next";
import HolidaysPageClient from "./HolidaysPageClient";

export const metadata: Metadata = {
  title: "Trading Holidays",
  description: "Complete list of NSE and BSE trading holidays for the current year.",
};

export default function HolidaysPage() {
  return <HolidaysPageClient />;
}
