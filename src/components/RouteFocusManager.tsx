"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Next.js client-side navigation never moves keyboard focus anywhere on its
 * own — including when the user presses the browser's Back/Forward buttons —
 * so a keyboard/screen-reader user returning to a previous page has no
 * visible indication of where they are. On every route change (after the
 * initial load), move focus to the page's own <h1> so there's always a
 * clear, visible focus target announcing which page they're now on.
 */
export default function RouteFocusManager() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // The new page's content commits in the same tick the pathname updates,
    // but under React's transition-based routing the paint can lag a frame
    // behind — defer one frame so the new page's <h1> is actually in the DOM.
    const raf = requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      const target = main?.querySelector<HTMLElement>("h1") ?? main;
      if (!target) return;

      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.setAttribute("data-route-focus-target", "");
      // preventScroll is essential here: without it, focus() scrolls the
      // target into view on every navigation, including browser Back/Forward,
      // which silently defeats the browser's native scroll-position restoration
      // and makes every "back" navigation jump to the top of the page.
      target.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
