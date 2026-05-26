/**
 * Simple in-memory rate limiter for login attempts
 * Prevents brute force attacks by limiting login attempts
 */

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Store login attempts in memory (will reset on server restart)
const loginAttempts = new Map<string, LoginAttempt>();

const MAX_ATTEMPTS = 5; // Maximum failed login attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const BLOCK_DURATION_MS = 15 * 60 * 1000; // Block for 15 minutes

/**
 * Check if login should be allowed for this identifier
 * @param identifier - Username, email, or IP address
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetIn?: number;
} {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  // No previous attempts
  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if currently blocked
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    const resetIn = Math.ceil((attempt.blockedUntil - now) / 1000); // seconds
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  // Reset if window has passed
  if (now - attempt.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if max attempts exceeded
  if (attempt.count >= MAX_ATTEMPTS) {
    // Block the user
    attempt.blockedUntil = now + BLOCK_DURATION_MS;
    const resetIn = Math.ceil(BLOCK_DURATION_MS / 1000); // seconds
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - attempt.count
  };
}

/**
 * Record a failed login attempt
 * @param identifier - Username, email, or IP address
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now
    });
    return;
  }

  // Reset if window has passed
  if (now - attempt.firstAttempt > WINDOW_MS) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now
    });
    return;
  }

  // Increment count
  attempt.count++;

  // Block if max attempts exceeded
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.blockedUntil = now + BLOCK_DURATION_MS;
  }
}

/**
 * Clear failed attempts for an identifier (call on successful login)
 * @param identifier - Username, email, or IP address
 */
export function clearFailedAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Clean up old entries (optional, to prevent memory growth)
 * Should be called periodically
 */
export function cleanupOldEntries(): void {
  const now = Date.now();
  for (const [key, attempt] of loginAttempts.entries()) {
    // Remove if window has passed and not currently blocked
    if (now - attempt.firstAttempt > WINDOW_MS && (!attempt.blockedUntil || attempt.blockedUntil < now)) {
      loginAttempts.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldEntries, 5 * 60 * 1000);
}
