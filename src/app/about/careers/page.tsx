import type { Metadata } from "next";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore current career opportunities at Sunidhi Securities and join a team shaping the future of finance.",
};

export default function CareersPage() {
  return <CareersPageClient />;
}
