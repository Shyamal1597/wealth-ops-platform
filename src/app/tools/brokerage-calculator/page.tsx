import type { Metadata } from "next";
import BrokerageCalculatorPageClient from "./BrokerageCalculatorPageClient";

export const metadata: Metadata = {
  title: "Brokerage Calculator",
  description: "Calculate your brokerage charges, STT, stamp duty, and net profit or loss on trades.",
};

export default function BrokerageCalculatorPage() {
  return <BrokerageCalculatorPageClient />;
}
