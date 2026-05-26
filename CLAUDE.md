# Sunidhi Securities & Finance Limited — Claude Code Context

## Read These First
- **`CMOTS_README.md`** — Full tech stack, architecture, data flow diagrams, environment variables, deployment instructions, and all implemented features. Start here to understand the codebase.
- **`CHANGELOG.md`** — Full history of every change. The top entry (`[1.0.6]`) contains a `⚠️ PENDING — Continue From Here` block describing exactly what still needs to be done and which files to edit.

---

## ⚠️ Resume Point — Do This First

**User-reported issue:** After a client session is killed (by a new login from another browser), the **Client profile dropdown in the Header remains visible** until the page is manually refreshed.

**Root cause:** `verifySessionSilently` sets `isAuthenticated(false)` and clears `sessionStorage`, but does **not** dispatch the `clientSessionChange` window event that `SettingsDropdown` in `Header.tsx` listens for.

**Fix — add one line in two files:**

`src/app/markets/research/page.tsx` and `src/app/markets/sip-products/page.tsx`

In the `verifySessionSilently` function, after:
```typescript
sessionStorage.removeItem('clientData');
setIsAuthenticated(false);
```
Add:
```typescript
window.dispatchEvent(new Event('clientSessionChange'));
```

The listener is already wired in `src/components/layout/Header.tsx` inside `SettingsDropdown` — no changes needed there.

---

## Project Overview

**Sunidhi Securities & Finance Limited** — official corporate website + client portal + admin dashboard.

- **Framework**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Flat JSON files in `data/` — no external database
- **Auth**: JWT (7-day expiry) + bcrypt + file-based session stores
- **Deployment**: PM2 + Nginx on Windows Server

---

## Critical Architecture Rules

### 1. Never Use In-Memory Singletons for Shared State
Next.js compiles each API route into a **separate module bundle**. A module-level `Map` or variable is a different object in every bundle — writes in `/api/auth/client-login` are invisible in `/api/auth/client-verify`.  
**Always use `data/*.json` files** for any state shared across API routes.

### 2. `Button` Component Defaults to `type="button"`
`src/components/ui/button.tsx` has `type="button"` as the default. Any button that intentionally submits a form must explicitly pass `type="submit"`. Without this default, buttons inside ancestor `<form>` elements would submit the form and trigger page navigation.

### 3. Derived Values Must Not Be IIFEs in JSX
Never use `(() => { ... })()` inside JSX — SWC (Next.js compiler) cannot handle IIFEs in JSX and will silently break the entire CSS bundle (page appears completely unstyled). Always compute derived values **above the `return` statement** in the component body.

### 4. `tsconfig.json` Must Have `paths` + `baseUrl`
The `@/` import alias requires both `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` in `tsconfig.json`. Without them, the alias only resolves off the stale `.next` cache — any fresh build fails with `Module not found: Can't resolve '@/...'`. If you see this error, delete `.next/` and rebuild.

### 5. Cookie Secure Flag
All auth cookies use `secure: process.env.COOKIE_SECURE !== "false"`.  
For local HTTP development, set `COOKIE_SECURE=false` in `.env.local`.  
In production (HTTPS), omit the variable entirely.

---

## Key Data Files

| File | Purpose |
|---|---|
| `data/client-sessions.json` | Single-session enforcement — `clientId → issuedAt (ms)` |
| `data/client-otps.json` | Client login OTPs (10-min TTL) |
| `data/clients.json` | Client records (name, email, phone, clientId) |
| `data/users.json` | Registered user accounts (phone + PAN encrypted at rest) |
| `data/admins.json` | Admin accounts |
| `data/feedbacks/` | Individual feedback submissions (one `.json` + `.docx` per entry) |
| `data/research-reports.json` | Research report metadata |
| `data/daily-updates.json` | Daily market update metadata |
| `data/login-sessions.json` | User login sessions (5-min TTL) |

---

## Client Portal Single-Session Flow

```
New login → createClientToken(clientId, name)
         → createClientSession(clientId)  [writes data/client-sessions.json]
         → JWT issued with iat timestamp

Any API call → verifyClientToken(token)
            → isClientSessionValid(clientId, iat * 1000)
            → returns null if another browser logged in later

Pages poll GET /api/auth/client-verify every 30 seconds
         → on failure: clear sessionStorage + setIsAuthenticated(false)
                     + dispatch window event 'clientSessionChange'  ← PENDING FIX
         → Header SettingsDropdown listens for 'clientSessionChange' and clears UI
```

---

## Key Source Files

| File | What It Does |
|---|---|
| `src/lib/client-session-store.ts` | File-backed single-session store |
| `src/lib/auth.ts` | `createClientToken`, `verifyClientToken`, JWT helpers |
| `src/app/api/auth/client-verify/route.ts` | Session poll endpoint |
| `src/app/api/auth/client-logout/route.ts` | Invalidates session + clears cookie |
| `src/app/markets/research/page.tsx` | Research portal — needs `clientSessionChange` dispatch ⚠️ |
| `src/app/markets/sip-products/page.tsx` | SIP portal — needs `clientSessionChange` dispatch ⚠️ |
| `src/components/layout/Header.tsx` | Contains `SettingsDropdown` with `clientSessionChange` listener |
| `src/app/admin/dashboard/page.tsx` | Admin dashboard — feedback management, analytics |
| `src/app/api/admin/feedbacks/route.ts` | GET / PATCH / DELETE feedback API |
| `src/components/ui/button.tsx` | `type="button"` default — important, do not remove |
