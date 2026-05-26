/**
 * Firebase Admin SDK Configuration
 * Used for server-side OTP token verification
 * Verifies Firebase ID tokens received from client
 */

import * as admin from "firebase-admin";

// Firebase Admin credentials from environment variables
// Download service account JSON from Firebase Console
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
};

// Initialize Firebase Admin (singleton pattern)
let adminApp: admin.app.App;

/**
 * Get or initialize Firebase Admin App
 * @returns Firebase Admin App instance
 */
export function getAdminApp(): admin.app.App {
  if (!adminApp) {
    try {
      // Check if already initialized
      adminApp = admin.app();
    } catch (error) {
      // Initialize if not already initialized
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      console.log("✅ Firebase Admin initialized");
    }
  }
  return adminApp;
}

/**
 * Get Firebase Admin Auth instance
 * @returns Firebase Admin Auth
 */
export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

/**
 * Verify Firebase ID token (from client OTP verification)
 * This is used to verify that the OTP was successfully verified on the client side
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user info
 */
export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const auth = getAdminAuth();

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    console.log(`✅ Firebase ID token verified for phone: ${decodedToken.phone_number}`);

    return decodedToken;
  } catch (error: any) {
    console.error("❌ Error verifying Firebase ID token:", error);

    if (error.code === "auth/id-token-expired") {
      throw new Error("Token has expired. Please request a new OTP.");
    } else if (error.code === "auth/argument-error") {
      throw new Error("Invalid token format");
    } else {
      throw new Error("Failed to verify OTP token");
    }
  }
}

/**
 * Get user by phone number
 * @param phoneNumber - Phone number in international format (+91XXXXXXXXXX)
 * @returns User record from Firebase
 */
export async function getUserByPhone(phoneNumber: string): Promise<admin.auth.UserRecord | null> {
  try {
    const auth = getAdminAuth();
    const userRecord = await auth.getUserByPhoneNumber(phoneNumber);
    return userRecord;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return null;
    }
    console.error("Error getting user by phone:", error);
    throw error;
  }
}

/**
 * Create or update user in Firebase Auth
 * @param phoneNumber - Phone number in international format
 * @param uid - Optional custom UID
 * @returns User record
 */
export async function createOrUpdateFirebaseUser(
  phoneNumber: string,
  uid?: string
): Promise<admin.auth.UserRecord> {
  try {
    const auth = getAdminAuth();

    // Check if user exists
    const existingUser = await getUserByPhone(phoneNumber);

    if (existingUser) {
      console.log(`ℹ️ User already exists in Firebase: ${phoneNumber}`);
      return existingUser;
    }

    // Create new user
    const userRecord = await auth.createUser({
      phoneNumber,
      uid: uid || undefined,
    });

    console.log(`✅ Created Firebase user for phone: ${phoneNumber}`);
    return userRecord;
  } catch (error) {
    console.error("Error creating Firebase user:", error);
    throw error;
  }
}

/**
 * Delete user from Firebase Auth
 * @param uid - Firebase UID
 */
export async function deleteFirebaseUser(uid: string): Promise<void> {
  try {
    const auth = getAdminAuth();
    await auth.deleteUser(uid);
    console.log(`✅ Deleted Firebase user: ${uid}`);
  } catch (error) {
    console.error("Error deleting Firebase user:", error);
    throw error;
  }
}

/**
 * Extract phone number from Firebase ID token
 * @param idToken - Firebase ID token
 * @returns Phone number from token
 */
export async function getPhoneFromToken(idToken: string): Promise<string> {
  const decodedToken = await verifyIdToken(idToken);

  if (!decodedToken.phone_number) {
    throw new Error("Phone number not found in token");
  }

  return decodedToken.phone_number;
}

/**
 * Verify that a phone number was verified via OTP
 * This is the main function to use in your auth APIs
 * @param idToken - Firebase ID token from client
 * @param expectedPhone - Expected phone number to match (optional)
 * @returns true if phone is verified and matches expected phone (if provided)
 */
export async function verifyPhoneOTP(
  idToken: string,
  expectedPhone?: string
): Promise<{ verified: boolean; phoneNumber: string }> {
  try {
    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(idToken);

    // Extract phone number from token
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return { verified: false, phoneNumber: "" };
    }

    // If expected phone is provided, verify it matches
    if (expectedPhone && phoneNumber !== expectedPhone) {
      console.warn(`⚠️ Phone mismatch: expected ${expectedPhone}, got ${phoneNumber}`);
      return { verified: false, phoneNumber };
    }

    return { verified: true, phoneNumber };
  } catch (error) {
    console.error("Phone OTP verification failed:", error);
    return { verified: false, phoneNumber: "" };
  }
}

/**
 * Generate custom token for a user
 * This can be used for seamless authentication after OTP verification
 * @param uid - User ID
 * @returns Custom token
 */
export async function createCustomToken(uid: string): Promise<string> {
  try {
    const auth = getAdminAuth();
    const customToken = await auth.createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error;
  }
}
