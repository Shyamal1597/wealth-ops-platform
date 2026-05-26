# Sunidhi Securities & Finance Limited - Official Website

This repository contains the source code for the official website of **Sunidhi Securities & Finance Limited**. The website is a modern, server-side rendered application built to provide corporate information, financial services details, market research, and legal resources to clients and investors.

---

## 🛠️ Tech Stack Ecosystem

The project is built on a modern JavaScript/TypeScript stack, prioritizing performance, SEO, and maintainability.

### Core Framework
*   **[Next.js](https://nextjs.org/) (v15)**: The underlying React framework utilized for Server-Side Rendering (SSR), Static Site Generation (SSG), and API Routes.
*   **[React.js](https://react.dev/) (v18)**: Core UI library.
*   **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language.

### Styling & UI
*   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development and fully responsive design.
*   **Lucide React**: Icon library used across the application.
*   **clsx / tailwind-merge**: Utilities for conditionally joining and merging Tailwind CSS classes.

### Data Storage
*   **Flat JSON Files** (`/data/*.json`): All application data — blogs, users, admins, research reports, leadership profiles, market news, SIP products, testimonials, etc. — is stored as JSON files on the server filesystem. There is **no external database**. The `data/` directory contains 20+ JSON files managed directly by the API routes.

### Backend Services & Integrations
*   **[Firebase](https://firebase.google.com/)**: Present in the codebase for phone OTP authentication (Client SDK sends OTP + reCAPTCHA; Admin SDK verifies Firebase ID tokens). Firebase is **not** used for database/Firestore. The active client login flow uses the Vibgyortel SMS + email fallback pipeline described below; Firebase phone auth exists as an additional available path.
    *   `firebase` (Client SDK — phone auth + reCAPTCHA)
    *   `firebase-admin` (Server SDK — Firebase ID token verification)
*   **Vibgyortel SMS API**: Primary channel for client login OTP delivery via HTTP API (`https://apps.vibgyortel.in`). DLT-registered sender ID and template required.
*   **Nodemailer (SMTP)**: Used for (1) transactional emails — contact form, admin credential emails; and (2) **email OTP fallback** — if SMS delivery fails, the OTP is automatically dispatched to the client's registered email address via `sendActivationOTP()` in `email.ts`. The two channels together ensure OTP always reaches the client.
*   **RSS Parser**: Used for aggregating and rendering external market feeds (e.g., NSE RSS Feeds).
*   **Cheerio & Axios**: Used for server-side HTML scraping and external API requests.

### Client Login OTP Flow

The client portal login uses a **dual-channel OTP system** — SMS is attempted first; email is the automatic fallback.

```
Client enters Client ID
        │
        ▼
First-time login / forgot password / resend?
        │  YES
        ▼
Generate 6-digit OTP → store in data/client-otps.json (10-min TTL)
        │
        ├─── Has mobile? ──► Send via Vibgyortel SMS API
        │         │
        │    SMS success? ──► Return { otpMethod: 'sms', maskedPhone }
        │         │
        │    SMS failed? ──► Fall back to email ─────────────────────┐
        │                                                             │
        └─── No mobile / SMS failed ──────────────────────────────────┘
                                                                      │
                                                              Has email?
                                                                      │  YES
                                                                      ▼
                                               Send via Nodemailer SMTP (sendActivationOTP)
                                               Return { otpMethod: 'email', maskedEmail }

Client submits OTP → POST /api/auth/verify-client-otp
        │
        ▼
Check data/client-otps.json → match + not expired → ✅ Verified
```

**Key details for IT:**
*   OTPs are stored per `clientId` in `data/client-otps.json` — this file must be writable by the Node.js process.
*   OTP TTL is **10 minutes**. Expired entries are checked at verification time.
*   Email OTP uses the same SMTP transporter (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` env vars) and the `sendActivationOTP()` function in `src/lib/email.ts`.
*   SMS OTP requires `SMS_API_KEY` env var. If the key is missing or the Vibgyortel API is unreachable, it automatically falls back to email — no downtime.
*   Client data (name, email, mobile) is loaded from `data/clients.json`.

### Authentication & Security
*   **JSON Web Tokens (JWT)**: (`jsonwebtoken`, `jose`) Used for stateless, secure authentication sessions for both admin and client areas. Token lifetimes differ by role: **admin** cookies use a **5-minute sliding window** (token is silently refreshed on user activity via `/api/admin/refresh` — see §Admin Sliding Session below); **client** cookies expire in **1 hour**; **user** cookies expire in **7 days**.
*   **Bcrypt.js**: Handles password hashing (cost factor 10).
*   **AES-256-GCM Encryption** (`crypto.ts`): Node.js built-in `crypto` module used for field-level encryption of sensitive user data — phone numbers and PAN card numbers are encrypted at rest.
*   **File-Based Session Store** (`session-store.ts`): Login sessions stored in `data/login-sessions.json` with a 5-minute TTL and automatic expiry cleanup.
*   **Client Single-Session Store** (`client-session-store.ts`): Enforces exactly one active browser session per client. Implemented as a **file-backed store** (`data/client-sessions.json`) rather than an in-memory Map — this is critical because Next.js compiles each API route into a separate module bundle, meaning a module-level Map would be a *different object* in each bundle and would never be shared. See §Client Portal Single-Session Enforcement below.
*   **Rate Limiter** (`rate-limiter.ts`): **File-backed** rate limiting applied to all API endpoints to prevent abuse. Rate-limit state is persisted to `data/rate-limit.json` — this is a hard requirement because Next.js compiles each API route into a separate module bundle, so an in-memory `Map` would not be shared between routes and limits would never enforce correctly.
*   **Audit Log** (`audit-log.ts`): Server-side logging of sensitive admin and auth actions.
*   **Isomorphic DOMPurify**: Sanitizes HTML to prevent XSS (Cross-Site Scripting) attacks when rendering external content.
*   **Cookie Secure Flag**: All auth cookies use `secure: process.env.COOKIE_SECURE !== "false"` — set `COOKIE_SECURE=false` in `.env.local` for local HTTP development; omit the variable (or set to any other value) in production for HTTPS-only cookies.

---

## 🔐 Client Portal Single-Session Enforcement

The client portal (`/markets/research`, `/markets/sip-products`) enforces a **single active session per client** — logging in from a new browser automatically invalidates all previous sessions from other browsers within ~30 seconds.

### How It Works

```
Client logs in → POST /api/auth/client-login
       │
       ▼
createClientToken(clientId, name)
       │
       ├─► createClientSession(clientId)
       │       Writes { clientId: issuedAt_ms } to data/client-sessions.json
       │       Overwrites any previous entry — all older tokens are now dead
       │
       └─► jwt.sign({ clientId, name, type:"client", iat }) → set as HttpOnly cookie

Every API call → verifyClientToken(token)
       │
       ├─► jwt.verify(token) → decoded.iat (seconds)
       ├─► isClientSessionValid(clientId, decoded.iat * 1000)
       │       Reads data/client-sessions.json
       │       Returns false if tokenIssuedAt < stored (another browser logged in later)
       │
       └─► null → 401 Unauthorized

Page load & every 30 seconds → GET /api/auth/client-verify
       │
       ├─► Calls verifyClientToken → 401 if session dead
       └─► Page sets isAuthenticated(false) + dispatches 'clientSessionChange' event
               → Header SettingsDropdown clears client name immediately
```

### Key Files

| File | Purpose |
|---|---|
| `src/lib/client-session-store.ts` | File-backed store — `createClientSession`, `isClientSessionValid`, `invalidateClientSession` |
| `src/lib/auth.ts` | `createClientToken` calls `createClientSession`; `verifyClientToken` calls `isClientSessionValid` |
| `src/app/api/auth/client-verify/route.ts` | GET endpoint polled every 30s by client pages |
| `src/app/api/auth/client-logout/route.ts` | Calls `invalidateClientSession` on explicit logout (kills all browsers) |
| `data/client-sessions.json` | Runtime data file — must be writable by the Node.js process |

### Critical Implementation Notes
- **Why file-backed, not in-memory**: Next.js compiles each API route (`/api/auth/client-verify`, `/api/auth/client-login`, etc.) into a separate module bundle. A module-level `Map` is a *different object* in each bundle — writes in one route are invisible to reads in another. The filesystem (`data/client-sessions.json`) is the only reliable shared state without an external database.
- **JWT `iat` unit mismatch**: JWT standard `iat` field is in **seconds**; the session store uses **milliseconds**. `verifyClientToken` converts via `decoded.iat * 1000` before comparison.
- **`clientSessionChange` window event**: The `SettingsDropdown` in `Header.tsx` listens for this custom event and clears the client name from the UI. Any code that terminates a client session (both explicit logout and the 30s poll) must dispatch this event via `window.dispatchEvent(new Event('clientSessionChange'))`.

### Per-Tab Behaviour (by design)
| Scenario | Result |
|---|---|
| Same browser, new tab | Stays logged in (same cookie jar) |
| Different browser | Logged out within 30 seconds of new login |
| Explicit logout | All browsers lose session immediately on next verify |

---

## 📂 Project Structure

```text
📁 sunidhi-nextjs/
├── 📁 public/                 # Static assets (images, fonts, PDFs)
│   ├── 📁 images/             # Logos, banners, team photos
│   │   └── 📁 blog/           # Blog post featured images (uploaded via admin dashboard)
│   ├── 📁 forms/              # Account opening & KYC form PDFs (41 files — Downloads & Forms page)
│   ├── 📁 legal-documents/    # Disclaimers, KYC, Annual Reports (MGT-7, AGMs)
│   └── 📁 research-reports/   # Downloadable PDF research reports
├── 📁 data/                   # ⚠️ All persistent app data (flat JSON files)
│   ├── admins.json            # Admin user accounts
│   ├── users.json             # Client/registered user accounts (sensitive fields encrypted)
│   ├── blogs.json             # Blog posts
│   ├── research-reports.json  # Research report metadata
│   ├── sip-products.json      # SIP Stock Portfolio data
│   ├── daily-updates.json     # Daily market updates
│   ├── testimonials.json      # Client testimonials
│   ├── leadership.json        # Leadership team profiles
│   ├── login-sessions.json    # Active login sessions (auto-expiry 5 min TTL)
│   ├── admin-sessions.json    # Admin single-session enforcement (adminId → issuedAt ms) — TDL-004/008
│   ├── client-sessions.json   # Client single-session enforcement store (clientId → issuedAt ms)
│   ├── client-otps.json       # Client login OTPs (10-min TTL)
│   ├── feedbacks/             # Individual feedback submission JSON files (one per submission)
│   ├── analytics.json         # Page visit analytics
│   ├── rate-limit.json        # API rate-limit state (per-IP request timestamps — auto-managed)
│   └── ...                    # Additional content JSON files
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router directory (Pages & API Routes)
│   │   ├── 📁 api/            # Backend API route handlers
│   │   ├── 📁 (pages)/        # Website Routes (/about, /legal, /expertise, etc.)
│   │   ├── favicon.ico
│   │   ├── globals.css        # Global CSS and Tailwind directives
│   │   └── layout.tsx         # Root application layout (Header/Footer)
│   ├── 📁 components/         # Reusable React components
│   │   ├── 📁 admin/          # Admin-specific components (AdminSessionGuard)
│   │   ├── 📁 layout/         # Header, Footer, Navigation (incl. "Old Website" redirect button)
│   │   └── 📁 ui/             # Buttons, Cards, Modals, Forms
│   ├── 📁 hooks/              # Custom React hooks
│   │   └── useAdminActivitySession.ts  # Admin inactivity timer (5-min sliding session, 60-s warning)
│   └── 📁 lib/                # Utility functions and service configs
│       ├── auth.ts            # User auth — JWT creation/verification, createClientToken, verifyClientToken
│       ├── admin-auth.ts      # Admin-specific authentication logic
│       ├── client-session-store.ts  # ★ Single-session enforcement (file-backed, data/client-sessions.json)
│       ├── email.ts           # Nodemailer SMTP — contact forms, OTP, admin credentials
│       ├── sms.ts             # Vibgyortel SMS API — client OTP delivery
│       ├── firebase.ts        # Firebase Client SDK — phone OTP + reCAPTCHA only
│       ├── firebase-admin.ts  # Firebase Admin SDK — Firebase ID token verification only
│       ├── crypto.ts          # AES-256-GCM field encryption (phone, PAN)
│       ├── session-store.ts   # File-based login session store (data/login-sessions.json)
│       ├── rate-limiter.ts    # File-backed API rate limiting (persisted to data/rate-limit.json)
│       ├── audit-log.ts       # Server-side audit logging for sensitive actions
│       ├── password-validator.ts # Password strength validation rules
│       ├── constants.ts       # Shared app constants (client login URLs, etc.)
│       ├── research-types.ts  # TypeScript types for research reports
│       ├── nse-aliases.ts     # NSE 500 company alias map + expandSearch() for NSE RSS search
│       └── utils.ts           # General utility functions
├── .env.local                 # Environment variables (DO NOT COMMIT)
├── next.config.ts             # Next.js compiler/server configuration
├── package.json               # Dependencies and NPM scripts
├── tailwind.config.ts         # Tailwind CSS theme and styling configuration
└── tsconfig.json              # TypeScript compilation rules
```

---

## 📋 Feedback Management System

Feedback submitted via `/feedback` is stored as individual JSON + DOCX files in `data/feedbacks/`. The admin dashboard manages these with open/closed categorisation.

### Data Flow

```
Public /feedback form → POST /api/feedback
        │
        ├─► Saves data/feedbacks/<timestamp>-<name>.json  { id, name, email, phone, message, status:"open", submittedAt }
        └─► Generates data/feedbacks/<timestamp>-<name>.docx  (formatted Word document)

Admin Dashboard → GET /api/admin/feedbacks?status=open|closed
        │
        └─► Reads all .json files in data/feedbacks/, injects id from filename,
            defaults missing status to "open", filters by query param,
            returns { feedbacks[], total, open, closed }

Admin marks as closed → PATCH /api/admin/feedbacks  { id, status:"closed" }
        └─► Updates status field in the .json file on disk

Admin deletes → DELETE /api/admin/feedbacks?id=<filename>
        └─► Deletes both the .json and .docx files
```

### Admin UI Behaviour
- **Tab navigation**: Open / Closed tabs with live counts in badges
- **Mark Open / Mark Closed button**: Toggles status, updates badge counts immediately (optimistic update)
- **Delete with confirmation**: First click shows inline red confirmation banner with "Yes, Delete" and "Cancel" — prevents accidental deletion; no browser `confirm()` dialog used (avoids admin logout from form submission)

### Why `type="button"` on Button Component
The `<Button>` UI component (`src/components/ui/button.tsx`) has `type="button"` as its default. Without this, any `<Button>` inside an ancestor `<form>` element defaults to `type="submit"` per the HTML spec, which submits the form and triggers page navigation. The admin dashboard has forms (admin login, research upload, etc.) in the component tree, so every button must explicitly be non-submitting by default.

---

## ⚙️ Environment Configuration

The application requires specific environment variables to function correctly, especially for APIs and Emals. The IT team must create a `.env.local` file in the root directory prior to production build.

```env
# ============================================
# Core Application Settings
# ============================================
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://sunidhisecurities.com
NEXT_PUBLIC_BASE_URL=https://sunidhisecurities.com

# ============================================
# Security Secrets (Must be generated securely)
# ============================================
JWT_SECRET=your_secure_random_string_min_32_chars
ENCRYPTION_SECRET=your_secure_random_string_min_32_chars
# ENCRYPTION_SECRET is used for AES-256-GCM encryption of phone numbers and PAN cards at rest.
# JWT_SECRET is used to sign all user and admin session tokens.

# ============================================
# Cookie Security (Secure Flag)
# ============================================
# In production (HTTPS): omit this variable or leave it unset — cookies will be secure=true
# In local development (HTTP): set COOKIE_SECURE=false to allow cookies without HTTPS
# COOKIE_SECURE=false   ← uncomment for local dev only

# ============================================
# Email / SMTP Configuration (For Contact Forms & Admin Emails)
# ============================================
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=sender@sunidhisecurities.com
SMTP_PASSWORD=your_secure_password

# ============================================
# SMS OTP — Vibgyortel API
# Used for client login OTP delivery via SMS
# ============================================
SMS_API_KEY=your_vibgyortel_api_key
SMS_SENDER_ID=SSFLBO
SMS_DLT_ENTITY_ID=your_dlt_entity_id
SMS_DLT_TEMPLATE_ID=your_dlt_template_id

# ============================================
# Firebase — Phone OTP Authentication NOT USED
# Firebase is used solely to send phone OTPs and verify them.
# Firestore / Firebase Storage / Firebase Hosting are NOT used.
# ============================================
# Client SDK (exposed to browser — safe to be public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin SDK (server-side only — keep secret)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# ============================================
# Proxy Settings (If IT Network requires it)
# ============================================
# HTTPS_PROXY=http://proxy-server:port
```

### Environment Variable Quick Reference

| Variable | Required? | What breaks if missing |
|---|---|---|
| `JWT_SECRET` | **Required** | All logins fail — tokens cannot be signed or verified |
| `ENCRYPTION_SECRET` | **Required** | Client phone/PAN data cannot be encrypted or decrypted — client portal breaks entirely |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` | **Required** | Contact form emails fail; email OTP fallback fails (clients cannot log in) |
| `NEXT_PUBLIC_SITE_URL` | **Required** | SEO metadata and canonical URLs are broken |
| `NODE_ENV=production` | **Required** | Security headers, source map suppression, and optimisations are disabled |
| `SMS_API_KEY` | Optional | SMS OTP delivery fails — system automatically falls back to email OTP |
| `SMS_SENDER_ID`, `SMS_DLT_ENTITY_ID`, `SMS_DLT_TEMPLATE_ID` | Optional (pair with `SMS_API_KEY`) | SMS delivery fails without DLT-registered sender/template |
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Optional | Firebase phone OTP path unavailable — email OTP fallback still works |
| `FIREBASE_ADMIN_*` (3 vars) | Optional | Firebase ID token verification unavailable |
| `COOKIE_SECURE` | Optional | Set to `false` **only** on plain HTTP dev environments. **Never set in production.** |

### Generating Secure Secrets

`JWT_SECRET` and `ENCRYPTION_SECRET` must each be a **cryptographically random string, minimum 32 characters**. Generate them as follows:

```bash
# Linux / macOS — run this command TWICE, use one output for each variable:
openssl rand -hex 32

# Windows PowerShell:
-join ((48..57 + 65..90 + 97..122) * 10 | Get-Random -Count 32 | % {[char]$_})
```

> ⚠️ **Never use the same value for both secrets. Never reuse UAT secrets in production.**

---

## 🖥️ Platform Compatibility

This application runs on **both Linux and Windows** without any code changes.

- It is built on **Node.js / Next.js** — industry-standard, fully platform-agnostic runtimes.
- All file paths in the code use Node.js's `path.join()` — never hardcoded OS-specific separators.
- The `.bat`, `.ps1`, and `IIS-web.config` files in the repository root are **optional Windows server setup helpers only** — they are not part of the application and are **not required** on Linux.
- `ecosystem.config.js` (the PM2 configuration) works on both Linux and Windows without modification.
- On Linux, `npm start` works fine with PM2 directly — no special workaround needed.

> The application is already running on a Windows server in the client's internal environment. Any claim that it "cannot be hosted on Windows" or is Linux-only is **incorrect**.

---

## 🗂️ Data Directory — Complete Reference

> ⚠️ **CRITICAL — Read this section before deploying.**

The `data/` folder **is the application's entire database**. There is no external database (no MySQL, PostgreSQL, MongoDB, etc.). Every piece of dynamic content — research reports, blog posts, user accounts, leadership profiles, client sessions, OTPs — is stored as JSON files inside this folder.

**If the `data/` directory is not present and populated on the server, the entire dynamic portion of the site will be empty or non-functional.** This is the most common deployment mistake.

### What Must Be in `data/` on the Server

Every file below must be present. Copy them from the source repository / handover package.

| File | What It Stores | Pages / Features That Use It |
|---|---|---|
| `admins.json` | Admin user accounts, roles, and permissions | `/admin/login`, `/admin/dashboard`, all `/api/admin/*` routes |
| `clients.json` | Client portal user records (name, email, encrypted phone, PAN, clientId) | `/research-login`, OTP send/verify, `/markets/research`, `/markets/sip-products` |
| `users.json` | Registered user accounts (encrypted sensitive fields) | `/register`, `/dashboard`, `/api/auth/login` |
| `research-reports.json` | Metadata for all research PDFs (title, date, category, internal file path) | `/markets/research`, `/api/research`, `/api/research/download` |
| `daily-updates.json` | Morning Buzz PDF metadata (title, date, file path) | `/markets/daily-updates`, `/api/daily-updates` |
| `sip-products.json` | SIP Stock Portfolio data — holdings, performance, tiers (50K / 1L) | `/markets/sip-products` |
| `blogs.json` | Blog post content (title, body, author, tags, slug, category) | `/blog`, `/blog/[slug]` |
| `leadership.json` | Leadership team profiles, titles, and image paths | `/about/leadership` |
| `testimonials.json` | Client testimonial cards (name, quote, company) | Homepage testimonials section |
| `awards.json` | Awards and recognition entries | `/about/awards` |
| `careers.json` | Job posting listings (title, location, type, description) | `/about/careers` |
| `timeline.json` | Company journey timeline milestones | `/about/story` (timeline section) |
| `csr.json` | CSR page content blocks | `/about/csr` |
| `foundation.json` | Sunidhi Foundation page content | `/about/foundation` |
| `life-images.json` | Life at Sunidhi photo gallery entries | `/about/life-at-sunidhi` |
| `analytics.json` | Page visit counters (auto-maintained) | `/admin/analytics` |
| `login-sessions.json` | Active login sessions — auto-managed, 5-minute TTL | All auth-protected routes |
| `admin-sessions.json` | Admin single-session enforcement store | All `/admin/*` routes |
| `client-sessions.json` | Client single-session enforcement store | Client portal, `/api/auth/client-verify` (polled every 30s) |
| `client-otps.json` | Pending client OTPs — auto-managed, 10-minute TTL | `/api/auth/send-client-otp`, `/api/auth/verify-client-otp` |
| `feedbacks/` | **Subdirectory** — one `.json` + one `.docx` per feedback submission | `/feedback`, `/admin/dashboard` Feedbacks tab |
| `rate-limit.json` | API rate-limit state — per-IP request timestamps (auto-managed) | All `/api/*` routes |

> The session files (`login-sessions.json`, `admin-sessions.json`, `client-sessions.json`, `client-otps.json`) and `rate-limit.json` can all be deployed as empty JSON objects `{}` — they are auto-populated at runtime. All other files must contain real data.

### File Permissions (Linux)

The Node.js / PM2 process must have **read and write access** to the entire `data/` directory. If it cannot write, uploads, logins, OTP delivery, and session management will fail silently.

```bash
# Replace 'nodeuser' with the actual Linux user running PM2/Node.js
chown -R nodeuser:nodeuser /path/to/app/data/
chmod -R 755 /path/to/app/data/
chmod 664 /path/to/app/data/*.json
chmod 775 /path/to/app/data/feedbacks/
```

### Copying `data/` to the Server

```bash
# Using SCP from source machine:
scp -r ./data/ user@yourserver:/path/to/app/data/

# Using rsync (preferred — preserves permissions):
rsync -avz ./data/ user@yourserver:/path/to/app/data/
```

### Backing Up `data/` Before Every Deployment

```bash
cp -r /path/to/app/data/ /path/to/app/data_backup_$(date +%Y%m%d)/
```

Treat the `data/` folder exactly like a production database — there is no external backup or recovery mechanism. **Always back up before deploying new code.**

---

## 📄 Public Assets — Complete Reference

The `public/` folder holds all static files served directly by Next.js. These must also be present on the server.

| Path | Contents | Used By |
|---|---|---|
| `public/images/` | All website images — banners, logos, team photos, app screenshots | All pages |
| `public/images/testimonials/` | Client testimonial headshot photos | Homepage |
| `public/images/blog/` | Blog post featured images uploaded via the admin dashboard | `/blog`, `/blog/[slug]` |
| `public/forms/` | Account opening & KYC form PDFs — 41 downloadable files | `/support/downloads` (Downloads & Forms page) |
| `public/research-reports/` | **Actual PDF files** for all research reports | `/api/research/download` — streams these to authenticated users |
| `public/legal-documents/` | Downloadable legal PDFs (KYC forms, Annual Reports, AGM documents) | `/support/downloads`, `/legal/notices-and-reports` |

> **Important:** Each entry in `data/research-reports.json` references a PDF filename in `public/research-reports/`. If a report record exists in the JSON but its PDF file is missing from `public/research-reports/`, that report's download will return a **404 error**. The PDF files and the JSON metadata must always be deployed together.

---

## 🚀 Deployment Instructions for IT

> 📌 **If this is your first deployment, follow every step below in order without skipping any.** The single most common deployment failure is missing the `data/` directory (Step 3), which causes every dynamic page to show "0 records".

---

### 🆕 First Deployment — Step by Step

---

**STEP 1 — Confirm Prerequisites**

Ensure the following are installed on the server before proceeding:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| Node.js | **v18.17 or higher** | `node --version` |
| npm | bundled with Node.js | `npm --version` |
| PM2 | any recent version | `pm2 --version` |
| Git | any (if pulling from repo) | `git --version` |

Install PM2 globally if not already installed:
```bash
npm install -g pm2
```

---

**STEP 2 — Transfer the Full Codebase to the Server**

Copy the entire project folder to the server. Recommended path: `/var/www/sunidhi-web/`

```bash
# Option A — SCP from source machine:
scp -r ./sunidhi-nextjs/ user@yourserver:/var/www/sunidhi-web/

# Option B — rsync (preferred — preserves permissions and is resumable):
rsync -avz ./sunidhi-nextjs/ user@yourserver:/var/www/sunidhi-web/

# Option C — Git:
git clone <repo-url> /var/www/sunidhi-web/
```

The transferred folder **must** contain all of the following:
`src/` · `public/` · `data/` · `package.json` · `package-lock.json` · `next.config.ts` · `ecosystem.config.js` · `tailwind.config.ts` · `tsconfig.json`

---

**STEP 3 — Deploy the `data/` Directory** ⬅ **DO NOT SKIP THIS STEP**

> ⚠️ **This is the most critical step in the entire deployment.** The `data/` folder is the application's entire database — there is no external database. If this folder is missing or empty on the server, every dynamic page (research reports, blog, leadership, daily updates, SIP products, client portal) will be blank or show "0 records".

```bash
# Verify the data/ folder arrived on the server:
ls /var/www/sunidhi-web/data/

# You must see these files listed:
# admins.json  clients.json  users.json  research-reports.json
# daily-updates.json  sip-products.json  blogs.json  leadership.json
# testimonials.json  awards.json  careers.json  timeline.json
# analytics.json  rate-limit.json  login-sessions.json  admin-sessions.json
# client-sessions.json  client-otps.json  feedbacks/
# (plus other content JSON files)
# NOTE: rate-limit.json, login-sessions.json, admin-sessions.json,
#       client-sessions.json, and client-otps.json may be deployed
#       as empty JSON objects {} — they are auto-populated at runtime.

# Set correct ownership and permissions so Node.js can read AND write:
chown -R www-data:www-data /var/www/sunidhi-web/data/
chmod -R 755 /var/www/sunidhi-web/data/
chmod 664 /var/www/sunidhi-web/data/*.json
chmod 775 /var/www/sunidhi-web/data/feedbacks/
```

Replace `www-data` with the Linux user account that will run the PM2/Node.js process on your server.

For the complete list of all data files and exactly which pages each one drives, see [Data Directory — Complete Reference](#️-data-directory--complete-reference) above.

---

**STEP 4 — Create `.env.local`**

Create the file `/var/www/sunidhi-web/.env.local` and fill in all required variables using the template in the [Environment Configuration](#️-environment-configuration) section.

The two security secrets must be freshly generated for every new environment — **never reuse secrets from UAT in production**:

```bash
# Generate JWT_SECRET — copy this output:
openssl rand -hex 32

# Generate ENCRYPTION_SECRET — run again, copy this DIFFERENT output:
openssl rand -hex 32
```

Set `JWT_SECRET=<first output>` and `ENCRYPTION_SECRET=<second output>` in `.env.local`.

> ⚠️ **Never use the same value for both. Never reuse UAT secrets in production.**

---

**STEP 5 — Install Dependencies**

```bash
cd /var/www/sunidhi-web
npm install
```

This reads `package-lock.json` and installs the exact dependency versions. Do not delete `package-lock.json`.

---

**STEP 6 — Build the Application**

```bash
npm run build
```

This compiles TypeScript, optimises all assets, and generates the `.next/` production build folder. **Takes 3–10 minutes** on a typical server. The build must complete **without any errors** before you proceed.

Common build failures:
- `Cannot find module` → `npm install` was not run; repeat Step 5
- TypeScript compilation errors → do not edit source files; contact the development team
- Missing env var warnings → verify `.env.local` is in the project root with `NODE_ENV=production`
- `node --version` shows below v18.17 → upgrade Node.js first

---

**STEP 7 — Start with PM2**

The project root contains `ecosystem.config.js`. **Always use this file** to start PM2 — it points PM2 directly at the Next.js binary, which works correctly on both Windows and Linux.

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

`pm2 startup` prints a system-specific command (varies by OS/init system). **Copy and run that printed command** as root/sudo to enable PM2 auto-start after server reboot.

> **Windows / Linux note:** Do **not** use `pm2 start npm --name sunidhi-web -- start` on Windows — PM2 cannot locate `npm` as an executable path on Windows and this will fail. The `ecosystem.config.js` approach (pointing directly to `node_modules/next/dist/bin/next`) is the correct and tested method on both platforms. On Linux, `npm start` also works, but `ecosystem.config.js` is preferred for consistency across environments.

---

**STEP 8 — Verify the Application Is Running**

```bash
pm2 status
# Expected output: sunidhi-web | online

pm2 logs sunidhi-web --lines 50
# Expected output: "Ready in Xms" — no crash or error lines

curl http://localhost:3000
# Expected: returns HTML page content
```

If `pm2 status` shows "errored" or "stopped":
```bash
pm2 logs sunidhi-web --lines 200
# Common causes shown in logs:
# — .env.local file missing or required variables not populated
# — Port 3000 already in use by another process
# — .next/ folder not present — npm run build was not completed
```

**Subsequent restarts** (after a rebuild):
```bash
pm2 restart sunidhi-web
```

**To stop without removing the process registration:**
```bash
pm2 stop sunidhi-web
```

---

### Step 9 — Configure Reverse Proxy (Nginx)
The local server on port `3000` must be exposed to the internet via port `80` (HTTP) and `443` (HTTPS). Configure Nginx to proxy passes to the Node.js service.

```nginx
server {
    listen 80;
    server_name www.sunidhisecurities.com sunidhisecurities.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.sunidhisecurities.com sunidhisecurities.com;

    # Add SSL Certificate bindings here

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Highly cache static Next.js assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 🗺️ Website Sitemap (Current)

This section reflects the **verified production build** as of April 2026, derived directly from the `npm run build` output (122 routes compiled). Pages listed here correspond to `page.tsx` files present in the final `.next/` build.

> **Note:** The source repository may contain `page.tsx` files for features that were wired out due to compliance review (e.g. `/markets/news`, `/markets/education`, standalone `/login`). Those files remain in the repository but are not linked from any navigation and are not listed below. The table below represents **only the pages reachable in the live production build**.

### Public Routes

#### About
| Route | Description |
|---|---|
| `/about/story` | Company history, founding story & core values (homepage redirect target) |
| `/about/leadership` | Leadership team profiles with image carousel |
| `/about/life-at-sunidhi` | Company culture and employee experience |
| `/about/awards` | Awards & recognition showcase |
| `/about/csr` | CSR overview & Sunidhi Foundation |
| `/about/foundation` | Sunidhi Foundation — Education, Healthcare, Animal Care |
| `/about/careers` | Career opportunities |

#### Expertise
| Route | Description |
|---|---|
| `/expertise/retail-equity` | Stock trading for individual investors (NSE/BSE) |
| `/expertise/institution-equity` | Corporate & institutional equity trading |
| `/expertise/mtf` | Margin Trading Facility (MTF) — **new** |
| `/expertise/commodities-trading` | MCX & NCDEX commodity trading |
| `/expertise/foreign-exchange` | FEDA-registered Forex trading |
| `/expertise/wholesale-debt-market` | Bonds & fixed-income securities |
| `/expertise/mutual-fund-distribution` | Mutual fund distribution & advisory |
| `/expertise/depository-services` | CDSL depository participant services |
| `/expertise/research` | Research services overview |
| `/expertise/sunidhi-capital` | Sunidhi Capital (RBI-registered NBFC) |

#### Markets & Research
| Route | Description |
|---|---|
| `/markets/research` | Downloadable research reports (Technical, Fundamental, Economic) |
| `/markets/sip-products` | SIP Stock Portfolios — Sunidhi Research exclusive product |
| `/markets/daily-updates` | Daily market updates published by the team |
| `/markets/nse-rss` | NSE RSS Feeds — live corporate announcements, results & disclosures across 13 feed streams with cross-stream company search |
| `/markets/overview` | Market overview page |
| `/markets/ipo` | IPO information & link to IPO portal |

#### Resources
| Route | Description |
|---|---|
| `/resources/holidays` | NSE/BSE trading holidays calendar — **new** |
| `/resources/settlement-calendar` | Exchange settlement calendar — **new** |

#### Services
| Route | Description |
|---|---|
| `/services/equity-trading` | Equity trading services detail |
| `/services/derivatives` | Derivatives (F&O) trading services |
| `/services/debt-market` | Debt market services |
| `/services/insurance` | Insurance product distribution |
| `/services/wealth-management` | Wealth management & portfolio advisory |
| `/services/mutual-funds` | Mutual funds service page — **new** |

#### Legal & Compliance
| Route | Description |
|---|---|
| `/legal/privacy-policy` | Privacy policy (DPDP Act compliant) |
| `/legal/disclosure-disclaimer` | Investment risk disclosures per SEBI norms |
| `/legal/regulatory-information` | SEBI registration & exchange membership details |
| `/legal/kyc-advisory` | KYC compliance advisory |
| `/legal/investor-charter` | Client rights & service standards |
| `/legal/notices-and-reports` | Statutory notices & annual reports — **new** |

#### Tools
| Route | Description |
|---|---|
| `/tools/brokerage-calculator` | Interactive brokerage cost calculator |
| `/tools/sip-calculator` | SIP returns projection calculator |
| `/tools/tax-calculator` | Tax impact calculator on trades/gains |
| `/tools/margin-calculator` | Derivatives margin calculator |

#### Support
| Route | Description |
|---|---|
| `/support/help` | Help center — FAQs by category |
| `/support/contact` | Contact form with email dispatch |
| `/support/downloads` | KYC forms, account opening docs & downloads |
| `/support/branches` | Branch locator |
| `/support/sub-brokers` | Sub-broker partnership programme — **new** |

#### Blog
| Route | Description |
|---|---|
| `/blog` | Blog home with category filters & full-text search |
| `/blog/[slug]` | Individual blog post (dynamic route) |

#### Account & Auth
| Route | Description |
|---|---|
| `/open-account` | Account opening landing page (eKYC) |
| `/register` | User registration |
| `/dashboard` | Authenticated user dashboard |
| `/client/profile` | Client profile page — **new** |
| `/research-login` | Research portal login — **new** |
| `/feedback` | Feedback submission form |
| `/search` | Global site search |
| `/` | Root — redirects to `/about/story` |

### Admin Routes (Internal Only)

| Route | Description |
|---|---|
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Admin dashboard home |
| `/admin/blogs` | Blog post management (create/edit/publish) |
| `/admin/research` | Research report uploads & management |
| `/admin/daily-updates` | Daily market update management |
| `/admin/testimonials` | Testimonial management |
| `/admin/analytics` | Site analytics & page visit tracking |
| `/admin/manage-admins` | Admin user account management & permission assignment |

#### Admin Permission System

Permissions are stored per admin in `data/admins.json`. The available permissions and the dashboard tabs they gate are:

| Permission ID | Gates |
|---|---|
| `upload_reports` | Research Reports tab in admin dashboard |
| `manage_daily_updates` | Daily Updates tab |
| `manage_blogs` | Blogs tab |
| `manage_sip_products` | SIP Products tab |
| `manage_testimonials` | Testimonials tab |
| `view_analytics` | Analytics tab |
| `manage_admins` | Manage Admins tab |

**Super admins** automatically have all current and future permissions — their stored `permissions` array is ignored. When a new permission/tab is added, only the permission ID needs to be added to the `availablePermissions` array in `src/app/admin/manage-admins/page.tsx`; super admins gain access immediately without any `admins.json` edit.

### Client Auth API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/client-login` | POST | Validates OTP, issues `client-token` cookie, calls `createClientSession` |
| `/api/auth/client-verify` | GET | Verifies active client session — polled every 30s by client pages |
| `/api/auth/client-logout` | POST | Calls `invalidateClientSession`, clears `client-token` cookie |
| `/api/auth/send-client-otp` | POST | Sends OTP via SMS (Vibgyortel) with email fallback |
| `/api/auth/verify-client-otp` | POST | Validates OTP, used before issuing client-token |

### Research Report API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/research` | GET | List all report metadata (filePath field stripped — never exposed to client) |
| `/api/research/download` | GET | Streams PDF bytes for `?id=<reportId>` after auth check; free reports (>1 yr) bypass auth |
| `/api/admin/research` | GET/POST/DELETE | Admin CRUD for report metadata and file upload |

**How PDF access works (TDL-003):**
The raw file path (e.g. `/research-reports/file.pdf`) is stored in `data/research-reports.json` but is **never sent to the browser**. `/api/research` deliberately strips `filePath` from its response. When a user clicks Download, the frontend calls `/api/research/download?id=<id>`, which:
1. Verifies the caller holds a valid `client-token` or `admin-token` cookie (skipped for free reports)
2. Resolves the file path server-side and guards against path traversal
3. Reads the PDF from `public/research-reports/` and streams the bytes with `Content-Type: application/pdf`

The browser receives binary content, creates an object URL via `URL.createObjectURL()`, and opens it in a new tab. The permanent URL to the PDF file is never exposed.

### Admin Identity Endpoint (TDL-001)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/me` | GET | Returns the currently logged-in admin record (minus password) using the `admin-token` cookie + `admin-sessions.json` validation. **Permissions are always read fresh from `admins.json`** — never trusted from the JWT or client-supplied data. Sends `Cache-Control: no-store` (TDL-006). |

Every admin dashboard page calls this endpoint on mount to determine which tabs/permissions the user actually has — sessionStorage is treated as a stale display cache only.

### Admin Feedback API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/feedbacks` | GET | List all feedbacks; `?status=open\|closed` filter; returns counts |
| `/api/admin/feedbacks` | PATCH | Update feedback status `{ id, status }` |
| `/api/admin/feedbacks` | DELETE | Delete feedback `?id=<filename>` (removes .json + .docx) |

### Admin Blog Image Upload

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/blogs/upload-image` | POST | Uploads a blog post featured image. Auth required (`admin-token`). Accepts `multipart/form-data` with a `file` field. Allowed types: JPG, PNG, WEBP. Max size: 5 MB. Saves to `public/images/blog/blog-<timestamp>.<ext>` (timestamp filename prevents path traversal and collisions). Returns `{ path: "/images/blog/blog-<timestamp>.<ext>" }`. |

The file path returned is stored in the blog's `image` field in `data/blogs.json` and rendered directly in the blog list and post pages.

### Admin Session — Refresh Endpoint

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/refresh` | POST | Silent token refresh for the admin sliding session. Verifies the current `admin-token` cookie, invalidates the old session in `data/admin-sessions.json`, and issues a fresh 5-minute token. Returns `401` if the session is already invalid (triggers redirect to login). Called automatically by `useAdminActivitySession` (throttled to at most once per 90 seconds of activity). |

### SIP Products Admin — Upload & Parse

The `/admin/dashboard` SIP Products tab supports uploading the monthly research output as XLSX or CSV. There are **two independent upload cards** so the rebalancing data and the performance metrics can be applied separately without overwriting each other.

| Card | File pattern | What it updates in the tier |
|---|---|---|
| **Rebalancing Report** | `SIP_Rebalancing_<Profile>_<Tier>_<DDMMYYYY>.xlsx`/`.csv` | `holdings`, `totalValue`, `date`, `numberOfStocks`, `sectorsExcluded` |
| **Performance Report** | `SIP_Performance_<Profile>_<Tier>_<DDMMYYYY>.xlsx`/`.csv` | `performance` (TWR, MWR, cumulative return, investment period, portfolio turnover), `stockPerformance`, `realizedGains`, `capitalMovement` |

Both cards POST to `/api/admin/sip-products/parse`. The route:

1. **Auth** — requires the `manage_sip_products` permission (TDL-001 — read from `admins.json`, never trusted from the token).
2. **In-memory only** — file bytes are read into a `Buffer` via `arrayBuffer()` and never written to disk.
3. **Validation** — extension allow-list (`xlsx`, `csv`), size cap (10 MB), `kind` form field cross-checked against the auto-detected report type so a performance file dropped into the rebalancing card is rejected with 422.
4. **Hint precedence** — `(highest) file contents > filename > UI dropdown (lowest)`. Profile and tier are extracted from the filename (`Aggressive` / `Moderate` / `Conservative` and `50K` / `1L`) so even if the dropdown is on the wrong portfolio the correct slot in `data/sip-products.json` is updated.

The route returns parsed JSON; the admin clicks **Apply** in the preview card to load it into the JSON editor, then **Save Changes** to write `data/sip-products.json`. The applier merges the new fields into the existing tier so a performance upload preserves the rebalancing fields and vice versa.

---

## 🔒 Security & VAPT Remediation

### Cookie Security (TDL-007)

All authentication cookies (`admin-token`, `auth-token`, `client-token`) are issued with `HttpOnly: true` and `Secure: true` by default. The `Secure` flag is controlled via the `COOKIE_SECURE` environment variable:

```env
# Production / staging — omit this variable entirely (Secure flag = true)
# Local HTTP development only:
COOKIE_SECURE=false
```

**Pattern used in all cookie-setting routes:**
```typescript
secure: process.env.COOKIE_SECURE !== "false", // true everywhere except local dev
```

**⚠️ IT note**: Never set `COOKIE_SECURE=false` in the production `.env.local`. That variable must only exist on developer machines running plain HTTP.

### Source Map Disclosure (TDL-009)

Inline base64 source maps (which embed absolute server file paths inside JS chunks) are disabled via a webpack override in `next.config.ts`:

```typescript
webpack: (config) => {
  config.devtool = false; // No inline or external source maps in any build
  return config;
},
```

The `productionBrowserSourceMaps: false` setting alone is insufficient — it only prevents external `.map` files; the webpack override is required to also suppress inline embedding.

### Session Store Architecture

Both admin and client session stores are **file-backed** (not in-memory). This is a hard requirement in Next.js because each API route is compiled into a separate module bundle with its own module scope — a module-level `Map` would be a different object in every bundle, making cross-route session validation impossible.

| Store | File | Purpose |
|---|---|---|
| Admin sessions | `data/admin-sessions.json` | Single-session enforcement per admin (TDL-004/TDL-008) |
| Client sessions | `data/client-sessions.json` | Single-session enforcement per client (one active browser) |

**⚠️ Do not convert these stores back to in-memory Maps.** The symptom of doing so is instant logout after login — sessions appear valid during login but invalid on every subsequent request.

### Client Single-Session Enforcement

The client portal enforces one active browser session per client ID. The flow is documented in the [Client Portal Single-Session Enforcement](#-client-portal-single-session-enforcement) section. Key implementation note for future pages that gate content behind client authentication:

Any page that calls `verifySessionSilently` must dispatch `clientSessionChange` when the session is found to be invalid, so the Header clears the client name immediately:

```typescript
const verifySessionSilently = async () => {
  const res = await fetch('/api/auth/client-verify');
  if (!res.ok || !(await res.json()).authenticated) {
    sessionStorage.removeItem('clientData');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('clientSessionChange')); // ← required
  }
};
```

The same dispatch is required in `checkAuthentication` (the on-mount check) for the same reason.

### Admin Sliding Session

The admin area uses a **5-minute sliding inactivity session**. As long as the admin is actively using the dashboard the token is silently refreshed. After 5 minutes of complete inactivity a 60-second countdown warning appears; if ignored, the admin is automatically logged out.

#### Components

| File | Purpose |
|---|---|
| `src/hooks/useAdminActivitySession.ts` | Tracks `mousedown`, `mousemove`, `keydown`, `scroll`, `touchstart`, `click` events. Updates the idle clock; calls `/api/admin/refresh` throttled to once per 90 s of activity. Drives the countdown state for the warning overlay. |
| `src/components/admin/AdminSessionGuard.tsx` | Wrapper rendered inside every admin page. Consumes `useAdminActivitySession` and renders the "Stay Signed In / Sign Out Now" warning dialog when `showWarning=true`. |
| `src/app/api/admin/refresh/route.ts` | POST endpoint. Verifies the `admin-token` cookie, invalidates the old session in `data/admin-sessions.json`, and issues a fresh 5-minute token. Returns `401` if the session is already dead. |

#### Key Timing Constants

| Constant | Value | Meaning |
|---|---|---|
| `INACTIVITY_TIMEOUT_MS` | 5 minutes | Total idle time before auto-logout |
| `WARN_BEFORE_MS` | 60 seconds | Show the warning dialog this long before logout |
| `REFRESH_THROTTLE_MS` | 90 seconds | Minimum gap between `/api/admin/refresh` calls |
| `CHECK_INTERVAL_MS` | 10 seconds | How often the idle ticker evaluates inactivity |

#### Critical Implementation Note — No Refresh on Mount

The hook does **not** call `refreshToken()` on mount. The token is brand-new immediately after login and requires no refresh. Calling refresh on mount would race with the dashboard's concurrent `GET /api/admin/me` call: if refresh resolved first, it would create a new session (T2) and invalidate the login token (T1); the in-flight `/api/admin/me` still carrying T1 would then fail `isAdminSessionValid` and return `401`, triggering an immediate logout loop — the exact bug reported as "super admin gets auto-logged out immediately after login". The fix was to omit the on-mount refresh call entirely.

---

### Broken Access Control — Research PDFs (TDL-003)

The `/api/research/download` route is the **sole access gate** for research report PDFs.

- The listing API (`/api/research`) **unconditionally strips** `filePath` from every record it returns — the raw file path is never sent to the browser under any circumstances.
- The download endpoint streams the PDF file content directly from disk. The browser never receives the static file URL; it only receives binary bytes via the API response.
- Path traversal is blocked by resolving the stored path and asserting it stays within `<cwd>/public/` before reading.
- Free reports (> 1 year old) stream without authentication. Premium reports require a valid `client-token` or `admin-token` cookie — the endpoint returns `401` otherwise.

This design means a premium PDF is **genuinely inaccessible** to unauthenticated users, not merely undiscoverable.

### Full VAPT Remediation Log

See [`VAPT_FIXES.md`](./VAPT_FIXES.md) for the complete remediation log including root cause analysis, exact file changes, and the IT deployment checklist for each finding.

---

## 📡 NSE RSS Feeds — Company Search

The `/markets/nse-rss` page aggregates 13 live NSE RSS feed streams and provides a cross-stream company search.

### How the search works

1. User types a company name or NSE ticker symbol into the search bar in the hero section.
2. The input is passed to `expandSearch()` in `src/lib/nse-aliases.ts`, which returns the original term plus any known alias expansions (e.g. `"sbi"` → `["sbi", "state bank of india"]`).
3. Every item across all 13 loaded feeds is tested — if any expansion term appears in the item's title or content, it is included.
4. Results are rendered grouped by feed type (Announcements, Financial Results, etc.) with a count badge per group.
5. Clearing the search box returns to the normal tabbed view.

### Adding a new company alias

Open `src/lib/nse-aliases.ts` and add an entry to `COMPANY_ALIASES`:

```typescript
newticker:    ["full company name as it appears in nse title"],
shortform:    ["full company name", "alternate short form"],
```

Rules:
- All keys must be **lowercase**
- Keys starting with a digit must be **quoted** (e.g. `"360one"`)
- **No duplicate keys** — TypeScript will throw a build error at compile time
- After adding entries, run `npm run build` and `pm2 restart sunidhi-web`

Full implementation details: see [`NSE_RSS_SEARCH_IMPLEMENTATION.md`](./NSE_RSS_SEARCH_IMPLEMENTATION.md).

---

## 🔄 Code Update Deployment (Subsequent Deploys)

Follow these steps every time new code is pushed to staging or production. **Always back up `data/` first** — these JSON files are your live database and there is no other backup.

---

**STEP 1 — Backup `data/` Before Touching Anything**

```bash
cp -r /var/www/sunidhi-web/data/ /var/www/sunidhi-web/data_backup_$(date +%Y%m%d)/
```

---

**STEP 2 — Pull / Transfer New Code**

```bash
# Git:
git pull origin main

# OR re-transfer updated files via rsync:
rsync -avz ./sunidhi-nextjs/ user@yourserver:/var/www/sunidhi-web/
```

> ⚠️ **Do NOT delete or overwrite the `data/` folder during this step.** Only the source code files (`src/`, `public/`, config files) should be updated.

---

**STEP 3 — Install Any New Dependencies**

```bash
npm install
```

Safe to run every time — only does work if `package.json` changed.

---

**STEP 4 — Rebuild**

```bash
npm run build
```

---

**STEP 5 — Restart**

```bash
pm2 restart sunidhi-web
```

---

**STEP 6 — Verify**

```bash
pm2 logs sunidhi-web --lines 50
# Confirm "Ready" message and no errors
```

Then run the **Post-Deployment Verification Checklist** below.

---

## ⚠️ Known Pending Update — NBFC Escalation Matrix

The **Contact page** (`/support/contact`) Escalation Matrix section has been updated in the latest codebase. The previous 3-column generic contact table (showing Hemant Sarmalkar / Avijit Kushari / Mahesh S Desai) has been replaced with a 4-level NBFC grievance escalation for Sunidhi Capital Pvt Ltd as required by RBI guidelines.

> **The hosting team must ensure they are deploying the latest version of the codebase.** If an outdated code snapshot is deployed, the old table will appear.

### How to Verify After Deployment

Navigate to `https://<your-domain>/support/contact` and check the **Escalation Matrix** section. It must show **exactly 4 levels**:

| Level | Expected Content |
|---|---|
| **Level 1** | Write to support@sunidhi.com or call 91-22-66771777 / 91-22-33222777 |
| **Level 2** | Nikhil Rasal — nikhil.r@sunidhi.com |
| **Level 3** | Janak Doshi — drjanak@sunidhi.com |
| **Level 4** | RBI CMS — https://cms.rbi.org.in/cms/indexpage.html#eng |

**If the old 3-column table (showing Hemant Sarmalkar / Avijit Kushari / Mahesh S Desai) is still visible**, the latest code has **not** been deployed. Pull the latest code, rebuild (`npm run build`), and restart (`pm2 restart sunidhi-web`).

---

## ✅ Post-Deployment Verification Checklist

**Run this checklist after every deployment — first deployment and every subsequent update.** Every item must pass before the deployment is considered complete. If any item fails, the deployment is incomplete and must not go live.

```
□ 1.  https://<domain>/                       → Homepage loads with banner, statistics, and testimonials
□ 2.  https://<domain>/about/story            → Company history text and timeline visible
□ 3.  https://<domain>/about/leadership       → Leadership team member cards visible (NOT "Loading...")
□ 4.  https://<domain>/markets/research       → Research reports list visible (NOT "0 reports" or empty)
□ 5.  https://<domain>/markets/daily-updates  → Morning Buzz reports visible (NOT "0 updates" or empty)
□ 6.  https://<domain>/markets/sip-products   → SIP dashboard loads with portfolio tier data
□ 7.  https://<domain>/markets/nse-rss        → NSE feed tabs load with live articles
□ 8.  https://<domain>/blog                   → Blog articles visible (NOT "Loading articles..." indefinitely)
□ 9.  https://<domain>/research-login         → Login form renders correctly (NOT a blank white page)
□ 10. https://<domain>/support/contact        → Escalation Matrix shows 4-level NBFC table
                                                 (Level 1 = support@sunidhi.com,
                                                  Level 4 = cms.rbi.org.in)
□ 11. https://<domain>/admin/login            → Admin login form renders
□ 12. https://<domain>/tools/brokerage-calculator → Calculator form renders and produces output
□ 13. HTTP → HTTPS redirect                   → http://<domain> redirects to https://<domain>
```

### Diagnosing Failures

**Items 3–8 show "Loading..." or "0 records" or empty lists:**
→ The `data/` directory is not correctly deployed or the Node.js process lacks write permission.
→ Repeat **First Deployment Step 3** — verify all JSON files are present and permissions are set.

**Item 9 (research-login) shows a blank page:**
→ Check PM2 logs for module or runtime errors.
→ Verify all `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` variables are in `.env.local`.
→ Run: `pm2 logs sunidhi-web --lines 100`

**Item 10 shows the old table (Hemant Sarmalkar / Avijit Kushari / Mahesh S Desai):**
→ The latest codebase version was not deployed. Pull latest code, rebuild, and restart.

**Item 13 (HTTP → HTTPS) fails:**
→ Check Nginx config — the `return 301` block on port 80 must be present and Nginx reloaded.
→ Verify SSL certificate paths are correct in the Nginx `server` block.

---

## 🔧 Troubleshooting Reference

| Symptom | Root Cause | Fix |
|---|---|---|
| All dynamic pages show "0 records" or spin forever | `data/` folder missing or empty on server | Copy full `data/` from source to server; verify with `ls /path/to/app/data/` |
| Research / blog / leadership / daily-updates pages show "Loading..." indefinitely | Same — `data/*.json` files absent | Re-run First Deployment Step 3 |
| Application crashes on start (`pm2 status` = "errored") | Missing required env vars, or build not run | `pm2 logs sunidhi-web --lines 200` — read the specific error; verify `.env.local` |
| Research portal (`/research-login`) shows blank white page | Firebase env vars missing, or stale code | Add all `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` to `.env.local`; rebuild |
| Admin login returns "Invalid credentials" on fresh deploy | `data/admins.json` not deployed or empty | Confirm `admins.json` from the source package is present in `data/` on server |
| OTP SMS not reaching clients | `SMS_API_KEY` missing or invalid | Verify key with Vibgyortel; system auto-falls back to email OTP if SMS fails |
| Neither SMS nor email OTP reaches clients | SMTP credentials missing | Check `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` in `.env.local` |
| Login sets no cookie / instant logout after login | Running on HTTP without `COOKIE_SECURE=false` | Add `COOKIE_SECURE=false` to `.env.local` (HTTP/dev only — **never in production HTTPS**) |
| Admin is immediately logged out after login (redirect loop to `/admin/login`) | Race condition — do **not** add an on-mount `refreshToken()` call to `useAdminActivitySession.ts` | This is an architectural constraint — see §Admin Sliding Session. The hook is correct as shipped; do not modify it. |
| PDF download returns 404 | PDF file missing from `public/research-reports/` | Copy PDF files to server; filenames must exactly match entries in `data/research-reports.json` |
| Build fails with TypeScript errors | Wrong Node.js version or corrupted node_modules | Run `node --version` (must be v18.17+); try `rm -rf node_modules && npm install` |
| `pm2 status` shows "errored" or "stopped" | App crashed — details in logs | `pm2 logs sunidhi-web --lines 200` |
| PM2 does not restart after server reboot | `pm2 startup` command not applied | Run `pm2 startup`, execute the printed command as root, then `pm2 save` |
| Contact page shows old escalation matrix names | Stale code deployed — old snapshot | Pull latest code, run `npm run build`, then `pm2 restart sunidhi-web` |
| How to view live application logs | — | `pm2 logs sunidhi-web` |
| How to restart after a code update | — | `npm run build && pm2 restart sunidhi-web` |
| How to stop the server without unregistering | — | `pm2 stop sunidhi-web` |
| How to monitor CPU / memory usage | — | `pm2 monit` |
