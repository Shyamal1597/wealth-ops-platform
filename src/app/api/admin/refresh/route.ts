import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, createAdminToken, findAdminById } from "@/lib/admin-auth";
import { createAdminSession } from "@/lib/admin-session-store";

// TDL-SLD: Sliding-session refresh endpoint.
// Called by the frontend on any user activity to extend the 5-minute JWT window.
// Requires a currently valid token — expired tokens cannot be refreshed.
// Each refresh issues a NEW token (new iat) and invalidates the previous one,
// preserving single-session semantics.

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Verify the current token (JWT signature + session store single-session check).
    // If the token is expired or was already superseded, this returns null.
    const decoded = await verifyAdminToken(token);
    if (!decoded?.adminId) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Confirm the admin record still exists (handles deleted admin accounts)
    const admin = await findAdminById(decoded.adminId);
    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Register a new session — overwrites the previous iat so the old token
    // becomes immediately invalid (single-session enforcement preserved).
    const sessionIssuedAt = createAdminSession(admin.id, admin.username);
    const newToken = await createAdminToken(admin.id, admin.username, sessionIssuedAt);

    // Set the refreshed cookie with the same security flags as login
    cookieStore.set("admin-token", newToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE !== "false",
      sameSite: "strict",
      maxAge: 5 * 60, // 5 minutes — reset by activity, expires on inactivity
      path: "/",
    });

    return NextResponse.json(
      { refreshed: true },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Admin session refresh error:", error);
    return NextResponse.json(
      { error: "Refresh failed" },
      { status: 500 }
    );
  }
}
