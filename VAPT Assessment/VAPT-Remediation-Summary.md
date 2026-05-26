# VAPT Remediation Summary
**Organization:** Sunidhi Securities & Finance Ltd.
**Application:** Sunidhi Securities Corporate Website
**Assessment By:** TechD Cybersecurity Limited (CERT-In empanelled)
**Assessment Period:** 7 April – 14 April 2026
**Report Released:** 16 April 2026
**Remediation Completed:** 20 April 2026
**90-Day CERT-In Deadline:** 15 July 2026

---

## Remediation Status Overview

| ID | Vulnerability | Severity | CVSS | Status Before | Status After |
|---|---|---|---|---|---|
| TDL-001 | Broken Access Control | High | 8.8 | Open | ✅ Remediated |
| TDL-002 | Stored Cross-Site Scripting (XSS) | High | 7.5 | Open | ✅ Remediated |
| TDL-003 | Missing Authorization on `/api/research` | Medium | 6.5 | Open | ✅ Remediated |
| TDL-004 | Account Lockout Bypass via Response Code | Medium | 4.2 | Open | ✅ Remediated |
| TDL-005 | Missing HTTP Security Headers | Low | — | Open | ✅ Remediated |
| TDL-006 | Missing Cache-Control on Sensitive Pages | Low | — | Open | ✅ Remediated |
| TDL-007 | Insecure Cookie Flags | Low | — | Open | ✅ Remediated |
| TDL-008 | Concurrent Logins (No Session Invalidation) | Low | — | Open | ✅ Remediated |
| TDL-009 | Internal Path Revealed in JS Bundles | Informational | — | Open | ✅ Remediated |

**All 9 findings remediated. 0 open.**

---

## Detailed Remediation Changes

---

### TDL-001 — Broken Access Control
**Severity:** High | **CVSS:** 8.8 | **CWE:** CWE-284 | **OWASP:** A01:2021

**Root Cause:**
The admin login API returned a JSON response containing a `permissions` array. The application trusted whatever the client received — an attacker intercepting the response in Burp Suite could inject `manage_all_pages` and `upload_reports` into the permissions field, which the dashboard would then honour, granting unauthorized access to restricted functions.

**Fix Applied:**

**`src/lib/admin-auth.ts`**
- Added new `verifyAdminPermission(token, requiredPermission)` function that re-reads the admin's permissions directly from the database (JSON file) on every request.
- The function verifies the JWT, resolves `adminId`, loads the admin record from disk, and checks the `permissions` array from the database — never from the JWT payload or any client-supplied value.
- Super admin bypass is also sourced from the database role field, not from client data.

**`src/app/api/admin/research/upload/route.ts`**
- Replaced `verifyAdminToken()` with `verifyAdminPermission(token, "upload_reports")`.
- Returns `403 Forbidden` if the database record does not contain `upload_reports` or `manage_all_pages`.

**`src/app/api/admin/research/edit/route.ts`**
- Same replacement — `verifyAdminPermission(token, "upload_reports")`.

**`src/app/api/admin/research/route.ts`** (DELETE handler)
- Same replacement — `verifyAdminPermission(token, "upload_reports")`.

---

### TDL-002 — Stored Cross-Site Scripting (XSS)
**Severity:** High | **CVSS:** 7.5 | **CWE:** CWE-79 | **OWASP:** A03:2021

**Root Cause:**
The file upload endpoint accepted any file type and only checked the `Content-Type` header provided by the client. An attacker (having first exploited TDL-001) could upload an HTML file containing a JavaScript payload, change `Content-Type: text/html` to `Content-Type: application/pdf` in Burp Suite, and the server would accept and store it. When any user clicked the uploaded "report," the browser executed the embedded script.

**Fix Applied:**

**`src/app/api/admin/research/upload/route.ts`**
1. **Extension validation** — The original filename's extension must be `.pdf`. Any other extension is rejected with `400 Bad Request` before reading the file.
2. **Magic byte validation** — The first 5 bytes of the file's actual binary content are read and compared against the PDF magic signature `%PDF-`. A spoofed `Content-Type` header cannot forge binary file content, so this check is unforgeable. HTML files, executables, or any non-PDF content fails here regardless of the declared content type.
3. **Forced extension on save** — The stored filename is always generated as `{reportId}.pdf`, stripping the original filename entirely. No executable extension can survive to the stored path.

---

### TDL-003 — Missing Authorization on `/api/research`
**Severity:** Medium | **CVSS:** 6.5 | **CWE:** CWE-862 | **OWASP:** A01:2021

