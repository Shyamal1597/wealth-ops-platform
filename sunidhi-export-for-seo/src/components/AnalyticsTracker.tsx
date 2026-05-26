"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
          }),
        });
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // This component doesn't render anything
}
