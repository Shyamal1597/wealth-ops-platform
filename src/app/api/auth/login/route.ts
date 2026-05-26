import { NextRequest, NextResponse } from "next/server";
import {
  findUser,
  findUserByClientId,
  verifyPassword,
  createToken,
  sanitizeUser,
  updateLastLogin,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyPhoneOTP } from "@/lib/firebase-admin";
import { decryptPhone } from "@/lib/crypto";
import { generateSecureToken } from "@/lib/crypto";
import { createSession, getSession, deleteSession } from "@/lib/session-store";
import { logSecurityEvent } from "@/lib/audit-log";
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password, step, firebaseIdToken, sessionId } = body;
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // STEP 1: Validate username/password
    if (step === "validate_credentials" || !step) {
      // Validate input
      if (!identifier || !password) {
        return NextResponse.json(
          { error: "Username/email/phone/client ID and password are required" },
          { status: 400 }
        );
      }

      // Rate limit check — 3 failed attempts triggers a 3-hour lockout
      const rateLimit = checkRateLimit(identifier);
      if (!rateLimit.allowed) {
        const hours = Math.ceil((rateLimit.resetIn || 0) / 3600);
        const minutes = Math.ceil(((rateLimit.resetIn || 0) % 3600) / 60);
        const timeMsg = hours >= 1
          ? `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
          : `${minutes} minute${minutes > 1 ? 's' : ''}`;

        await logSecurityEvent({
          eventType: "LOGIN_RATE_LIMITED",
          details: { identifier, resetIn: rateLimit.resetIn },
          status: "FAILURE",
          ip,
          userAgent,
        });

        return NextResponse.json(
          { error: `Account temporarily locked. Too many failed attempts. Please try again in ${timeMsg}.` },
          { status: 429 }
        );
      }

      // Find user by multiple methods
      let user = null;

      // Try finding by username or email first
      user = await findUser(identifier);

      // If not found, try client ID
      if (!user) {
        user = await findUserByClientId(identifier);
      }

      // If still not found, try phone number (need to encrypt and compare)
      // Note: This is expensive, so do it last
      if (!user && identifier.startsWith("+")) {
        // This would require iterating through all users and decrypting phones
        // For now, we'll skip this and recommend using username/email/clientID
      }

      if (!user) {
        // Record failed attempt against the identifier so the rate limiter tracks it
        recordFailedAttempt(identifier);

        await logSecurityEvent({
          eventType: "LOGIN_FAILED",
          details: { reason: "User not found", identifier },
          status: "FAILURE",
          ip,
          userAgent
        });

        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        // Record failed attempt against the identifier
        recordFailedAttempt(identifier);

        await logSecurityEvent({
          eventType: "LOGIN_FAILED",
          userId: user.id,
          username: user.username,
          details: { reason: "Invalid password" },
          status: "FAILURE",
          ip,
          userAgent
        });

        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Credentials valid — clear the failed-attempt counter
      clearFailedAttempts(identifier);

      console.log(`✅ Credentials valid for: ${user.username}`);

      // Check if 2FA is enabled
      if (!user.twoFactorEnabled || !user.phoneVerified) {
        // 2FA not enabled, proceed with direct login
        const token = createToken(user.id, user.username);

        const cookieStore = await cookies();
        // TDL-007: HttpOnly + Secure in production; SameSite=Lax retained for
        // client app (strict would break OAuth/Firebase redirects)
        cookieStore.set("auth-token", token, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE !== "false", // TDL-007: Secure by default
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });

        await updateLastLogin(user.id);
        const userWithoutPassword = sanitizeUser(user);

        await logSecurityEvent({
          eventType: "LOGIN_SUCCESS",
          userId: user.id,
          username: user.username,
          details: { method: "password_only" },
          status: "SUCCESS",
          ip,
          userAgent
        });

        return NextResponse.json({
          success: true,
          requiresOTP: false,
          message: "Login successful",
          user: userWithoutPassword,
        });
      }

      // 2FA enabled - generate persistent session
      const tempSessionId = generateSecureToken(32);
      await createSession(user.id, tempSessionId);

      // Decrypt phone for display (masked)
      let maskedPhone = "XXXXXXXXXXXX";
      try {
        const decryptedPhone = decryptPhone(user.phone);
        const lastFour = decryptedPhone.slice(-4);
        maskedPhone = "+91XXXXXX" + lastFour;
      } catch (e) {
        console.error("Error decrypting phone for display");
      }

      await logSecurityEvent({
        eventType: "LOGIN_2FA_STARTED",
        userId: user.id,
        username: user.username,
        details: { sessionId: tempSessionId },
        status: "SUCCESS",
        ip,
        userAgent
      });

      return NextResponse.json({
        success: true,
        requiresOTP: true,
        sessionId: tempSessionId,
        phone: maskedPhone,
        message: "Credentials verified. Please verify OTP sent to your phone.",
      });
    }

    // STEP 2: Verify OTP and create session
    if (step === "verify_otp") {
      if (!sessionId || !firebaseIdToken) {
        return NextResponse.json(
          { error: "Session ID and Firebase token are required" },
          { status: 400 }
        );
      }

      // Get persistent login session
      const session = await getSession(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: "Invalid or expired session. Please login again." },
          { status: 401 }
        );
      }

      // Verify OTP with Firebase
      const otpVerification = await verifyPhoneOTP(firebaseIdToken);
      if (!otpVerification.verified) {
        await logSecurityEvent({
          eventType: "LOGIN_2FA_FAILED",
          userId: session.userId,
          details: { reason: "Invalid OTP", sessionId },
          status: "FAILURE",
          ip,
          userAgent
        });

        return NextResponse.json(
          { error: "Invalid OTP. Please try again." },
          { status: 401 }
        );
      }

      console.log(`✅ OTP verified for session: ${sessionId}`);

      // Get user
      const user = await findUser(session.userId);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Create JWT token (NOW we create the session)
      const token = createToken(user.id, user.username);

      // TDL-007: HttpOnly + Secure by default; opt-out via COOKIE_SECURE=false in .env.local
      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE !== "false", // TDL-007: Secure by default
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Update last login
      await updateLastLogin(user.id);

      // Clean up session
      await deleteSession(sessionId);

      // Return user data
      const userWithoutPassword = sanitizeUser(user);

      console.log(`✅ User logged in with 2FA: ${user.username}`);

      await logSecurityEvent({
        eventType: "LOGIN_SUCCESS",
        userId: user.id,
        username: user.username,
        details: { method: "2fa" },
        status: "SUCCESS",
        ip,
        userAgent
      });

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
      });
    }

    return NextResponse.json(
      { error: "Invalid step parameter" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("❌ Login error:", error);
    await logSecurityEvent({
      eventType: "LOGIN_ERROR",
      details: { error: error.message },
      status: "FAILURE"
    });

    return NextResponse.json(
      { error: error.message || "An error occurred during login" },
      { status: 500 }
    );
  }
}
