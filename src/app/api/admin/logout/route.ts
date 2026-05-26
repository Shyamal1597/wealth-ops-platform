import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { invalidateAdminSession } from "@/lib/admin-session-store";

// TDL-008: Admin logout — clear cookie AND invalidate the server-side session
// so that any in-flight tokens for this admin become immediately invalid.
export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    // Use decode (not verify) so an already-expired token still yields the adminId.
    // This ensures the session is always invalidated, even if the 5-minute JWT has
    // just ticked over when the admin clicks "logout".
    if (token) {
      try {
        const decoded = jwt.decode(token) as { adminId?: string } | null;
        if (decoded?.adminId) {
          invalidateAdminSession(decoded.adminId);
        }
      } catch {
        // Ignore decode errors — we're logging out regardless
      }
    }

    // Clear the admin cookie
    cookieStore.delete("admin-token");

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 });
  }
}
