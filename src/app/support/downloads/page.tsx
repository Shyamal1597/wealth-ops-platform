import type { Metadata } from "next";
import DownloadsPageClient from "./DownloadsPageClient";

export const metadata: Metadata = {
  title: "Downloads & Forms",
  description: "Account opening forms, KYC documents, and other downloadable forms for Sunidhi Securities clients.",
};

export default function DownloadsPage() {
  return <DownloadsPageClient />;
}
