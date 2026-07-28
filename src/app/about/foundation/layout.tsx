import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSR & Foundation",
};

export default function FoundationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
