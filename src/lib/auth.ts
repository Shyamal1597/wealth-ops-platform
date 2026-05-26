import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClientSession, isClientSessionValid } from "@/lib/client-session-store";
import { createUserSession, isUserSessionValid } from "@/lib/user-session-store";

if (!process.env.JWT_SECRET) {
  throw new Error("Critical Security Error: JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = process.env.JWT_SECRET;
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed with bcrypt
  fullName: string;
  phone: string; // ENCRYPTED - use encryptPhone/decryptPhone from crypto.ts
  phoneVerified: boolean; // true if phone OTP was verified
  twoFactorEnabled: boolean; // Enable/disable 2FA OTP on login
  accountType: string;
  clientId?: string; // Optional client ID for login
  panCard?: string; // ENCRYPTED - use encryptPAN/decryptPAN from crypto.ts
  firebaseUid?: string; // Firebase UID for phone auth
  createdAt: string;
  lastLoginAt?: string; // Track last successful login
}

export interface UserData {
  users: User[];
}

// Read users from file
export async function getUsers(): Promise<UserData> {
  try {
    if (!existsSync(USERS_FILE)) {
      return { users: [] };
    }
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return { users: [] };
  }
}

// Save users to file
export async function saveUsers(userData: UserData): Promise<void> {
  await writeFile(USERS_FILE, JSON.stringify(userData, null, 2));
}

// Find user by username, email, or ID
export async function findUser(usernameOrEmailOrId: string): Promise<User | null> {
  const userData = await getUsers();
  const user = userData.users.find(
    (u) =>
      u.username.toLowerCase() === usernameOrEmailOrId.toLowerCase() ||
      u.email.toLowerCase() === usernameOrEmailOrId.toLowerCase() ||
      u.id === usernameOrEmailOrId
  );
  return user || null;
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  const userData = await getUsers();
  const user = userData.users.find((u) => u.id === id);
  return user || null;
}

// Verify password
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Create JWT token — registers a single-session entry so older tokens are
// immediately invalidated on their next verification call.
export function createToken(userId: string, username: string): string {
  const issuedAt = createUserSession(userId);
  const payload: Record<string, unknown> = { userId, username };
  payload.iat = Math.floor(issuedAt / 1000);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token — checks signature AND single-session store.
// Returns null if the token has been superseded by a newer login.
export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      iat: number;
    };
    if (!decoded || !decoded.userId) return null;

    // Single-session check: reject if a newer login has taken over.
    const tokenIssuedAtMs = decoded.iat * 1000;
    if (!isUserSessionValid(decoded.userId, tokenIssuedAtMs)) return null;

    return { userId: decoded.userId, username: decoded.username };
  } catch {
    return null;
  }
}

// ── Client portal tokens ────────────────────────────────────────────────────
// Separate token type so client-portal sessions cannot be confused with
// regular user or admin sessions.
// iat is explicitly embedded from the session store so verifyClientToken's
// issuedAt comparison is always consistent (avoids rare second-boundary skew).
export function createClientToken(clientId: string, name: string): string {
  const issuedAt = createClientSession(clientId);
  const payload: Record<string, unknown> = { clientId, name, type: "client" };
  payload.iat = Math.floor(issuedAt / 1000);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyClientToken(token: string): { clientId: string; name: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      clientId: string;
      name: string;
      type: string;
      iat: number;
    };
    if (decoded.type !== "client") return null;

    // Single-session check: reject tokens issued before the latest login.
    // JWT `iat` is in seconds; session store uses ms floored to the second.
    const tokenIssuedAtMs = decoded.iat * 1000;
    if (!isClientSessionValid(decoded.clientId, tokenIssuedAtMs)) {
      return null; // A newer login from another browser has taken over
    }

    return { clientId: decoded.clientId, name: decoded.name };
  } catch {
    return null;
  }
}

// Create new user
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string; // Should be ENCRYPTED before calling this function
  phoneVerified?: boolean;
  accountType: string;
  clientId?: string;
  panCard?: string; // Should be ENCRYPTED before calling this function
  firebaseUid?: string;
}): Promise<User> {
  const users = await getUsers();

  // Check if username or email already exists
  const existingUser = users.users.find(
    (u) =>
      u.username.toLowerCase() === userData.username.toLowerCase() ||
      u.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  // Generate new user ID
  const newId = `user${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Generate client ID if not provided
  const clientId = userData.clientId || `SUN${Date.now().toString().slice(-8)}`;

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create new user
  const newUser: User = {
    id: newId,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    fullName: userData.fullName,
    phone: userData.phone, // Already encrypted
    phoneVerified: userData.phoneVerified || false,
    twoFactorEnabled: true, // Enable 2FA by default
    accountType: userData.accountType,
    clientId: clientId,
    panCard: userData.panCard || undefined,
    firebaseUid: userData.firebaseUid || undefined,
    createdAt: new Date().toISOString(),
  };

  // Add to users array
  users.users.push(newUser);

  // Save to file
  await saveUsers(users);

  return newUser;
}

// Find user by client ID
export async function findUserByClientId(clientId: string): Promise<User | null> {
  const userData = await getUsers();
  const user = userData.users.find(
    (u) => u.clientId?.toLowerCase() === clientId.toLowerCase()
  );
  return user || null;
}

// Find user by encrypted phone number
export async function findUserByPhone(phoneNumber: string): Promise<User | null> {
  const userData = await getUsers();
  // Note: phoneNumber parameter should be ENCRYPTED before calling this
  const user = userData.users.find((u) => u.phone === phoneNumber);
  return user || null;
}

// Update user's last login time
export async function updateLastLogin(userId: string): Promise<void> {
  const userData = await getUsers();
  const userIndex = userData.users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    userData.users[userIndex].lastLoginAt = new Date().toISOString();
    await saveUsers(userData);
  }
}

// Get user without password
export function sanitizeUser(user: User) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
