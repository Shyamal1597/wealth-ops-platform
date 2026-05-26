import { NextRequest, NextResponse } from "next/server";

// Map stock names from the reports to Yahoo Finance ticker symbols
const TICKER_MAP: { [key: string]: string } = {
  "M & M": "M&M.NS",
  "Avenue Super.": "DMART.NS",
  "Bajaj Auto": "BAJAJ-AUTO.NS",
  "Eicher Motors": "EICHERMOT.NS",
  "Dr Reddy's Labs": "DRREDDY.NS",
  "APL Apollo Tubes": "APLAPOLLO.NS",
  "Petronet LNG": "PETRONET.NS",
  "Metro Brands": "METROBRAND.NS",
  "Aadhar Hsg. Fin.": "AADHARHFC.NS",
  "Swaraj Engines": "SWARAJENG.NS",
  "Nifty Bees": "NIFTYBEES.NS",
  "Ashok Leyland": "ASHOKLEY.NS",
  "B P C L": "BPCL.NS",
  "Hindalco Inds.": "HINDALCO.NS",
  "Hero Motocorp": "HEROMOTOCO.NS",
  "HDFC AMC": "HDFCAMC.NS",
  "MAS FINANC SER": "MASFIN.NS",
  "Anand Rathi Wea.": "ANANDRATHI.NS",
  "Gulf Oil Lubric.": "GULFOILLUB.NS",
  "CEAT": "CEATLTD.NS",
  "Bank of Maha": "MAHABANK.NS",
};

// ── EOD price cache keyed by ticker + IST trading date ──────────────────────
// Key changes after 15:45 IST (15 min grace past NSE close), so prices refresh
// automatically once per trading session without any manual invalidation.
let priceCache: { [key: string]: number } = {};

/**
 * Returns the date string (YYYY-MM-DD in IST) of the most recently *completed*
 * trading session. Before 15:45 IST we return yesterday; after, we return today.
 */
function getISTTradingDate(): string {
  const istMs = Date.now() + (5 * 60 + 30) * 60 * 1000; // UTC → IST
  const ist = new Date(istMs);
  const istTotalMinutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  if (istTotalMinutes < 15 * 60 + 45) {
    return new Date(istMs - 86400000).toISOString().split("T")[0]; // yesterday
  }
  return ist.toISOString().split("T")[0]; // today (market has closed)
}

/** Convert a Yahoo Finance Unix timestamp to its IST calendar date string. */
function toISTDateStr(unixTs: number): string {
  const istMs = unixTs * 1000 + (5 * 60 + 30) * 60 * 1000;
  return new Date(istMs).toISOString().split("T")[0];
}

async function fetchYahooPrice(ticker: string): Promise<number | null> {
  const tradingDate = getISTTradingDate(); // e.g. "2026-04-15"
  const cacheKey = `${ticker}_${tradingDate}`;

  if (priceCache[cacheKey] != null) return priceCache[cacheKey];

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://finance.yahoo.com/",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json();
    const result = json?.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];

    // Walk backwards through the candles and pick the last one whose IST date
    // is ≤ tradingDate. This skips today's in-progress candle when the NSE
    // session is still open, so we always return a completed EOD close.
    let closePrice: number | null = null;
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (closes[i] == null) continue;
      if (toISTDateStr(timestamps[i]) <= tradingDate) {
        closePrice = closes[i];
        break;
      }
    }

    if (closePrice != null) {
      priceCache[cacheKey] = closePrice;
      return closePrice;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const stocksParam = request.nextUrl.searchParams.get("stocks");

  if (!stocksParam) {
    return NextResponse.json({ error: "Missing 'stocks' parameter" }, { status: 400 });
  }

  const stockNames = stocksParam.split(",").map((s) => s.trim());
  const results: { [stock: string]: number | null } = {};

  // Fetch all prices in parallel
  const promises = stockNames.map(async (stockName) => {
    const ticker = TICKER_MAP[stockName];
    if (!ticker) {
      results[stockName] = null;
      return;
    }
    const price = await fetchYahooPrice(ticker);
    results[stockName] = price;
  });

  await Promise.all(promises);

  return NextResponse.json(
    { prices: results, tradingDate: getISTTradingDate(), lastFetched: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }, // also prevent CDN/proxy caching
  );
}
