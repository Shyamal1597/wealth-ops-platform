# Development Session Summary — May 2026
### Sunidhi Securities & Finance Ltd — Next.js Website

> This document is the authoritative record of all code changes, security fixes, and feature additions
> made in the May 2026 development session. It is intended for future developers, auditors, and
> the hosting team.

---

## Table of Contents

1. [Session Overview](#1-session-overview)
2. [Task A — Downloads & Forms Page](#2-task-a--downloads--forms-page)
3. [Task B — Full VAPT Security Audit](#3-task-b--full-vapt-security-audit)
4. [Task C — VAPT Fixes Implementation](#4-task-c--vapt-fixes-implementation)
5. [Task D — Self-Review Checklist & Additional Fixes](#5-task-d--self-review-checklist--additional-fixes)
6. [Task E — Banking-Style Admin Sliding Session](#6-task-e--banking-style-admin-sliding-session)
7. [Complete File Change Inventory](#7-complete-file-change-inventory)
8. [Data Directory — New Files](#8-data-directory--new-files)
9. [Authentication Architecture — Final State](#9-authentication-architecture--final-state)
10. [Security Tag Reference](#10-security-tag-reference)
11. [Deployment Checklist](#11-deployment-checklist)

---

## 1. Session Overview

| Item | Detail |
|---|---|
| Date | May 2026 |
| Project | `sunidhi-nextjs` — Sunidhi Securities & Finance Ltd website |
| Stack | Next.js 15 App Router, TypeScript, file-backed JSON data store, JWT auth |
| Auth layers | 3 separate token types: Admin (`admin-token`), Client Portal (`client-token`), User (`auth-token`) |
| Key outcome | Full VAPT remediation + downloads page rebuilt + banking-model admin session |

### What was addressed
- Old downloads page had 4 categories of broken external links pointing to a defunct hosting provider (`wekart.co.in`) — all returning 404.
- A comprehensive VAPT audit across all auth layers found multiple Critical, High, and Medium vulnerabilities — all remediated in the same session.
- A self-review checklist was run after the VAPT fixes and found two additional bugs that were also fixed.
- The admin dashboard's 5-minute fixed JWT was replaced with a banking-style sliding inactivity timeout (session stays alive on activity, expires after 5 minutes of idle).

---

## 2. Task A — Downloads & Forms Page

### Problem
`src/app/support/downloads/page.tsx` had 4 hardcoded download categories, each pointing to URLs like:
```
https://wekart.co.in/APP_ADDONS/SunidhiSecurities/Forms/...
```
The hosting at `wekart.co.in` had been discontinued — all 404.

### Source Files
44 PDF files were provided in:
```
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\Downloads & Forms\Forms Copy\
```

### What Was Done
1. All 44 PDFs copied to `public/forms/` to be served as static assets by Next.js.
2. `src/app/support/downloads/page.tsx` completely rewritten with 5 categorised tabs and 41 forms (3 duplicate `(1)` files excluded from links, present in the folder for reference only).

### Tab Structure

| Tab ID | Label | Forms | Icon |
|---|---|---|---|
| `equity` | Equity & BSE | 19 | TrendingUp |
| `depository` | Depository | 6 | Layers |
| `ap-support` | AP Support | 3 | Users |
| `mandatory` | Mandatory Information | 7 | AlertCircle |
| `policies` | Policies | 6 | ShieldCheck |
| **Total** | | **41** | |

### Key Implementation Details
```typescript
// URL encoder — handles spaces and special characters in filenames safely
function formUrl(filename: string) {
  return `/forms/${encodeURIComponent(filename)}`;
}
```
- All download links use `target="_blank" rel="noopener noreferrer"` for XSS protection.
- Tab navigation is sticky (stays at top on scroll) with per-tab count badges.
- Forms rendered in a table with row-level Download buttons.
- `totalForms` is computed dynamically: `TABS.reduce((sum, t) => sum + t.forms.length, 0)`.

### Files Changed
| File | Change |
|---|---|
| `src/app/support/downloads/page.tsx` | Complete rewrite |
| `public/forms/*.pdf` (44 files) | New directory, all PDFs added |

---

## 3. Task B — Full VAPT Security Audit

A systematic audit was conducted across all authentication layers, session management, encryption, and data persistence.

### Findings Summary

| ID | Severity | Title | File(s) |
|---|---|---|---|
| C-1 | **CRITICAL** | Stale `verifyAdminToken` in `auth.ts` — session-store-blind | `src/lib/auth.ts` |
| C-2 | **CRITICAL** | 4 admin routes importing `verifyAdminToken` from wrong module | 4 route files |
| H-1 | HIGH | No user session store — logout does not invalidate tokens | `src/lib/auth.ts`, `logout/route.ts` |
| H-2 | HIGH | In-memory rate limiter — bypassed by PM2 restart or redeploy | `src/lib/rate-limiter.ts` |
| H-3 | HIGH | `createToken()` not registering sessions | `src/lib/auth.ts` |
| M-1 | MEDIUM | `createClientToken` iat skew — second-boundary race condition | `src/lib/auth.ts` |
| M-2 | MEDIUM | User logout does not call session invalidation | `src/app/api/auth/logout/route.ts` |
| M-3 | MEDIUM | Non-atomic session store writes | all 3 session store files |
| TDL-007 | MEDIUM | Admin token lifetime too long (2h), client token too long (7d) | multiple files |

### Detailed Finding Descriptions

#### C-1 — Stale `verifyAdminToken` in `auth.ts`
`src/lib/auth.ts` exported its own `verifyAdminToken` that only checked JWT signature — it had no session store check. Any admin token that had been issued was permanently valid for its full lifetime even after logout or lockout.

```typescript
// THE OLD DANGEROUS FUNCTION (now deleted from auth.ts):
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    return decoded !== null && decoded !== undefined;
  } catch (error) { return false; }
}
// ↑ No session-store check. No type discrimination (treated admin tokens same as user tokens).
```

#### C-2 — 4 Admin Routes on Wrong Import
These four routes were calling `verifyAdminToken` from `@/lib/auth` (the stale version) instead of `@/lib/admin-auth` (the session-aware version):
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/admin/blogs/route.ts`
- `src/app/api/admin/csr/route.ts`
- `src/app/api/admin/foundation/route.ts`

Consequence: all four routes would accept a locked-out admin's token for the full JWT lifetime.

#### H-1 & H-3 — No User Session Store
Regular user logins (`auth-token`) had no server-side session store at all. Once a JWT was issued, it could never be revoked — even after the user explicitly logged out. An attacker who captured the `auth-token` cookie could use it until the 7-day JWT expiry.

#### H-2 — In-Memory Rate Limiter
```typescript
// THE OLD IMPLEMENTATION:
const loginAttempts = new Map<string, LoginAttempt>();
```
Being a module-level `Map`, it was reset to empty on every PM2 restart or deployment. A locked-out attacker could bypass the lockout by triggering a server restart (or waiting for a scheduled deployment).

#### M-1 — Client Token iat Skew
`createClientToken` was calling `createClientSession(clientId)` but discarding the returned `issuedAt`. The JWT `iat` was then set by the library to `Math.floor(Date.now() / 1000)`. If execution crossed a second boundary, the session store's `issuedAt` (in milliseconds) and the JWT's `iat × 1000` could differ by up to 999 ms, causing `isClientSessionValid` to reject a brand-new valid token.

#### M-3 — Non-Atomic Session Store Writes
All session store files were written with `writeFileSync(file, data)` directly. If the process was killed mid-write, the JSON file would be truncated/corrupt, causing all subsequent reads to fail with parse errors — effectively taking down auth for all users.

---

## 4. Task C — VAPT Fixes Implementation

All Critical, High, and Medium findings were implemented. Token lifetimes per user specification:
- **Admin token**: 5 minutes
- **Client token**: 1 hour
- **User token**: unchanged at 7 days

### New File: `src/lib/user-session-store.ts`

```typescript
// Stores: userId → tokenIssuedAt (ms)
// File-backed: data/user-sessions.json
// Atomic writes: write to .tmp, then rename (with Windows EPERM fallback)

export function createUserSession(userId: string): number
  // Writes issuedAt to store, returns issuedAt value for embedding in JWT iat

export function isUserSessionValid(userId: string, tokenIssuedAtMs: number): boolean
  // Returns true only if tokenIssuedAtMs >= stored value
  // >= (not ===) to handle clock rounding across session refresh

export function invalidateUserSession(userId: string): void
  // Deletes entry — all outstanding tokens for this user become invalid immediately
```

Pattern matches the existing `admin-session-store.ts` and `client-session-store.ts`.

### Changes to `src/lib/rate-limiter.ts`

**Was:** In-memory `Map<string, LoginAttempt>` — lost on restart.

**Now:** File-backed `data/rate-limit.json` with atomic writes.

Key additions:
```typescript
// Automatic stale-entry pruning on every write — no memory leak, no setInterval needed
function pruneExpired(attempts: AttemptMap, now: number): AttemptMap {
  const pruned: AttemptMap = {};
  for (const [key, attempt] of Object.entries(attempts)) {
    const isBlocked = attempt.blockedUntil && attempt.blockedUntil > now;
    const isWithinWindow = now - attempt.firstAttempt <= WINDOW_MS;
    if (isBlocked || isWithinWindow) pruned[key] = attempt;
  }
  return pruned;
}
```

Lockouts now survive PM2 restarts, server reboots, and code deployments.

### Changes to `src/lib/auth.ts`

| Function | Before | After |
|---|---|---|
| `createToken()` | Signs JWT, no session registration | Calls `createUserSession(userId)`, embeds `iat` explicitly from returned value |
| `verifyToken()` | Checks JWT signature only | Also calls `isUserSessionValid(userId, iat * 1000)` |
| `createClientToken()` | Called `createClientSession` but discarded return value, JWT set own `iat` | Captures `issuedAt` from `createClientSession`, embeds `iat` explicitly |
| `verifyAdminToken` (exported) | Existed — session-store-blind | **DELETED** — use `verifyAdminToken` from `@/lib/admin-auth` exclusively |

### Changes to `src/lib/admin-auth.ts`

| Change | Before | After |
|---|---|---|
| JWT expiry in `createAdminToken` | `expiresIn: "2h"` | `expiresIn: "5m"` |

### Changes to `src/lib/admin-session-store.ts` & `src/lib/client-session-store.ts`

Added atomic write pattern to both:
```typescript
const TMP_FILE = SESSIONS_FILE + ".tmp";

function write(sessions: SessionMap): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(TMP_FILE, JSON.stringify(sessions, null, 2));
  try {
    renameSync(TMP_FILE, SESSIONS_FILE);    // atomic on POSIX
  } catch {
    writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2)); // Windows EPERM fallback
  }
}
```

### Changes to `src/app/api/auth/logout/route.ts`

Before: just deleted the `auth-token` cookie.

After:
```typescript
import jwt from "jsonwebtoken";
import { invalidateUserSession } from "@/lib/user-session-store";

// Uses jwt.decode (NOT verify) so an already-expired token still yields userId
const decoded = jwt.decode(token) as { userId?: string } | null;
if (decoded?.userId) invalidateUserSession(decoded.userId);
cookieStore.delete("auth-token");
```

### Cookie maxAge Changes

| Cookie | Before | After |
|---|---|---|
| `admin-token` (login route) | `2 * 60 * 60` (2h) | `5 * 60` (5 min) |
| `client-token` (client-login route) | `60 * 60 * 24 * 7` (7 days) | `60 * 60` (1h) |
| `client-token` (set-client-password route) | `60 * 60 * 24 * 7` (7 days) | `60 * 60` (1h) |
| `auth-token` (user login) | unchanged | unchanged (7 days) |

### Admin Routes Import Fix (C-2)

All 4 routes changed:
```typescript
// BEFORE (wrong — stale, session-store-blind):
import { verifyAdminToken } from "@/lib/auth";

// AFTER (correct — session-aware):
import { verifyAdminToken } from "@/lib/admin-auth";
```

---

## 5. Task D — Self-Review Checklist & Additional Fixes

After the VAPT fixes were implemented, a systematic self-review was run across all 14 modified/related files. This found two additional bugs.

### Bug 1 — `verify-client-otp` Missing Rate Limiting (HIGH)

**File:** `src/app/api/auth/verify-client-otp/route.ts`

**Problem:** The OTP verification endpoint had zero rate limiting. An attacker with a valid `clientId` could brute-force the 6-digit OTP space (1,000,000 combinations) with no lockout whatsoever.

Additionally, the original code had a timing oracle — expiry check was split from validity check, giving distinct error messages for "wrong OTP" vs "correct OTP but expired". This let an attacker distinguish the two cases.

**Fix applied:**
```typescript
// Added at top of route handler:
const otpRateLimitKey = `otp:${clientId}`;  // prefixed to avoid collision with password attempts
const rateLimit = checkRateLimit(otpRateLimitKey);
if (!rateLimit.allowed) { return 429; }

// On failure:
recordFailedAttempt(otpRateLimitKey);
return { error: "Invalid or expired OTP" };  // combined message — no timing oracle

// On success:
clearFailedAttempts(otpRateLimitKey);
```

### Bug 2 — Admin/Client Logout Cannot Invalidate Expired Tokens

**Files:** `src/app/api/admin/logout/route.ts`, `src/app/api/auth/client-logout/route.ts`

**Problem:** Both routes used `verifyAdminToken` / `verifyClientToken` to extract the user ID before calling `invalidateSession`. These verify-functions call `jwt.verify` which rejects expired tokens. Since the admin token is only 5 minutes, if an admin's token had just expired when they clicked "Logout", the session entry in the JSON store would NOT be invalidated. The JWT is expired anyway (harmless in practice), but it left orphaned entries in the session store and was inconsistent with the user logout pattern.

**Fix applied** (matching `auth/logout/route.ts` pattern):
```typescript
// Both routes now use jwt.decode (not jwt.verify):
import jwt from "jsonwebtoken";

const decoded = jwt.decode(token) as { adminId?: string } | null;  // admin
const decoded = jwt.decode(token) as { clientId?: string } | null; // client
if (decoded?.adminId) invalidateAdminSession(decoded.adminId);
if (decoded?.clientId) invalidateClientSession(decoded.clientId);
```

### Final Review Status

| # | File | Result |
|---|---|---|
| 1 | `lib/user-session-store.ts` | ✅ Clean |
| 2 | `lib/rate-limiter.ts` | ✅ Clean |
| 3 | `lib/admin-session-store.ts` | ✅ Clean |
| 4 | `lib/client-session-store.ts` | ✅ Clean |
| 5 | `lib/auth.ts` | ✅ Clean |
| 6 | `lib/admin-auth.ts` | ✅ Clean |
| 7 | `api/auth/logout/route.ts` | ✅ Clean |
| 8 | `api/admin/login/route.ts` | ✅ Clean |
| 9 | `api/auth/client-login/route.ts` | ✅ Clean |
| 10 | `api/auth/set-client-password/route.ts` | ✅ Clean |
| 11 | `support/downloads/page.tsx` | ✅ Clean |
| 12 | `api/admin/logout/route.ts` | 🔧 Fixed — expired-token logout bug |
| 13 | `api/auth/client-logout/route.ts` | 🔧 Fixed — expired-token logout bug |
| 14 | `api/auth/verify-client-otp/route.ts` | 🔧 Fixed — OTP brute-force, timing oracle |

---

## 6. Task E — Banking-Style Admin Sliding Session

### The Problem
The 5-minute admin JWT was a fixed-expiry token. An admin actively working in the dashboard would be logged out every 5 minutes and forced to re-login, regardless of activity. This was unusable.

### The Solution (Banking Model)
The JWT remains at 5 minutes (security intact). A new **sliding-session** mechanism refreshes the token transparently on activity. The session expires only after **5 consecutive minutes of no activity**.

```
Admin actively working  →  token refreshes silently every ~90s  →  session stays alive forever
Admin leaves desk       →  no activity events  →  no refresh  →  token expires
  4 min idle            →  warning modal appears with 60-second countdown
  5 min idle            →  auto-logout + redirect to /admin/login
```

### New File: `src/app/api/admin/refresh/route.ts`

```
POST /api/admin/refresh
Authorization: via HttpOnly admin-token cookie
```

**Logic:**
1. Read `admin-token` cookie
2. Call `verifyAdminToken(token)` — requires JWT valid AND session store valid
3. Confirm admin record still exists in `admins.json` (handles deleted accounts)
4. Call `createAdminSession(admin.id)` — issues new `issuedAt`, **old token immediately invalid**
5. Call `createAdminToken(admin.id, admin.username, sessionIssuedAt)` — new 5-min JWT
6. Set new `admin-token` cookie (same security flags as login)

**Key security property:** An expired token cannot be used to call `/api/admin/refresh`. Refresh requires a currently-valid token. The inactivity window is enforced by the JWT TTL — if the admin hasn't refreshed within 5 minutes, the JWT expires and `/api/admin/refresh` returns 401.

Single-session enforcement is fully preserved: each refresh creates a new session `iat`, making all other tokens (including those in other browser tabs) immediately invalid.

### New File: `src/hooks/useAdminActivitySession.ts`

Custom React hook containing all inactivity tracking logic.

**Timing constants:**
```typescript
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;  // 5 minutes — auto-logout threshold
const WARN_BEFORE_MS        = 60 * 1000;        // warning shown in the last 60 seconds
const REFRESH_THROTTLE_MS   = 90 * 1000;        // server refresh at most once per 90s
const CHECK_INTERVAL_MS     = 10_000;           // inactivity check every 10 seconds
```

**Activity events monitored:**
```
mousedown  mousemove  keydown  scroll  touchstart  click
```

**Exported API:**
```typescript
{
  showWarning: boolean,        // true when in the 60-second warning window
  secondsUntilLogout: number,  // countdown value (only meaningful when showWarning=true)
  dismissWarning: () => void,  // resets idle clock (called by "Stay Signed In" button)
  signOut: () => void,         // immediate logout (called by "Sign Out Now" button)
}
```

**How the refresh throttle works:**
- Activity event fires → `lastActivityRef.current = Date.now()`
- If `now - lastRefreshRef.current >= 90_000` → call `/api/admin/refresh` + update `lastRefreshRef`
- Otherwise: just update the activity timestamp, no server call
- Since the JWT lasts 5 minutes and we refresh every 90 seconds when active, there is always a comfortable buffer before expiry.

### New File: `src/components/admin/AdminSessionGuard.tsx`

Drop-in component that renders nothing during normal operation and shows a modal overlay when `showWarning === true`.

**Warning modal features:**
- Full-screen backdrop with blur
- Icon changes from amber `ShieldAlert` to red below 30 seconds remaining
- Live countdown display (`secondsUntilLogout` seconds)
- Draining progress bar (amber → red below 30s)
- **"Stay Signed In"** button — auto-focused, calls `dismissWarning()`
- **"Sign Out Now"** button — calls `signOut()`
- Clicking the backdrop also counts as activity and dismisses the warning
- `role="alertdialog"` + `aria-modal="true"` for accessibility

### Pages Protected by `<AdminSessionGuard />`

| Page | Route |
|---|---|
| Admin Dashboard | `/admin/dashboard` |
| Analytics | `/admin/analytics` |
| Manage Admins | `/admin/manage-admins` |

Usage in each page is a single self-contained line:
```tsx
<AdminSessionGuard />
```

---

## 7. Complete File Change Inventory

### New Files Created

| File | Purpose |
|---|---|
| `src/lib/user-session-store.ts` | Server-side user session store (mirrors admin/client equivalents) |
| `src/app/api/admin/refresh/route.ts` | Sliding-session token refresh endpoint |
| `src/hooks/useAdminActivitySession.ts` | React hook for inactivity tracking and token refresh |
| `src/components/admin/AdminSessionGuard.tsx` | Banking-style session expiry warning modal |
| `public/forms/*.pdf` (44 files) | All downloads page PDFs served as static assets |

### Modified Files

| File | What Changed |
|---|---|
| `src/lib/auth.ts` | Added user session store integration; fixed client token iat; deleted stale `verifyAdminToken` export |
| `src/lib/admin-auth.ts` | Admin token expiry: `"2h"` → `"5m"` |
| `src/lib/rate-limiter.ts` | Rewritten from in-memory Map to file-backed JSON; added `pruneExpired()` |
| `src/lib/admin-session-store.ts` | Added atomic writes (tmp → rename + Windows EPERM fallback) |
| `src/lib/client-session-store.ts` | Added atomic writes (same pattern) |
| `src/app/api/auth/logout/route.ts` | Added `jwt.decode` + `invalidateUserSession` on logout |
| `src/app/api/admin/logout/route.ts` | Changed from `verifyAdminToken` to `jwt.decode` for reliable session invalidation |
| `src/app/api/auth/client-logout/route.ts` | Changed from `verifyClientToken` to `jwt.decode` for reliable session invalidation |
| `src/app/api/admin/login/route.ts` | Cookie `maxAge`: `2 * 60 * 60` → `5 * 60` |
| `src/app/api/auth/client-login/route.ts` | Cookie `maxAge`: `60 * 60 * 24 * 7` → `60 * 60` |
| `src/app/api/auth/set-client-password/route.ts` | Cookie `maxAge`: `60 * 60 * 24 * 7` → `60 * 60` |
| `src/app/api/auth/verify-client-otp/route.ts` | Added rate limiting; fixed timing oracle; combined error message |
| `src/app/api/admin/analytics/route.ts` | Import fix: `@/lib/auth` → `@/lib/admin-auth` |
| `src/app/api/admin/blogs/route.ts` | Import fix: `@/lib/auth` → `@/lib/admin-auth` |
| `src/app/api/admin/csr/route.ts` | Import fix: `@/lib/auth` → `@/lib/admin-auth` |
| `src/app/api/admin/foundation/route.ts` | Import fix: `@/lib/auth` → `@/lib/admin-auth` |
| `src/app/support/downloads/page.tsx` | Complete rewrite — 5 tabs, 41 forms, local PDF links |
| `src/app/admin/dashboard/page.tsx` | Added `AdminSessionGuard` import + `<AdminSessionGuard />` |
| `src/app/admin/analytics/page.tsx` | Added `AdminSessionGuard` import + `<AdminSessionGuard />` |
| `src/app/admin/manage-admins/page.tsx` | Added `AdminSessionGuard` import + `<AdminSessionGuard />` |

---

## 8. Data Directory — New Files

Three new JSON files will be auto-created in `data/` on first use. They do not need to be pre-created but their containing directory must be writable.

| File | Created By | Contents |
|---|---|---|
| `data/user-sessions.json` | `user-session-store.ts` on first user login | `{ "userId": issuedAtMs }` |
| `data/rate-limit.json` | `rate-limiter.ts` on first login attempt | `{ "key": { count, firstAttempt, blockedUntil? } }` |
| `data/user-sessions.json.tmp` | Atomic write temp — deleted immediately | Transient |

### Existing files with new write activity

| File | New Writers |
|---|---|
| `data/admin-sessions.json` | Now uses atomic writes (tmp → rename) |
| `data/client-sessions.json` | Now uses atomic writes (tmp → rename) |
| `data/rate-limit.json` | Now persisted here instead of in-memory |

> **Important for deployment:** The `data/` directory must be writable by the Node.js process user. Run:
> ```bash
> chown -R <nodeuser>:<nodeuser> data/
> chmod -R 755 data/
> chmod 664 data/*.json
> ```

---

## 9. Authentication Architecture — Final State

### Three Token Types

```
┌────────────────────────────────────────────────────────────────┐
│  Token Type   │  Cookie Name    │  Lifetime  │  SameSite       │
├───────────────┼─────────────────┼────────────┼─────────────────┤
│  Admin        │  admin-token    │  5 min *   │  Strict         │
│  Client       │  client-token   │  1 hour    │  Lax            │
│  User         │  auth-token     │  7 days    │  Lax            │
└────────────────────────────────────────────────────────────────┘
  * Admin: 5 min TTL but auto-refreshed on activity (sliding session).
    Effective inactivity timeout = 5 minutes.
    Effective active session = unlimited while in use.
```

All cookies: `HttpOnly: true`, `Secure: COOKIE_SECURE !== "false"`, `Path: /`.

### Session Store Architecture

```
Login event
    │
    ├── createUserSession(userId)     → data/user-sessions.json    { userId: issuedAt }
    ├── createAdminSession(adminId)   → data/admin-sessions.json   { adminId: issuedAt }
    └── createClientSession(clientId) → data/client-sessions.json  { clientId: issuedAt }

Each token embeds iat = Math.floor(issuedAt / 1000)

On every authenticated request:
    jwt.verify(token) → decoded.iat
    isXxxSessionValid(id, decoded.iat * 1000)
        → storedIssuedAt = read from JSON file
        → return decoded.iat * 1000 >= storedIssuedAt  ✓ or ✗
```

### Single-Session Enforcement

Each new login **overwrites** the session store entry. The new `issuedAt` becomes the minimum acceptable `iat`. All tokens issued before the new login have `iat < storedIssuedAt` and are immediately rejected, even if their JWTs haven't expired yet.

```
User logs in from Chrome  →  issuedAt = T1  stored: { user123: T1 }
User logs in from Firefox →  issuedAt = T2  stored: { user123: T2 }
Chrome token (iat=T1) is checked: T1 < T2  →  REJECTED
Firefox token (iat=T2) is checked: T2 >= T2 →  ACCEPTED
```

### Rate Limiting

File: `data/rate-limit.json`

```
3 failed attempts within 15 minutes  →  3-hour lockout

Keys used:
  "{clientId}"        — client password login attempts
  "otp:{clientId}"    — OTP verification attempts  ← NEW
  "{usernameOrEmail}" — admin login attempts
  "{clientId}"        — user login (generic key)
```

Lockout survives: PM2 restart, code deployment, server reboot.

Auto-pruning: `pruneExpired()` runs on every `writeFile` call, removing entries that are neither blocked nor within the tracking window. No memory leak possible.

### Token Verification Flow

```typescript
// Admin token verification (admin-auth.ts):
jwt.verify(token)           // 1. JWT signature + expiry
  → isAdminSessionValid()   // 2. Single-session check (iat >= stored)
  → findAdminById()         // 3. DB permissions check (TDL-001)

// Client token verification (auth.ts):
jwt.verify(token)           // 1. JWT signature + expiry
  → isClientSessionValid()  // 2. Single-session check

// User token verification (auth.ts):
jwt.verify(token)           // 1. JWT signature + expiry
  → isUserSessionValid()    // 2. Single-session check  ← NEW
```

---

## 10. Security Tag Reference

All security requirements are tagged with `TDL-XXX` codes in code comments. Complete reference:

| Tag | Requirement | Implementation |
|---|---|---|
| TDL-001 | Permissions always read from DB, never trusted from JWT | `verifyAdminPermission()` in `admin-auth.ts` |
| TDL-004 | Rate limiting with 3-hour lockout after 3 failures | `rate-limiter.ts` |
| TDL-005 | OTP rate limiting | `verify-client-otp/route.ts` ← **added this session** |
| TDL-006 | No-cache headers on auth endpoints | `admin/login/route.ts`, `admin/logout/route.ts` |
| TDL-007 | `HttpOnly + Secure + SameSite` on all auth cookies | all auth routes |
| TDL-008 | Single concurrent session per user/admin/client | all session stores |
| TDL-SLD | Sliding session: activity extends 5-min JWT, inactivity expires it | `admin/refresh/route.ts`, `useAdminActivitySession.ts` |

---

## 11. Deployment Checklist

After deploying this update, verify the following:

### Code Verification
- [ ] Run `npm run build` — must complete without TypeScript errors
- [ ] `pm2 restart sunidhi-web` then `pm2 logs sunidhi-web` — check for startup errors

### Downloads Page
- [ ] Navigate to `/support/downloads` — page loads with 5 tabs
- [ ] Click each tab — forms table populates
- [ ] Click a "Download" button — PDF opens in a new tab (not 404)
- [ ] Hero shows "41 documents across 5 categories"

### Admin Session (Sliding Session)
- [ ] Log in to `/admin/login`
- [ ] Work actively in dashboard for > 5 minutes — confirm NOT logged out
- [ ] Leave the dashboard completely idle for 4 minutes — warning modal appears
- [ ] Move the mouse — warning disappears, session continues
- [ ] Leave idle again — at 5 minutes, auto-logout fires and redirects to `/admin/login`

### Auth Security
- [ ] Log in as admin → log out → verify `/api/admin/me` returns 401
- [ ] Log in as client → log out → verify subsequent API calls return 401
- [ ] Three failed admin logins → fourth attempt shows lockout message

### New Data Files
- [ ] Confirm `data/user-sessions.json` is created after first user login
- [ ] Confirm `data/rate-limit.json` is created after first login attempt
- [ ] Confirm `data/` files are readable and writable by the PM2 process

---

*Document generated: May 2026 | Project: sunidhi-nextjs | Maintainer: Sunidhi Securities development team*
