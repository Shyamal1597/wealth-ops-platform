import type { Metadata } from "next";
import SIPCalculatorPageClient from "./SIPCalculatorPageClient";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description: "Estimate the future value of your monthly SIP investments with compound interest projections.",
};

export default function SIPCalculatorPage() {
  return <SIPCalculatorPageClient />;
}
