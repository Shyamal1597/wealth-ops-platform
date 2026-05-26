import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, findAdminById } from "@/lib/admin-auth";
import { isAdminSessionValid } from "@/lib/admin-session-store";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    const payload = await verifyAdminToken(token);
    if (!payload || !payload.adminId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    // TDL-004/008: reject replayed or old tokens by checking session store
    const tokenIssuedAt = (payload.iat ?? 0) * 1000;
    if (!isAdminSessionValid(payload.adminId, tokenIssuedAt)) {
      return NextResponse.json({ error: "Session expired" }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    const admin = await findAdminById(payload.adminId);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 401, headers: NO_CACHE_HEADERS });
    }

    const { password: _pw, ...adminData } = admin;
    return NextResponse.json({ admin: adminData }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Error in /api/admin/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
