"use client";

/**
 * AdminSessionGuard
 *
 * Drop this component anywhere inside an admin page (no props needed).
 * It is invisible during normal use and shows a banking-style "session expiring"
 * modal when the admin has been idle for 4 minutes, then auto-logs out at 5 minutes.
 *
 * Usage:
 *   <AdminSessionGuard />
 */

import { Clock, LogOut, ShieldAlert } from "lucide-react";
import { useAdminActivitySession } from "@/hooks/useAdminActivitySession";

export function AdminSessionGuard() {
  const { showWarning, secondsUntilLogout, dismissWarning, signOut } =
    useAdminActivitySession();

  if (!showWarning) return null;

  // Colour shifts from amber → red as the countdown approaches zero
  const isUrgent = secondsUntilLogout <= 30;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismissWarning}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 transition-colors ${
            isUrgent ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          <ShieldAlert
            className={`h-8 w-8 transition-colors ${
              isUrgent ? "text-red-600" : "text-amber-600"
            }`}
          />
        </div>

        {/* Heading */}
        <h2
          id="session-warning-title"
          className="text-xl font-bold text-gray-900 mb-2"
        >
          Session Expiring Soon
        </h2>

        {/* Countdown */}
        <p id="session-warning-desc" className="text-gray-600 mb-1">
          Your session will expire in{" "}
          <span
            className={`font-bold tabular-nums transition-colors ${
              isUrgent ? "text-red-600" : "text-amber-600"
            }`}
          >
            {secondsUntilLogout}s
          </span>{" "}
          due to inactivity.
        </p>
        <p className="text-sm text-gray-400 mb-7">
          Move your mouse or press any key to stay signed in.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-7 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isUrgent ? "bg-red-500" : "bg-amber-400"
            }`}
            style={{ width: `${(secondsUntilLogout / 60) * 100}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={dismissWarning}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm"
            autoFocus
          >
            <Clock className="h-4 w-4" />
            Stay Signed In
          </button>
          <button
            onClick={signOut}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
