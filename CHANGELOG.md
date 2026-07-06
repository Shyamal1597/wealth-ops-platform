# Changelog

All notable changes to the Sunidhi Securities & Finance Limited website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-06-02 - Deployment Gaps on Beta Server: Daily Updates Permission + Downloads Page

> This entry documents two mismatches between the local (production-ready) build and the current beta server deployment at `https://beta.sunidhi.com`. Both are deployment gaps, not bugs in the code.

---

### Gap 1 — Downloads & Forms Page (Code + Files Missing)

**Symptom:** The beta `/support/downloads` page shows the old layout — a flat list with ~3 forms (Individual Account Opening, NRI Account Opening, Corporate Account Opening). The current version has **41 documents across 5 tabbed categories** with a completely different UI.

**Root cause:** The beta is running the old `src/app/support/downloads/page.tsx`. The entire page was rewritten in v1.1.0, and the `public/forms/` directory (44 PDF files) was added. Neither the new code nor the PDF files were deployed to the beta server.

**Fix — Two steps required (code change + file transfer):**

**Step 1: Transfer the `public/forms/` directory to the beta server**

Copy the entire `public/forms/` folder from the updated codebase to the server:
```bash
# From the source machine / updated codebase:
scp -r ./public/forms/ user@betaserver:/path/to/app/public/forms/

# Or via rsync:
rsync -avz ./public/forms/ user@betaserver:/path/to/app/public/forms/
```

This directory contains **44 PDF files**. All download buttons on the new page point to `/forms/<filename>` — if this directory is missing, every download button will return a 404.

Complete list of files that must be present in `public/forms/`:

**Equity & BSE (19 files):**
```
1315486115Individual Client Registration form 09072025.pdf
412079703Non-Individual Client Registration Form 09072025.pdf
1636583788_CKYC-FORM_INDIVIDUAL.pdf
1052170211_CKYC-KRA-FORM_NON-INDIVIDUAL.pdf
632414905Individual Client -FATCA Format.pdf
1938392331Non-Individual Client -FATCA Format.pdf
509887835_FATCA-form-for-Individual.pdf
774412172Nominee Form With Opt Out Self Declaration.pdf
1425675770_Format-for-Availing-MTF-Facility_09072025.pdf
841094080_DECLARATION-FOR--COMMODITY-CATEGORY.pdf
397559448_Undertaking-Cum-Declaration-from-client-to-fetch-KRA---CKYC-Details.pdf
1250232975_Combined-Account-closure-Form-for-Trading-and-DP.pdf
1680636187_Self-Declaration-to-accept-Common-Email-id-and-Mobile-no._08022024.pdf
607753444Combined-Modification-Form-for-Trading-and-DP-account-details.pdf
735034110_SOP-for-Centralised-Demise-Information-of-demise-of-investor-through-KRA.pdf
666780711_Client-Reactivation-Form---Trading.pdf
309889068_Client-Reactivation-form-for-Non--Individual.pdf
891067512_Family-Declaration-for-Common-Email--ID--and-Mobile-No..pdf
326581155_FORMAT-OF-HUF-CREATION-DEED.pdf
```

**Depository (6 files):**
```
771283942Sunidhi Form-DMAT Final.pdf
669219932_Request-instruction-slip.pdf
2058630641Transmission_Request_Form-Death_of_Joint_Holder_New.pdf
292820211Transmission_Request_Form-Death_of_Sole_Holder_where_nomination_is_recorded_New.pdf
2065021145Repurchase_Redemption_Request_Form_for_Mutual_Fund_Units.pdf
1915700324_Request-Letter-for-Addition-for-beneficiary-Details-for-executing-Off-Market-Transfer.pdf
```

**AP Support (3 files):**
```
1011287790_Updation-of-Additional-Office-(Branch)-address-of-AP.pdf
796443294_Modification-in-e-mail-Id-Mobile-No-Contact-person-name-of-the-AP-.pdf
998351678_Change-in-Registered-office-address-of-AP.pdf
```

**Mandatory Information (7 files):**
```
331897791List of AP with terminal details as on 31032026.pdf
13556810602099879383Branch Details.pdf
1595172966List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf
4637170071697863426_List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf
16090313USER-MANUAL-And-BASIC-REQUIRMENTS-EKYC-Version1.2.pdf
720198387USER-MANUAL-And-BASIC-REQUIRMENTS-RE-KYC-Version1.2.pdf
1936870993procedure_and_flow_chart_of_Client _grievance_Aug_08_2023.pdf
```

**Policies (6 files):**
```
276059171PMLA policy_combined _version I _28.03.2025.pdf
1466033186_Policy-on-Treatment-of-Inactive-Clients.pdf
1639914064_Policy-on-Prohibition-on-unauthenticated-news-circulation.pdf
1163209386_Policy-on-Client-Code-Modification.pdf
1379131523_Survellience-Policy-for-Trading.pdf
391187829_Surveillance-Policy-for-Depository.pdf
```

**Step 2: Deploy the updated code and rebuild**

The file `src/app/support/downloads/page.tsx` was completely rewritten. Deploy the latest codebase and rebuild:
```bash
# After transferring the updated src/ files:
npm install        # only if package.json changed
npm run build
pm2 restart sunidhi-web
```

> ⚠️ **Order matters:** Transfer `public/forms/` BEFORE restarting the app. If you restart with the new code before the PDFs are in place, every download link on the page will 404.

**What the new page looks like vs the old one:**

| | Old (currently on beta) | New (v1.1.0+) |
|---|---|---|
| Layout | Flat list, 2 sections | 5 tabs |
| Documents | ~3 forms | 41 documents |
| Subtitle | "Access all important forms and documents…" | "41 documents across 5 categories" |
| Categories | Account Opening, KYC | Equity & BSE, Depository, AP Support, Mandatory Info, Policies |
| File source | Hardcoded external URLs | `public/forms/<filename>` served by Next.js |

**Verification after deployment:**
1. Open `https://beta.sunidhi.com/support/downloads`
2. Confirm 5 tabs are visible: **Equity & BSE (19)**, **Depository (6)**, **AP Support (3)**, **Mandatory Information (7)**, **Policies (6)**
3. Click the Download button on any form — it should download the PDF immediately
4. If any Download returns 404, that specific PDF file is missing from `public/forms/` on the server

