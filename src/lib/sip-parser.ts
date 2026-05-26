/**
 * SIP Report Parser — PDF (rebalancing + performance) and Excel/CSV
 *
 * Two PDF types are handled:
 *   Rebalancing  — "Date DD-MM-YYYY" header + "STOCK DETAILS" table
 *   Performance  — "SIP Product - Rs. X/-" header + "Individual Stock Performance"
 *
 * Both types work on concatenated text (no newlines) as well as
 * cleanly-formatted text, since pdf-parse output varies by PDF generator.
 */

// ─── Rebalancing report types ────────────────────────────────────────────────

export interface SipHolding {
  stock: string;
  currentPrice: number;
  recommendedWeight: number;
  recommendedAmount: number;
  recommendedQty: number;
  currentQty: number;
  transactionQty: number;
  action: string;
}

export interface SipTierParsed {
  date: string;           // DD-MM-YYYY
  additionalCapital: number;
  numberOfStocks: number;
  sectorsExcluded: string;
  totalValue: number;
  holdings: SipHolding[];
}

export interface ParsedSipReport {
  type: 'rebalancing';
  profile: string;        // 'conservative' | 'moderate' | 'aggressive'
  tiers: Record<string, SipTierParsed>;  // key = additionalCapital.toString()
}

// ─── Performance report types ────────────────────────────────────────────────

export interface PerformanceMetrics {
  totalInvested: number;
  currentValue: number;
  unrealizedGains: number;
  benchmarkTotalInvested: number;
  benchmarkCurrentValue: number;
  benchmarkUnrealizedGains: number;
  cumulativeReturn: number;
  benchmarkCumulativeReturn: number;
  timeWeightedReturnNonAnnualized: number;
  benchmarkTWRNonAnnualized: number;
  annualizedTWR: number;
  benchmarkAnnualizedTWR: number;
  moneyWeightedReturnAnnualized: number;
  benchmarkMWRAnnualized: number;
  moneyWeightedReturnNonAnnualized: number;
  benchmarkMWRNonAnnualized: number;
  investmentPeriod: number;
  portfolioTurnover: number;
}

export interface StockPerformanceEntry {
  stock: string;
  totalShares: number;
  investedValue: number;
  currentPrice: number;
  avgPurchasePrice: number;
  currentValue: number;
  cumulativeReturn: number;
}

export interface RealizedGainEntry {
  company: string;
  longTermGain: number;
  shortTermGain: number;
}

export interface CapitalMovementEntry {
  date: string;
  netInjection: number;
  cumulativeCapital: number;
}

export interface PerformanceTierParsed {
  additionalCapital: number;
  performance: PerformanceMetrics;
  stockPerformance: StockPerformanceEntry[];
  realizedGains: RealizedGainEntry[];
  capitalMovement: CapitalMovementEntry[];
}

export interface ParsedPerformanceReport {
  type: 'performance';
  profile: string;
  tiers: Record<string, PerformanceTierParsed>;
}

export type AnyParsedReport = ParsedSipReport | ParsedPerformanceReport;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function parseNum(s: string | number): number {
  return parseFloat((s ?? '').toString().replace(/,/g, '').trim()) || 0;
}

function normalizeProfile(s: string): string {
  return (s ?? '').trim().toLowerCase();
}

/** Convert Excel date serial (e.g. 46136) to DD-MM-YYYY. */
function excelSerialToDate(serial: number): string {
  const d = new Date((serial - 25569) * 86400 * 1000);
  const dd = d.getUTCDate().toString().padStart(2, '0');
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  return `${dd}-${mm}-${d.getUTCFullYear()}`;
}

/** Accept "06-04-2026" or an Excel serial (46136). */
function parseDate(val: string | number): string {
  const n = typeof val === 'number' ? val : parseFloat(String(val));
  if (!isNaN(n) && n > 40000) return excelSerialToDate(n);
  return String(val).trim();
}

/**
 * Extract the text that lies between two regex patterns.
 * Returns everything after the start match up to (not including) the end match.
 */
function extractBetween(text: string, startRe: RegExp, endRe: RegExp): string {
  const sm = startRe.exec(text);
  if (!sm) return '';
  const after = text.slice(sm.index + sm[0].length);
  const em = endRe.exec(after);
  return em ? after.slice(0, em.index) : after;
}

