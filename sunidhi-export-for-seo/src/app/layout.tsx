import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sunidhi Securities & Finance Limited - Where Financial Goals Take Wings",
    template: "%s | Sunidhi Securities"
  },
  description: "Sunidhi Securities & Finance Limited is a leading stock broking and financial services company with 58 years of excellence, serving 50,000+ clients across 100+ locations.",
  keywords: "stock broking, financial services, equity trading, derivatives, mutual funds, IPO, wealth management, Sunidhi Securities",
  authors: [{ name: "Sunidhi Securities & Finance Limited" }],
  creator: "Sunidhi Securities & Finance Limited",
  publisher: "Sunidhi Securities & Finance Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.sunidhi.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsTracker />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
