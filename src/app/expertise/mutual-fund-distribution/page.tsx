import type { Metadata } from "next";
import MutualFundDistributionPageClient from "./MutualFundDistributionPageClient";

export const metadata: Metadata = {
  title: "Mutual Funds & Wealth Management",
  description: "Explore mutual fund products across leading AMCs with zero commission, plus portfolio management and wealth advisory services from Sunidhi Securities.",
};

export default function MutualFundDistributionPage() {
  return <MutualFundDistributionPageClient />;
}
