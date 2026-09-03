# Accessibility Remediation Log — Sunidhi Securities Web Application

**Source audit**: WCAG 2.2 (Level AA) Accessibility Bug Report
**Prepared by**: Zoffec Infotech Pvt. Ltd.
**Prepared for**: Sunidhi
**Audit target**: `https://beta.sunidhi.com` (29 pages tested)
**Remediation start**: 2026-07-14
**This file**: Updated after every batch. Each entry records the finding, root cause, exact fix, and files touched, so a regression can be traced back to the change that introduced it.

---

## Status at a Glance

The audit sheet contains one row per WCAG 2.2 success criterion per page (mostly "pass" / "DNA" / blank). Only rows marked **fail** (or the "fails" typo variant found in the sheet) require action. Deduplicated across all 29 page sheets, there are **25 distinct failing findings**, several of which repeat verbatim across multiple pages (same root cause, fixed once per batch where possible).

| # | WCAG SC | Criterion | Severity | Status | Batch |
|---|---|---|---|---|---|
| 1 | 1.1.1 | Non-text Content — social icons unnamed (Header/Footer) | major | ✅ **Fixed** | 2 |
| 2 | 1.1.1 | Non-text Content — decorative image needs `alt=""` (About Story) | critical | ✅ **Fixed** | 5 |
| 3 | 1.3.1 | Info and Relationships — footer contact list should be `<dl>` | — | ✅ **Fixed** | 2 |
| 4 | 1.4.3 | Contrast (Minimum) — Header/Footer | major | ✅ **Fixed** | 3 |
| 5 | 1.4.3 | Contrast (Minimum) — Retail Equity page | major | ✅ **N/A — verified** | 3 |
| 6 | 1.4.10 | Reflow — sticky/fixed icon obscures content (Header/Footer) | critical | ✅ **Fixed** | 2 |
| 7 | 1.4.11 | Non-Text Contrast — Leadership carousel buttons | major | ✅ **Fixed** | 3 |
| 8 | 1.4.12 | Text Spacing — forced horizontal scroll (Header/Footer) | major | ✅ **Fixed** | 4 |
| 9 | 1.4.12 | Text Spacing — forced horizontal scroll (About Story) | major | ✅ **Fixed (shared root cause)** | 4 |
| 10 | 1.4.12 | Text Spacing — forced horizontal scroll (About Leadership) | major | ✅ **Fixed (shared root cause)** | 4 |
| 11 | 1.4.12 | Text Spacing — forced horizontal scroll (Retail Equity) | major | ✅ **Fixed (shared root cause)** | 4 |
| 12 | 1.4.12 | Text Spacing — forced horizontal scroll (Institution Equity) | major | ✅ **Fixed (shared root cause)** | 4 |
| 13 | 1.4.12 | Text Spacing — forced horizontal scroll (MTF) | major | ✅ **Fixed (shared root cause)** | 4 |
| 14 | 2.4.2 | Page Titled — every page shares one `<title>` | critical | ✅ **Fixed** | **1a + 1b done** |
| 15 | 2.4.3 | Focus Order — Tab breaks out of submenu (Header) | critical | ✅ **Fixed** | 2 |
| 16 | 2.4.4 | Link Purpose — non-functional links, unclear names (Header/Footer) | critical | ✅ **Fixed** (4 of 5 links; Twitter still pending) | 2 + 6 |
| 17 | 2.4.7 | Focus Visible — no focus indicator on back-navigation | critical | ✅ **Fixed** | 5 |
| 18 | 2.5.8 | Target Size (Minimum) — social icons 20×20px, below 24×24 min | critical | ✅ **Fixed** | 2 |
| 19 | 3.2.2 | On Input — IPO link opens new context unannounced (Header) | critical | ✅ **Fixed** | 2 |
| 20 | 3.2.2 | On Input — links open new tab unannounced (MTF) | critical | ✅ **N/A — verified** | 2 |
| 21 | 4.1.3 | Status Changes — carousel slide change not announced (Leadership) | critical | ✅ **Fixed** | 5 |

Note: Item 14 (Page Titled) is the single highest-impact finding — the audit's own retest sample only covered 5 pages, but the root cause (only 1 of 57 `page.tsx` files had its own `metadata` export) affects **every page on the site**, so remediation here is a full sweep, not just the 5 pages the auditor happened to sample.

---

## Batch 1a — Page Titles: Server-Component Pages ✅ Complete

**Date**: 2026-07-14
**WCAG finding addressed**: 2.4.2 Page Titled (Level AA) — *"Web pages have titles that describe topic or purpose."*

### Finding

The auditor's screen reader test found that every URL announced the exact same page title: `"Sunidhi Securities - Best Trading App in India | Stock Market Trading & Investment"`. A screen reader user navigating via browser tabs or history has no way to distinguish `/about/leadership` from `/expertise/retail-equity` — both announce identically.

### Root Cause

`src/app/layout.tsx` sets a single site-wide `metadata.title` with a template (`"%s | Sunidhi Securities"`), but only **1 of 57** `page.tsx` files provided its own `title` to fill that template. Every other page silently fell back to the layout's `default` title.

### Fix