**Root Cause:**
The public `/api/research` GET endpoint returned a list of all research report file paths and metadata with no authentication or authorization check. Anyone — without any login — could call this endpoint, retrieve all file paths, and download the full reports directly, completely bypassing the client login system.

**Fix Applied:**

**`src/app/api/research/route.ts`**
- Added `auth-token` cookie verification to the GET handler using the existing `verifyToken()` function from `src/lib/auth.ts`.
- Unauthenticated requests now receive `401 Unauthorized` with message: `"Unauthorized - Please login to access research reports"`.
- The `cookies()` import from `next/headers` and `verifyToken` from `@/lib/auth` were added to the imports.
- Only authenticated client sessions can now list or access research reports.

---

### TDL-004 — Account Lockout Bypass via Response Code
**Severity:** Medium | **CVSS:** 4.2 | **CWE:** CWE-307 | **OWASP:** A07:2021

**Root Cause:**
Account lockout was enforced server-side via an in-memory rate limiter, but an attacker could bypass it by intercepting the locked-out `429` response in Burp Suite and replacing it with a previously captured successful `200` login response (which included the `Set-Cookie` header). The replayed response would re-authenticate the attacker using the old session token, which was still valid within its 8-hour window.

**Fix Applied:**

**`src/lib/admin-session-store.ts`** *(new file)*
- Created a server-side session store using an in-memory `Map<adminId, AdminSession>`.
- Tracks `tokenIssuedAt` (unix ms) for the current active session per admin.
- Provides: `createAdminSession()`, `isAdminSessionValid()`, `invalidateAdminSession()`, `getAdminSession()`.

**`src/lib/admin-auth.ts`**
- `createAdminToken()` now accepts an optional `issuedAt` parameter and embeds it as `iat` in the JWT payload (seconds, as per JWT spec).
- `verifyAdminToken()` now cross-checks the decoded token's `iat * 1000` against `isAdminSessionValid(adminId, tokenIssuedAtMs)`. Tokens whose `iat` pre-dates the session store's recorded `tokenIssuedAt` are rejected and return `null`.

**`src/app/api/admin/login/route.ts`**
- On lockout (`429`): `invalidateAdminSession(lockedAdmin.id)` is called before returning the error response. Any token previously issued for that admin is now invalid — replaying it will fail `isAdminSessionValid()`.

---

### TDL-005 — Missing HTTP Security Headers
**Severity:** Low | **CWE:** CWE-693 | **OWASP:** A05:2021

