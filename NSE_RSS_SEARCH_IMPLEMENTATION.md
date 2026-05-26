# NSE RSS Feed — Cross-Stream Search Bar Implementation

## Overview

The `/markets/nse-rss` page aggregates **13 live NSE RSS feed streams** and exposes a
**cross-stream company search bar** that allows users to search for a company name or
ticker symbol and see matching items from every feed simultaneously — rather than having
to switch tabs manually.

The search is **entirely client-side**. All 13 feeds are fetched once on page load
(in parallel), held in React state, and the search filters in-memory using `useMemo`.
There is no additional API call when the user types.

---

## Files Involved

| File | Role |
|---|---|
| `src/app/markets/nse-rss/page.tsx` | Page component — search state, `useMemo` filter, UI rendering |
| `src/lib/nse-aliases.ts` | `COMPANY_ALIASES` map + `expandSearch()` function |
| `src/app/api/nse-feeds/route.ts` | API route — fetches all 13 NSE XML feeds in parallel, returns normalised JSON |

---

## Architecture: Data Flow

```
Page mount
    │
    ▼
fetchFeeds() → GET /api/nse-feeds
    │
    ▼
api/nse-feeds/route.ts
    ├── Reads 13 NSE RSS XML URLs in parallel (Promise.all)
    ├── Parses each via rss-parser (custom fields: pdf_link, attachment_count)
    └── Returns { success: true, feeds: { [feedKey]: { name, items[], count } } }
    │
    ▼
setFeeds(data.feeds)   ← all 13 feeds now in React state
setLastUpdated(now)

User types in search box
    │
    ▼
setSearchTerm(value)
    │
    ▼
useMemo → searchResults recomputed
    ├── expandSearch(searchTerm) → string[]   (original term + alias expansions)
    ├── For each of 13 feeds:
    │       filter items where (title + content).toLowerCase()
    │       includes ANY of the expanded terms  (OR logic)
    └── Returns grouped array: [{ feedConfig, items[] }] | null

Render
    ├── searchTerm empty  → normal tabbed view
    └── searchTerm set    → search results view (grouped by feed, with count badges)
```

---

## The API Route — `src/app/api/nse-feeds/route.ts`

### Feed Sources

All 13 feeds are fetched from the NSE archives domain:

```
https://nsearchives.nseindia.com/content/RSS/<FeedName>.xml
```

| Feed Key | XML Filename |
|---|---|
| `announcements` | `Online_announcements.xml` |
| `annualReports` | `Annual_Reports.xml` |
| `boardMeetings` | `Board_Meetings.xml` |
| `brsr` | `brsr.xml` |
| `corporateAction` | `Corporate_action.xml` |
| `corporateGovernance` | `Corporate_Governance.xml` |
| `dailyBuyback` | `Daily_Buyback.xml` |
| `financialResults` | `Financial_Results.xml` |
| `insiderTrading` | `Insider_Trading.xml` |
| `investorComplaints` | `Investor_Complaints.xml` |
| `offerDocuments` | `Offer_Documents.xml` |
| `shareholdingPattern` | `Shareholding_Pattern.xml` |
| `statementOfDeviation` | `Statement_Of_Deviation.xml` |

### Parser Configuration

The `rss-parser` package is used with two custom NSE-specific fields extracted from
each item:

```typescript
const parser = new Parser({
  customFields: {
    item: [
      ["pdf_link", "pdfLink"],
      ["attachment_count", "attachmentCount"],
    ],
  },
});
```

These map NSE's non-standard XML tags to camelCase fields available on each `FeedItem`.

### Request Modes

The route supports two modes controlled by the `?feed=` query parameter:

| Mode | Trigger | Behaviour |
|---|---|---|
| **All feeds** | No `?feed=` param (default) | Fetches all 13 feeds via `Promise.all`, returns `{ feeds: { [key]: {...} } }` |
| **Single feed** | `?feed=financialResults` etc. | Fetches only that feed, returns `{ items[], count }`. Also accepts `?limit=N` (default 20) |

The page always uses the **all-feeds** mode on load — it fires a single request that
returns everything at once.

### Per-Item Normalised Shape

Each feed item is normalised to a consistent `FeedItem` interface:

```typescript
interface FeedItem {
  id: string;            // "<feedKey>-<index>"
  title: string;
  link: string;
  content: string;       // contentSnippet || content from rss-parser
  pubDate: string;
  isoDate: string;
  feedType: string;      // the feed key, e.g. "financialResults"
  feedName: string;      // human label, e.g. "Financial Results"
  pdfLink?: string | null;
  attachmentCount?: string | null;
}
```

### Error Handling

Each feed is fetched inside its own `try/catch` within the `Promise.all`. If one
feed fails (NSE server down, timeout, malformed XML), it returns
`{ items: [], count: 0, error: "Failed to fetch feed" }` for that stream only.
The other 12 feeds are unaffected. On the UI, failed tabs render with a red
border and an error card instead of a spinner or crash.

---

## State Management — `page.tsx`

