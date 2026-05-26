import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sunidhi Securities - Best Trading App in India | Stock Market Trading & Investment",
    template: "%s | Sunidhi Securities"
  },
  description: "Sunidhi Securities offers best trading app in India for stock market trading, intraday trading, commodity market, forex trading, and capital market investments. Open trading account with 68+ years of excellence serving 50,000+ clients.",
  keywords: "intraday trading, commodity market, capital market, trading account, best trading app in india, stock market trading, stock market and trading, commodities trading platform, commodity trading, forex trading in india, stock broking, financial services, equity trading, derivatives, mutual funds, IPO, wealth management",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-primary-700 text-white px-6 py-3 rounded-md shadow-lg font-semibold focus:outline-white focus:ring-4 focus:ring-primary-300"
        >
          Skip to main content
        </a>
        <AnalyticsTracker />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