---

### Gap 2 — Daily Updates Tab Missing in Admin Dashboard (Data Fix Only)

**Symptom:** Admin users Mrunali Bambulkar and Rajat Kumar do not see the "Daily Updates" tab in the admin dashboard on the beta site. The tab is visible on the local/production server.

**Root cause:** The beta server's `data/admins.json` is a stale snapshot. The `manage_daily_updates` permission was granted to these two accounts in the local admin UI but the updated file was never synced to the beta server.

Affected accounts:

| Admin | Username | ID | Missing permission |
|---|---|---|---|
| Mrunali Bambulkar | `Mrunali` | `admin1768816827805` | `manage_daily_updates` |
| Rajat Kumar | `Rajat` | `admin1768813898437` | `manage_daily_updates` |

**Fix — Edit `data/admins.json` on the beta server**

> **No code change. No rebuild. No pm2 restart required.**
> The file is read on every request; changes take effect on the next login.

**Step 1:** Open `/path/to/app/data/admins.json` on the beta server.

**Step 2:** Find **Mrunali Bambulkar's** entry (search for id `admin1768816827805`).
Change her permissions from:
```json
"permissions": [
  "upload_reports"
]
```
To:
```json
"permissions": [
  "upload_reports",
  "manage_daily_updates"
]
```

**Step 3:** Find **Rajat Kumar's** entry (search for id `admin1768813898437`).
Apply the identical change:
```json
"permissions": [
  "upload_reports",
  "manage_daily_updates"
]
```

**Step 4:** Save the file and verify the JSON is valid (no trailing commas, no missing brackets).

**Step 5:** Ask Mrunali or Rajat to log out and log back in. The "Daily Updates" tab will appear immediately.

**Verification:** After login, the admin dashboard tab bar should show:
```
Research Reports (N)    Daily Updates (N)
```

---

### Root Cause

The beta server's `data/admins.json` is a stale snapshot — the `manage_daily_updates` permission was later granted to two accounts in the local admin UI but the updated file was never copied to the beta server. The application code is correct on both servers; the tab is hidden by a permission check, not a missing feature.

Affected accounts on the beta server:

| Admin | Username | ID | Missing permission |
|---|---|---|---|
| Mrunali Bambulkar | `Mrunali` | `admin1768816827805` | `manage_daily_updates` |
| Rajat Kumar | `Rajat` | `admin1768813898437` | `manage_daily_updates` |

The super admin (Rahul Bisht, `role: "super_admin"`) is unaffected — `super_admin` bypasses all permission-array checks in the code.

### Fix — Edit `data/admins.json` on the beta server

> **No code change. No rebuild. No pm2 restart required.**
> The file is read on every request; changes take effect on the next page load.

**Step 1:** Open the file on the beta server — typically at:
```
/var/www/sunidhi-web/data/admins.json
```

**Step 2:** Find **Mrunali Bambulkar's** entry (search for `admin1768816827805`).
Her current permissions array looks like:
```json
"permissions": [
  "upload_reports"
]
```
Add `manage_daily_updates` so it becomes:
```json
"permissions": [
  "upload_reports",
  "manage_daily_updates"
]
```

**Step 3:** Find **Rajat Kumar's** entry (search for `admin1768813898437`).
Apply the identical change:
```json
"permissions": [
  "upload_reports",
  "manage_daily_updates"
]
```

**Step 4:** Save the file. Check that the JSON is valid — no trailing commas, no missing brackets.

**Step 5:** Ask either admin to log out and log back in. The dashboard reloads permissions from `data/admins.json` on every login; they will see the **Daily Updates** tab immediately.

### Verification

After the edit, log in as Mrunali Bambulkar on the beta site. The admin dashboard tab bar should show:
```
Research Reports (N)    Daily Updates (N)
```
If only "Research Reports" appears, the JSON file was not saved correctly or has a syntax error.

---

## [1.2.0] - 2026-06-02 - Blog Image Upload, Old Website Button & Admin Session Bug Fix

### Fixed — Critical: Admin Immediate-Logout Race Condition

**File changed:** `src/hooks/useAdminActivitySession.ts`

**Problem:** Super admin (and any admin) was being logged out instantly upon successful login. The user would be redirected back to `/admin/login` within milliseconds of the dashboard loading.

**Root cause:** The `useAdminActivitySession` hook was calling `refreshToken()` on mount. On the dashboard page, two async calls fired concurrently the moment the component tree mounted:
1. `GET /api/admin/me` — the dashboard's own auth check, carrying Token1 in the cookie
2. `POST /api/admin/refresh` — fired by the session guard hook on mount, also carrying Token1

If the refresh request reached the server first:
- Server invalidated Token1, created Token2, stored `{ adminId → T2 }` in `data/admin-sessions.json`
- The in-flight `/api/admin/me` request, still carrying Token1, then failed `isAdminSessionValid` (T1 < T2) → returned `401`
- Dashboard's 401 handler redirected to `/admin/login` → user sees instant logout

**Fix (one-line removal):** The `refreshToken()` call on mount was removed entirely. The token is issued seconds earlier during login and needs no refresh. `lastRefreshRef.current = Date.now()` is kept so the first activity-driven refresh fires correctly after the 90-second throttle window.

**Specific change in `src/hooks/useAdminActivitySession.ts`:**
```typescript
// REMOVED (was causing the race condition):
// refreshToken();  ← line 105, deleted

// KEPT (throttle initialisation — no change):
lastRefreshRef.current = Date.now();
```

No other files were touched. The `AdminSessionGuard` component, the `/api/admin/refresh` endpoint, and the sliding-session timing logic are all unchanged and continue to work correctly.

---

### Added — Blog Featured Image Upload

**Problem:** The blog creation form in the admin dashboard had a plain text input labelled "Featured Image URL" — a non-starter for non-technical staff who don't know file system paths.

**New files:**