```typescript
const [feeds, setFeeds] = useState<Record<string, FeedData>>({});
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState(RSS_FEEDS[0].key); // "announcements"
const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
const [searchTerm, setSearchTerm] = useState("");
```

`searchTerm` is the single source of truth for whether search mode is active.
An empty string means the normal tabbed view is displayed. Any non-empty value
switches the page to the search results view — there is no separate boolean flag.

---

## The `expandSearch` Function — `src/lib/nse-aliases.ts`

This is the core of the search intelligence. It maps what users commonly type
(tickers, abbreviations, short names) to the full strings that actually appear
in NSE feed titles.

### Function Signature

```typescript
export function expandSearch(raw: string): string[]
```

### How It Works

```typescript
export function expandSearch(raw: string): string[] {
  const term = raw.trim().toLowerCase();
  const aliases = COMPANY_ALIASES[term];
  return aliases ? [...new Set([term, ...aliases])] : [term];
}
```

1. Trims and lowercases the raw input
2. Looks up `term` as a key in `COMPANY_ALIASES`
3. If found: returns the original term **plus** all alias expansions (deduplicated via `Set`)
4. If not found: returns just the original term as a single-element array

The returned array is used with **OR logic** in the filter — an item matches if
*any* of the terms appears in its title or content.

### Examples

| User types | `expandSearch()` returns | Why |
|---|---|---|
| `"sbi"` | `["sbi", "state bank of india", "sbi"]` → deduped: `["sbi", "state bank of india"]` | Expands ticker to full name |
| `"infosys"` | `["infosys"]` | Already the full name, no expansion needed |
| `"infy"` | `["infy", "infosys", "infy"]` → deduped: `["infy", "infosys"]` | Expands common ticker |
| `"l&t"` | `["l&t", "larsen", "l&t"]` → deduped: `["l&t", "larsen"]` | Handles special characters |
| `"hdfc"` | `["hdfc"]` | Generic — matches anything with "hdfc" in the title |
| `"xyz unknown"` | `["xyz unknown"]` | No alias — literal substring match only |

### The `COMPANY_ALIASES` Map

The alias map covers ~500+ entries across the NSE 500 universe, organised by sector:

- Nifty 50 (all constituents)
- Nifty Next 50
- IT & Tech
- Pharma & Healthcare
- Auto & Auto Ancillaries
- FMCG & Consumer
- Chemicals
- Infrastructure & Real Estate
- Power & Energy
- Telecom & Media
- Oil & Gas
- Metals & Mining
- Cement
- Insurance
- Finance / NBFC / MFI
- Railways & Defence
- Logistics & Shipping
- Textile & Apparel
- Hospitality & Travel
- Agriculture & Food Processing
- Diversified & Others
- REITs

**Key rules enforced in the map:**

| Rule | Reason |
|---|---|
| All keys are lowercase | `expandSearch` lowercases input before lookup — case mismatch would cause a miss |
| Keys starting with a digit must be quoted (`"360one"`) | Unquoted numeric-start keys are a JavaScript syntax error |
| No duplicate keys | TypeScript throws a build error (`Duplicate identifier`) if a key appears twice |
| Values are arrays of lowercase substrings | Checked with `.includes()` against the lowercased `title + content` haystack |

---

## The `useMemo` Filter — Client-Side Search Logic

```typescript
const searchResults = useMemo(() => {
  if (!searchTerm.trim()) return null;

  const terms = expandSearch(searchTerm); // e.g. ["sbi", "state bank of india"]

  return RSS_FEEDS.flatMap((feedConfig) => {
    const items = (feeds[feedConfig.key]?.items ?? []).filter((item) => {
      const haystack = (item.title + " " + (item.content ?? "")).toLowerCase();
      return terms.some((t) => haystack.includes(t));
    });
    return items.length > 0 ? [{ feedConfig, items }] : [];
  });
}, [searchTerm, feeds]);
```

### Dependency Array

`useMemo` recomputes when either `searchTerm` or `feeds` changes:
- `searchTerm` changes on every keystroke
- `feeds` changes only once (on page load) or when the user clicks "Refresh Feeds"

This means search filtering is effectively free after page load — no debouncing
or async work is needed.

### The Haystack

Each item is matched against a combined string:
```
item.title + " " + item.content
```
Both are lowercased before comparison. The space separator prevents a title ending
in "hdfc" accidentally matching content starting with "bank" as "hdfcbank".

### OR Logic Across Expanded Terms

```typescript
return terms.some((t) => haystack.includes(t));
```

`terms.some()` means: include this item if **at least one** expanded term appears
in the haystack. For `sbi`, this checks for both `"sbi"` and `"state bank of india"`,
so items titled "SBI Life" (matches "sbi") and items titled "State Bank of India FY26"
(matches "state bank of india") both appear in results.

### Output Shape

```typescript
// searchResults is null when search is empty (shows tabbed view)
// searchResults is [] when there are no matches (shows empty state card)
// searchResults is [{ feedConfig, items }] when matches found

const totalSearchHits = searchResults?.reduce((n, g) => n + g.items.length, 0) ?? 0;
```

