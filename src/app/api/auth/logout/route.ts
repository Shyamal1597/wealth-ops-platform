import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { invalidateUserSession } from "@/lib/user-session-store";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    // Invalidate the server-side session so any token copy (e.g. stolen cookie)
    // also becomes immediately invalid, even before the JWT expires.
    if (token) {
      try {
        // Use decode (not verify) so an already-expired token still yields the userId.
        const decoded = jwt.decode(token) as { userId?: string } | null;
        if (decoded?.userId) {
          invalidateUserSession(decoded.userId);
        }
      } catch {
        // Ignore decode errors — we're logging out regardless
      }
    }

    cookieStore.delete("auth-token");

    console.log("✅ User logged out");

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