- **`src/app/api/admin/blogs/upload-image/route.ts`** (new API endpoint)
  - `POST /api/admin/blogs/upload-image`
  - Auth-gated: requires valid `admin-token` cookie
  - Accepts `multipart/form-data` with a `file` field
  - Validates MIME type: `image/jpeg`, `image/jpg`, `image/png`, `image/webp` only
  - Validates size: max 5 MB
  - Saves to `public/images/blog/blog-<timestamp>.<ext>` — timestamp filename prevents path traversal and collisions; original filename is never reflected into the filesystem
  - Returns `{ path: "/images/blog/blog-<timestamp>.<ext>" }` on success
  - Returns `{ error: "..." }` with appropriate 4xx status on failure

**Files modified:**

- **`src/app/admin/dashboard/page.tsx`**
  - Added `useRef` to the React import line
  - Added two new state fields:
    - `blogImageUploading: boolean` (controls button disabled state and spinner)
    - `blogImageInputRef: RefObject<HTMLInputElement>` (hidden file input trigger)
  - Added `handleBlogImageUpload` async function (before `handleCreateBlog`):
    - Reads the selected file, POST to `/api/admin/blogs/upload-image` with `FormData`
    - On success: sets `blogForm.image` to the returned path
    - On failure: shows `alert()` with the server error message
    - Always resets `e.target.value = ""` in `finally` so the same file can be re-selected
  - Replaced the "Featured Image URL" `<input type="text">` block with:
    - A hidden `<input type="file" ref={blogImageInputRef} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden">`
    - An image preview `<img>` (shown only when `blogForm.image` is set, with `onError` fallback to hide)
    - A "Choose Image" / "Change Image" button that calls `blogImageInputRef.current?.click()` — disabled and shows spinner while upload is in progress
    - A "✓ Image ready" confirmation line shown after a successful upload
    - A "JPG, PNG or WEBP · Max 5 MB" hint line below the button

**Runtime storage:** Uploaded blog images are saved to `public/images/blog/`. This directory is excluded from the git repository (added to `.gitignore` as `/public/images/blog/`) and must exist on the server with write permission for the Node.js process.

---

### Added — "Old Website" Redirect Button in Header

**Motivation:** The old Sunidhi Securities website at `https://www.sunidhi.com/default.aspx` is still used by long-standing clients. BSE implemented a similar "Old Website" pill button on their redesigned site — this follows the same pattern.

**File modified:** `src/components/layout/Header.tsx`

**Changes made:**

1. Added `ExternalLink` to the `lucide-react` import (alongside existing icons)

2. **Desktop top bar** — inserted a pill button to the right of the existing utility links (Search, Support, Help):
   ```html
   <a href="https://www.sunidhi.com/default.aspx" target="_blank" rel="noopener noreferrer"
      aria-label="Visit old Sunidhi website (opens in a new tab)">
     <ExternalLink className="h-3 w-3" />  Old Website
   </a>
   ```
   Styled as a white-bordered semi-transparent pill against the `primary-600` red top bar; fills solid white on hover with red text.

3. **Mobile menu** — added a full-width "Visit Old Website" outlined button at the bottom of the mobile menu drawer, above the close button row. Same `target="_blank" rel="noopener noreferrer"` attributes.

No navigation structure, routing, or other header logic was modified.

---

### Documentation — CMOTS README Updated

**File changed:** `CMOT README BEFORE DEPLOYIING/CMOTS_README.md`

The following corrections and additions were made to bring the deployment README in sync with the actual codebase state. This is the reference document given to the hosting/deployment team.

**Corrections (stale information fixed):**

| Section | Old (wrong) | New (correct) |
|---|---|---|
| Authentication & Security — JWT | "Tokens expire in 7 days" | Admin: 5-minute sliding window (refreshed via `/api/admin/refresh`); Client: 1 hour; User: 7 days |
| Authentication & Security — Rate Limiter | "In-memory rate limiting applied to all API endpoints" | File-backed rate limiting; state persisted to `data/rate-limit.json` — required because Next.js API routes are separate module bundles |
| Project Structure — `rate-limiter.ts` | `# In-memory API rate limiting` | `# File-backed API rate limiting (persisted to data/rate-limit.json)` |

**Additions to Data Directory table:**

| New row added | Details |
|---|---|
| `rate-limit.json` | API rate-limit state — per-IP request timestamps (auto-managed). Can be deployed as empty `{}`. |

**Additions to Public Assets table:**

| New rows added | Details |
|---|---|
| `public/images/blog/` | Blog post featured images uploaded via admin dashboard |
| `public/forms/` | Account opening & KYC form PDFs — 41 downloadable files (Downloads & Forms page) |

**Additions to Project Structure tree:**
- `public/images/blog/` subfolder under `public/images/`
- `public/forms/` directory
- `src/components/admin/` directory (containing `AdminSessionGuard`)
- `src/hooks/` directory (containing `useAdminActivitySession.ts`)
- `data/rate-limit.json` file entry
- Header comment updated: "Header, Footer, Navigation (incl. 'Old Website' redirect button)"

**New API endpoints documented:**

- `POST /api/admin/blogs/upload-image` — blog featured image upload (see §Admin Blog Image Upload above)
- `POST /api/admin/refresh` — admin sliding session token refresh (see §Admin Session — Refresh Endpoint above)

**New section added — Admin Sliding Session** (under Security & VAPT Remediation):
- Documents the 5-minute inactivity timeout, 60-second warning overlay, and 90-second refresh throttle
- Lists the three component files involved (`useAdminActivitySession.ts`, `AdminSessionGuard.tsx`, `refresh/route.ts`)
- Includes timing constants table
- Documents the critical "no refresh on mount" constraint with explanation of the race condition it prevents

**Addition to First Deployment Step 3:**
- `rate-limit.json` added to the verification checklist of required data files
- Added note clarifying which files can be deployed as empty `{}` (session stores + `rate-limit.json`)

**Addition to Troubleshooting table:**

| New row | Symptom | Fix |
|---|---|---|
| Admin redirect loop | Admin immediately logged out after login | Do NOT add on-mount `refreshToken()` call — architectural constraint, see §Admin Sliding Session |

---

## [1.1.0] - 2026-05-19 - Full VAPT Remediation, Downloads Page Rebuild & Sliding Admin Session