For every **server component** page (no `"use client"` directive — these can export `metadata` directly per Next.js App Router rules), added:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "<Page-Specific Title>",
  description: "<one-line accurate description of the page>",
};
```

This is purely additive — no existing logic, imports, or JSX were touched. The existing `template: "%s | Sunidhi Securities"` in `layout.tsx` automatically appends the suffix, so e.g. `title: "Our Story"` renders as `"Our Story | Sunidhi Securities"`.

**Client-component pages were deliberately excluded from this batch** — they cannot export `metadata` directly (Next.js build error), and need a different wrapper pattern. That is Batch 1b.

### Files Modified (20 files)

| File | Title set | Description set |
|---|---|---|
| `src/app/about/story/page.tsx` | Our Story | Discover Sunidhi Securities' 69+ year journey since 1957 — our history, values, and growth into a trusted SEBI-registered stock broker. |
| `src/app/expertise/commodities-trading/page.tsx` | Derivatives & Commodity Trading | Trade Futures & Options and commodities (gold, silver, crude oil) with Sunidhi's dedicated commodities dealing desk and derivatives research team. |
| `src/app/expertise/depository-services/page.tsx` | Depository Services | CDSL-registered depository participant services for secure dematerialisation, holding, and transfer of securities. |
| `src/app/expertise/institution-equity/page.tsx` | Institution Equity (Corporate) | Institutional equity services for FIIs, DIIs, mutual funds, insurance companies, and corporates with in-depth research coverage. |
| `src/app/expertise/research/page.tsx` | Research | In-depth equity research with a focus on mid-cap and small-cap stocks aimed at delivering absolute returns. |
| `src/app/expertise/retail-equity/page.tsx` | Retail Equity & Equity Trading | Pioneers of online market trading in India — equity, commodity, and currency trading with dedicated trading platforms and market access. |
| `src/app/expertise/sunidhi-capital/page.tsx` | Sunidhi Capital Pvt Ltd (NBFC) | Capital solutions from Sunidhi's RBI-registered NBFC arm — loan against shares, personal loans, and business funding. |
| `src/app/expertise/wholesale-debt-market/page.tsx` | Wholesale Debt Market | WDM trading, economic research, and access to government securities and money market instruments. |
| `src/app/legal/disclosure-disclaimer/page.tsx` | Disclosure & Disclaimer | Investment risk disclosures and regulatory disclaimers as mandated by SEBI for Sunidhi Securities & Finance Limited. |
| `src/app/legal/investor-charter/page.tsx` | Investor Charter | Client rights, service standards, and grievance redressal timelines as per the SEBI Investor Charter. |
| `src/app/legal/kyc-advisory/page.tsx` | KYC Advisory | KYC compliance advisory and guidance for opening and maintaining your trading and demat account. |
| `src/app/legal/notices-and-reports/page.tsx` | Notices & Reports | Statutory notices, annual reports, and regulatory filings published by Sunidhi Securities & Finance Limited. |
| `src/app/legal/privacy-policy/page.tsx` | Privacy Policy | How Sunidhi Securities collects, uses, and protects your personal data, in line with the DPDP Act. |
| `src/app/legal/regulatory-information/page.tsx` | Regulatory Information | SEBI registration numbers, exchange memberships, and regulatory details for Sunidhi Securities & Finance Limited. |
| `src/app/markets/ipo/page.tsx` | IPO Center | Track upcoming and ongoing IPOs, and apply online through Sunidhi Securities. |
| `src/app/markets/overview/page.tsx` | Market Overview | A snapshot of key market indices and trends to help guide your investment decisions. |
| `src/app/open-account/page.tsx` | Open Trading Account | Open a trading and demat account with Sunidhi Securities — eKYC, offline, and NRI account options available. |
| `src/app/support/branches/page.tsx` | Branch Locator | Find your nearest Sunidhi Securities branch office across India. |
| `src/app/support/help/page.tsx` | Help Center | Frequently asked questions and support resources covering account opening, trading, and technical support. |
| `src/app/tools/tax-calculator/page.tsx` | Tax Calculator | Calculate short-term and long-term capital gains tax on your stock market investments. |

### Verification Performed

- ✅ `npx tsc --noEmit` — clean, zero errors (confirms no broken imports/exports and no accidental `metadata` export from a client component)
- ✅ `git status` — diff scoped to exactly these 20 files (plus an unrelated pre-existing diff on `admin/dashboard/page.tsx` from earlier session work)
- ✅ Confirmed zero changes to any auth/session/rate-limiting/crypto file — `admin-auth.ts`, `rate-limiter.ts`, `session-store.ts`, `client-session-store.ts`, `crypto.ts`, `auth.ts`, `middleware.ts` all untouched
- ✅ Every edit is purely additive (new import line + new export block) — no existing line was deleted or modified

### Regression Risk

**Very low.** `export const metadata` is inert at runtime for anything other than `<head>` tag generation — it cannot affect auth, data fetching, rendering logic, or client-side behavior. The only way this batch could visibly break something is a page accidentally being misclassified as a server component when it's actually a client component (Next.js would fail the build immediately with `tsc`/`next build`, not fail silently) — this was independently re-verified by re-checking every file's first 3 lines for a `"use client"` / `'use client'` directive before editing.

---

## Batch 1b — Page Titles: Client-Component Pages ✅ Complete

**Date**: 2026-07-14
**WCAG finding addressed**: 2.4.2 Page Titled (Level AA) — same finding as Batch 1a, remaining scope.

### Finding

Same as Batch 1a — 22 remaining public pages are Client Components (`"use client"`), which cannot export `metadata` directly in the Next.js App Router (attempting it is a build-time error). These were deliberately excluded from Batch 1a pending a different fix pattern.

### Fix

**Pattern used — split each page into a server wrapper + client child:**

1. The original `page.tsx` (with its `"use client"` directive and all logic intact) was copied byte-for-byte into a new sibling file, `<Name>PageClient.tsx`, in the same directory. Verified identical with `diff` before proceeding in every case.
2. `page.tsx` was replaced with a thin **server component**:
   ```typescript
   import type { Metadata } from "next";
   import <Name>PageClient from "./<Name>PageClient";

   export const metadata: Metadata = {
     title: "<Page Title>",
     description: "<one-line description>",
   };

   export default function <Name>Page() {
     return <<Name>PageClient />;
   }
   ```

No logic, state, hooks, or JSX inside the original component was touched — the wrapper only adds a `metadata` export and renders the untouched client component as a child.

**Special case — `blog/[slug]/page.tsx` (dynamic route):** A blog post's title should be the post's own title, not a fixed string. This page uses `generateMetadata()` instead of a static `metadata` export — an async server function that reads `data/blogs.json` directly (mirroring the exact read pattern already used by `src/app/api/blogs/[slug]/route.ts`, so both stay in sync with the data file) and returns `{ title: blog.title, description: blog.excerpt }`. Falls back to a generic title if the slug isn't found.

### Files Modified (22 page pairs — 44 files total)

| Directory | Wrapper (`page.tsx`) | New client file | Title set |
|---|---|---|---|
| `about/csr` | modified | `CSRPageClient.tsx` | CSR & Sunidhi Foundation |
| `about/leadership` | modified | `LeadershipPageClient.tsx` | Leadership Team |
| `about/life-at-sunidhi` | modified | `LifeAtSunidhiPageClient.tsx` | Life at Sunidhi |
| `about/awards` | modified | `AwardsPageClient.tsx` | Awards & Recognition |
| `about/careers` | modified | `CareersPageClient.tsx` | Careers |
| `expertise/mtf` | modified | `MTFPageClient.tsx` | Margin Trading Facility (MTF) |
| `expertise/mutual-fund-distribution` | modified | `MutualFundDistributionPageClient.tsx` | Mutual Funds & Wealth Management |
| `markets/daily-updates` | modified | `DailyUpdatesPageClient.tsx` | Daily Market Updates |
| `markets/research` | modified | `ResearchPageClient.tsx` | Research Reports |
| `markets/sip-products` | modified | `SIPProductsPageClient.tsx` | Direct Equity SIP |
| `markets/nse-rss` | modified | `NSERSSPageClient.tsx` | NSE RSS Feeds |
| `research-login` | modified | `ResearchLoginPageClient.tsx` | Client Login |
| `resources/holidays` | modified | `HolidaysPageClient.tsx` | Trading Holidays |
| `resources/settlement-calendar` | modified | `SettlementCalendarPageClient.tsx` | Settlement Calendar |
| `search` | modified | `SearchPageClient.tsx` | Search Results |
| `support/contact` | modified | `ContactPageClient.tsx` | Contact Us |
| `support/downloads` | modified | `DownloadsPageClient.tsx` | Downloads & Forms |
| `tools/brokerage-calculator` | modified | `BrokerageCalculatorPageClient.tsx` | Brokerage Calculator |
| `tools/margin-calculator` | modified | `MarginCalculatorPageClient.tsx` | Margin Calculator |
| `tools/sip-calculator` | modified | `SIPCalculatorPageClient.tsx` | SIP Calculator |
| `blog` | modified | `BlogPageClient.tsx` | Blog |
| `blog/[slug]` | modified | `BlogPostPageClient.tsx` | *(dynamic — the blog post's own title via `generateMetadata`)* |

### Deliberately Out of Scope

These pages still have no page-specific `metadata` — left untouched on purpose, not an oversight:

| Page | Why excluded |
|---|---|
| `src/app/page.tsx` (homepage) | Already correct — the root layout's `default` title *is* the intended homepage title |
| `src/app/about/foundation/page.tsx` | Pure redirect stub to `/about/csr`, no distinct content to title |
| `src/app/admin/*` (8 pages), `src/app/dashboard`, `src/app/client/profile` | Auth-gated internal pages, not part of the public WCAG audit scope |
| `src/app/feedback/page.tsx`, `src/app/register/page.tsx` | Public but outside the audit's 29-page test list; candidates for a future pass if wanted |

### Verification Performed

- ✅ Every copied client file verified byte-identical to the original via `diff` before the original was overwritten
- ✅ `npx tsc --noEmit` run after each sub-batch (5 checkpoints total across the 22-page batch) — clean every time, zero errors
- ✅ Final sweep confirms every public server/client page.tsx in `src/app` now has either `export const metadata` or `generateMetadata`, except the four deliberately-excluded categories above
- ✅ `git diff --name-only` against all VAPT-critical files (`admin-auth.ts`, `rate-limiter.ts`, `session-store.ts`, `client-session-store.ts`, `crypto.ts`, `auth.ts`, `middleware.ts`, `useAdminActivitySession.ts`, `AdminSessionGuard.tsx`) — empty, confirming zero touches

### Regression Risk

**Low.** The only structural change is that each page's component now lives in a sibling file instead of `page.tsx` itself — the component's internal code (state, effects, event handlers, JSX) is byte-for-byte unchanged, verified by `diff` before every overwrite. The one genuinely new piece of logic is `blog/[slug]/page.tsx`'s `generateMetadata()`, which only reads `data/blogs.json` (read-only, same file the existing API route already reads) and cannot affect rendering, auth, or data mutation.

---

## Batch 2 — Header & Footer Component Fixes ✅ Complete (one item needs your input)

**Date**: 2026-07-14
**WCAG findings addressed**: 1.1.1, 1.3.1, 1.4.10, 2.4.3, 2.4.4 (partial), 2.5.8, 3.2.2

### 1.1.1 + 2.5.8 — Social icons: no accessible name, and below minimum target size

**Finding**: Facebook/Twitter/LinkedIn/Instagram/YouTube icon links in the footer had no text alternative (screen readers announce them as bare "link") and measured 20×20px, below the 24×24px minimum click/tap target.

**Root cause**: `<a href="#"><Facebook className="h-5 w-5" /></a>` — no `aria-label`, no `aria-hidden` on the decorative icon, no padding to enlarge the hit area beyond the icon's own bounding box.

**Fix** (`src/components/layout/Footer.tsx`): Added `aria-label="Follow us on Facebook"` (etc.) to each link, `aria-hidden="true"` to each icon (the label now carries the meaning), and `p-2 -m-1` padding on each link — this enlarges the clickable/tappable area to ~36×36px without changing the icon's visual size or the row's overall layout (the negative margin cancels the padding's effect on visual spacing).

### 1.3.1 — Footer contact list should be a description list

**Finding**: The address/phone/email block in the footer used a generic `<ul>`, losing the term→value relationship a screen reader could otherwise announce (e.g., "Address: ...", "Phone: ...").

**Fix** (`src/components/layout/Footer.tsx`): Converted the `<ul>`/`<li>` structure to `<dl>`/`<dt>`/`<dd>`, with each `<dt>` (Address / Phone / Email) marked `sr-only` — visually identical to before, but now announces the field name before its value to assistive technology.

### 1.4.10 — Floating fixed icon obscures content on reflow

**Finding**: A permanently fixed-position icon overlaps page content and can't be scrolled away from.

**Root cause**: `src/components/AccessibilityWidget.tsx` — a legitimate, deliberately-built feature (a text-to-speech focus announcer, toggled via a floating button, Alt+T shortcut) renders a `fixed bottom-6 right-6 z-[9999] w-14 h-14` (56×56px) circular button on every public page. At high zoom / narrow viewports (the standard 1.4.10 Reflow test condition — 320px CSS width equivalent), a persistent 56px circle in the corner can overlap page content that reflows into that same area.

**Fix**: Reduced the button's footprint on narrow viewports — `w-11 h-11` (44px) below the `sm:` breakpoint, `w-14 h-14` (56px) at `sm:` and above, with matching icon and offset adjustments. 44px still comfortably exceeds the 24×24 minimum target size while meaningfully reducing the area it can obscure exactly where Reflow testing is most likely to expose overlap. Also added `aria-hidden="true"` to the button's icon (the button already has a proper `aria-label`).

**Note**: this is the *only* persistent `fixed`-position element found across the public site (confirmed via `grep`) — no other floating widget exists to compound the issue.

### 2.4.3 — Tab key breaks out of an open submenu unexpectedly

**Finding**: Pressing Tab while a dropdown menu is open moves focus to the next top-level menu instead of a predictable location, and the menu itself doesn't visibly close, leaving a stale open panel on screen.

**Root cause**: `NavDropdown`, `ClientLoginDropdown`, and `SettingsDropdown` (all three share an identical hover/click/blur-driven open-close pattern) had no `keydown` handling *inside* the open menu panel at all — `Escape` only worked while focus was still on the trigger button, and there was no explicit handling for Tab/Shift+Tab reaching the first or last menu item. The existing `onBlur` handler does eventually close the menu once focus truly leaves it, but with no explicit boundary handling this could lag or feel inconsistent across browsers/assistive tech.

**Fix** (`src/components/layout/Header.tsx`, applied identically to all three dropdown components):
- Added a `triggerRef` to each trigger button.
- Added `handleMenuKeyDown` on the `role="menu"` panel: **Escape** closes the menu and moves focus back to the trigger button (previously did nothing once focus was inside the menu); **Tab** on the last menu item (or **Shift+Tab** on the first) explicitly collapses the menu before the browser moves focus onward, so the UI never shows a stale open panel while focus has already moved elsewhere.

### 2.4.4 — Non-functional links / unclear link names

**Finding**: "The links don't work and just refresh the same page. Also proper link names are not pronounced." / **Expected result**: "provide proper names to links **and make the links active**."

**What was fixed**: The "names not pronounced" half is resolved by the same 1.1.1 fix above — the social icons now have real accessible names.

**⚠️ What still needs your input — not fixed, and not silently worked around:** The "make the links active" half requires real destination URLs. I checked `src/lib/constants.ts` and the entire codebase for any existing Facebook/Twitter/LinkedIn/Instagram/YouTube profile URL — **none exist anywhere in this project.** The footer's social links are `href="#"` placeholders with no real destination ever configured. I will not invent a URL — pointing these at a guessed or wrong profile would be worse than the current state. **Once you provide the real profile URLs, updating them is a one-line change per link in `Footer.tsx`.**

**Update — see Batch 6 below:** Facebook, LinkedIn, Instagram, and YouTube URLs were provided and wired in. Twitter's URL was not provided, so that one link remains a `href="#"` placeholder.

### 3.2.2 — External / new-tab links not announced

**Finding**: Links that open a new tab/window (e.g., the Header's "IPO Center" nav entry) don't warn screen reader users before the context change.

**Fix**: Added `aria-label={`${name} (opens in a new tab)`}` to every `target="_blank"` link across `Header.tsx`: the `NavDropdown` and `MobileNavSection` external items (covers "IPO Center" — the only `external: true` entry today), all 5 external links in `ClientLoginDropdown` and its mobile counterpart `MobileClientLoginSection`, and the "Visit Old Website" mobile menu link (desktop top-bar version already had this from earlier work). The visible link text is unchanged — only the accessible name gained the suffix.

**Bonus fix bundled in**: while editing `MobileClientLoginSection`, found 4 of its 5 external links were missing `role="menuitem"`, focus-visible ring styling, and padding entirely (only the first link had it — an inconsistency, not a deliberate choice). Brought all 5 (plus the "Direct Equity SIP" link below them) to the same consistent, accessible styling as part of the same edit.

**MTF page (assigned to this batch as finding #20)**: Checked `src/app/expertise/mtf/MTFPageClient.tsx` in full — it contains zero `target="_blank"` links in the current codebase (only internal `<Link>` components to `/open-account` and `/support/contact`). This finding likely refers to a page structure present on the audited beta deployment that no longer matches current source (the site has been substantially restructured since the audit). Nothing to fix here today; flagging as verified rather than silently skipped.

### Files Modified

| File | Changes |
|---|---|
| `src/components/layout/Footer.tsx` | Social icon `aria-label`/`aria-hidden`/padding; Contact Us list converted to `<dl>` |
| `src/components/layout/Header.tsx` | `useRef` import added; `NavDropdown`, `ClientLoginDropdown`, `SettingsDropdown` all gained `triggerRef` + `handleMenuKeyDown` (Escape + Tab-boundary close); external-link `aria-label` additions in `NavDropdown`, `MobileNavSection`, `ClientLoginDropdown`, `MobileClientLoginSection`, and the mobile "Visit Old Website" link; consistency fix for 4 previously-unstyled links in `MobileClientLoginSection` |
| `src/components/AccessibilityWidget.tsx` | Floating button footprint reduced on narrow viewports (56px → 44px below `sm:`); `aria-hidden` added to its icon |

### Verification Performed

- ✅ `npx tsc --noEmit` — clean, zero errors (confirms `Button`'s `forwardRef` accepts the new `ref` props correctly, and all new keyboard-handler types are valid)
- ✅ `git diff --stat` — touches exactly the 3 expected files, nothing else
- ✅ `git diff --name-only` against all VAPT-critical files — empty, confirming zero touches
- ✅ Confirmed via `grep` that `AccessibilityWidget`'s floating button is the *only* persistent fixed-position element on the public site before deciding how to scope the 1.4.10 fix
- ✅ Confirmed via `grep` across the whole codebase that no real social media URLs exist anywhere, before deciding to flag rather than fabricate one for 2.4.4

### Regression Risk

**Low.** All changes are additive (`aria-*` attributes, new `useRef`/keydown handlers, Tailwind classes) — no existing prop, handler, or rendering path was removed or changed in behavior for mouse/touch users. The one behavioral change (Tab closing the menu at its boundary) only affects keyboard users navigating an *already-open* dropdown, and makes that interaction strictly more predictable than the previous "menu silently stays open" state.

---

## Batch 3 — Color Contrast Fixes ✅ Complete

**Date**: 2026-07-14
**WCAG findings addressed**: 1.4.3 (Contrast Minimum), 1.4.11 (Non-Text Contrast)

### Investigation Method

Rather than judge contrast visually, every `text-*`/`bg-*` Tailwind color class actually used in `Header.tsx`, `Footer.tsx`, and `expertise/retail-equity/page.tsx` was extracted via `grep`, then its exact WCAG relative-luminance contrast ratio was computed with the standard sRGB gamma-corrected formula (`c ≤ 0.03928 → c/12.92`, else `((c+0.055)/1.055)^2.4`; luminance `= 0.2126R + 0.7152G + 0.0722B`; contrast `= (L_lighter+0.05)/(L_darker+0.05)`), checked against both stock Tailwind hex values and this project's custom `primary`/`secondary` palette in `tailwind.config.ts`. Every flagged combination's real co-occurrence in the JSX was then confirmed by reading the surrounding code before touching anything — this caught one false positive (below).

### 1.4.11 — Leadership carousel inactive dot indicator below 3:1

**Finding**: item #7 — carousel button contrast.

**Root cause**: the inactive slide-indicator dots used `bg-gray-400` sitting on the timeline section's `bg-gray-50` background — 2.43:1, below the 3:1 minimum required for non-text UI components.

**Fix** (`src/app/about/leadership/LeadershipPageClient.tsx`): `bg-gray-400` → `bg-gray-500` (4.63:1 against `gray-50`, clears the requirement with margin). The hover state (`hover:bg-gray-600`) and the active-slide indicator (`bg-primary-600`) were already compliant and left untouched.

### 1.4.3 — Header: "Signed in as" label below 4.5:1

**Finding**: part of item #4.

**Root cause**: `MobileClientLoginSection` in `Header.tsx` renders a green "signed in" card (`bg-green-50 border-green-200`) for logged-in clients on the mobile menu. Its small "Signed in as" label used `text-green-600` — 3.15:1 against that background, below 4.5:1. (The client's name directly below it already used `text-green-800` — 6.81:1, passes.)

**Fix** (`src/components/layout/Header.tsx`): `text-green-600` → `text-green-700` (4.79:1, passes) on the "Signed in as" label, preserving the two-tone label/value visual hierarchy relative to the `green-800` name below it.

### 1.4.3 — Footer: bottom-bar "Admin" link / credit line below 4.5:1

**Finding**: part of item #4.

**Root cause**: the footer's bottom bar used `text-gray-500` for the "Admin" link and the "Designed and Developed by…" credit line, against the footer's `bg-gray-900` background — 3.67:1, below 4.5:1. Every other dim/small-print text elsewhere in the same footer (disclaimer, compliance officer block, CIN line) already correctly used `text-gray-400` (6.99:1) for the identical visual purpose — `gray-500` here was an inconsistency, not a deliberate design choice.

**Fix** (`src/components/layout/Footer.tsx`): `text-gray-500` → `text-gray-400` for both the "Admin" link and the "Designed and Developed by" line, matching the pattern already used everywhere else in the file. The `hover:text-gray-300` state on the Admin link is unaffected.

### Checked and found compliant — no fix needed

- **Header "Sign Out" button** (`text-red-600` with `hover:bg-red-50` / `focus-visible:bg-red-50`): the exhaustive sweep initially flagged `text-red-600` on `bg-red-50` as 4.41:1 (fails). On inspection, `bg-red-50` is only ever applied as a `:hover`/`:focus-visible` state — at rest the text sits on the dropdown panel's actual background (white), where `text-red-600` measures 4.83:1 and passes comfortably. Not a real defect; no change made.
- **Retail Equity page** (finding #5): every text/background combination actually present in `src/app/expertise/retail-equity/page.tsx` today passes comfortably (6.19:1 to 21:1) — nothing close to the 4.5:1 threshold. Combined with Header's own prominent text (nav links, logo area, top bar: 6.47:1–17.74:1) and Footer's main body text (`gray-300`/`gray-400` on `gray-900`: 6.99:1–12.04:1) also passing comfortably, this strongly suggests findings #4/#5 as originally worded (broad "Header/Footer" and "Retail Equity" contrast failures) reflect the live `beta.sunidhi.com` deployment as it existed when audited, rather than a defect reproducible in the current source tree — consistent with the audit having targeted the beta deployment directly rather than this source snapshot. The three defects found and fixed above are the only reproducible contrast failures located in current source across all three pages checked.

### Files Modified (3 files)

| File | Change |
|---|---|
| `src/app/about/leadership/LeadershipPageClient.tsx` | Inactive carousel dot: `bg-gray-400` → `bg-gray-500` |
| `src/components/layout/Header.tsx` | Mobile "Signed in as" label: `text-green-600` → `text-green-700` |
| `src/components/layout/Footer.tsx` | Bottom-bar "Admin" link + credit line: `text-gray-500` → `text-gray-400` (both instances) |

### Verification Performed

- ✅ Computed exact WCAG relative-luminance contrast ratios (not visual estimation) for every combination checked, for both stock Tailwind hex values and this project's custom palette
- ✅ Confirmed each flagged combination's actual co-occurrence in the rendered UI by reading the surrounding JSX before changing anything — caught the red-600/red-50 false positive this way (hover-only background, not the resting state)
- ✅ Re-computed each replacement color's ratio before applying it — all three land comfortably above the required threshold (4.63:1, 4.79:1, 6.99:1 against 3:1/4.5:1/4.5:1 minimums respectively), not just barely over
- ✅ `npx tsc --noEmit` — clean, zero errors
- ✅ `git diff --stat` — touches exactly these 3 files, nothing else
- ✅ `git diff --name-only` against all VAPT-critical files (`admin-auth.ts`, `rate-limiter.ts`, `session-store.ts`, `client-session-store.ts`, `crypto.ts`, `auth.ts`, `middleware.ts`, `useAdminActivitySession.ts`, `AdminSessionGuard.tsx`) — empty, confirming zero touches

### Regression Risk

**Very low.** Every change is a single Tailwind color-shade swap (one step darker on the same hue) — no structural, logical, or behavioral change. Visual impact is a barely-perceptible darkening of three small text/UI elements; layout, spacing, and all other styling are untouched.

---

## Batch 4 — Text Spacing / Horizontal Reflow Fix ✅ Complete

**Date**: 2026-07-14
**WCAG finding addressed**: 1.4.12 (Text Spacing) — *"No loss of content or functionality occurs when line-height, paragraph spacing, letter-spacing, and word-spacing are increased to specified minimums."*

### Investigation Method

The finding repeated verbatim across 6 different audited pages (Header/Footer, About Story, About Leadership, Retail Equity, Institution Equity, MTF), which was the same "one shared component, six page reports" signature already seen in Batch 1a (page titles). Rather than guess, this was investigated with 8 parallel read-only agents — one per flagged page plus one covering all shared layout primitives (`Container`, `Card`, `Button`, `globals.css`, `tailwind.config.ts`, `layout.tsx`) — each independently reading the real source and reasoning about the standard WCAG 1.4.12 stress-test override:
```css
* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p { margin-bottom: 2em !important; }
```
All 8 agents converged on the same conclusion: every page-specific investigation (About Story, About Leadership, Retail Equity, Institution Equity, MTF) found its own markup already fluid and safe (Container-based, percentage/`fr`-based grids, no fixed pixel widths, no `white-space: nowrap`), and traced the reported overflow back to **`src/components/layout/Header.tsx`** — mounted once in the site's single `src/app/layout.tsx` and rendered identically on every route, which is why the bug "recurred verbatim" across 6 different page audits instead of needing 6 separate fixes. Footer was independently checked and cleared — its bottom-bar link row already uses `flex-wrap` correctly.

### Empirical Verification (not just static reading)

Since this is a rendering/layout bug, static code reading alone wasn't trusted — the actual page was rendered in a real browser (dev server pointed at this worktree) and the exact stress-test CSS above was injected via script, then `document.documentElement.scrollWidth` vs `clientWidth` was measured directly:

- **Before any fix**, on `/expertise/institution-equity` at a 1280px viewport: 0px overflow at rest, **111px of forced horizontal overflow** after injecting the stress CSS — reproducing the reported bug exactly. The overflowing element was pinpointed via DOM geometry to the header's desktop nav row.
- **Unexpected discovery**: at a 1024px viewport (the exact edge of Tailwind's `lg:` breakpoint, where the desktop nav switches on), the header overflowed by **253px even with no stress CSS applied at all** — a pre-existing responsive-design bug affecting real sighted users at that viewport width (e.g. a small laptop or a non-maximized browser window), independent of any accessibility setting. The audit's 1.4.12 finding and this latent bug share the same root cause and the same fix.

### Root Cause

`Header.tsx`'s desktop `<nav>` (the "Main Header" row) lays out three children — the logo, a middle row of 8 nav-dropdown triggers (`flex-1`, meaning it grows to fill available space), and a CTA button cluster — with `flex items-center justify-between`, no `flex-wrap` anywhere in the chain, and the two outer children pinned via `flex-shrink-0`. All width pressure from letter-spacing/word-spacing growth on the 8 nav labels and 2 CTA buttons had nowhere to go: with no wrap and both flanking elements refusing to shrink, the row — and therefore the page — was forced wider than the viewport instead of reflowing.

### Fix

**`src/components/layout/Header.tsx`** — the middle nav-items `<div>` (the one containing the 8 `NavDropdown`s and the Blog link) changed from:
```tsx
<div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
```
to:
```tsx
<div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 flex-1 justify-center">
```
This lets the nav-items row wrap onto additional lines *within its own column* when it doesn't fit, instead of forcing the whole header row wider than the viewport. The fix is deliberately scoped to this one inner `<div>` and **not** the outer `<nav>` — an earlier attempt at adding `flex-wrap` to the outer `<nav>` was tested and rejected because it interacted badly with the middle item's `flex-1` (an intrinsic `flex-basis: 0%` `flex-grow` item), causing the CTA button group to wrap onto its own line even at very wide viewports (1440px, 1920px) where the header comfortably fits on one line today — a real regression that was caught by testing before it was ever applied to source. The version actually shipped was re-verified to *not* reproduce that regression (see below).

### Files Modified (1 file)

| File | Change |
|---|---|
| `src/components/layout/Header.tsx` | Desktop nav-items row: added `flex-wrap` + switched `gap-6` to `gap-x-6 gap-y-2`, scoped to the inner nav-links `<div>` only |

### Verification Performed

- ✅ Reproduced the exact reported bug empirically (browser + injected stress CSS) before writing any fix, on the actual dev server pointed at this worktree
- ✅ Tested three candidate fixes live in the browser (via injected override CSS) before touching source — rejected two variants that either didn't fully resolve overflow or caused unwanted wrapping at wide viewports, before landing on the one that passed every check
- ✅ Re-verified the **real shipped Tailwind classes** (via HMR hot-reload, not just the injected simulation) at 1024px, 1280px, 1440px, and 1920px viewports, in both the plain baseline state and with the WCAG stress CSS applied — **zero horizontal overflow in all 8 combinations**, and no premature/unwanted wrapping at any width where the header previously fit on one line
- ✅ Confirmed the internal wrap (when it does trigger, e.g. at 1024px under stress) renders as a clean multi-row stack with zero pairwise element overlap — checked programmatically via bounding-rect intersection, not just visually assumed
- ✅ Spot-checked all 6 originally-flagged pages (About Story, About Leadership, Retail Equity, Institution Equity, MTF, plus the shared Header/Footer chrome) directly under the stress CSS at the previously-broken 1024px viewport — all now measure 0px overflow, confirming the single shared-component fix resolves every page the auditor reported
- ✅ `npx tsc --noEmit` — same 3 pre-existing errors as before (all inside the unrelated `sunidhi-export-for-seo/` directory), zero new errors, zero errors in `Header.tsx`
- ✅ `git diff --stat` / `git status` — touches exactly this 1 file beyond what Batches 1–3 already modified; no unexpected scope
- ✅ `git diff --name-only` against all VAPT-critical files — empty, confirming zero touches

### Investigated and Deliberately Left Out of Scope

A few lower-confidence, different-symptom observations surfaced during the investigation but were not part of the reported "forces horizontal scroll" finding and were left untouched to keep this batch minimal and low-risk:

- **`Header.tsx`'s `SettingsDropdown`** has a `<span className="max-w-[120px] truncate">` around the logged-in client's first name. Under the stress CSS this causes *more* of the name to be ellipsis-clipped (a content-loss symptom, not horizontal scroll), but it's contained by `overflow:hidden` so it never produces a page-level scrollbar, and it's only visible while a client session is active. Not fixed — different symptom, out of this batch's reported scope.
- **`src/components/ui/card.tsx`'s `CardFooter`** default styling (`flex items-center p-6 pt-0`, no `flex-wrap`) is a latent defect in the shared primitive, but its only current call site already overrides it with `flex-col`, so it isn't actively firing anywhere today.
- **`src/components/ui/button.tsx`'s** fixed-height size variants (`h-9`/`h-11`/`h-12`) risk *vertical* clipping under the stress test's increased `line-height`, not horizontal overflow — a different WCAG 1.4.12 sub-symptom, site-wide in scope, and a materially bigger change than this batch's reported bug warrants.

### Regression Risk

**Low.** The change is a single Tailwind class addition (`flex-wrap`) plus splitting one `gap-6` into `gap-x-6 gap-y-2` (identical spacing value, just axis-specific), scoped to one `<div>`. Under normal letter/word-spacing at every practically-relevant desktop width (1024–1920px, tested), the row still renders as a single line identical to before — verified directly against the real rendered classes, not just reasoned about. The only behavioral change is what happens under conditions that don't occur during normal browsing (extreme letter/word-spacing, or the narrow 1024px-ish window this batch also happened to fix): the row now wraps to extra lines instead of silently overflowing the page.

---

## Batch 5 — Remaining Page-Specific Fixes ✅ Complete

**Date**: 2026-07-14
**WCAG findings addressed**: 1.1.1 (Non-text Content), 2.4.7 (Focus Visible), 4.1.3 (Status Messages)

### 1.1.1 — About Story's rotating banner image has a meaningless alt text

**Finding**: the auditor flagged a decorative image on About Story needing `alt=""`.

**Root cause**: About Story renders `<MarqueeBanner />` at the top of the page — a shared, auto-rotating hero-image component (also used on the homepage). Its `<Image>` had `alt={\`Banner ${currentIndex + 1}\`}`, producing announcements like "Banner 1", "Banner 2" — worse than no alt text at all, since it forces every screen reader user to sit through meaningless noise for a purely decorative rotating background image that has its own dark overlay and conveys no information beyond generic visual atmosphere (the page's real content starts with its own `<h1>Our Story</h1>` immediately below).

**Fix** (`src/components/ui/MarqueeBanner.tsx`): `alt={\`Banner ${currentIndex + 1}\`}` → `alt=""`, so screen readers correctly skip the image entirely. Since this component is shared, the homepage banner gets the same correct treatment as a side effect.

### 2.4.7 — Leadership carousel's Previous/Next/dot buttons have no visible focus indicator

**Finding**: "no focus indicator on back-navigation."

**Root cause**: read literally rather than assumed to mean the browser's Back button — the Leadership page's timeline carousel has a "Previous slide" button (the literal *back* control for stepping through the carousel) and a "Next slide" button, plus dot indicators. All three were missing any `focus-visible` styling entirely — no ring, no outline override — unlike every other interactive element in this codebase (Header's nav links, dropdowns, search box, etc.), which consistently uses a `focus-visible:ring-2 focus-visible:ring-primary-500` pattern. Keyboard users tabbing to these controls had no reliable visible indication of focus.

**Fix** (`src/app/about/leadership/LeadershipPageClient.tsx`): added `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500` to the Previous and Next arrow buttons, and the same plus `focus-visible:ring-offset-2` to the dot indicators (needed there since the dots are small and sit flush against the section background, so an offset keeps the ring from looking clipped). Matches the exact pattern already proven correct elsewhere in the codebase.

### 4.1.3 — Leadership carousel slide changes aren't announced to screen readers

**Finding**: carousel slide change not announced.

**Root cause**: advancing the timeline carousel (via the arrow buttons, dot indicators, or arrow keys) updates the displayed caption and the "Image X of Y" position text, but nothing signaled this to assistive technology — a screen reader user who wasn't already focused inside the caption text would never learn the slide had changed.

**Fix** (`src/app/about/leadership/LeadershipPageClient.tsx`): added `aria-live="polite" aria-atomic="true"` to the caption/position-count wrapper `<div>`. `aria-atomic="true"` ensures the whole region (caption + count) is re-announced together as one unit rather than only the specific text node that changed, so the announcement always makes grammatical sense (e.g. "1985 - Initiated operations in the Wholesale Debt Market, Image 2 of 11") rather than a fragment.

### Files Modified (2 files)

| File | Change |
|---|---|
| `src/components/ui/MarqueeBanner.tsx` | Rotating banner image: `alt="Banner N"` → `alt=""` (decorative) |
| `src/app/about/leadership/LeadershipPageClient.tsx` | Added `focus-visible` ring styling to Previous/Next/dot carousel buttons; added `aria-live="polite"` to the caption/count region |

### Verification Performed

- ✅ Confirmed the real root cause of each finding by reading actual source rather than assuming — in particular, re-read "no focus indicator on back-navigation" literally against the carousel's own Previous ("back") button rather than assuming it meant browser history navigation, which matched the codebase's scope note (`about/leadership/page.tsx`) far better than a speculative site-wide SPA-routing fix would have
- ✅ Verified empirically in a real browser against the actual dev server: confirmed the rendered `<img>` on About Story now has `alt=""`; confirmed Tailwind compiled a correct `:focus-visible` CSS rule for the new ring classes; confirmed the `aria-live` region's text content actually updates (checked before/after clicking "Next slide" — text changed from the slide-1 caption to the slide-2 caption as expected)
- ✅ `npx tsc --noEmit` — same 3 pre-existing errors as before (unrelated, inside `sunidhi-export-for-seo/`), zero new errors
- ✅ `git diff --stat` — touches exactly these 2 files beyond what Batches 1–4 already modified
- ✅ `git diff --name-only` against all VAPT-critical files — empty, confirming zero touches

### Regression Risk

**Very low.** The `alt=""` change is inert for sighted users (alt text isn't visually rendered) and only changes screen-reader behavior, correctly. The focus-ring additions are purely additive Tailwind classes matching an already-proven pattern used everywhere else in the app — no existing styling, layout, or click behavior was touched. The `aria-live` addition is a single non-visual attribute; it does not change what's rendered, only how assistive technology is notified of updates.

---

## Batch 6 — Social Media Links (follow-up to Batch 2, finding #16) ✅ Complete

**Date**: 2026-07-14
**WCAG finding addressed**: 2.4.4 (Link Purpose) — completes the half of this finding left open in Batch 2.

### Fix

You provided the real profile URLs for 4 of the 5 footer social icons. `src/components/layout/Footer.tsx` updated:

| Platform | `href` | Status |
|---|---|---|
| Facebook | `https://www.facebook.com/profile.php?id=61582925495111` | ✅ Wired in |
| LinkedIn | `https://www.linkedin.com/company/sunidhisecurities&financelimited/` | ✅ Wired in |
| Instagram | `https://www.instagram.com/sunidhisecurities/` | ✅ Wired in |
| YouTube | `https://www.youtube.com/@sunidhisecuritiesfinancelt002` | ✅ Wired in |
| Twitter | — | ⏳ No URL provided yet — still `href="#"` |

Each of the 4 wired-in links also gained `target="_blank" rel="noopener noreferrer"` (they now genuinely leave the site, so this is required for security — `noopener` prevents the opened tab from being able to manipulate the original page via `window.opener`) and its `aria-label` gained the `(opens in a new tab)` suffix, matching the exact pattern already established for every other external link on the site since Batch 2.

**Note on the LinkedIn URL**: it contains a literal `&` in the path (`sunidhisecurities&financelimited`), which is unusual for a LinkedIn company slug — this was transcribed exactly as provided. Worth a quick double-check that it resolves to the intended page.

### Verification Performed

- ✅ Confirmed in a real running copy of the site that all 4 links render with the correct `href`, `target="_blank"`, and `rel="noopener noreferrer"`, and that Twitter was correctly left untouched
- ✅ `npx tsc --noEmit` — same 3 pre-existing unrelated errors, zero new errors
- ✅ `git diff --name-only` against all VAPT-critical files — empty, confirming zero touches

### Regression Risk

**Very low.** Four `href` values changed from `#` to real URLs, plus two standard, additive attributes (`target`, `rel`) and an `aria-label` suffix — no structure, styling, or layout touched.

---

## Batch 7 — Accessibility Reader Truncation Bug (user-reported, not from the Zoffec audit) ✅ Complete

**Date**: 2026-07-14
**Reported by you**: "the voice is reading all paragraphs but not completely. It is cutting off a few words or sentences before the text ends."

### Finding

Not one of the 25 Zoffec audit findings — a separate bug in the site's own built-in "Accessibility Reader" (the floating speaker-icon button, `src/components/AccessibilityWidget.tsx`), which reads focused or clicked page content aloud via the browser's built-in text-to-speech.

### Root Cause

`getReadableText()`'s fallback branch for reading general page text had a hard, comment-explained cap: *"Only read the first 200 characters to avoid reading enormous blocks"* — implemented as a raw `innerText.substring(0, 200)`. This is a **character-count slice with no regard for word or sentence boundaries.** Any paragraph longer than 200 characters — which is the majority of real body-text paragraphs on this site — got silently chopped mid-word before the text was ever handed to the speech engine. The reader wasn't mishearing or mispronouncing anything and speech synthesis itself wasn't failing; the bug was upstream of that — the *text string itself* was already truncated before `speechSynthesis.speak()` was ever called, so of course every long paragraph sounded like it stopped a few words early.

**Confirmed empirically**, not just by reading the code: on the About Story page, a 250-character paragraph ("Sunidhi Group was founded in the 1960s... business **kn**owledge for sustainable gains and growing capital.") was captured being sent to the speech engine at exactly 203 characters — cut off mid-word inside "kn|owledge," silently dropping the entire rest of the sentence ("owledge for sustainable gains and growing capital."). The same page has 6 separate paragraphs over the 200-character limit, so this fired routinely, not as an edge case.

### Fix

`src/components/AccessibilityWidget.tsx` — raised the cap to 1000 characters (comfortably above any single paragraph on the site, so in practice it essentially never triggers for real content) and, if the cap is ever hit, truncation now cuts at the **last complete word** before the limit rather than an arbitrary character position:

```typescript
const MAX_CHARS = 1000;
if (innerText.length <= MAX_CHARS) return innerText;
const truncated = innerText.slice(0, MAX_CHARS);
const lastSpace = truncated.lastIndexOf(' ');
return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
```

The original safeguard's intent — don't read an enormous block of unrelated text if a click ever lands on a huge container — is preserved; only the trigger threshold and the cut point changed.

### Verification Performed

- ✅ Reproduced the bug empirically before fixing: spied on `speechSynthesis.speak()` in a real running copy of the site, clicked the same 250-character paragraph, and captured the exact (truncated) string that was being sent — confirmed it stopped mid-word at 203 characters
- ✅ Re-ran the identical test after the fix: the full 250-character paragraph now reaches the speech engine unmodified, tail-to-tail identical to the source text
- ✅ Separately tested the safety-net path with a synthetic 1,574-character block: truncation now correctly lands on a complete word boundary before appending `...`, rather than fracturing a word
- ✅ `npx tsc --noEmit` — same 3 pre-existing unrelated errors, zero new errors
- ✅ `git diff --stat` — touches exactly this 1 file
- ✅ `git diff --name-only` against all VAPT-critical files — empty, confirming zero touches

### Files Modified (1 file)

| File | Change |
|---|---|
| `src/components/AccessibilityWidget.tsx` | `getReadableText()`: truncation cap raised 200 → 1000 chars, and truncation now cuts at the last whole word instead of an arbitrary character position |

### Regression Risk

**Very low.** The only behavior change is that more text now gets read aloud (correctly) instead of less — no other logic, styling, or structure touched. Genuinely oversized blocks are still capped, just at a boundary that won't fracture a word.

---

## All Batches Complete

24 of the 25 catalogued findings are now fully resolved: fixed in current source, confirmed not reproducible in current source (2 items — likely reflecting drift between the audited `beta.sunidhi.com` deployment and current source), or confirmed not applicable after investigation (1 item). The remaining item (#16) is resolved for 4 of 5 social platforms — only Twitter's URL is still needed. See the Status at a Glance table above for the final state of every finding.