---

## UI: Two Render Modes

The page renders one of three states based on `loading` and `searchResults`:

```typescript
loading             → full-page spinner
searchResults !== null → Search Results View
searchResults === null → Normal Tabbed View
```

### Search Input (Hero Section)

```tsx
<input
  type="text"
  placeholder="Company name, e.g. Reliance, Infosys…"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

- Controlled input bound directly to `searchTerm` state
- No debounce — `useMemo` is synchronous and fast enough on typical feed sizes
- A "Clear" button (`X`) appears conditionally only when `searchTerm` is non-empty
- A second "Clear search" link appears in the results header for discoverability

### Search Results View

When `searchResults !== null`:

- Header shows: `Results for "sbi"` with subtitle `12 results across 4 feeds`
- Results are **grouped by feed**, each group preceded by a feed icon + name badge + count pill
- Items within each group are rendered as the same `Card` component used in the tabbed view
- Empty state: single card with `Search` icon and "No results found for X"

### Normal Tabbed View (default)

When `searchResults === null`:

- 13 tab buttons rendered horizontally (scrollable on mobile)
- Active tab: `bg-primary-600 text-white`
- Error tab: red border + `bg-red-50` styling
- Each tab shows a live count badge from `feeds[key].count`
- Tab content renders items for `activeTab` only

---

## Refresh Feeds

```tsx
<Button onClick={fetchFeeds} disabled={loading}>
  {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
  {loading ? "Refreshing..." : "Refresh Feeds"}
</Button>
```

Clicking Refresh calls `fetchFeeds()` again, which re-fetches all 13 feeds from NSE.
The `lastUpdated` timestamp is updated on each successful refresh.

If a search is active when the user refreshes, the `useMemo` recomputes automatically
because `feeds` (a dependency) changes — results update without the user needing to
retype.

---

## Raw XML Feed Link

Each tab in the normal view shows a "View Raw XML Feed" link:

```typescript
href={`https://nsearchives.nseindia.com/content/RSS/${NSE_XML_URL[activeTab]}.xml`}
```

The `NSE_XML_URL` map on the frontend mirrors the route map in the API:

```typescript
const NSE_XML_URL: Record<string, string> = {
  announcements: "Online_announcements",
  financialResults: "Financial_Results",
  // ...
};
```

This link opens the raw NSE XML in a new tab and is intended for users who want to
subscribe to a feed in an RSS reader.

---

## How to Add a New Company Alias

Open `src/lib/nse-aliases.ts` and add a new entry to `COMPANY_ALIASES`:

```typescript
// Single alias (ticker → full name):
newco: ["new company name as it appears in nse title"],

// Multiple expansions (short form + ticker + full name):
abc: ["abc corporation", "abc corp", "a b c limited"],

// Key with special characters — must be quoted:
"a&b": ["a and b corporation"],

// Key starting with a digit — must be quoted:
"3mindia": ["3m india"],
```

**Rules checklist:**
- [ ] Key is all lowercase
- [ ] Key does not already exist in the file (TypeScript will error on duplicates)
- [ ] Key is quoted if it starts with a digit or contains special characters
- [ ] Values are lowercase substrings that would appear in an NSE feed title
- [ ] After editing, run `npm run build` to catch any duplicate-key TypeScript errors
- [ ] Restart: `pm2 restart sunidhi-web`

No API or database changes are needed — the file is imported directly by the page.

---

## Performance Characteristics

| Concern | Detail |
|---|---|
| **Network requests** | 1 request on page load (all 13 feeds). No additional requests during search. |
| **Search latency** | Zero async latency — `useMemo` runs synchronously in the same render cycle as the keystroke |
| **Feed size** | Each NSE feed typically returns 20–50 items. Total in-memory: ~650 items across 13 feeds |
| **Alias lookup** | O(1) — plain object key lookup in `COMPANY_ALIASES` |
| **Filter pass** | O(n × m) where n = total items (~650) and m = expanded terms (usually 2–3). Negligible. |
| **Debounce** | Not implemented — not needed given the synchronous filter size. Could be added if feed sizes grow significantly. |

---

## Known Limitations

| Limitation | Notes |
|---|---|
| **Exact key match only** | `expandSearch` does exact key lookup. Typing `"relianc"` (typo) will not match the `reliance` alias — it falls back to literal substring, so it still finds items with "relianc" in the title. |
| **Single-word lookup** | `COMPANY_ALIASES` keys are single words or short phrases. Multi-word input (e.g. `"bajaj finance"`) has no key entry and falls back to literal substring matching. |
| **No partial alias match** | If the user types `"bajaj fin"`, it won't hit the `bajajfin` key. They need to type the exact key. |
| **NSE feed availability** | The feeds are served by NSE's CDN. If NSE's servers are down or rate-limiting, individual feeds may fail — handled gracefully per-feed. |
| **No caching** | Each page load / refresh re-fetches from NSE. There is no server-side caching layer. Adding `Cache-Control` or an in-memory TTL cache to the API route would reduce NSE load. |
