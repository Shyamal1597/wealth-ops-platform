import type { Metadata } from "next";
import LifeAtSunidhiPageClient from "./LifeAtSunidhiPageClient";

export const metadata: Metadata = {
  title: "Life at Sunidhi",
  description: "Discover Sunidhi's work culture, learning and development programs, and employee celebrations.",
};

export default function LifeAtSunidhiPage() {
  return <LifeAtSunidhiPageClient />;
}
