# Sunidhi Securities & Finance Limited — Official Website

Production-deployed corporate website for a **SEBI-registered stock broker and RBI-registered NBFC** with 30+ years of operations. Built from scratch as a complete replacement for a legacy PHP site — handles authenticated research report delivery, a client login portal with dual-channel OTP, an admin CMS, and a real-time NSE RSS aggregator.

> **Live** at [sunidhisecurities.com](https://sunidhisecurities.com)

---

## What This Project Actually Does

The site is not a brochure. It serves three distinct user populations with different auth flows:

| User type | Auth | Access |
|---|---|---|
| General public | None | All public pages, legal docs, tools |
| Research clients | OTP (SMS + email fallback) → `client-token` (1h JWT) | Downloadable research PDFs, SIP portfolio data |
| Admins | Password → `admin-token` (5-min sliding) | Full CMS — reports, blogs, SIP data, user management |

The core engineering challenge was building all of this on a **flat JSON file store** (no database server) while keeping auth, sessions, and rate limiting correct across a Next.js deployment where every API route is a separate module bundle.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR for SEO on all public pages; API routes co-located with the UI |
| Language | **TypeScript 5** | End-to-end type safety; auth token payloads typed with discriminated unions |
| Styling | **Tailwind CSS** | Utility-first; zero runtime CSS — important for a compliance-heavy financial site |
| Auth | **JWT** (`jsonwebtoken` + `jose`) | Stateless tokens work across PM2 cluster workers without shared memory |
| Encryption | **AES-256-GCM** (Node.js `crypto`) | Field-level encryption of PAN numbers and mobile numbers at rest |
| Email | **Nodemailer** (Office 365 SMTP) | Contact forms + OTP delivery fallback |
| SMS | **Vibgyortel API** | Primary OTP channel; system auto-falls back to email on delivery failure |
| PDF delivery | Custom streaming API route | PDFs never exposed as public URLs; served only through auth-gated `/api/research/download` |

---

## Architecture Decisions Worth Noting

### File-backed shared state instead of in-memory Maps

Next.js compiles each API route into a **separate module bundle**. A module-level `Map` (e.g. for rate limiting or sessions) lives in a different process scope for every route — writes in `/api/auth/login` are invisible to reads in `/api/auth/verify`. The solution: every shared store (sessions, rate limits, OTPs) writes to a JSON file on the filesystem, which is the only reliable shared state without a database server.

This forced explicit atomic-write patterns (`write to tmp → rename`) everywhere to prevent corruption under concurrent requests.

### Sliding admin session (5-minute inactivity timeout)

Admin tokens expire in 5 minutes, but are silently refreshed as long as the admin is actively using the dashboard. The `useAdminActivitySession` hook listens for `mousedown`, `mousemove`, `keydown`, `scroll`, `touchstart`, and `click` events and calls `POST /api/admin/refresh` — throttled to once per 90 seconds — to extend the session. After 5 minutes of inactivity, a 60-second countdown warning appears before auto-logout.

Critical constraint: the refresh call must **not** fire on mount. On mount, the dashboard also calls `GET /api/admin/me` concurrently. If refresh wins, it creates a new session (T2) and invalidates the login token (T1); the in-flight `/api/admin/me` carrying T1 then fails session validation and triggers an immediate logout loop. The hook initialises `lastRefreshRef` to `Date.now()` on mount and lets the first real refresh fire naturally after 90 seconds of activity.

### Single-session enforcement for clients

Each client can only have one active browser session at a time. The session store (`data/client-sessions.json`) holds `{ clientId → tokenIssuedAt_ms }`. On login, the entry is overwritten, making all older tokens dead. Every authenticated client API call checks whether `token.iat * 1000 >= storedIssuedAt` — note the unit mismatch: JWT `iat` is in seconds, the store uses milliseconds.

Client pages poll `GET /api/auth/client-verify` every 30 seconds and dispatch a `clientSessionChange` window event on session death, which clears the user's name from the header immediately.

### Dual-channel OTP with automatic fallback

OTP delivery: try Vibgyortel SMS → if API call fails or returns an error, automatically fall back to Nodemailer email. The client receives `{ otpMethod: 'sms' | 'email', maskedPhone | maskedEmail }` so the UI can show "check your SMS" or "check your email" without any manual configuration. The SMS API key is the only optional dependency — remove it and the system silently runs on email-only.

### Research PDF access control

Listing (`GET /api/research`) strips `filePath` from every record. Download (`GET /api/research/download?id=`) resolves the path server-side, asserts it stays within `cwd/public/`, and streams the bytes. The browser sees `application/pdf` content, never the URL. Premium reports (< 1 year old) require a valid `client-token` or `admin-token` cookie.

---

## Feature Overview

**Public site:**
- 30+ pages: services, about, legal, tools, blog, support
- NSE RSS aggregator across 13 feed streams with cross-stream company search and alias expansion (`sbi` → `state bank of india`)
- Interactive calculators: brokerage, SIP, tax, margin
- SEBI-mandated investor charter, disclosures, escalation matrix (4-level NBFC grievance redressal per RBI guidelines)

**Research portal:**
- Client login via OTP → JWT-gated access to research PDFs and SIP stock portfolios
- SIP product page with Sunidhi's 50K/1L tiered portfolios — holdings, performance metrics, portfolio turnover, monthly returns heatmap

**Admin CMS:**
- Per-admin permission system with role-based tab visibility; super admins bypass permission checks at source
- XLSX/CSV upload parser for SIP rebalancing and performance reports with content-based type detection (the hint precedence is: file contents > filename > UI dropdown)
- Blog post editor with image upload (JPG/PNG/WEBP, 5 MB limit, stored in `public/images/blog/`)
- Research PDF upload, metadata tagging, category management
- Feedback management (open/closed workflow, JSON + DOCX per submission)
- Analytics dashboard

---

## Security Notes (VAPT-audited)

This project went through a VAPT audit. Key remediations:

- **Broken object-level auth** (TDL-001): Permissions read from `admins.json` on every request — never trusted from JWT claims or `sessionStorage`
- **Broken function-level auth** (TDL-002): Every admin API route verifies the specific permission required, not just that a token exists
- **PDF path exposure** (TDL-003): `filePath` stripped from all listing responses; download is a proxy endpoint
- **Single-session enforcement** (TDL-004/008): File-backed session store invalidates all previous sessions on new login
- **Source map suppression** (TDL-009): `config.devtool = false` in webpack override (the `productionBrowserSourceMaps` setting alone doesn't suppress inline base64 maps)
- **Rate limiting**: File-backed per-IP rate limiter (in-memory alternative is non-functional in Next.js multi-bundle architecture)

---

## Project Structure

```
src/
├── app/
│   ├── api/          # All API routes (auth, admin, research, blog, feedback, analytics)
│   ├── admin/        # Admin dashboard (login, dashboard, manage-admins)
│   ├── markets/      # Research portal, SIP products, daily updates, NSE RSS
│   ├── about/        # About pages (story, leadership, awards, CSR, careers)
│   ├── support/      # Help, contact, downloads, branches
│   └── (30+ more routes)
├── components/
│   ├── admin/        # AdminSessionGuard — wraps every admin page
│   ├── layout/       # Header (with "Old Website" redirect), Footer
│   └── ui/           # Button, Card, Modal primitives
├── hooks/
│   └── useAdminActivitySession.ts   # 5-min sliding session logic
└── lib/
    ├── auth.ts                       # JWT creation/verification for all three token types
    ├── admin-auth.ts                 # Admin-specific verification + session store
    ├── client-session-store.ts       # File-backed single-session enforcement
    ├── session-store.ts              # User login session store (5-min TTL)
    ├── rate-limiter.ts               # File-backed rate limiter
    ├── crypto.ts                     # AES-256-GCM field encryption
    ├── email.ts                      # SMTP — contact forms + OTP fallback
    ├── sms.ts                        # Vibgyortel SMS API
    └── nse-aliases.ts                # NSE 500 company alias map for search
data/                # JSON file store — see deployment guide for complete file list
public/
├── images/          # Static image assets
├── forms/           # KYC and account-opening form PDFs
└── (research-reports/ excluded — served through API, never public URLs)
```

---

## Local Development

```bash
# Install
npm install

# Environment variables — copy and fill:
cp .env.local.example .env.local
# Required: JWT_SECRET, ENCRYPTION_SECRET, SMTP_HOST, SMTP_USER, SMTP_PASSWORD
# Optional: SMS_API_KEY, NEXT_PUBLIC_FIREBASE_* (phone OTP path)

# Dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build && npm start
```

For PM2 deployment, full Linux/Windows deployment steps, and the complete data directory reference, see [`CMOT README BEFORE DEPLOYIING/CMOTS_README.md`](./CMOT%20README%20BEFORE%20DEPLOYIING/CMOTS_README.md).

---

## Data Directory

The `data/` folder is the application's entire database (no external database). It contains 20+ JSON files — session stores, user records, content metadata. The folder is excluded from this repository. The deployment guide covers the complete file inventory, first-deployment checklist, and backup procedures.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | Yes | Signs all three token types |
| `ENCRYPTION_SECRET` | Yes | AES-256-GCM key for PAN/phone encryption |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` | Yes | Contact forms + OTP fallback |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs and SEO metadata |
| `SMS_API_KEY` | No | SMS OTP via Vibgyortel; falls back to email if absent |
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | No | Firebase phone OTP path (alternative to Vibgyortel) |
| `COOKIE_SECURE` | No | Set to `false` on local HTTP dev only |

Generate `JWT_SECRET` and `ENCRYPTION_SECRET` separately:
```bash
openssl rand -hex 32   # run twice — use different values for each
```
