/**
 * Admin Session Store — file-backed
 *
 * Uses data/admin-sessions.json so the session record is shared across
 * every Next.js route bundle (API routes are compiled into separate chunks
 * that each get their own module instance; an in-memory Map would be a
 * different object in each chunk).
 *
 * TDL-004: Account Lockout Bypass — invalidating a session here means any
 *   replayed token is rejected on the very next request.
 *
 * TDL-008: Concurrent Logins — a new login overwrites the stored issuedAt,
 *   instantly invalidating all older tokens on their next verification call.
 */

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const SESSIONS_FILE = join(DATA_DIR, "admin-sessions.json");
const TMP_FILE = SESSIONS_FILE + ".tmp";

interface AdminSession {
  adminId: string;
  username: string;
  tokenIssuedAt: number; // unix ms
}

type SessionMap = Record<string, AdminSession>; // adminId → session

function read(): SessionMap {
  try {
    if (!existsSync(SESSIONS_FILE)) return {};
    return JSON.parse(readFileSync(SESSIONS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function write(sessions: SessionMap): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(TMP_FILE, JSON.stringify(sessions, null, 2));
  try {
    renameSync(TMP_FILE, SESSIONS_FILE);
  } catch {
    // Fallback for Windows when the destination file is briefly locked
    writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  }
}

/**
 * Register a new session for an admin.
 * Any previous session for the same admin is automatically invalidated (TDL-008).
 * Returns the issuedAt timestamp to embed in the JWT.
 */
export function createAdminSession(adminId: string, username: string): number {
  const issuedAt = Math.floor(Date.now() / 1000) * 1000;
  const sessions = read();
  sessions[adminId] = { adminId, username, tokenIssuedAt: issuedAt };
  write(sessions);
  return issuedAt;
}

/**
 * Check whether a token (identified by its issued-at time) is still valid
 * for the given admin. Returns false if the session has been invalidated.
 */
export function isAdminSessionValid(adminId: string, tokenIssuedAt: number): boolean {
  const sessions = read();
  const session = sessions[adminId];
  if (!session) return false;
  return tokenIssuedAt >= session.tokenIssuedAt;
}

/**
 * Invalidate all sessions for an admin.
 * Call on lockout, explicit logout, or account deletion.
 */
export function invalidateAdminSession(adminId: string): void {
  const sessions = read();
  delete sessions[adminId];
  write(sessions);
}

/**
 * Look up the active session for an admin (for diagnostics).
 */
export function getAdminSession(adminId: string): AdminSession | undefined {
  return read()[adminId];
}
