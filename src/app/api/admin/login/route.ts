import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findAdmin,
  verifyAdminPassword,
  createAdminToken,
} from "@/lib/admin-auth";
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from "@/lib/rate-limiter";
import { createAdminSession, invalidateAdminSession } from "@/lib/admin-session-store";

// TDL-006: No-cache headers applied to every response from this endpoint
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    // Check rate limit — 3 failed attempts → 3-hour lockout (TDL-004)
    const rateLimit = checkRateLimit(usernameOrEmail);
    if (!rateLimit.allowed) {
      const totalSeconds = rateLimit.resetIn || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.ceil((totalSeconds % 3600) / 60);
      const timeMsg = hours >= 1
        ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
        : `${minutes} minute${minutes > 1 ? 's' : ''}`;

      // TDL-004: invalidate any active session when account is locked so a previously
      // captured successful response cannot be replayed to bypass the lockout
      const lockedAdmin = await findAdmin(usernameOrEmail);
      if (lockedAdmin) invalidateAdminSession(lockedAdmin.id);

      return NextResponse.json(
        { error: `Account temporarily locked. Too many failed attempts. Please try again in ${timeMsg}.` },
        { status: 429, headers: NO_CACHE_HEADERS }
      );
    }

    // Find admin
    const admin = await findAdmin(usernameOrEmail);
    if (!admin) {
      recordFailedAttempt(usernameOrEmail);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Verify password
    const isValidPassword = await verifyAdminPassword(password, admin.password);
    if (!isValidPassword) {
      recordFailedAttempt(usernameOrEmail);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(usernameOrEmail);

    // TDL-008: register a new session — this automatically invalidates any
    // previous active session for this admin (single concurrent session)
    const sessionIssuedAt = createAdminSession(admin.id, admin.username);

    // Create token (iat matches session store so replayed old tokens are rejected)
    const token = await createAdminToken(admin.id, admin.username, sessionIssuedAt);

    // TDL-007: Set cookie with HttpOnly + Secure (production/HTTPS) + SameSite=Strict
    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      // TDL-007: Secure flag is ON by default everywhere.
      // Set COOKIE_SECURE=false in .env.local only for local HTTP dev.
      secure: process.env.COOKIE_SECURE !== "false",
      sameSite: "strict",
      maxAge: 5 * 60,  // 5 minutes
      path: "/",
    });

    // Return admin data (without password)
    const { password: _, ...adminData } = admin;

    return NextResponse.json(
      { message: "Login successful", admin: adminData },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
