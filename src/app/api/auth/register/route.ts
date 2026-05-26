import { NextRequest, NextResponse } from "next/server";
import { createUser, sanitizeUser } from "@/lib/auth";
import { encryptPhone } from "@/lib/crypto";
import { verifyPhoneOTP } from "@/lib/firebase-admin";
import { logSecurityEvent } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      username,
      email,
      password,
      fullName,
      phone,
      accountType,
      firebaseIdToken, // Required: Firebase OTP verification token
    } = body;

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Validate input
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: "Username, email, password, and full name are required" },
        { status: 400 }
      );
    }

    // Validate phone number and Firebase token
    if (!phone || !firebaseIdToken) {
      return NextResponse.json(
        { error: "Phone number and OTP verification are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Validate username (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // CRITICAL: Verify OTP with Firebase Admin SDK
    console.log("🔐 Verifying phone OTP...");
    const otpVerification = await verifyPhoneOTP(firebaseIdToken, phone);

    if (!otpVerification.verified) {
      console.error("❌ OTP verification failed");
      await logSecurityEvent({
        eventType: "REGISTER_FAILED",
        details: { reason: "OTP verification failed", phone },
        status: "FAILURE",
        ip,
        userAgent
      });

      return NextResponse.json(
        { error: "Phone verification failed. Please verify your phone number with OTP." },
        { status: 401 }
      );
    }

    console.log(`✅ OTP verified for: ${otpVerification.phoneNumber}`);

    // Encrypt sensitive data before storing
    const encryptedPhone = encryptPhone(phone);

    // Create user (only after OTP verification succeeds)
    const newUser = await createUser({
      username,
      email,
      password,
      fullName,
      phone: encryptedPhone, // Store encrypted
      phoneVerified: true, // Phone is verified via OTP
      accountType: accountType || "Trading",
    });

    // Return user data (without password and encrypted data)
    const userWithoutPassword = sanitizeUser(newUser);

    console.log(`✅ New user registered: ${newUser.username} (${newUser.email})`);

    await logSecurityEvent({
      eventType: "REGISTER_SUCCESS",
      userId: newUser.id,
      username: newUser.username,
      details: { email: newUser.email, accountType },
      status: "SUCCESS",
      ip,
      userAgent
    });

    return NextResponse.json(
      {
        message: "Registration successful! Your account has been created.",
        user: userWithoutPassword,
        clientId: newUser.clientId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Registration error:", error);

    if (error.message === "Username or email already exists") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }

    if (error.message?.includes("OTP") || error.message?.includes("token")) {
      return NextResponse.json(
        { error: "Phone verification failed. Please try again." },
        { status: 401 }
      );
    }

    await logSecurityEvent({
      eventType: "REGISTER_ERROR",
      details: { error: error.message },
      status: "FAILURE"
    });

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
