# VAPT Remediation Log — Sunidhi Securities Web Application

**Assessment**: Sunidhi Securities & Finance Ltd. — Web Application VAPT Report  
**Remediation Period**: April 2026  
**Status**: TDL-007 ✅ Closed · TDL-009 ✅ Closed · Session Security ✅ Hardened

---

## TDL-003 — Missing Authorization on Research API (Broken Access Control)

### Finding
**OWASP A01:2021 — Broken Access Control · CVSS 6.5 · CWE-862**

`GET /api/research` returned the full report listing including `filePath` (the direct PDF download URL) to any caller with no authentication. Burp Suite confirmed that sending the request without a valid session cookie received a `200 OK` with all 169 report records and their download paths. An attacker could harvest all PDF URLs and download premium research reports without a client account.

**Root cause**: A prior fix (from an earlier VAPT cycle) removed the authentication gate from the listing endpoint entirely to allow public browsing. This correctly kept the listing open but accidentally left `filePath` — the actual download credential — in every response regardless of authentication state.

### Fix
Two-part fix: the listing endpoint now **never** returns `filePath` to any caller, and a new dedicated download endpoint performs the auth check before resolving the download URL.

**Part 1 — `GET /api/research` unconditionally strips `filePath`**

`filePath` is destructured out of every record before the response is sent, regardless of authentication state or report age. The listing API has zero knowledge of download URLs.

```typescript
// Strip filePath from every record — no caller ever receives it through this endpoint
const sanitised = filteredReports.map(({ filePath: _fp, ...rest }) => rest);
return NextResponse.json({ reports: sanitised });
```

**Part 2 — New `GET /api/research/download?id=` endpoint is the single auth gate**

The frontend calls this endpoint when the user clicks Download. The endpoint loads the report by ID, checks whether it is free (> 1 year old), and — for premium reports — verifies the caller holds a valid `client-token` or `admin-token` cookie before returning `{ filePath }`.

```typescript
// Free reports (older than 1 year) — no auth required
const isFree = report.reportDate ? new Date(report.reportDate) < oneYearAgo : false;

if (!isFree) {
  const cookieStore = await cookies();
  const clientToken = cookieStore.get('client-token')?.value;
  if (clientToken && verifyClientToken(clientToken))
    return NextResponse.json({ filePath: report.filePath });
  const adminToken = cookieStore.get('admin-token')?.value;
  if (adminToken && await verifyAdminToken(adminToken))
    return NextResponse.json({ filePath: report.filePath });
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
return NextResponse.json({ filePath: report.filePath });
```

The frontend's `handleDownload` calls `/api/research/download?id=`, opens the returned `filePath` in a new tab, and redirects to `/research-login` on a `401`.

### Files Modified
| File | Change |
|---|---|
| `src/app/api/research/route.ts` | `filePath` unconditionally stripped from all listing responses; unused auth imports removed |
| `src/app/api/research/download/route.ts` | **New file** — auth-gated endpoint that returns `{ filePath }` after verifying session |
| `src/app/markets/research/page.tsx` | `handleDownload` calls `/api/research/download?id=` instead of using a cached URL |

### Verification
In Burp Suite, send `GET /api/research` with no cookies. The response must contain zero `filePath` fields across all records — free or premium. Then send `GET /api/research/download?id=<any_premium_id>` with no cookies — it must return `401`. Repeat with a valid `client-token` cookie — it must return `{ filePath: "..." }`. For a free report (reportDate > 1 year ago), the download endpoint must return `{ filePath }` with no cookie required.

---

## TDL-007 — Cookie Missing Secure and HttpOnly Flags

### Finding
Burp Suite confirmed that authentication cookies (`admin-token`, `auth-token`, `client-token`) were being set with `Secure: false` and `HttpOnly: false` in the pre-production environment. This allows cookies to be transmitted over plain HTTP and read by JavaScript, exposing session tokens to interception and XSS theft.

**Root cause**: All cookie-setting routes used `secure: process.env.NODE_ENV === 'production'`. The pre-production server ran in development mode (`npm run dev:host`), so `NODE_ENV` evaluated to `"development"` — making `secure: false` on every response even when running on the office network over HTTP.

### Fix
Replaced the `NODE_ENV`-based flag with an explicit opt-out environment variable across all five cookie-setting routes:

```typescript
// Before (wrong — evaluates to false in dev mode)
secure: process.env.NODE_ENV === "production"

// After (correct — secure by default, opt out only for local HTTP dev)
secure: process.env.COOKIE_SECURE !== "false"
```

Added to `.env.local` for local development only:
```env
# TDL-007: Disable Secure flag ONLY for local HTTP dev.
# Remove this line on staging and production servers.
COOKIE_SECURE=false
```

### Files Modified
| File | Change |
|---|---|
| `src/app/api/admin/login/route.ts` | `secure` flag updated |
| `src/app/api/auth/login/route.ts` | `secure` flag updated (both OTP paths — lines 131 and 245) |
| `src/app/api/auth/client-login/route.ts` | `secure` flag updated |
| `src/app/api/auth/set-client-password/route.ts` | `secure` flag updated |
| `src/app/api/auth/client-logout/route.ts` | `secure` flag applied on cookie clear |
| `.env.local` | `COOKIE_SECURE=false` added for local dev |