### Added — Downloads & Forms Page Rebuild
- `src/app/support/downloads/page.tsx` completely rewritten with 5 categorised tabs (41 forms)
- All 44 PDFs copied to `public/forms/` — served as Next.js static assets
- `formUrl()` helper uses `encodeURIComponent` for safe filenames with spaces/special chars
- All download links use `rel="noopener noreferrer"` (XSS protection)
- Tabs: Equity & BSE (19 forms), Depository (6), AP Support (3), Mandatory Information (7), Policies (6)
- Removed all broken `wekart.co.in` external links

### Added — User Session Store (H-1, H-3 VAPT fix)
- `src/lib/user-session-store.ts` (new file, file-backed, matches admin/client pattern)
- `data/user-sessions.json` — auto-created on first login
- `createUserSession(userId)` → records issuedAt, returns value for JWT iat embedding
- `isUserSessionValid(userId, tokenIssuedAtMs)` → session store check on every verification
- `invalidateUserSession(userId)` → called on logout, immediate token revocation

### Added — Banking-Style Sliding Admin Session (TDL-SLD)
- `src/app/api/admin/refresh/route.ts` — POST endpoint, extends 5-min JWT on activity
- `src/hooks/useAdminActivitySession.ts` — React hook: tracks mouse/keyboard/scroll/click
- `src/components/admin/AdminSessionGuard.tsx` — warning modal (amber → red countdown, draining progress bar)
- Admin session: alive while active, auto-logout after 5 min idle, 60s warning at 4 min mark
- Single-session preserved: each refresh creates new iat, old token immediately invalid
- Guard added to dashboard, analytics, and manage-admins pages

### Security Fixes
- **C-1 CRITICAL** — Deleted stale session-store-blind `verifyAdminToken` export from `auth.ts`
- **C-2 CRITICAL** — Fixed 4 admin routes importing `verifyAdminToken` from `@/lib/auth` (wrong, blind) instead of `@/lib/admin-auth` (correct, session-aware): analytics, blogs, csr, foundation
- **H-1 HIGH** — `verifyToken()` now calls `isUserSessionValid()` — user tokens revocable immediately
- **H-2 HIGH** — Rate limiter rewritten: in-memory `Map` → `data/rate-limit.json`; lockouts survive PM2 restart/redeploy; `pruneExpired()` runs on every write (no `setInterval`, no memory leak)
- **H-3 HIGH** — `createToken()` now registers session + embeds explicit `iat` from session store
- **M-1 MEDIUM** — `createClientToken` iat skew fixed: captures `issuedAt` from `createClientSession` and embeds explicitly; eliminates second-boundary race condition
- **M-2 MEDIUM** — User `logout/route.ts` now calls `invalidateUserSession` using `jwt.decode` (not verify, so expired tokens still yield userId)
- **M-3 MEDIUM** — All 3 session stores + rate limiter now use atomic writes (tmp → rename, Windows EPERM fallback)
- **TDL-007** — Admin token: `2h` → `5m`; Client token: `7d` → `1h`
- **TDL-005 NEW** — `verify-client-otp/route.ts` now rate-limited (`otp:{clientId}` key); timing oracle fixed (combined validity + expiry error message)
- Admin/client logout routes now use `jwt.decode` instead of `jwt.verify` so sessions are always invalidated even when token has just expired

## [1.0.6] - 2026-04-22 - Security Hardening, Single-Session Enforcement & Feedback Management

### Security Fixes
- **TDL-007 — Cookie Secure Flag** (`src/app/api/auth/login/route.ts`)
  - Fixed last remaining gap: the OTP step-2 cookie path was using `secure: process.env.NODE_ENV === "production"` instead of the standardised `secure: process.env.COOKIE_SECURE !== "false"`
  - All auth cookies (user login, client login, admin login, client logout) now use the same `COOKIE_SECURE` env var guard

### Added — Client Portal Single-Session Enforcement
- **`src/lib/client-session-store.ts`** (new file, file-backed)
  - Stores `clientId → tokenIssuedAt (ms)` in `data/client-sessions.json`
  - File-backed (not in-memory Map) because Next.js compiles each API route into a separate bundle; a module-level Map is a *different* object in each bundle — only the filesystem is shared across all routes
  - `createClientSession(clientId)`: records `issuedAt`, overwrites any existing entry (all older tokens from other browsers immediately invalid)
  - `isClientSessionValid(clientId, tokenIssuedAtMs)`: returns `true` only if `tokenIssuedAt >= stored`
  - `invalidateClientSession(clientId)`: removes entry on explicit logout

- **`src/lib/auth.ts`** — updated client token functions
  - `createClientToken`: now calls `createClientSession(clientId)` before JWT sign → each new login kills all previous sessions
  - `verifyClientToken`: now calls `isClientSessionValid(decoded.clientId, decoded.iat * 1000)` → tokens from superseded sessions are rejected even if JWT signature is valid

- **`src/app/api/auth/client-verify/route.ts`** (new API endpoint)
  - `GET /api/auth/client-verify` — reads `client-token` cookie, calls `verifyClientToken`, returns `{ authenticated, clientId, name }` or HTTP 401
  - Used by every page on load and on a 30-second polling interval

- **`src/app/api/auth/client-logout/route.ts`** — updated
  - Now reads and decodes `client-token` before clearing cookie, calls `invalidateClientSession(decoded.clientId)` — explicit logout kills session for *all* browsers, not just the current one

### Added — Client Session Polling & Header Sync
- **`src/app/markets/research/page.tsx`** — updated session handling
  - `checkAuthentication`: always verifies with server first (was checking sessionStorage first and returning early, bypassing single-session enforcement); sessionStorage used only as network-error fallback
  - `verifySessionSilently`: quiet 30-second background check — no loading flash; clears sessionStorage and sets `isAuthenticated(false)`. ⚠️ **`window.dispatchEvent(new Event('clientSessionChange'))` still needs to be added here** — see PENDING section above
  - `handleDownload`: now async; free reports (>1 year old) open directly; premium reports call `/api/auth/client-verify` live before `window.open` — a dead session cannot download even within the 30-second polling window
  - `useEffect`: starts `setInterval(verifySessionSilently, 30_000)` with `clearInterval` cleanup on unmount

- **`src/app/markets/sip-products/page.tsx`** — identical session handling added (same pattern as research page)

### Added — Feedback Management (Admin Dashboard)
- **`src/app/api/feedback/route.ts`** — updated
  - Feedback JSON files now include `id: filename` and `status: "open"` on save

