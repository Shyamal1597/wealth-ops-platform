import { readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAdminSessionValid } from "@/lib/admin-session-store";

const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");
if (!process.env.JWT_SECRET) {
  throw new Error("Critical Security Error: JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = process.env.JWT_SECRET;

export interface Admin {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: "super_admin" | "admin";
  permissions: string[];
  createdAt: string;
  approvedBy?: string; // ID of the super admin who approved this admin
}

export async function getAdmins(): Promise<Admin[]> {
  try {
    const data = await readFile(ADMINS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function findAdmin(usernameOrEmail: string): Promise<Admin | null> {
  const admins = await getAdmins();
  const admin = admins.find(
    (a) =>
      a.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
      a.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );
  return admin || null;
}

export async function findAdminById(id: string): Promise<Admin | null> {
  const admins = await getAdmins();
  return admins.find((a) => a.id === id) || null;
}

export async function verifyAdminPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function createAdminToken(
  adminId: string,
  username: string,
  issuedAt?: number
): Promise<string> {
  const payload: Record<string, unknown> = { adminId, username, role: "admin" };
  if (issuedAt !== undefined) payload.iat = Math.floor(issuedAt / 1000);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5m" });
}

export async function verifyAdminToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      adminId: string;
      username: string;
      iat: number;
    };
    if (!decoded || !decoded.adminId) return null;

    // Single-session check: reject tokens issued before the latest login.
    // Mirrors the client-session check in verifyClientToken (auth.ts).
    // JWT `iat` is in seconds; session store uses ms floored to the second.
    const tokenIssuedAtMs = decoded.iat * 1000;
    if (!isAdminSessionValid(decoded.adminId, tokenIssuedAtMs)) {
      return null; // Session was invalidated (logout, lockout, or newer login)
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify a JWT token AND check that the admin (from admins.json) has the
 * required permission. Returns the Admin record on success, null otherwise.
 * TDL-001: permissions are always read from the DB, never trusted from the token.
 */
export async function verifyAdminPermission(
  token: string,
  requiredPermission: string
): Promise<Omit<Admin, "password"> | null> {
  const payload = await verifyAdminToken(token);
  if (!payload || !payload.adminId) return null;

  const admin = await findAdminById(payload.adminId);
  if (!admin) return null;

  if (admin.role !== "super_admin" && !admin.permissions.includes(requiredPermission)) {
    return null;
  }

  const { password: _pw, ...adminData } = admin;
  return adminData;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function saveAdmins(admins: Admin[]): Promise<void> {
  await writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
}

export async function createAdmin(adminData: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: "super_admin" | "admin";
  permissions: string[];
  approvedBy?: string;
}): Promise<Admin> {
  const hashedPassword = await hashPassword(adminData.password);
  const newAdmin: Admin = {
    id: `admin${Date.now()}`,
    username: adminData.username,
    email: adminData.email,
    password: hashedPassword,
    fullName: adminData.fullName,
    role: adminData.role,
    permissions: adminData.permissions,
    createdAt: new Date().toISOString(),
    approvedBy: adminData.approvedBy,
  };

  const admins = await getAdmins();
  admins.push(newAdmin);
  await saveAdmins(admins);

  return newAdmin;
}

export async function deleteAdmin(adminId: string): Promise<boolean> {
  const admins = await getAdmins();
  const filteredAdmins = admins.filter((a) => a.id !== adminId);

  if (filteredAdmins.length === admins.length) {
    return false; // Admin not found
  }

  await saveAdmins(filteredAdmins);
  return true;
}

export async function updateAdmin(adminId: string, updates: Partial<Admin>): Promise<Admin | null> {
  const admins = await getAdmins();
  const adminIndex = admins.findIndex((a) => a.id === adminId);

  if (adminIndex === -1) {
    return null;
  }

  // If password is being updated, hash it
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  admins[adminIndex] = { ...admins[adminIndex], ...updates };
  await saveAdmins(admins);

  return admins[adminIndex];
}
