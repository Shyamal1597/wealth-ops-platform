import type { Metadata } from "next";
import MarginCalculatorPageClient from "./MarginCalculatorPageClient";

export const metadata: Metadata = {
  title: "Margin Calculator",
  description: "Calculate margin requirements for your derivatives and intraday trades.",
};

export default function MarginCalculatorPage() {
  return <MarginCalculatorPageClient />;
}