- **`src/app/api/admin/feedbacks/route.ts`** — full rewrite
  - **GET**: injects `id` from filename for pre-existing records, defaults missing `status` to `"open"`, supports `?status=open|closed` filter query param, returns `{ feedbacks, total, open, closed }` counts
  - **PATCH** `{ id, status }`: updates `status` field in the feedback JSON file on disk
  - **DELETE** `?id=`: deletes both the `.json` and `.docx` files for a feedback record

- **`src/app/admin/dashboard/page.tsx`** — updated feedback section
  - `Feedback` interface now includes `status: "open" | "closed"`
  - New state `feedbackFilter: "open" | "closed"` (default `"open"`) for tab-based filtering
  - Tab navigation badge shows `(N open)` count instead of total
  - Derived values computed before `return` (not inline in JSX — avoids IIFE/SWC compiler issue): `feedbackOpenCount`, `feedbackClosedCount`, `visibleFeedbacks`
  - `toggleFeedbackStatus(feedback)`: calls PATCH, updates local state optimistically
  - `deleteFeedback(id)`: state `deletingFeedbackId` drives inline confirm banner — "Yes, Delete" calls DELETE endpoint and removes card from local state; "Cancel" resets state
  - Card layout: title/badges → contact info → message → action strip at bottom (Mark Open/Closed + Delete buttons always visible)

### Fixed
- **`src/components/ui/button.tsx`** — added `type="button"` as default on the rendered `<button>` element
  - **Root cause**: without an explicit `type`, buttons inside ancestor `<form>` elements default to `type="submit"`, triggering form navigation that appeared as admin logout when clicking Delete
  - All `<Button>` usages across the site are now safe inside forms by default

- **`tsconfig.json`** — added `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`, changed `"moduleResolution"` to `"bundler"`
  - **Root cause**: the `@/` import alias was only resolving off the stale `.next` cache; any fresh webpack compile (after `.next` deletion or on a clean server) would fail with `Module not found: Can't resolve '@/components/ui/...'`
  - Deleted `.next/` cache to force clean rebuild after fix

- **Admin dashboard styling broken after feedback implementation**
  - **Cause 1**: IIFE `(() => { ... })()` inside JSX body broke the SWC compiler, causing the entire CSS bundle to fail (site appeared completely unstyled)
  - **Fix**: Moved all derived computations above the `return` statement
  - **Cause 2**: tsconfig missing paths alias (see above)

### ⚠️ PENDING — Continue From Here (Next Conversation)

**The last user-reported issue was: "once it logged me out, the Client profile tab is still visible in the header."**

The fix is one line in two files. `verifySessionSilently` correctly clears `sessionStorage` and calls `setIsAuthenticated(false)`, but it does **not yet dispatch** the `clientSessionChange` window event that the Header's `SettingsDropdown` listens for.

**File 1:** `src/app/markets/research/page.tsx`
**File 2:** `src/app/markets/sip-products/page.tsx`

In each file, find `verifySessionSilently`. After the lines:
```typescript
sessionStorage.removeItem('clientData');
setIsAuthenticated(false);
```
Add:
```typescript
window.dispatchEvent(new Event('clientSessionChange'));
```

The `SettingsDropdown` in `src/components/layout/Header.tsx` already has the `addEventListener('clientSessionChange', ...)` listener wired up — it just needs this event to be fired. No other changes required.

**Also needs user confirmation:** The file-based `client-session-store.ts` rewrite (replacing the in-memory Map) should now fully prevent downloads during the 30-second window before poll fires. User should retest: log in on Browser A, log in on Browser B (kills Browser A session), immediately try to download a premium report on Browser A before the 30-second poll fires — it should be blocked by the live `client-verify` call inside `handleDownload`.

---

### Technical Notes for Next Conversation
- `data/client-sessions.json` is the single-session enforcement store — must be writable by the Node.js process in production
- JWT `iat` is in seconds; `client-session-store.ts` stores milliseconds (`iat * 1000`) — the `isClientSessionValid` comparison accounts for this
- The `clientSessionChange` custom window event is the bridge between page-level session polling and the Header's `SettingsDropdown` — it must be dispatched whenever a silent verify detects session expiry
- `Button` component now has `type="button"` by default — any button that intentionally submits a form must explicitly pass `type="submit"`
- Next.js API route bundles are isolated — **never use module-level in-memory singletons for shared state**; always use the filesystem (`data/*.json`) or an external store

---

## [1.0.5] - 2026-01-21 - Registration Flow & Daily Updates Fixes

### Fixed
- **Daily Updates Navigation** (`/markets/daily-updates`)
  - Fixed critical route mismatch in header navigation
  - Navigation link was pointing to `/markets/updates` but actual page was at `/markets/daily-updates`
  - Corrected link in Header component to resolve "page crash" issue
  - All 54 Morning Buzz reports now display correctly

### Changed
- **Registration Form** (`/register`)
  - **Streamlined Registration Flow**: Reduced from 4 steps to 3 steps
    - Old flow: Details → Phone → OTP → Success
    - New flow: Details → OTP → Success
  - **Phone Number Field**: Moved phone input to first screen (Details step)
    - Users now enter phone number along with other details
    - Removed separate phone verification step
    - OTP is sent immediately after form validation
  - **Removed Account Type Field**: Eliminated account type selection from registration
    - Field was deemed unnecessary for the registration process
    - Simplified user experience
  - **Updated Progress Indicator**: Modified to reflect 3-step process instead of 4

### Added
- **Firebase Setup Documentation** (`FIREBASE_SETUP_INSTRUCTIONS.md`)
  - Comprehensive step-by-step guide for Firebase configuration
  - Instructions for creating Firebase project and enabling Phone Authentication
  - Detailed environment variable setup for `.env.local`
  - Configuration examples for Firebase web app
  - Troubleshooting section for common Firebase errors
  - Security best practices and notes

- **Admin Research Upload Enhancement** (`/admin/research`)
  - Added report type selector with radio buttons
  - Allows admin to choose between "Research Report" and "Daily Update (Morning Buzz)"
  - Reports are automatically routed to correct data file:
    - Research Reports → `data/research-reports.json`
    - Daily Updates → `data/daily-updates.json`
  - Maintains separation between research content and daily market updates