**Root Cause:**
Server responses were missing `Content-Security-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and `Strict-Transport-Security` (which was only set in production mode). The absence of CSP directly amplified the exploitability of TDL-002 (XSS), and absent HSTS exposed users to SSL stripping.

**Fix Applied:**

**`next.config.ts`**
Added the following headers to all routes (`/:path*`):

| Header | Value |
|---|---|
| `Content-Security-Policy` | Scoped `default-src 'self'`; script/style/font/img/connect/frame sources explicitly whitelisted; `object-src 'none'`; `upgrade-insecure-requests` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` (now always applied, not just production) |
| `X-Frame-Options` | `SAMEORIGIN` (already existed, retained) |
| `X-Content-Type-Options` | `nosniff` (already existed, retained) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` (already existed, retained) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (already existed, retained) |

---

### TDL-006 — Missing Cache-Control on Sensitive Responses
**Severity:** Low | **CWE:** CWE-525 | **OWASP:** A05:2021

**Root Cause:**
Admin login responses and other authenticated pages lacked `Cache-Control` headers. Browsers and proxy servers could cache these responses. On shared/public machines, previously visited admin pages could be retrieved from browser history or cache after logout.

**Fix Applied:**

**`next.config.ts`**
Added `Cache-Control: no-store, no-cache, must-revalidate` + `Pragma: no-cache` + `Expires: 0` to the following route patterns:
- `/admin/:path*`
- `/api/admin/:path*`
- `/api/auth/:path*`
- `/research-login`
- `/markets/sip-products`

**`src/app/api/admin/login/route.ts`**
- Defined a `NO_CACHE_HEADERS` constant and applied it inline to all response returns (success `200`, auth failure `401`, lockout `429`, and server error `500`).

---

### TDL-007 — Insecure Cookie Flags
**Severity:** Low | **CWE:** CWE-614 | **OWASP:** A05:2021

**Root Cause:**
The `admin-token` and `auth-token` session cookies were missing critical security attributes:
- `Secure` was conditional (`process.env.NODE_ENV === "production"`), meaning in non-production environments (including the pre-prod environment where testing was conducted) the flag was `false`, allowing transmission over HTTP.
- `SameSite` was set to `"lax"` on the admin token instead of `"strict"`, permitting cross-site request inclusion in some navigation scenarios.
- `HttpOnly` was already `true` in code but confirmed `false` during testing — indicating the pre-prod environment wasn't running in production mode.

Note: The missing `HttpOnly` flag directly enabled the TDL-002 XSS payload to read `document.cookie` and exfiltrate the admin session token.

**Fix Applied:**

**`src/app/api/admin/login/route.ts`**
```
httpOnly: true
secure: true           // always — was: process.env.NODE_ENV === "production"
sameSite: "strict"     // was: "lax"
```

**`src/app/api/auth/login/route.ts`** (both password-only and OTP code paths)
```
httpOnly: true
secure: true           // always — was: process.env.NODE_ENV === "production"
sameSite: "lax"        // retained "lax" for client app (strict breaks OAuth redirects)
```

---

### TDL-008 — Concurrent Logins
**Severity:** Low | **CWE:** CWE-613 | **OWASP:** A05:2021

**Root Cause:**
Multiple simultaneous sessions were allowed for the same admin account from different browsers or devices with no detection or invalidation. If admin credentials were compromised, an attacker could maintain persistent silent access without the legitimate admin being alerted or logged out.

**Fix Applied:**

**`src/lib/admin-session-store.ts`** *(new file)*
- `createAdminSession(adminId, username)` — registers a new session. Because the store is keyed by `adminId`, calling this a second time (new login from a different browser) **overwrites** the previous session's `tokenIssuedAt`. The previous session's token will fail `isAdminSessionValid()` on its next API call.
- Single active session is enforced automatically without any additional configuration.

**`src/app/api/admin/logout/route.ts`** *(new file)*
- Dedicated admin logout endpoint (`POST /api/admin/logout`).
- Decodes the `admin-token` cookie, calls `invalidateAdminSession(adminId)` to remove the session store entry, then deletes the cookie.
- This ensures that after logout, no replayed token for that admin can pass session validation.

**`src/app/admin/dashboard/page.tsx`**
- `handleLogout` updated to call `/api/admin/logout` (new dedicated endpoint) instead of the client `/api/auth/logout` (which only cleared the client `auth-token` cookie and was unaware of admin sessions).

---

### TDL-009 — Internal Path Revealed in JS Bundles
**Severity:** Informational | **CWE:** CWE-200 | **OWASP:** A05:2021

**Root Cause:**
Next.js production JS bundles (`main-app.js`, `app-pages-internal.js`) contained Base64-encoded values that, when decoded, revealed server-side file system paths. This is a known behaviour of Next.js source maps included in production builds. While not directly exploitable, it aids an attacker in mapping the server's directory structure and reduces the complexity of follow-on attacks.

**Fix Applied:**

**`next.config.ts`**
```typescript
productionBrowserSourceMaps: false
```
This single flag instructs Next.js to omit source map generation from the production browser bundle, eliminating the Base64-encoded path references from the public JS files.

---

## Files Modified

| File | Change Type | Findings Addressed |
|---|---|---|
| `src/lib/admin-auth.ts` | Modified | TDL-001, TDL-004, TDL-008 |
| `src/lib/admin-session-store.ts` | **New file** | TDL-004, TDL-008 |
| `src/app/api/admin/login/route.ts` | Modified | TDL-004, TDL-006, TDL-007, TDL-008 |
| `src/app/api/admin/logout/route.ts` | **New file** | TDL-008 |
| `src/app/api/admin/research/upload/route.ts` | Modified | TDL-001, TDL-002 |
| `src/app/api/admin/research/edit/route.ts` | Modified | TDL-001 |
| `src/app/api/admin/research/route.ts` | Modified | TDL-001 |
| `src/app/api/research/route.ts` | Modified | TDL-003 |
| `src/app/api/auth/login/route.ts` | Modified | TDL-007 |
| `src/app/admin/dashboard/page.tsx` | Modified | TDL-008 |
| `next.config.ts` | Modified | TDL-005, TDL-006, TDL-009 |

---

## Retesting Request

As per the engagement terms, a re-assessment to verify these remediations should be requested from TechD Cybersecurity Limited within the **90-day remediation window** (before **15 July 2026**).

**Contact for retesting:**
- Pavan Saxena (Team Lead – VAPT): pavan@techdefence.com
- Akshar Riteshbhai Chanpura (Enterprise Growth): akshar@techdefence.com
- Wali Chaudhary (Sunidhi IT): wali@sunidhi.com

---

*Remediation implemented by the Sunidhi development team on 20 April 2026.*
*Report reference: TDL-SSFL-WG-04/26/0017 v1.0*
