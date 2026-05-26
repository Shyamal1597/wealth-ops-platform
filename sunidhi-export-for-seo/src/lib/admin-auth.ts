/**
 * Admin Authentication Module
 *
 * CRITICAL SECURITY POLICY - SUPER ADMIN PROTECTION:
 * ====================================================
 * This system enforces that ONLY ONE super admin can exist.
 *
 * Super Admin Details:
 * - ID: superadmin001
 * - Username: rahul.bisht
 * - Email: rahul.bisht@sunidhi.com
 *
 * Security Rules Enforced:
 * 1. NO other super admin accounts can be created
 * 2. Super admin role CANNOT be assigned to new admins
 * 3. Existing admin roles CANNOT be changed to super_admin
 * 4. Super admin account CANNOT be deleted
 * 5. Super admin role CANNOT be modified or downgraded
 *
 * All attempts to violate these rules will throw FORBIDDEN errors.
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");
const JWT_SECRET = process.env.JWT_SECRET || "sunidhi-admin-secret-key-2025";

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

export async function verifyAdminPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function createAdminToken(
  adminId: string,
  username: string
): Promise<string> {
  return jwt.sign(
    { adminId, username, role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export async function verifyAdminToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
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
  // CRITICAL SECURITY RULE: Only ONE super admin can exist in the system
  // Super admin: rahul.bisht@sunidhi.com (ID: superadmin001)
  // No other super admin accounts can be created
  if (adminData.role === "super_admin") {
    throw new Error(
      "FORBIDDEN: Cannot create super admin account. Only one super admin exists in the system."
    );
  }

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

  // CRITICAL SECURITY RULE: Prevent deleting super admin
  // Super admin (superadmin001) cannot be deleted
  const adminToDelete = admins.find((a) => a.id === adminId);
  if (adminToDelete?.role === "super_admin") {
    throw new Error(
      "FORBIDDEN: Cannot delete super admin account. Super admin is protected."
    );
  }

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

  // CRITICAL SECURITY RULE: Prevent changing role to super_admin
  // Only one super admin can exist: rahul.bisht@sunidhi.com (ID: superadmin001)
  if (updates.role === "super_admin") {
    throw new Error(
      "FORBIDDEN: Cannot change admin role to super_admin. Only one super admin exists in the system."
    );
  }

  // CRITICAL SECURITY RULE: Prevent modifying the existing super admin account
  // Protect the super admin from having their role changed
  if (admins[adminIndex].role === "super_admin" && updates.role === "admin") {
    throw new Error(
      "FORBIDDEN: Cannot modify super admin role. Super admin is protected."
    );
  }

  // If password is being updated, hash it
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  admins[adminIndex] = { ...admins[adminIndex], ...updates };
  await saveAdmins(admins);

  return admins[adminIndex];
}
