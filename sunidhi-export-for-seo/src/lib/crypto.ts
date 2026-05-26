/**
 * Encryption Utility for Sensitive Data
 * Uses AES-256-GCM for encrypting phone numbers, PAN cards, etc.
 * Based on Node.js built-in crypto module (no external dependencies)
 */

import crypto from "crypto";

// Get encryption key from environment variable
// IMPORTANT: Change this in production and keep it secret!
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET || "sunidhi-encryption-key-change-in-production-32chars";

// Ensure key is 32 bytes for AES-256
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32));

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param plaintext - The data to encrypt
 * @returns Encrypted data in format: iv:authTag:encryptedData (all base64)
 */
export function encrypt(plaintext: string): string {
  try {
    // Generate random initialization vector (IV)
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY_BUFFER, iv);

    // Encrypt the data
    let encrypted = cipher.update(plaintext, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Return: iv:authTag:encryptedData (all base64 encoded)
    return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - The encrypted data in format: iv:authTag:encryptedData
 * @returns Decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
  try {
    // Split the encrypted data
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const [ivBase64, authTagBase64, encrypted] = parts;

    // Convert from base64
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY_BUFFER, iv);
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Encrypt phone number
 * @param phoneNumber - Phone number in format +91XXXXXXXXXX
 * @returns Encrypted phone number
 */
export function encryptPhone(phoneNumber: string): string {
  // Validate phone number format (basic validation)
  const cleanPhone = phoneNumber.replace(/\s+/g, "");
  if (!cleanPhone.startsWith("+") || cleanPhone.length < 10) {
    throw new Error("Invalid phone number format");
  }
  return encrypt(cleanPhone);
}

/**
 * Decrypt phone number
 * @param encryptedPhone - Encrypted phone number
 * @returns Decrypted phone number
 */
export function decryptPhone(encryptedPhone: string): string {
  return decrypt(encryptedPhone);
}

/**
 * Encrypt PAN card number
 * @param panCard - PAN card number
 * @returns Encrypted PAN
 */
export function encryptPAN(panCard: string): string {
  // Validate PAN format (AAAAA0000A)
  const cleanPAN = panCard.toUpperCase().replace(/\s+/g, "");
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(cleanPAN)) {
    throw new Error("Invalid PAN card format");
  }

  return encrypt(cleanPAN);
}

/**
 * Decrypt PAN card number
 * @param encryptedPAN - Encrypted PAN
 * @returns Decrypted PAN
 */
export function decryptPAN(encryptedPAN: string): string {
  return decrypt(encryptedPAN);
}

/**
 * Mask phone number for display (shows only last 4 digits)
 * @param phoneNumber - Full phone number or encrypted phone
 * @param encrypted - Whether the input is encrypted
 * @returns Masked phone number like +91XXXXXX1234
 */
export function maskPhone(phoneNumber: string, encrypted: boolean = false): string {
  try {
    const phone = encrypted ? decrypt(phoneNumber) : phoneNumber;
    const cleanPhone = phone.replace(/\s+/g, "");

    if (cleanPhone.length < 4) {
      return "XXXX";
    }

    const lastFour = cleanPhone.slice(-4);
    const prefix = cleanPhone.slice(0, 3); // e.g., +91
    const masked = prefix + "XXXXXX" + lastFour;

    return masked;
  } catch (error) {
    return "XXXXXXXXXXXX";
  }
}

/**
 * Mask PAN for display (shows only last 4 characters)
 * @param panCard - Full PAN or encrypted PAN
 * @param encrypted - Whether the input is encrypted
 * @returns Masked PAN like XXXXXX1234A
 */
export function maskPAN(panCard: string, encrypted: boolean = false): string {
  try {
    const pan = encrypted ? decrypt(panCard) : panCard;
    const cleanPAN = pan.toUpperCase().replace(/\s+/g, "");

    if (cleanPAN.length < 4) {
      return "XXXXXXXXXX";
    }

    const lastFour = cleanPAN.slice(-4);
    return "XXXXXX" + lastFour;
  } catch (error) {
    return "XXXXXXXXXX";
  }
}

/**
 * Generate a secure random token (for temporary sessions, etc.)
 * @param length - Length of the token in bytes (default: 32)
 * @returns Random token as hex string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
