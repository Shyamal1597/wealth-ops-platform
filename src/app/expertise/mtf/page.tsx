import type { Metadata } from "next";
import MTFPageClient from "./MTFPageClient";

export const metadata: Metadata = {
  title: "Margin Trading Facility (MTF)",
  description: "Trade with up to 4x leverage using Sunidhi's Margin Trading Facility — pay a fraction upfront and fund the balance with competitive interest rates.",
};

export default function MTFPage() {
  return <MTFPageClient />;
}