// ─── PDF type detection ───────────────────────────────────────────────────────

/**
 * Sniff the PDF text to decide which parser to use.
 * Performance PDFs contain "Individual Stock Performance" and
 * "Comparative Performance Metrics"; rebalancing PDFs have "STOCK DETAILS"
 * and a "Date DD-MM-YYYY" header.
 */
export function detectSipPdfType(text: string): 'rebalancing' | 'performance' | 'unknown' {
  if (
    /Individual\s+Stock\s+Performance/i.test(text) &&
    /Comparative\s+Performance\s+Metrics/i.test(text)
  ) return 'performance';

  if (/STOCK\s+DETAILS/i.test(text) && /Date\s+\d{2}-\d{2}-\d{4}/i.test(text)) {
    return 'rebalancing';
  }

  return 'unknown';
}

// ─── Rebalancing PDF parser ───────────────────────────────────────────────────

/**
 * Parse text extracted from a rebalancing PDF.
 *
 * Works with both:
 *   • cleanly formatted text (one field per line)
 *   • concatenated text with no line breaks (common with certain PDF generators)
 *
 * Each tier section starts with "Date DD-MM-YYYY".
 */
export function parseSipPdfText(text: string): ParsedSipReport {
  const result: ParsedSipReport = { type: 'rebalancing', profile: '', tiers: {} };

  // Split into per-tier blocks at each "Date DD-MM-YYYY" occurrence
  const blocks = text.split(/(?=Date\s+\d{2}-\d{2}-\d{4})/);

  for (const block of blocks) {
    if (!/STOCK\s*DETAILS/i.test(block)) continue;

    // ── Metadata ──────────────────────────────────────────────────────────────
    const dateMatch    = block.match(/Date\s+(\d{2}-\d{2}-\d{4})/);
    const capitalMatch = block.match(/Additional\s+Capital\s+[₹\s]*([\d,]+\.?\d*)/i);
    const stocksMatch  = block.match(/Number\s+of\s+stocks\s+(\d+)/i);
    // Sectors: capture up to next known keyword (works with and without newlines)
    const sectorsMatch = block.match(
      /Sectors\s+Excluded\s+(.*?)(?=\s*(?:Risk\s*Profile|Market\s*Cap|STOCK\s*DETAILS))/i
    );
    const profileMatch = block.match(/Risk\s+Profile\s*(Conservative|Moderate|Aggressive)/i);
    // Total portfolio value — first "Total" followed by a number in the block
    const totalMatch   = block.match(/\bTotal\b\s+([\d,]+\.?\d*)/);

    if (!dateMatch || !capitalMatch || !profileMatch) continue;

    const date              = dateMatch[1];
    const additionalCapital = parseNum(capitalMatch[1]);
    const numberOfStocks    = stocksMatch ? parseInt(stocksMatch[1]) : 0;
    const sectorsExcluded   = sectorsMatch ? sectorsMatch[1].trim() : '';
    const profile           = normalizeProfile(profileMatch[1]);
    const totalValue        = totalMatch ? parseNum(totalMatch[1]) : 0;
    if (!result.profile) result.profile = profile;

    const holdings = extractHoldingsFromBlock(block);

    const tierKey = additionalCapital.toString();
    result.tiers[tierKey] = {
      date,
      additionalCapital,
      numberOfStocks,
      sectorsExcluded,
      totalValue,
      holdings,
    };
  }

  return result;
}

/**
 * Extract holding rows from a single tier block using a global regex.
 * This approach is immune to missing/inconsistent line breaks.
 */