### Technical Improvements
- Enhanced error handling for Firebase authentication flows
- Improved state management in registration component
- Streamlined form validation and OTP sending process
- Better UX with combined validation and OTP trigger
- Cleaner component architecture with reduced step complexity

---

## [1.0.4] - 2026-01-09 - Mutual Funds Section

### Added
- **Mutual Funds Page** (`/services/mutual-funds`)
  - Comprehensive mutual funds marketplace page showcasing 1,579 schemes
  - Complete list of 42+ Asset Management Companies (AMCs) organized alphabetically:
    - Aditya Birla Sun Life, Axis, Bajaj Finserv, Bandhan, Bank of India, Baroda BNP Paribas
    - Canara Robeco, DSP, Edelweiss, Franklin Templeton, Groww, HDFC, Helios, HSBC
    - ICICI Prudential, Invesco, ITI, JM Financial, Kotak Mahindra, LIC
    - Mahindra Manulife, Mirae Asset, Motilal Oswal, Navi, Nippon India, NJ, Old Bridge
    - PGIM India, PPFAS, Quant, Quantum, Samco, SBI, Shriram, Sundaram
    - Tata, Taurus, Union, UTI, WhiteOak Capital, Zerodha, 360 ONE
  - Each AMC card displays company name and fund count
  - Hero section highlighting 1,579 schemes from 42+ AMCs
  - 4 key features: Wide Fund Selection, Expert Guidance, Secure Platform, Zero Commission
  - 10 benefits checklist (SIP from ₹500, lumpsum options, KYC verification, NAV updates, etc.)
  - Fund category filters: All Funds (1579), Equity (650), Debt (450), Hybrid (280), ELSS (85), Index (114)
  - Search functionality to filter AMCs by name
  - "How to Invest" section with 4-step process
  - 10-question comprehensive FAQ section covering:
    - Fund offerings and minimum investment amounts
    - Charges and commission structure
    - Investment process (SIP vs Lumpsum)
    - Safety and risk factors
    - Portfolio tracking and switching
    - ELSS tax-saving benefits
    - Redemption timelines
  - Regulatory disclaimer section
  - Multiple CTAs for account opening and advisor consultation
  - Added "Mutual Funds" link to Expertise navigation menu in Header

---

## [1.0.3] - 2026-01-08 - MTF Page, Blog Admin, and Calculator Improvements

### Added
- **Margin Trading Facility (MTF) Page** (`/expertise/mtf`)
  - Comprehensive MTF product page with hero section and gradient background
  - "What is MTF" educational section with visual 3-step diagram (You Pay → We Fund → You Get)
  - 6 feature cards highlighting Enhanced Buying Power, Flexible Funding, Extended Holding, Security, Stock Selection, and Instant Activation
  - Benefits checklist with 6 key advantages
  - 5-step activation process with numbered cards
  - 8-question FAQ accordion with controlled expand/collapse
  - Risk warning disclaimer section with regulatory compliance messaging
  - Multiple CTAs linking to account opening and contact pages
  - Added MTF navigation link in Header component under Expertise menu

- **Blog Management Admin Interface** (`/admin/blogs`)
  - Dedicated admin page for creating, editing, and deleting blog posts
  - Form with auto-slug generation from title
  - Rich content support with markdown textarea
  - Image URL input for featured images
  - Category and tags management (comma-separated)
  - Featured blog toggle option
  - Preview blogs in new tab functionality
  - Authentication protection with session storage checks
  - 401 status handling with automatic redirect to login

### Changed
- **Brokerage Calculator** (`/tools/brokerage-calculator`)
  - **Terminology Update**: Changed all "Square-off" references to "Intraday" across the calculator
    - Updated state types from `"square-off"` to `"intraday"`
    - Updated button labels and UI text
    - Updated validation messages
  - **Uniform Display**: Modified result display to always show "Net Proceeds" instead of inconsistent "Breakeven Price"
    - Buy-only scenario: Shows net cost as negative Net Proceeds
    - Sell-only scenario: Shows net proceeds as positive Net Proceeds
    - Buy + Sell scenario: Shows net P&L with breakeven separately
  - **Complete Redesign**: Removed "AI slop" appearance with minimalist makeover
    - Removed flashy gradients from buttons and cards
    - Removed animated icons and fancy effects
    - Simplified to clean red/gray/white color scheme matching website palette
    - Standard border/rounded inputs instead of gradient containers
    - Professional, clean layout suitable for financial services
    - Simple segment buttons with red primary color for active state
    - Clean result cards with gray backgrounds instead of gradients

### Fixed
- **Brokerage Calculator Charges**: Verified all charges are correctly implemented
  - Stamp duty: 0.015% on buy side (equity delivery), 0.002% on sell side (equity intraday/F&O)
  - Exchange transaction charges: 0.00325% NSE, 0.00375% BSE
  - STT: 0.1% on sell side (delivery), 0.025% both sides (intraday), 0.0625% sell side (F&O), 0.002% (commodity)
  - SEBI charges: ₹10 per crore
  - GST: 18% on (brokerage + exchange charges + SEBI charges)
  - All calculations verified against provided charge structure tables

### Technical Improvements
- Enhanced authentication flow for admin pages with proper 401 handling
- Improved state management for FAQ accordion component
- Clean component architecture for MTF page sections
- Responsive design across all new components

---

## [1.0.2] - 2024-12-30 - Market Overview Removal

### Removed
- **Market Overview Page** (`/markets/overview`)
  - Removed entire Market Overview section due to compliance requirements
  - Deleted `/markets/overview/page.tsx` and associated directory
  - Removed "Market Overview" navigation link from Header component
  - Removed "Market Overview" entry from search page index
  - This feature cannot be displayed due to regulatory compliance constraints

### Changed
- Updated navigation menu to exclude Market Overview option
- Search functionality no longer indexes Market Overview page

---

## [1.0.1] - 2024-12-30 - Market News Search Improvements

