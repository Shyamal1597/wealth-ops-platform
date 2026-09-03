import type { Metadata } from "next";
import AwardsPageClient from "./AwardsPageClient";

export const metadata: Metadata = {
  title: "Awards & Recognition",
  description: "Sunidhi Securities' industry awards and recognitions earned over 69+ years of excellence in financial services.",
};

export default function AwardsPage() {
  return <AwardsPageClient />;
}