function extractHoldingsFromBlock(block: string): SipHolding[] {
  // Locate the "STOCK DETAILS" header, then find "ACTION" (end of column headers)
  const sdIdx = block.search(/STOCK\s*DETAILS/i);
  if (sdIdx === -1) return [];

  const afterSd   = block.slice(sdIdx);
  const actionRe  = /\bACTION\b/i.exec(afterSd);
  const start     = sdIdx + (actionRe ? actionRe.index + actionRe[0].length : 0);

  // Everything from start up to "Total <number>" (the portfolio totals row)
  const tail       = block.slice(start);
  const totalMatch = /\bTotal\b\s+[\d,]/.exec(tail);
  const section    = totalMatch ? tail.slice(0, totalMatch.index) : tail;

  // Global match: StockName  price  weight  amount  recQty  curQty  transQty  Action
  const re = /([A-Za-z][A-Za-z0-9 &'.,()/-]*?)\s+([\d,]+\.?\d*)\s+([\d.]+)\s+([\d,]+\.?\d*)\s+(\d+)\s+(\d+)\s+(\d+)\s+(Buy|Sell|Hold)/gi;

  const holdings: SipHolding[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    holdings.push({
      stock:              m[1].trim(),
      currentPrice:       parseNum(m[2]),
      recommendedWeight:  parseNum(m[3]),
      recommendedAmount:  parseNum(m[4]),
      recommendedQty:     parseInt(m[5]),
      currentQty:         parseInt(m[6]),
      transactionQty:     parseInt(m[7]),
      action:             m[8].charAt(0).toUpperCase() + m[8].slice(1).toLowerCase(),
    });
  }

  return holdings;
}

// ─── Performance PDF parser ───────────────────────────────────────────────────

/**
 * Parse text from a monthly performance / portfolio review PDF.
 *
 * These reports contain, per tier:
 *   • Comparative Performance Metrics table
 *   • Individual Stock Performance table
 *   • Realized Gains (Booked Trades) table
 *   • Net Capital Movement table
 */
export function parseSipPerformancePdfText(text: string): ParsedPerformanceReport {
  const result: ParsedPerformanceReport = { type: 'performance', profile: '', tiers: {} };

  // Each tier section starts with e.g. "Moderate SIP Product - Rs. 50,000/-"
  const blocks = text.split(
    /(?=(?:Conservative|Moderate|Aggressive)\s+SIP\s+Product\s+-\s+Rs\.)/i
  );

  for (const block of blocks) {
    const headerMatch = block.match(
      /^(Conservative|Moderate|Aggressive)\s+SIP\s+Product\s+-\s+Rs\.\s*([\d,]+)\/-/i
    );
    if (!headerMatch) continue;

    const profile           = normalizeProfile(headerMatch[1]);
    const additionalCapital = parseNum(headerMatch[2]);
    if (!result.profile) result.profile = profile;

    // ── Helper: regex exec on the block ─────────────────────────────────────
    const pm = (re: RegExp) => re.exec(block);

    // ── Comparative Performance Metrics ──────────────────────────────────────
    // Each metric row: "Label portfolio% benchmark%" — capture both columns
    const tiM    = pm(/Total Invested \(INR\)\s+([\d.]+)\s+([\d.]+)/);
    const cvM    = pm(/Current Value \(INR\)\s+([\d.]+)\s+([\d.]+)/);
    const ugM    = pm(/Unrealized Gains \(INR\)\s+(-?[\d.]+)\s+(-?[\d.]+)/);
    const crM    = pm(/Cumulative Return \(%\)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    const twrM   = pm(/Time-Weighted Return \(Non-Annualized\) \(%\)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    const atwrM  = pm(/Annualized Time-Weighted Return \(%\)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    const mwrAM  = pm(/Money-Weighted Return \(Annualized\) \(%\)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    const mwrNM  = pm(/Money-Weighted Return \(Non-Annualized\) \(%\)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
    const ipM    = pm(/Investment Period \(Years\)\s+([\d.]+)/);
    const ptM    = pm(/Portfolio Turnover \(%\)\s+([\d.]+)%/);

    const performance: PerformanceMetrics = {
      totalInvested:                    parseNum(tiM?.[1]   ?? '0'),
      benchmarkTotalInvested:           parseNum(tiM?.[2]   ?? '0'),
      currentValue:                     parseNum(cvM?.[1]   ?? '0'),
      benchmarkCurrentValue:            parseNum(cvM?.[2]   ?? '0'),
      unrealizedGains:                  parseNum(ugM?.[1]   ?? '0'),
      benchmarkUnrealizedGains:         parseNum(ugM?.[2]   ?? '0'),
      cumulativeReturn:                 parseFloat(crM?.[1]  ?? '0'),
      benchmarkCumulativeReturn:        parseFloat(crM?.[2]  ?? '0'),
      timeWeightedReturnNonAnnualized:  parseFloat(twrM?.[1] ?? '0'),
      benchmarkTWRNonAnnualized:        parseFloat(twrM?.[2] ?? '0'),
      annualizedTWR:                    parseFloat(atwrM?.[1] ?? '0'),
      benchmarkAnnualizedTWR:           parseFloat(atwrM?.[2] ?? '0'),
      moneyWeightedReturnAnnualized:    parseFloat(mwrAM?.[1] ?? '0'),
      benchmarkMWRAnnualized:           parseFloat(mwrAM?.[2] ?? '0'),
      moneyWeightedReturnNonAnnualized: parseFloat(mwrNM?.[1] ?? '0'),
      benchmarkMWRNonAnnualized:        parseFloat(mwrNM?.[2] ?? '0'),
      investmentPeriod:                 parseFloat(ipM?.[1]  ?? '0'),
      portfolioTurnover:                parseFloat(ptM?.[1]  ?? '0'),
    };

    // ── Individual stock performance ─────────────────────────────────────────
    const stockPerfSection = extractBetween(
      block, /Individual\s+Stock\s+Performance/i, /Realized\s+Gains/i
    );
    const stockPerformance = parseStockPerformance(stockPerfSection);

    // ── Realized gains ───────────────────────────────────────────────────────
    const realizedSection = extractBetween(
      block, /Realized\s+Gains\s+\(Booked\s+Trades\)/i, /Net\s+Capital\s+Movement/i
    );
    const realizedGains = parseRealizedGains(realizedSection);

    // ── Capital movement ─────────────────────────────────────────────────────
    const capitalSection = extractBetween(
      block, /Capital\s+Movement\s+Overview/i, /Corporate\s+Cash\s+Payouts/i
    );
    const capitalMovement = parseCapitalMovement(capitalSection);

    const tierKey = additionalCapital.toString();
    result.tiers[tierKey] = {
      additionalCapital,
      performance,
      stockPerformance,
      realizedGains,
      capitalMovement,
    };
  }

  return result;
}

/**
 * Parse the Individual Stock Performance section.
 * Pattern: StockName  totalShares  investedValue  currentPrice  avgPurchasePrice  currentValue  cumulativeReturn%
 */
function parseStockPerformance(text: string): StockPerformanceEntry[] {
  const entries: StockPerformanceEntry[] = [];
  const re = /([A-Za-z][A-Za-z0-9 &'.,()/-]*?)\s+(\d+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+(-?[\d.]+)%/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    entries.push({
      stock:            m[1].trim(),
      totalShares:      parseInt(m[2]),
      investedValue:    parseNum(m[3]),
      currentPrice:     parseNum(m[4]),
      avgPurchasePrice: parseNum(m[5]),
      currentValue:     parseNum(m[6]),
      cumulativeReturn: parseFloat(m[7]),
    });
  }
  return entries;
}

/**
 * Parse the Realized Gains (Booked Trades) section.
 * Pattern: CompanyName  longTermGain  shortTermGain
 * Uses \.\d{2} (exact 2 dp) to prevent consuming digits of the next company name.
 */
function parseRealizedGains(text: string): RealizedGainEntry[] {
  const entries: RealizedGainEntry[] = [];
  const re = /([A-Za-z][A-Za-z0-9 &'.,()/-]*?)\s+(-?[\d,]+\.\d{2})\s+(-?[\d,]+\.\d{2})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    entries.push({
      company:       m[1].trim(),
      longTermGain:  parseNum(m[2]),
      shortTermGain: parseNum(m[3]),
    });
  }
  return entries;
}

/**
 * Parse the Capital Movement Overview section.
 * Pattern: DD-MM-YYYY  netInjection  cumulativeCapital
 * Uses \.\d{2} to avoid overreading into adjacent dates.
 */
function parseCapitalMovement(text: string): CapitalMovementEntry[] {
  const entries: CapitalMovementEntry[] = [];
  const re = /(\d{2}-\d{2}-\d{4})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    entries.push({
      date:              m[1],
      netInjection:      parseNum(m[2]),
      cumulativeCapital: parseNum(m[3]),
    });
  }
  return entries;
}

// ─── CSV / Excel Row Parser ───────────────────────────────────────────────────

/** Parse a percentage cell that may be a raw decimal (0.06) or a number (6.0). */
function parsePct(val: string | number): number {
  const n = parseFloat(String(val).replace('%', '').trim());
  if (isNaN(n)) return 0;
  // Excel stores percentages as decimals (0.06 = 6%). Values < 2 assumed decimal.
  return Math.abs(n) < 2 ? n * 100 : n;
}

/**
 * Sniff whether a 2-D row array is a performance or rebalancing sheet.
 * Performance sheets have a "Comparative Performance Metrics" or
 * "Individual Stock Performance" header in any cell.
 */
function isPerformanceSheet(rows: (string | number)[][]): boolean {
  for (const row of rows) {
    for (const cell of row) {
      const s = String(cell);
      if (
        /Comparative\s+Performance\s+Metrics/i.test(s) ||
        /Individual\s+Stock\s+Performance/i.test(s)
      ) return true;
    }
  }
  return false;
}

/**
 * Parse a performance-format Excel / CSV (Comparative Performance Metrics +
 * Individual Stock Performance tables).
 *
 * profileHint / tierHint are used when the sheet doesn't embed those values.
 */
function parseSipPerformanceRows(
  rows: (string | number)[][],
  profileHint: string,
  tierHint: string
): ParsedPerformanceReport {
  const result: ParsedPerformanceReport = { type: 'performance', profile: '', tiers: {} };

  // ── Profile: scan every cell for Conservative / Moderate / Aggressive ───────
  outer:
  for (const row of rows) {
    for (const cell of row) {
      const m = String(cell).match(/\b(Conservative|Moderate|Aggressive)\b/i);
      if (m) { result.profile = normalizeProfile(m[1]); break outer; }
    }
  }
  if (!result.profile) result.profile = profileHint;

  // ── Tier amount: scan for "Rs. X" / "₹X" / "50,000" / "1,00,000" ───────────
  let tierKey = tierHint || '50000';
  tierSearch:
  for (const row of rows) {
    for (const cell of row) {
      const m = String(cell).match(/(?:Rs\.?\s*|₹\s*)([\d,]+)/i);
      if (m) {
        const amt = parseNum(m[1]);
        if (amt >= 10000) { tierKey = amt.toString(); break tierSearch; }
      }
    }
  }

  // ── Metrics and stock tables ─────────────────────────────────────────────────
  const perf: Partial<PerformanceMetrics> = {};
  const stockPerformance: StockPerformanceEntry[] = [];
  const realizedGains: Array<{ company: string; longTermGain: number; shortTermGain: number }> = [];
  const capitalMovement: Array<{ date: string; netInjection: number; cumulativeCapital: number }> = [];
  let mode: 'none' | 'metrics' | 'stocks' | 'realized' | 'capmov' = 'none';
  let stockHeaderSeen = false;
  let realizedHeaderSeen = false;
  let capmovHeaderSeen = false;

  for (let i = 0; i < rows.length; i++) {
    const row   = rows[i] ?? [];
    const cell0 = String(row[0] ?? '').trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
    const cell0l = cell0.toLowerCase();

    // Section header detection
    if (/Comparative\s+Performance\s+Metrics/i.test(cell0)) { mode = 'metrics'; continue; }
    if (/Individual\s+Stock\s+Performance/i.test(cell0))    { mode = 'stocks'; stockHeaderSeen = false; continue; }
    if (/^Realized\s+Gains/i.test(cell0))                   { mode = 'realized'; realizedHeaderSeen = false; continue; }
    if (/^Capital\s+Movement\s+Overview/i.test(cell0))      { mode = 'capmov'; capmovHeaderSeen = false; continue; }
    if (/^(Net\s+Capital|Corporate\s+Cash)/i.test(cell0))   { mode = 'none'; continue; }

    if (mode === 'metrics') {
      // Skip the "Metric | Portfolio | Benchmark Index" header row
      if (/^metric$/i.test(cell0l)) continue;
      const v1 = parseNum(String(row[1] ?? '0'));
      const v2 = parseNum(String(row[2] ?? '0'));
      const p1 = parsePct(row[1] ?? 0);
      const p2 = parsePct(row[2] ?? 0);

      if (/total invested/i.test(cell0))                              { perf.totalInvested = v1; perf.benchmarkTotalInvested = v2; }
      else if (/current value/i.test(cell0))                         { perf.currentValue = v1; perf.benchmarkCurrentValue = v2; }
      else if (/unrealized gains/i.test(cell0))                      { perf.unrealizedGains = v1; perf.benchmarkUnrealizedGains = v2; }
      else if (/cumulative return/i.test(cell0))                     { perf.cumulativeReturn = p1; perf.benchmarkCumulativeReturn = p2; }
      else if (/time.weighted return.*non/i.test(cell0))             { perf.timeWeightedReturnNonAnnualized = p1; perf.benchmarkTWRNonAnnualized = p2; }
      else if (/annualized time.weighted/i.test(cell0))              { perf.annualizedTWR = p1; perf.benchmarkAnnualizedTWR = p2; }
      else if (/money.weighted return.*non/i.test(cell0))            { perf.moneyWeightedReturnNonAnnualized = p1; perf.benchmarkMWRNonAnnualized = p2; }
      else if (/money.weighted return.*annualized\)/i.test(cell0))   { perf.moneyWeightedReturnAnnualized = p1; perf.benchmarkMWRAnnualized = p2; }
      else if (/investment period/i.test(cell0))                     { perf.investmentPeriod = v1; }
      else if (/portfolio turnover/i.test(cell0))                    { perf.portfolioTurnover = p1; }
    }

    if (mode === 'stocks') {
      // Skip the column-header row (Stock | Total Shares | ...)
      if (!stockHeaderSeen && /stock/i.test(cell0l)) { stockHeaderSeen = true; continue; }
      if (!stockHeaderSeen) continue;

      if (!cell0 || /^total$/i.test(cell0l)) continue;

      // Columns: Stock | Total Shares | Avg Purchase Price | Invested Value | Current Value | Cumulative Return | Current Price
      stockPerformance.push({
        stock:            cell0,
        totalShares:      parseInt(String(row[1] ?? '0')) || 0,
        avgPurchasePrice: parseNum(String(row[2] ?? '0')),
        investedValue:    parseNum(String(row[3] ?? '0')),
        currentValue:     parseNum(String(row[4] ?? '0')),
        cumulativeReturn: parsePct(row[5] ?? 0),
        currentPrice:     parseNum(String(row[6] ?? '0')),
      });
    }

    if (mode === 'realized') {
      // Header row: "Company | Long Term Gain | Short Term Gain"
      if (!realizedHeaderSeen && /company/i.test(cell0l)) { realizedHeaderSeen = true; continue; }
      if (!realizedHeaderSeen) continue;
      if (!cell0 || /^total$/i.test(cell0l)) continue;
      realizedGains.push({
        company:       cell0,
        longTermGain:  parseNum(String(row[1] ?? '0')),
        shortTermGain: parseNum(String(row[2] ?? '0')),
      });
    }

    if (mode === 'capmov') {
      // Header row: "Date | Net Injection | Cumulative Capital"
      if (!capmovHeaderSeen && /^date$/i.test(cell0l)) { capmovHeaderSeen = true; continue; }
      if (!capmovHeaderSeen) continue;
      if (!cell0 || /^total$/i.test(cell0l)) continue;
      capitalMovement.push({
        date:              cell0,
        netInjection:      parseNum(String(row[1] ?? '0')),
        cumulativeCapital: parseNum(String(row[2] ?? '0')),
      });
    }
  }

  result.tiers[tierKey] = {
    additionalCapital: parseNum(tierKey),
    performance: {
      totalInvested:                    perf.totalInvested                    ?? 0,
      benchmarkTotalInvested:           perf.benchmarkTotalInvested           ?? 0,
      currentValue:                     perf.currentValue                     ?? 0,
      benchmarkCurrentValue:            perf.benchmarkCurrentValue            ?? 0,
      unrealizedGains:                  perf.unrealizedGains                  ?? 0,
      benchmarkUnrealizedGains:         perf.benchmarkUnrealizedGains         ?? 0,
      cumulativeReturn:                 perf.cumulativeReturn                 ?? 0,
      benchmarkCumulativeReturn:        perf.benchmarkCumulativeReturn        ?? 0,
      timeWeightedReturnNonAnnualized:  perf.timeWeightedReturnNonAnnualized  ?? 0,
      benchmarkTWRNonAnnualized:        perf.benchmarkTWRNonAnnualized        ?? 0,
      annualizedTWR:                    perf.annualizedTWR                    ?? 0,
      benchmarkAnnualizedTWR:           perf.benchmarkAnnualizedTWR           ?? 0,
      moneyWeightedReturnAnnualized:    perf.moneyWeightedReturnAnnualized    ?? 0,
      benchmarkMWRAnnualized:           perf.benchmarkMWRAnnualized           ?? 0,
      moneyWeightedReturnNonAnnualized: perf.moneyWeightedReturnNonAnnualized ?? 0,
      benchmarkMWRNonAnnualized:        perf.benchmarkMWRNonAnnualized        ?? 0,
      investmentPeriod:                 perf.investmentPeriod                 ?? 0,
      portfolioTurnover:                perf.portfolioTurnover                ?? 0,
    },
    stockPerformance,
    realizedGains,
    capitalMovement,
  };

  return result;
}

/**
 * Parse a 2-D array of strings (rows × cols) from a CSV or Excel sheet.
 *
 * Auto-detects rebalancing vs performance format.
 * profileHint / tierHint are used as fallbacks when the file doesn't embed them.
 */
export function parseSipRows(
  rows: (string | number)[][],
  profileHint = '',
  tierHint = ''
): AnyParsedReport {
  if (isPerformanceSheet(rows)) {
    return parseSipPerformanceRows(rows, profileHint, tierHint);
  }
  return parseSipRebalancingRows(rows, profileHint);
}

function parseSipRebalancingRows(
  rows: (string | number)[][],
  profileHint = ''
): ParsedSipReport {
  const result: ParsedSipReport = { type: 'rebalancing', profile: profileHint, tiers: {} };

  let i = 0;
  while (i < rows.length) {
    const cell0 = String(rows[i]?.[0] ?? '').trim().toLowerCase();

    if (cell0 !== 'date') { i++; continue; }

    const base = i;

    // ── Metadata ─────────────────────────────────────────────────────────────
    const date              = parseDate(String(rows[base]?.[1] ?? ''));
    const additionalCapital = parseNum(String(rows[base + 2]?.[1] ?? '0'));
    const numberOfStocks    = parseInt(String(rows[base + 3]?.[1] ?? '0')) || 0;
    const sectorsExcluded   = String(rows[base + 4]?.[1] ?? '').trim();
    const riskRaw           = String(rows[base + 5]?.[1] ?? '').trim();
    const profile           = normalizeProfile(riskRaw);
    if (!result.profile && profile) result.profile = profile;

    // Find the STOCK DETAILS header row
    let headerIdx = base;
    while (
      headerIdx < rows.length &&
      String(rows[headerIdx]?.[0] ?? '').trim().toUpperCase() !== 'STOCK DETAILS'
    ) headerIdx++;

    // ── Holdings ─────────────────────────────────────────────────────────────
    const holdings: SipHolding[] = [];
    let totalValue = 0;
    let j = headerIdx + 1;

    while (j < rows.length) {
      const row   = rows[j] ?? [];
      const stock = String(row[0] ?? '').trim();
      const col3  = String(row[3] ?? '').trim();

      if (!stock && col3) { totalValue = parseNum(col3); j++; break; }

      if (
        stock.toLowerCase() === 'date' ||
        stock === 'Stock Metrics' ||
        stock === 'Name'
      ) break;

      if (!stock) { j++; continue; }

      const price = parseNum(String(row[1] ?? '0'));
      if (isNaN(price) && !String(row[7] ?? '').match(/Buy|Sell|Hold/i)) {
        j++; continue;
      }

      holdings.push({
        stock,
        currentPrice:      price,
        recommendedWeight: parseNum(String(row[2] ?? '0')),
        recommendedAmount: parseNum(String(row[3] ?? '0')),
        recommendedQty:    parseInt(String(row[4] ?? '0')) || 0,
        currentQty:        parseInt(String(row[5] ?? '0')) || 0,
        transactionQty:    parseInt(String(row[6] ?? '0')) || 0,
        action:            String(row[7] ?? '').trim(),
      });

      j++;
    }

    const tierKey = additionalCapital.toString();
    result.tiers[tierKey] = {
      date,
      additionalCapital,
      numberOfStocks,
      sectorsExcluded,
      totalValue,
      holdings,
    };

    i = j;
  }

  return result;
}