### Fixed
- **Market News Search Functionality** (`/markets/news`)
  - Fixed duplicate React key warnings by implementing full base64 hash IDs instead of truncated 32-character IDs
  - Resolved search display issue where filtered results weren't rendering correctly
  - Enhanced search to comprehensively search across title, source, AND content fields
  - Increased news loading from 50 to 200 items for complete dataset searching
  - Fixed state initialization bug where filteredNews wasn't populating on page load
  - Implemented array spreading technique to force React re-renders when search results change
  - Added unique component keys to news grid and cards for proper React reconciliation

### Changed
- **Search Behavior**
  - Search now returns results matching keywords in article titles, source names, or content
  - Results are intelligently ranked: title matches first, then source matches, then content matches
  - Search placeholder updated to "Search news by title, source, or keywords..." for clarity
  - Clearing search now properly restores all 200 news articles

### Technical Improvements
- ID Generation: Changed from `substring(0, 32)` to full `toString('base64').replace(/[/+=]/g, '_')`
- API Data Limit: Increased from `limit=50` to `limit=200` in `/api/market-news` calls
- Search Algorithm: Enhanced filter logic with proper state management and re-render optimization
- Component Keys: Added dynamic keys based on filtered content length to ensure proper updates

---

## [1.0.0] - 2024-12-30 - Initial Production Release

### Overview
Complete rebuild of the Sunidhi Securities & Finance Limited website using modern web technologies. This marks the transition from static pages to a fully functional, dynamic website with real-time market data integration.

---

## Phase 1: Foundation & Core Pages (December 2024)

### Added - Core Infrastructure
- **Next.js 15.1.0** with App Router for modern routing and server-side rendering
- **React 18.3.1** for component-based UI development
- **TypeScript 5.7.2** for type-safe development
- **Tailwind CSS 3.4.15** for utility-first styling
- Custom design system with brand colors (Primary Blue, Growth Green, Energy Orange)
- Responsive layouts for mobile, tablet, and desktop
- Component-based architecture for maintainability

### Added - Layout Components
- **Header Component** (`src/components/layout/Header.tsx`)
  - Sticky navigation with dropdown menus
  - Mobile-responsive hamburger menu
  - Top bar with company highlights (58+ years, 100+ locations, 50,000+ clients)
  - Quick access to Login and Open Account

- **Footer Component** (`src/components/layout/Footer.tsx`)
  - Comprehensive multi-column layout
  - Company information and social links
  - Quick links to all pages
  - Contact information
  - Regulatory disclaimer

### Added - UI Component Library
- Button component with multiple variants (default, secondary, outline, ghost, link)
- Card components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Container component for consistent max-width layouts
- Utility functions for className merging

### Added - Homepage (`/`)
- Hero section with compelling tagline and CTAs
- Trust indicators section
- Services overview with 6 service cards
- Why Choose Us section
- Quick actions (Open Account, Calculators, Research)
- Latest updates section
- Final CTA section

### Added - Service Pages
1. **Equity Trading** (`/services/equity-trading`)
   - Feature list and benefits
   - Trading platforms overview
   - Market access details
   - Research and support information

2. **Derivatives & Commodities** (`/services/derivatives`)
   - F&O trading information
   - Commodity trading details
   - Advanced tools description

3. **Debt Market** (`/services/debt-market`)
   - Bond investment options
   - Benefits of debt instruments

4. **Foreign Exchange** (`/services/foreign-exchange`)
   - Currency trading information
   - Major currency pairs

5. **Insurance** (`/services/insurance`)
   - Life, Health, and General insurance
   - Product categories

6. **Wealth Management** (`/services/wealth-management`)
   - Portfolio management services
   - Financial planning offerings

### Added - Markets & Research Pages
1. **Market Overview** (`/markets/overview`)
   - Market indices display
   - Top gainers and losers
   - Real-time data structure

2. **Research Reports** (`/markets/research`)
   - Downloadable report cards
   - CMS-ready structure

3. **Daily Updates** (`/markets/updates`)
   - News and market updates
   - Timestamp display

4. **IPO Center** (`/markets/ipo`)
   - Current IPO listings
   - Application functionality placeholders

5. **Educational Resources** (`/markets/education`)
   - Trading basics
   - Video tutorials
   - Financial glossary

### Added - Interactive Calculator Tools
1. **Margin Calculator** (`/tools/margin-calculator`)
   - Real-time margin calculation
   - Interactive form inputs

2. **Brokerage Calculator** (`/tools/brokerage-calculator`)
   - Detailed charge breakdown
   - STT, transaction charges, GST calculation
   - Net P&L display

3. **SIP Calculator** (`/tools/sip-calculator`)
   - Monthly investment calculator
   - Visual breakdown of returns
   - Compound interest calculation

4. **Tax Calculator** (`/tools/tax-calculator`)
   - STCG and LTCG tax information
   - Tax rate display

### Added - About Pages
1. **Our Story** (`/about/story`)
   - Company history and heritage
   - Core values (Integrity, Client First, Excellence)
   - Current presence information

2. **Leadership** (`/about/leadership`)
   - Leadership team profiles
   - Executive bios

3. **Awards & Recognition** (`/about/awards`)
   - Timeline of achievements
   - Industry recognitions

4. **Sunidhi Foundation** (`/about/foundation`)
   - CSR initiatives
   - Education, Healthcare, Environment programs

5. **Careers** (`/about/careers`)
   - Career opportunities
   - Job listings
   - Application system

### Added - Support Pages
1. **Help Center** (`/support/help`)
   - Comprehensive FAQs
   - Categorized by topic
   - Account, trading, and technical support

2. **Contact Us** (`/support/contact`)
   - Interactive contact form
   - Office addresses
   - Multiple contact methods
   - Business hours

3. **Branch Locator** (`/support/branches`)
   - Branch listings
   - Search functionality
   - Maps integration ready

4. **Downloads & Forms** (`/support/downloads`)
   - Document library
   - Account opening forms
   - KYC documents
   - Trading guides

### Added - Account Management
1. **Open Account** (`/open-account`)
   - Three account types (eKYC, Offline, NRI)
   - Benefits highlighted
   - Document requirements
   - Multi-step wizard structure

2. **Login** (`/login`)
   - Login form
   - Remember me option
   - Forgot password link
   - Authentication ready

---

## Phase 2: Dynamic Features & Backend Integration (December 2024)