### Verification
On staging/production (no `COOKIE_SECURE` variable set or set to any value other than `"false"`), all cookies will be issued with `Secure: true; HttpOnly: true`. Burp Suite interception of HTTPS traffic will show the flags set correctly.

---

## TDL-009 — Internal File Path Disclosure via Inline Source Maps

### Finding
JavaScript chunks served by the application contained inline base64-encoded source maps embedded directly in the JS file content (not as separate `.map` files). Decoding these revealed absolute server-side file paths such as:

```
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\node_modules\...
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\src\app\...
```

This discloses the server's directory structure, username, and project layout to any attacker who downloads a JS bundle.

**Root cause**: The existing `productionBrowserSourceMaps: false` setting in `next.config.ts` only prevents Next.js from generating separate `.map` files. It does **not** disable webpack's `eval-source-map` devtool, which embeds source maps **inline** inside the JS chunks themselves. This inline embedding happens regardless of the `productionBrowserSourceMaps` setting.

### Fix
Added a webpack configuration override in `next.config.ts` to explicitly set `devtool: false`, which disables all source map generation — both inline and external:

```typescript
// next.config.ts
webpack: (config) => {
  // TDL-009: Disable webpack's eval-source-map devtool so that JS chunks do
  // not embed inline base64 source maps containing absolute server file paths.
  config.devtool = false;
  return config;
},
```

### Files Modified
| File | Change |
|---|---|
| `next.config.ts` | Added `webpack` override setting `config.devtool = false` |

### Verification
After rebuilding (`npm run build`), inspect any `.js` chunk in the browser's Network tab or DevTools Sources panel. There should be no `//# sourceMappingURL=data:application/json;base64,...` comment at the end of any JS file, and no reference to local filesystem paths anywhere in the bundle output.

---

## Session Security Hardening (Beyond VAPT Scope — Implemented Alongside)

The following issues were discovered and fixed during the VAPT remediation cycle. They are not in the original VAPT report but represent significant security improvements.

### S-001 — Admin Session Store: In-Memory Map Replaced with File-Backed Store

**Problem**: `src/lib/admin-session-store.ts` used a module-level `Map` to track active admin sessions. Next.js compiles each API route into a separate module bundle — a module-level `Map` is a different object instance in each bundle. As a result, `createAdminSession` (called from the login route) wrote to one Map, while `isAdminSessionValid` (called from every other route) read from a different, always-empty Map. This caused the single-session enforcement (VAPT TDL-004/TDL-008) to silently fail, and also caused admin sessions to appear invalid immediately after login — admins were logged out the moment they authenticated.

**Fix**: Rewrote `admin-session-store.ts` to use `data/admin-sessions.json` as the backing store. File I/O is shared across all bundles since it hits the same path on disk.

**File**: `src/lib/admin-session-store.ts`

### S-002 — Client Session Store: In-Memory Map Replaced with File-Backed Store

**Problem**: Same root cause as S-001 applied to `src/lib/client-session-store.ts`. The client single-session enforcement (one active browser per client) was silently failing — two browsers could be simultaneously logged in as the same client, and the 30-second background poll never invalidated the displaced session because the session store Map was always empty in the verify route's bundle.

**Fix**: Rewrote `client-session-store.ts` to use `data/client-sessions.json`. Sessions are now correctly enforced: logging in on Browser B within ~30 seconds causes Browser A to be automatically logged out (no manual refresh needed).

**File**: `src/lib/client-session-store.ts`

### S-003 — `clientSessionChange` Event Not Dispatched on Session Invalidation

**Problem**: When the 30-second background poll (`verifySessionSilently`) or the on-mount check (`checkAuthentication`) detected a stolen/expired session, they cleared `sessionStorage` and set the page's `isAuthenticated` to `false` — but never dispatched the `clientSessionChange` window event. The `SettingsDropdown` in `Header.tsx` listens for this event to clear the client's name and hide the profile tab. Without the dispatch, the header continued showing the logged-in client name even after the session was terminated.

**Fix**: Added `window.dispatchEvent(new Event('clientSessionChange'))` to both the `verifySessionSilently` and `checkAuthentication` functions in both affected pages, so the Header updates immediately when a session is invalidated.

**Files**:
- `src/app/markets/research/page.tsx`
- `src/app/markets/sip-products/page.tsx`

---

## Runtime Data Files Created by These Fixes

The file-backed session stores create and maintain the following files at runtime. These files are **not** committed to version control (add to `.gitignore` if not already present) but the `data/` directory must be **writable** by the Node.js process on the server.

| File | Purpose |
|---|---|
| `data/admin-sessions.json` | Active admin sessions — `{ adminId: { adminId, username, tokenIssuedAt } }` |
| `data/client-sessions.json` | Active client sessions — `{ clientId: tokenIssuedAt_ms }` |

---

## IT Deployment Checklist for These Fixes

- [ ] Ensure `.env.local` does **not** contain `COOKIE_SECURE=false` on staging/production
- [ ] Confirm `data/` directory is writable by the Node.js/PM2 process
- [ ] Run `npm run build` to regenerate JS bundles without inline source maps
- [ ] Restart the PM2 process: `pm2 restart sunidhi-web`
- [ ] Verify with Burp Suite: cookies should show `Secure; HttpOnly` flags on all auth responses
- [ ] Verify in browser DevTools: no `sourceMappingURL=data:application/json;base64` in any JS chunk

---

*Document prepared by: Development Team*  
*Date: April 2026*
