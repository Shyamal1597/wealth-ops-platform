import type { Metadata } from "next";
import SettlementCalendarPageClient from "./SettlementCalendarPageClient";

export const metadata: Metadata = {
  title: "Settlement Calendar",
  description: "NSE and BSE settlement schedule and pay-in/pay-out dates.",
};

export default function SettlementCalendarPage() {
  return <SettlementCalendarPageClient />;
}