### Added - Authentication System
- **JWT-based authentication** (`jsonwebtoken` v9.0.3)
- **Password hashing** with bcryptjs (v3.0.3)
- **Cookie-based session management** (v1.1.1)
- API routes for login, register, and logout
- Admin authentication system
- Protected routes structure

### Added - Real-time Market News System
- **RSS Feed Integration** (`rss-parser` v3.13.0)
  - LiveMint market news
  - Economic Times business section
  - The Hindu Business Line
  - Times of India business
  - MarketWatch (global)
  - CNBC financial news
  - Financial Times markets

- **Market News Page** (`/markets/news/page.tsx`)
  - Real-time news aggregation
  - Multi-source filtering
  - Search functionality (title and source)
  - Auto-refresh every 5 minutes (display)
  - Auto-fetch from RSS feeds every 30 minutes
  - Image thumbnails with fallback
  - Relative timestamps (e.g., "5m ago", "2h ago")
  - Responsive card layout
  - External link handling

- **News API Endpoints**
  - `POST /api/market-news` - Webhook receiver for n8n integration
  - `GET /api/market-news` - Retrieve filtered news with pagination
  - `GET /api/fetch-market-news` - Manual RSS feed refresh trigger
  - Automatic duplicate detection using URL-based IDs
  - Source extraction from URLs
  - Content sanitization

- **Data Persistence**
  - JSON file-based storage (`/data/market-news.json`)
  - Automatic cleanup (keeps latest 200 items)
  - Chronological sorting (newest first)

### Added - Content Management System (CMS)
- Admin dashboard for content management
- API routes for managing:
  - Research reports (upload, edit, delete)
  - Career postings
  - Awards and recognition
  - Leadership profiles
  - Company timeline
  - CSR/Foundation initiatives
  - Blog posts
  - Life at Sunidhi images

### Added - Email Integration
- **Nodemailer** (v7.0.11) for email services
- Contact form email delivery
- Feedback form submissions
- Career application notifications

### Added - Document Management
- **DOCX generation** (`docx` v9.5.1) for report generation
- File upload handling for admin
- Document storage structure
- Public download endpoints

### Added - Analytics & Monitoring
- Visit tracking API (`/api/analytics/visit`)
- Admin analytics dashboard
- Feedback collection system

### Added - Blog System
- Dynamic blog posts with slug-based routing
- Rich content support
- Category filtering
- Publication date management
- SEO-optimized blog structure

---

## Technical Improvements

### Performance Optimizations
- Server-side rendering (SSR) for SEO
- Code splitting by route
- Optimized bundle sizes
- Efficient React re-renders
- Image optimization ready (Next.js Image component structure)

### Accessibility
- Semantic HTML5 elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus visible states
- WCAG-compliant color contrast

### SEO Enhancements
- Metadata in layout.tsx
- Descriptive page titles
- Semantic heading hierarchy
- Clean URL structure
- Sitemap ready
- OpenGraph tags structure

### Security
- Environment variable management (.env.local)
- Password hashing with bcrypt
- JWT token security
- CSRF protection ready
- Content Security Policy headers ready
- HTTPS enforcement structure

### Developer Experience
- TypeScript for type safety
- ESLint configuration
- Clear component structure
- Modular architecture
- Comprehensive documentation
- Code comments where needed

---

## Dependencies Added

### Production Dependencies
```json
{
  "autoprefixer": "^10.4.22",
  "bcryptjs": "^3.0.3",
  "cheerio": "^1.1.2",
  "clsx": "^2.1.1",
  "cookie": "^1.1.1",
  "docx": "^9.5.1",
  "jsonwebtoken": "^9.0.3",
  "lucide-react": "^0.460.0",
  "next": "^15.1.0",
  "nodemailer": "^7.0.11",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "rss-parser": "^3.13.0",
  "tailwind-merge": "^2.5.5"
}
```

### Development Dependencies
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/cookie": "^0.6.0",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/node": "^22.10.1",
  "@types/nodemailer": "^7.0.4",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "eslint": "^9.16.0",
  "eslint-config-next": "^15.1.0",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.15",
  "typescript": "^5.7.2"
}
```

---

## Known Issues & Future Improvements

### Current Known Issues
- None - All critical issues have been resolved ✅

### Recently Resolved (v1.0.1)
- ✅ **React Key Warning**: Fixed duplicate keys in market news component
  - Solution: Implemented full base64 hash IDs with character sanitization
- ✅ **Market News Search**: Fixed search not displaying relevant results
  - Solution: Enhanced search algorithm and state management

### Planned Future Enhancements
- [ ] Real-time market data API integration (NSE, BSE)
- [ ] Trading platform integration
- [ ] Mobile apps (iOS/Android)
- [ ] Push notification system
- [ ] Video KYC integration
- [ ] Payment gateway integration
- [ ] Advanced portfolio analytics
- [ ] AI-powered chatbot for customer support
- [ ] Multi-language support
- [ ] Dark mode theme

---

## File Structure

```
sunidhi-nextjs/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/               # About section pages
│   │   ├── api/                 # API routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── market-news/    # Market news API
│   │   │   └── ...
│   │   ├── markets/            # Markets & research pages
│   │   │   └── news/           # Real-time market news
│   │   ├── services/           # Service pages
│   │   ├── support/            # Support pages
│   │   ├── tools/              # Calculator tools
│   │   └── ...
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       └── utils.ts            # Utility functions
├── data/                        # Data storage (gitignored)
│   └── market-news.json        # Market news cache
├── public/                      # Static assets
│   └── uploads/                # Uploaded files
├── .env.local                   # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # This file
├── PROJECT_SUMMARY.md          # Project overview
├── README.md                   # Documentation
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Deployment Information

### Production Ready
The application is ready for deployment to:
- **Vercel** (recommended)
- **Netlify**
- **Traditional hosting** (with Node.js support)

### Environment Variables Required
```
JWT_SECRET=<your-jwt-secret>
ADMIN_PASSWORD=<hashed-admin-password>
EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<email-username>
EMAIL_PASS=<email-password>
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

---

## Contributors

**Development Team**: Sunidhi Securities Development Team
**Project Start**: December 2024
**Initial Release**: December 30, 2024
**Status**: Production Ready ✅

---

## License

Private - Sunidhi Securities & Finance Limited
All rights reserved.
