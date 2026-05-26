/**
 * OTP Verification API Endpoint
 * Verifies Firebase OTP token on the server side
 * This is called after the client successfully verifies OTP with Firebase
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneOTP, getPhoneFromToken } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseIdToken, expectedPhone, action } = body;

    // Validate input
    if (!firebaseIdToken) {
      return NextResponse.json(
        { error: "Firebase ID token is required" },
        { status: 400 }
      );
    }

    // Verify the Firebase OTP token
    const verificationResult = await verifyPhoneOTP(firebaseIdToken, expectedPhone);

    if (!verificationResult.verified) {
      return NextResponse.json(
        { error: "OTP verification failed. Phone number mismatch or invalid token." },
        { status: 401 }
      );
    }

    console.log(`✅ OTP verified successfully for: ${verificationResult.phoneNumber}`);

    // Return success with phone number
    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        phoneNumber: verificationResult.phoneNumber,
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ OTP verification error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to verify OTP",
        success: false,
        verified: false,
      },
      { status: 500 }
    );
  }
}
