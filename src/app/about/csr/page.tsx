import type { Metadata } from "next";
import CSRPageClient from "./CSRPageClient";

export const metadata: Metadata = {
  title: "CSR & Sunidhi Foundation",
  description: "Sunidhi's corporate social responsibility initiatives and Sunidhi Foundation — supporting education, healthcare, and animal care.",
};

export default function CSRPage() {
  return <CSRPageClient />;
}
