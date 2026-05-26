"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Timing constants ───────────────────────────────────────────────────────
// Total inactivity window before auto-logout (matches the banking model).
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;   // 5 minutes

// How long before logout to show the warning dialog (last 60 seconds).
const WARN_BEFORE_MS = 60 * 1000;               // 1 minute

// Minimum gap between token-refresh API calls.
// Activity within this window is tracked but only one refresh fires per period.
const REFRESH_THROTTLE_MS = 90 * 1000;          // 1.5 minutes

// How often to tick the inactivity check (affects warning countdown precision).
const CHECK_INTERVAL_MS = 10_000;               // every 10 seconds

// ─── Public API ─────────────────────────────────────────────────────────────
export interface AdminActivitySessionResult {
  /** True when the warning overlay should be shown (last 60 s of inactivity). */
  showWarning: boolean;
  /** Seconds remaining until auto-logout (only meaningful when showWarning=true). */
  secondsUntilLogout: number;
  /** Call this when the admin clicks "Stay Signed In" — resets the idle clock. */
  dismissWarning: () => void;
  /** Call this when the admin clicks "Sign Out Now". */
  signOut: () => void;
}

export function useAdminActivitySession(): AdminActivitySessionResult {
  const router = useRouter();

  // Refs — never cause re-renders on change, safe to read from event handlers.
  const lastActivityRef = useRef<number>(Date.now());
  const lastRefreshRef  = useRef<number>(Date.now());
  const loggedOutRef    = useRef<boolean>(false);

  const [showWarning, setShowWarning]           = useState(false);
  const [secondsUntilLogout, setSecondsUntilLogout] = useState(60);

  // ── Sign out (called by auto-logout or by the "Sign Out Now" button) ────────
  const signOut = useCallback(async () => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore network errors — we're logging out regardless
    }
    sessionStorage.removeItem("adminData");
    router.push("/admin/login");
  }, [router]);

  // ── Silently refresh the JWT on the server ───────────────────────────────
  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/refresh", { method: "POST" });
      if (res.status === 401) {
        // Server-side session is already dead — redirect immediately
        sessionStorage.removeItem("adminData");
        router.push("/admin/login");
      }
    } catch {
      // Network error: don't log out; the JWT will handle expiry naturally
    }
  }, [router]);

  // ── Dismiss the warning (admin moved the mouse / pressed a key) ──────────
  const dismissWarning = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
  }, []);

  // ── Main effect: activity listeners + inactivity timer ──────────────────
  useEffect(() => {
    // Record activity.  Kept intentionally lightweight — this fires on every
    // mouse move, so no allocations or state updates unless necessary.
    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;

      // Dismiss the warning if it's showing (functional update: no re-render if
      // already false, because React bails out on same-value state updates).
      setShowWarning(false);

      // Throttled server refresh — at most once per REFRESH_THROTTLE_MS
      if (now - lastRefreshRef.current >= REFRESH_THROTTLE_MS) {
        lastRefreshRef.current = now;
        refreshToken();
      }
    };

    const activityEvents = [
      "mousedown", "mousemove", "keydown",
      "scroll", "touchstart", "click",
    ] as const;

    activityEvents.forEach((e) =>
      window.addEventListener(e, updateActivity, { passive: true })
    );

    // Do NOT refresh on mount — the token was just issued during login and is
    // fresh. Calling refreshToken() here races with the dashboard's concurrent
    // /api/admin/me call: if the refresh wins and creates a new session (T2),
    // the in-flight /api/admin/me still carries the old token (T1 < T2) and
    // gets a 401, causing an immediate logout loop.
    // The first real refresh fires naturally after REFRESH_THROTTLE_MS of activity.
    lastRefreshRef.current = Date.now();

    // Inactivity ticker — runs every CHECK_INTERVAL_MS seconds
    const interval = setInterval(() => {
      if (loggedOutRef.current) return;

      const idle = Date.now() - lastActivityRef.current;

      if (idle >= INACTIVITY_TIMEOUT_MS) {
        // Time's up — auto-logout
        clearInterval(interval);
        signOut();
      } else if (idle >= INACTIVITY_TIMEOUT_MS - WARN_BEFORE_MS) {
        // Inside the warning window — show countdown
        const remaining = Math.ceil((INACTIVITY_TIMEOUT_MS - idle) / 1000);
        setSecondsUntilLogout(remaining);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      activityEvents.forEach((e) =>
        window.removeEventListener(e, updateActivity)
      );
      clearInterval(interval);
    };
    // doLogout and refreshToken are stable useCallback refs — no re-run risk
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signOut, refreshToken]);

  return { showWarning, secondsUntilLogout, dismissWarning, signOut };
}
