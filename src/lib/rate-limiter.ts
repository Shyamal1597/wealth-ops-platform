/**
 * File-backed rate limiter for login attempts.
 *
 * Persists to data/rate-limit.json so lockouts survive server restarts
 * and PM2 redeployments — closing the attack window where a process restart
 * was enough to bypass a 3-hour account lockout.
 *
 * Atomic writes (write-to-tmp + rename) prevent corrupt JSON being read
 * if the process is killed mid-write.
 */

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const RATE_LIMIT_FILE = join(DATA_DIR, "rate-limit.json");
const TMP_FILE = RATE_LIMIT_FILE + ".tmp";

interface LoginAttempt {
  count: number;
  firstAttempt: number; // unix ms
  blockedUntil?: number; // unix ms
}

type AttemptMap = Record<string, LoginAttempt>;

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 3 * 60 * 60 * 1000;    // 3-hour counting window
const BLOCK_DURATION_MS = 3 * 60 * 60 * 1000; // 3-hour lockout

// ── File I/O ──────────────────────────────────────────────────────────────────

function read(): AttemptMap {
  try {
    if (!existsSync(RATE_LIMIT_FILE)) return {};
    return JSON.parse(readFileSync(RATE_LIMIT_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function write(attempts: AttemptMap): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(TMP_FILE, JSON.stringify(attempts, null, 2));
  try {
    renameSync(TMP_FILE, RATE_LIMIT_FILE);
  } catch {
    // Fallback for Windows when the destination file is briefly locked
    writeFileSync(RATE_LIMIT_FILE, JSON.stringify(attempts, null, 2));
  }
}

/** Remove entries that are no longer within the lockout or tracking window. */
function pruneExpired(attempts: AttemptMap, now: number): AttemptMap {
  const pruned: AttemptMap = {};
  for (const [key, attempt] of Object.entries(attempts)) {
    const isBlocked = attempt.blockedUntil && attempt.blockedUntil > now;
    const isWithinWindow = now - attempt.firstAttempt <= WINDOW_MS;
    if (isBlocked || isWithinWindow) pruned[key] = attempt;
  }
  return pruned;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Check if login should be allowed for this identifier (username / email / clientId).
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetIn?: number;
} {
  const now = Date.now();
  const attempts = read();
  const attempt = attempts[identifier];

  // No prior attempts
  if (!attempt) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };

  // Currently blocked
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    const resetIn = Math.ceil((attempt.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  // Window expired — treat as fresh
  if (now - attempt.firstAttempt > WINDOW_MS) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Max attempts reached but blockedUntil not yet set — set it now and persist
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.blockedUntil = now + BLOCK_DURATION_MS;
    attempts[identifier] = attempt;
    write(pruneExpired(attempts, now));
    const resetIn = Math.ceil(BLOCK_DURATION_MS / 1000);
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempt.count };
}

/**
 * Record a failed login attempt. Blocks the identifier if MAX_ATTEMPTS is reached.
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const attempts = read();
  const attempt = attempts[identifier];

  if (!attempt || now - attempt.firstAttempt > WINDOW_MS) {
    // Fresh entry
    attempts[identifier] = { count: 1, firstAttempt: now };
  } else {
    attempt.count++;
    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.blockedUntil = now + BLOCK_DURATION_MS;
    }
    attempts[identifier] = attempt;
  }

  write(pruneExpired(attempts, now));
}

/**
 * Clear failed attempts on successful login.
 */
export function clearFailedAttempts(identifier: string): void {
  const attempts = read();
  delete attempts[identifier];
  write(attempts);
}

/**
 * Prune all expired entries (can be called periodically if desired;
 * pruning also happens automatically on every write).
 */
export function cleanupOldEntries(): void {
  write(pruneExpired(read(), Date.now()));
}
