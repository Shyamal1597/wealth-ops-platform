# Accessibility Guidelines — Read This Before Building Any New Page or Component

**Target standard: WCAG 2.2, Level AA.** Confirmed against the source SEBI circulars (`enable - SEBIDeck_pvt circulation Dec 2025.pdf`, `sebi circular dated -8th dec 2025.pdf`, both in the project owner's Downloads, extracted to `scripts/pdf-output.txt`): SEBI's mandate text is **"WCAG 2.1 or the latest version," AA level** — deliberately not pinned to a version number, and SEBI's own reporting template (Annexure B) asks whether each platform meets "**AA level as per latest WCAG guidelines**." WCAG 2.2 is the current W3C Recommendation (published 12 December 2024, does not deprecate or supersede 2.1) — verified live at the canonical URL below. Building to 2.2 AA satisfies SEBI's requirement and is the most future-proof choice.

- **Canonical spec**: https://www.w3.org/TR/WCAG22/
- **Quick-reference (techniques, examples)**: https://www.w3.org/WAI/WCAG22/quickref/
- Also required alongside WCAG by SEBI: **IS 17802:2021** (India's ICT accessibility standard) and **GIGW 3.0** (Government of India website guidelines) — both broadly align with WCAG's substance, so building to WCAG 2.2 AA covers the overwhelming majority of both.

This file exists because a full external audit (~100 findings across 29 pages) turned up the same handful of root causes over and over. The rules below are written specifically to stop those from recurring — treat this as a pre-flight checklist for any new page, component, or dashboard in this codebase, not a WCAG textbook.

---

## The recurring bugs — check these first, every time

### 1. Heading hierarchy — watch `CardTitle`

`src/components/ui/card.tsx`'s `CardTitle` **hardcodes `<h3>`** with no way to override it. This caused a flat/skipped heading structure (H1 → H3 → H3 → H3...) on more than a dozen pages, because `CardTitle` was used for top-level section headings with no real `<h2>` anywhere on the page.

- **Rule**: a page's headings must be strictly sequential — one `<h1>` (page title), `<h2>` for each major section, `<h3>` only nested under a real `<h2>`, never skipping a level.
- **If a section heading needs `CardTitle`'s styling but must be an `<h2>`**: don't use `CardTitle`. Use a plain heading with its exact default classes instead:
  ```tsx
  <h2 className="text-2xl font-semibold leading-none tracking-tight">Section Title</h2>
  ```
  (Add any extra classes the specific `CardTitle` instance had — icon-flex layout, color accents, etc.)
- **Do not modify `CardTitle` itself** — it's shared, and some pages may already nest it correctly under a real H2. Fix the *page*, not the shared component.
- Before shipping: read the actual rendered heading list top to bottom (`document.querySelectorAll('h1,h2,h3,h4,h5,h6')` in a live check) and confirm no level is skipped.

### 2. Color contrast — don't trust a Tailwind shade by eye

Every contrast failure this session was a case of a lighter shade token (`-500`, `-600`) being used with white text, when only `-700` or darker actually cleared 4.5:1. Examples that failed: `bg-amber-600 text-white` (3.18:1), `bg-amber-500 text-white` (2.15:1).

- **Normal text** (under ~18pt regular / ~14pt bold): needs **4.5:1** against its background.
- **Large text** (≥18pt/24px regular, or ≥14pt/18.66px **bold**): needs **3:1**.
- **UI component boundaries and focus indicators** (buttons, input borders, focus rings): need **3:1** against adjacent colors (WCAG 1.4.11).
- **Don't guess.** Compute the real ratio from the actual hex values using the WCAG relative-luminance formula, or check against a known-good pairing already used elsewhere in this codebase (`bg-primary-600`/`bg-primary-700` text-white pairings have been verified compliant repeatedly). When in doubt, `-700` or darker is a safe floor for white text on a saturated brand color.
- **Focus rings on colored backgrounds**: on the site's red `primary-600` background (header top bar, hero sections), a same-hue ring (e.g. `focus:ring-primary-600`) is nearly invisible. Use `focus-visible:ring-white` (the established convention elsewhere in `Header.tsx`) or another genuinely high-contrast color instead — never assume a ring color that works on white also works on a colored background.

### 3. Decorative vs. meaningful — icons and images

- Every icon sitting next to text that already says the same thing (most `lucide-react` icons in this codebase) → `aria-hidden="true"`. This was missed constantly — check every new icon you add.
- An icon that **is** the entire content of a control (icon-only button) → the control needs `aria-label`, and the icon itself still gets `aria-hidden="true"`.
- An `<Image>`/`<img>` whose content is already fully described by adjacent visible text (e.g. a preview thumbnail next to a title+description) → `alt="" aria-hidden="true"`, don't duplicate the text into `alt` too.
- A meaningful image (a real photo, a chart, a screenshot that IS the content) → a real, specific `alt` — not the filename, not generic text.

### 4. Links and buttons need names that make sense out of context

A screen reader user often scans a page by pulling up a list of just the links/buttons — if every one says "View" or "Download" with no context, that list is useless.

- **Never** ship a `.map()`-generated list of "Download"/"View" links without a per-item descriptive `aria-label`:
  ```tsx
  aria-label={`Download ${item.title} PDF (opens in a new tab)`}
  ```
  This bit us on every PDF-heavy page in the codebase (Legal documents, Downloads & Forms, Daily Updates, NSE RSS feed cards) — one missed `aria-label` in a `.map()` loop means *every* row in that list is broken, not just one.
- Links/buttons that open a new tab (`target="_blank"`) should say so in their accessible name.
- **Multi-element cards** (a title link + a separate description paragraph + a separate action button, e.g. an announcement/news card): if the description sits as plain unlinked text between two links, a keyboard user tabbing through never hears it. Give the description an `id` and reference it from the title link via `aria-describedby` so the full context is announced:
  ```tsx
  <a href={item.link} aria-describedby={`desc-${item.id}`}>{item.title}</a>
  <p id={`desc-${item.id}`}>{item.description}</p>
  ```

### 5. Semantic structure — no div-soup for lists or key/value data

- Anything that's visually a list → `<ul>`/`<li>`, not a stack of `<div>`s.
- Value/label pairs (stats grids, contact info, spec sheets) → `<dl>`/`<dt>`/`<dd>`, not two adjacent `<div>`s or an `<h3>`+`<p>` pair.

### 6. Dynamic and moving content needs an accessible equivalent

- **Any content that updates without a page reload and conveys real information** (session sign-in/out state, a rotating testimonial/carousel, live search result counts) needs `aria-live="polite"` on the region that changes, or screen reader users never learn it changed.
- **Any auto-advancing carousel/slideshow** (interval-driven `setInterval`) needs a visible, clearly-labeled pause/stop control (WCAG 2.2.2) — and make it an obvious, adequately-sized control (≥24×24px effective target, ideally with a visible text label, not just a tiny icon crammed next to unrelated dots — a cramped icon-only pause button was reported as "unnatural" and hard to find in practice).
- **Non-text status info** (a star rating, a progress indicator) needs a text equivalent for non-visual users — e.g. a visually-hidden `<span className="sr-only">Rated 4 out of 5 stars</span>` alongside the visual stars.

### 7. Keyboard operability

- Prefer native `<button>`/`<a>` over `<div onClick>` — native elements get keyboard operability for free.
- **Never nest interactive elements** (`<a><button>...</button></a>`). If you need button styling on something that's really a link (or vice versa), use the shared `Button` component's `asChild` prop (Radix Slot pattern) to merge styles onto the real element instead of wrapping one interactive element in another.
- For custom interactive widgets, add an explicit `onKeyDown` handler for Enter/Space as a defensive measure, even on native `<button>`s where it's technically redundant — it's cheap insurance and was added to the site's floating accessibility-widget toggle for exactly this reason.
- **Focus order must match visual/reading order.** A `flex-wrap` layout that wraps unpredictably at certain viewport widths can put focusable elements in a DOM-order-vs-visual-order mismatch (this happened with the desktop nav wrapping to two lines while CTA buttons stayed vertically centered against both lines). When building responsive nav/toolbar components: measure the actual required width against the actual available width at your target breakpoints (don't eyeball it), and prefer *not* wrapping at all — fall back to a mobile/hamburger pattern below whatever breakpoint can't fit everything on one line, rather than letting a multi-item row wrap.

### 8. Focus management on client-side navigation

Next.js client-side routing does **not** move keyboard focus on its own, including on browser Back/Forward — a keyboard/screen-reader user gets no indication of where they landed. This project's fix (`src/components/RouteFocusManager.tsx`, mounted in `src/app/layout.tsx`) moves focus to the new page's `<h1>` on every route change after the first load.

- **If you touch this pattern**: always call `target.focus({ preventScroll: true })`, never bare `.focus()`. Without `preventScroll`, focusing the element scrolls it into view, which silently defeats the browser's native scroll-position restoration on Back/Forward navigation — every "back" press would jump to the top of the page instead of restoring where the user was.

### 9. Reflow and text spacing

- Content must be usable at **320 CSS px width** without introducing horizontal scrolling (WCAG 1.4.10), except for content that inherently requires 2D layout (data tables, complex images).
- Content must survive the WCAG 1.4.12 text-spacing stress test without clipping or overlapping: line-height ≥1.5×, paragraph spacing ≥2× font size, letter-spacing ≥0.12×, word-spacing ≥0.16×. Test by injecting this stylesheet and checking for new `scrollWidth`/clipping, not by eyeballing a screenshot:
  ```css
  * { line-height:1.5!important; letter-spacing:0.12em!important; word-spacing:0.16em!important; }
  p,li,dt,dd,h1,h2,h3,h4,h5,h6 { margin-bottom:2em!important; }
  ```

### 10. Every page needs a real, unique title

- Server components: `export const metadata: Metadata = { title: "...", description: "..." }`.
- **Client components (`"use client"` pages) cannot export `metadata`.** Pair them with a minimal server-component `layout.tsx` sibling in the same route folder:
  ```tsx
  import type { Metadata } from "next";
  export const metadata: Metadata = { title: "Page Title" };
  export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
  }
  ```
  This bit 13 routes in this codebase at once (`dashboard`, `client/profile`, `feedback`, `register`, several `admin/*` pages) — they were all silently rendering the homepage's title because nothing exported metadata for them.
- The root layout applies a title template (`"%s | Sunidhi Securities"`) — pass a plain string as the page's own title, don't re-include the brand name yourself or it'll double up.

### 11. Target size

Interactive controls need at least a 24×24 CSS px effective touch target (WCAG 2.5.8) — padding counts toward this, margin does not. A 20×20px icon with `p-2` (8px) padding on all sides clears this (36×36px effective); a bare 20×20px icon with no padding does not.

---

## Before shipping any new page or dashboard — quick checklist

1. **Headings**: read the rendered heading list top-to-bottom; confirm exactly one `<h1>` and no skipped levels. Watch for `CardTitle` used as a top-level heading.
2. **Contrast**: check every distinct text/background and UI-boundary color pairing against 4.5:1 (normal text) / 3:1 (large text, UI components, focus rings) — especially any white-text-on-brand-color combination.
3. **Tab through the whole page** with only the keyboard. Confirm tab order matches visual order, every interactive element is reachable and operable, and focus is always visible.
4. **Icons and images**: every decorative icon has `aria-hidden="true"`; every icon-only control has `aria-label`; every meaningful image has a real `alt`.
5. **Links/buttons in a list**: if there's more than one on the page with the same generic label ("View", "Download", "Edit"), each needs a specific `aria-label`.
6. **Dynamic content**: anything that updates without a reload and matters (state changes, carousels, live counts) has an `aria-live` region or an equivalent announcement mechanism.
7. **Auto-moving content** has a visible, adequately-sized pause control.
8. **Page has a unique title** (`metadata.title`, or a `layout.tsx` sibling if it's a client component).
9. **Reflow**: resize to 320–375px width and confirm no horizontal scrolling is introduced.
10. **New responsive nav/toolbar layouts**: measure actual content width vs. available width at every target breakpoint before assuming it fits on one line.

If a new page reuses existing shared components (`Card`/`CardTitle`, `Button`, `Header`, `Footer`) exactly as they're already used elsewhere in a *working, audited* page, most of this is already handled — the failures above came from copying an old, never-audited pattern (a monolithic page built before any of this was fixed) or introducing something genuinely new (a new carousel, a new upload list, a new nav layout).

---

*Background: this document was written after remediating a full external WCAG 2.2 AA audit (~100 findings across 29 pages) commissioned per SEBI's digital accessibility circulars. Full history, root-cause investigations, and verification methodology for that remediation are in `SHEET_BY_SHEET_REMEDIATION_LOG.md`. This file is the forward-looking distillation of that work — read it before building, not just when fixing.*
