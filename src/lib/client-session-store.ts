/**
 * Client Session Store — file-backed
 *
 * Uses data/client-sessions.json so the session record is shared across
 * every Next.js route bundle (API routes are compiled into separate chunks
 * that each get their own module instance; an in-memory Map would be a
 * different object in each chunk).
 *
 * Enforces a single active session per client.  A new login from any
 * browser overwrites the stored issuedAt, instantly invalidating all
 * older tokens on their next verification call.
 */

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const SESSIONS_FILE = join(DATA_DIR, "client-sessions.json");
const TMP_FILE = SESSIONS_FILE + ".tmp";

type SessionMap = Record<string, number>; // clientId → tokenIssuedAt (ms)

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
 * Register a new session for the client.
 * Overwrites any existing entry — all older tokens are now invalid.
 * Returns the issuedAt timestamp to embed in the JWT.
 */
export function createClientSession(clientId: string): number {
  const issuedAt = Math.floor(Date.now() / 1000) * 1000;
  const sessions = read();
  sessions[clientId] = issuedAt;
  write(sessions);
  return issuedAt;
}

/**
 * Returns true only if the token's issuedAt matches the latest login for
 * this client (i.e. no newer login has occurred from another browser).
 */
export function isClientSessionValid(clientId: string, tokenIssuedAt: number): boolean {
  const sessions = read();
  const stored = sessions[clientId];
  if (stored === undefined) return false;
  return tokenIssuedAt >= stored;
}

/**
 * Remove the session entry on explicit logout.
 */
export function invalidateClientSession(clientId: string): void {
  const sessions = read();
  delete sessions[clientId];
  write(sessions);
}
