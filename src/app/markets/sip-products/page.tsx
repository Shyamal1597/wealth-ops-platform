import type { Metadata } from "next";
import SIPProductsPageClient from "./SIPProductsPageClient";

export const metadata: Metadata = {
  title: "Direct Equity SIP",
  description: "Professionally managed stock portfolios — Conservative, Moderate, and Aggressive strategies with monthly rebalancing from Sunidhi Research.",
};

export default function SIPProductsPage() {
  return <SIPProductsPageClient />;
}
