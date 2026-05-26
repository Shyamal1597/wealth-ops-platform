/**
 * Firebase Client SDK Configuration
 * Used for frontend phone authentication
 * reCAPTCHA is handled automatically by Firebase
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from "firebase/auth";

// Firebase configuration from environment variables
// You need to create a Firebase project and add these values to .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase App (singleton pattern)
let firebaseApp: FirebaseApp;
let auth: Auth;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
  }
  return firebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/**
 * Initialize reCAPTCHA verifier
 * Firebase handles reCAPTCHA automatically - no manual implementation needed
 * @param containerID - ID of the container element for reCAPTCHA
 * @param size - Size of reCAPTCHA ('invisible' or 'normal')
 * @returns RecaptchaVerifier instance
 */
export function initializeRecaptcha(
  containerID: string = "recaptcha-container",
  size: "invisible" | "normal" = "invisible"
): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  // Clear any existing reCAPTCHA
  const existingContainer = document.getElementById(containerID);
  if (existingContainer) {
    existingContainer.innerHTML = "";
  }

  const recaptchaVerifier = new RecaptchaVerifier(auth, containerID, {
    size: size,
    callback: () => {
      // reCAPTCHA solved - allow phone auth
      console.log("✅ reCAPTCHA verified");
    },
    "expired-callback": () => {
      // reCAPTCHA expired
      console.warn("⚠️ reCAPTCHA expired");
    },
  });

  return recaptchaVerifier;
}

/**
 * Send OTP to phone number
 * @param phoneNumber - Phone number in international format (+91XXXXXXXXXX)
 * @param recaptchaVerifier - Initialized RecaptchaVerifier
 * @returns ConfirmationResult for OTP verification
 */
export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  try {
    const auth = getFirebaseAuth();

    // Validate phone number format
    if (!phoneNumber.startsWith("+")) {
      throw new Error("Phone number must be in international format (e.g., +91XXXXXXXXXX)");
    }

    console.log(`📱 Sending OTP to ${phoneNumber}...`);

    // Send OTP via Firebase
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    console.log("✅ OTP sent successfully");
    return confirmationResult;
  } catch (error: any) {
    console.error("❌ Error sending OTP:", error);

    // Handle specific Firebase errors
    if (error.code === "auth/invalid-phone-number") {
      throw new Error("Invalid phone number format");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many requests. Please try again later.");
    } else if (error.code === "auth/quota-exceeded") {
      throw new Error("SMS quota exceeded. Please contact support.");
    } else {
      throw new Error(error.message || "Failed to send OTP");
    }
  }
}

/**
 * Verify OTP code
 * @param confirmationResult - ConfirmationResult from sendOTP
 * @param otpCode - 6-digit OTP code entered by user
 * @returns ID token for backend verification
 */
export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<string> {
  try {
    console.log(`🔐 Verifying OTP code...`);

    // Verify the OTP code
    const userCredential = await confirmationResult.confirm(otpCode);

    // Get ID token for backend verification
    const idToken = await userCredential.user.getIdToken();

    console.log("✅ OTP verified successfully");
    return idToken;
  } catch (error: any) {
    console.error("❌ Error verifying OTP:", error);

    // Handle specific Firebase errors
    if (error.code === "auth/invalid-verification-code") {
      throw new Error("Invalid OTP code");
    } else if (error.code === "auth/code-expired") {
      throw new Error("OTP code has expired. Please request a new one.");
    } else {
      throw new Error(error.message || "Failed to verify OTP");
    }
  }
}

/**
 * Clean up reCAPTCHA verifier
 * @param recaptchaVerifier - RecaptchaVerifier to clear
 */
export function clearRecaptcha(recaptchaVerifier: RecaptchaVerifier | null) {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      console.error("Error clearing reCAPTCHA:", error);
    }
  }
}

/**
 * Format phone number to international format
 * @param phoneNumber - Phone number (may include spaces, dashes, etc.)
 * @param countryCode - Country code (default: +91 for India)
 * @returns Formatted phone number (+91XXXXXXXXXX)
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string = "+91"): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // If already starts with country code, return as-is
  if (phoneNumber.startsWith("+")) {
    return phoneNumber.replace(/\s+/g, "");
  }

  // Add country code
  return countryCode + digits;
}

/**
 * Validate Indian phone number
 * @param phoneNumber - Phone number to validate
 * @returns true if valid Indian phone number
 */
export function isValidIndianPhone(phoneNumber: string): boolean {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // Indian mobile numbers are 10 digits
  // Can start with 6, 7, 8, or 9
  const indianPhoneRegex = /^[6-9]\d{9}$/;

  return indianPhoneRegex.test(digits);
}
