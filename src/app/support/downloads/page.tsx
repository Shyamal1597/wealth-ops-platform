import type { Metadata } from "next";
import DownloadsPageClient from "./DownloadsPageClient";
import { getDownloadsData } from "@/lib/downloads-store";

export const metadata: Metadata = {
  title: "Downloads & Forms",
  description: "Account opening forms, KYC documents, and other downloadable forms for Sunidhi Securities clients.",
};

export default function DownloadsPage() {
  const forms = getDownloadsData();
  return <DownloadsPageClient forms={forms} />;
}
