import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { promises as fs } from "fs";
import path from "path";
import * as cheerio from "cheerio";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media"],
      ["enclosure", "enclosure"],
      ["media:thumbnail", "thumbnail"],
    ],
  },
});

const RSS_FEEDS = [
  "https://www.livemint.com/rss/companies",
  "https://www.livemint.com/rss/markets",
  "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "http://www.thehindu.com/business/?service=rss",
  "http://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
  "https://www.marketwatch.com/rss/topstories",
  "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  "https://www.ft.com/markets",
  "https://www.ft.com/companies",
  // Business Standard RSS feeds are blocked by their server
  // Alternative: Using additional ET and Mint feeds for better coverage
  "https://www.livemint.com/rss/industry",
  "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms",
];

const MAX_NEWS_ITEMS = 200;
const MAX_ITEMS_PER_FEED = 15; // Increased from 5 to get more articles per feed

// Market News Filter - Filters out non-market related news
function isMarketNews(title: string, content: string): boolean {
  const fullText = (title + ' ' + content).toLowerCase();

  // STRICT EXCLUSIONS - Must filter these out first
  const strictExclusionKeywords = [
    // Entertainment & Celebrity
    'actor', 'actress', 'celebrity', 'bollywood', 'hollywood',
    'movie star', 'film star', 'musician', 'singer', 'performer',
    // Sports & Athletes
    'cricket', 'football', 'tennis', 'golf', 'basketball', 'baseball',
    'soccer', 'athlete', 'player', 'tournament', 'championship',
    'world cup', 'olympics', 'sports match', 'sporting event',
    'tennis star', 'cricket star', 'football star',
    // Real Estate (Celebrity/Personal)
    'celebrity home', 'actor home', 'actress home', 'star\'s home',
    'luxury mansion', 'beverly hills home', 'malibu home', 'l.a. home',
    // Entertainment Business
    'movie', 'film', 'music concert', 'album', 'grammy', 'oscar',
    'box office', 'streaming show', 'tv series', 'netflix show',
    // Non-Market Content
    'weather', 'fashion show', 'fashion week', 'festival',
    'murder', 'crime scene', 'arrest', 'wedding', 'divorce',
    // Sports Leagues
    'pickleball', 'ipl auction', 'nfl', 'nba', 'premier league'
  ];

  const hasStrictExclusions = strictExclusionKeywords.some(keyword =>
    fullText.includes(keyword)
  );

  // Reject immediately if strict exclusions found
  if (hasStrictExclusions) {
    return false;
  }

  // Check for Indian market context
  const indianMarketIndicators = [
    'nifty', 'sensex', 'nse', 'bse', 'sebi', 'rbi',
    'rupee', 'indian stock', 'mumbai stock', 'dalal street',
    'fii', 'dii', 'foreign investor', 'domestic investor',
    'indian market', 'india stock', 'indian economy'
  ];

  // Check for Global market impact
  const globalMarketIndicators = [
    // Global Indices
    'dow jones', 'dow', 's&p 500', 's&p', 'nasdaq', 'wall street',
    'ftse', 'dax', 'nikkei', 'hang seng',
    // Commodities
    'crude oil', 'brent', 'wti', 'gold price', 'oil price',
    'silver price', 'copper price', 'commodity market',
    // Central Banks
    'fed rate', 'federal reserve', 'fomc', 'ecb', 'boj',
    'jerome powell', 'interest rate hike', 'rate cut',
    'monetary policy', 'central bank',
    // Currencies
    'dollar index', 'dxy', 'usd-inr', 'dollar-rupee',
    'forex market', 'currency market',
    // Economic Data
    'us gdp', 'us inflation', 'china gdp', 'global recession',
    'economic growth', 'inflation data', 'trade deficit'
  ];

  const hasIndianContext = indianMarketIndicators.some(indicator =>
    fullText.includes(indicator)
  );

  const hasGlobalContext = globalMarketIndicators.some(indicator =>
    fullText.includes(indicator)
  );

  // Must have at least TWO financial keywords (relaxed from 3)
  const financialKeywords = [
    'stock', 'share', 'equity', 'stock market', 'share price',
    'ipo', 'listing', 'profit', 'revenue', 'earnings', 'dividend',
    'quarterly result', 'annual result', 'financial result',
    'rally', 'surge', 'fall', 'crash', 'selloff', 'buying',
    'inflation', 'interest rate', 'bond yield', 'treasury',
    'mutual fund', 'portfolio', 'valuation', 'market cap',
    'pe ratio', 'eps', 'brokerage', 'analyst', 'recommendation',
    // Additional common market terms
    'budget', 'bank', 'sector', 'industry', 'quarterly',
    'q1', 'q2', 'q3', 'q4', 'yoy', 'growth', 'investment',
    'trading', 'investor', 'market', 'financial', 'economic',
    'business', 'company', 'corporate', 'fiscal'
  ];

  let financialKeywordCount = 0;
  financialKeywords.forEach(keyword => {
    if (fullText.includes(keyword)) financialKeywordCount++;
  });

  // Accept if: (Indian OR Global context) OR (2+ financial keywords)
  // More permissive: context OR keywords, not requiring both
  const isRelevant = (hasIndianContext || hasGlobalContext) ||
         financialKeywordCount >= 2;

  return isRelevant;
}

function detectSource(link: string): string {
  try {
    const url = new URL(link);
    const hostname = url.hostname.toLowerCase();

    if (hostname.includes("livemint.com")) return "Mint";
    if (hostname.includes("economictimes.")) return "Economic Times";
    if (hostname.includes("thehindu.com")) return "The Hindu";
    if (hostname.includes("timesofindia.") || hostname.includes("indiatimes.com"))
      return "Times of India";
    if (hostname.includes("marketwatch.com")) return "MarketWatch";
    if (hostname.includes("cnbc.com")) return "CNBC";
    if (hostname.includes("ft.com")) return "Financial Times";
    if (hostname.includes("business-standard.com")) return "Business Standard";

    return "Unknown";
  } catch {
    return "Unknown";
  }
}

async function extractImageFromArticle(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try Open Graph image first
    let image = $('meta[property="og:image"]').attr("content");
    if (image && image.startsWith("http")) return image;

    // Try Twitter card image
    image = $('meta[name="twitter:image"]').attr("content");
    if (image && image.startsWith("http")) return image;

    // Try article image
    image = $('meta[property="og:image:secure_url"]').attr("content");
    if (image && image.startsWith("http")) return image;

    // Try to find first article image
    image = $("article img").first().attr("src");
    if (image && image.startsWith("http")) return image;

    return null;
  } catch (error) {
    console.error(`Error extracting image from ${url}:`, error);
    return null;
  }
}

function extractImageFromRSSItem(item: any): string | null {
  try {
    // Check enclosure (common in RSS)
    if (item.enclosure && item.enclosure.url) {
      return item.enclosure.url;
    }

    // Check media:content
    if (item.media && item.media.$) {
      return item.media.$.url;
    }

    // Check media:thumbnail
    if (item.thumbnail && item.thumbnail.$) {
      return item.thumbnail.$.url;
    }

    // Check content for images
    if (item.content) {
      const $ = cheerio.load(item.content);
      const img = $("img").first().attr("src");
      if (img && img.startsWith("http")) return img;
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const dataFile = path.join(process.cwd(), "data", "market-news.json");

    // Read existing news
    let newsData: { news: any[] } = { news: [] };
    try {
      const fileContent = await fs.readFile(dataFile, "utf-8");
      newsData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, will create it
    }

    const allNewItems: any[] = [];
    const seenLinks = new Set(newsData.news.map(n => n.link)); // Track existing links
    const seenTitles = new Set(newsData.news.map(n => n.title?.toLowerCase().trim())); // Track existing titles
    let successCount = 0;
    let errorCount = 0;
    let filteredCount = 0; // Track filtered items
    let duplicateCount = 0; // Track duplicates
    const feedStats: any = {};

    // Fetch from all RSS feeds with limited items per feed
    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        let itemsFromThisFeed = 0;

        for (const item of feed.items) {
          if (!item.link) continue;
          if (itemsFromThisFeed >= MAX_ITEMS_PER_FEED) break; // Limit per feed

          // Skip duplicates using link OR title comparison
          const normalizedTitle = (item.title || '').toLowerCase().trim();
          if (seenLinks.has(item.link) || seenTitles.has(normalizedTitle)) {
            console.log('Skipping duplicate:', item.title?.substring(0, 50));
            duplicateCount++;
            continue;
          }

          // 🔍 FILTER: Check if market-related news
          const title = item.title || '';
          const content = item.contentSnippet || item.content || '';

          if (!isMarketNews(title, content)) {
            console.log('❌ Filtered (non-market):', title.substring(0, 60));
            filteredCount++;
            continue;
          }

          // Create unique ID from link using full base64 (no truncation)
          const id = Buffer.from(item.link)
            .toString("base64")
            .replace(/[/+=]/g, '_'); // Replace unsafe characters for IDs

          // Detect source
          const source = detectSource(item.link);

          // Extract image from RSS item first (faster)
          let image = extractImageFromRSSItem(item);

          // If no image in RSS, try to extract from article (slower, but optional)
          // We'll skip this for performance - only use RSS images

          const newsItem = {
            id,
            title: item.title || "Untitled",
            link: item.link,
            content: item.contentSnippet || item.content || "",
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
            source,
            image: image || null,
            receivedAt: new Date().toISOString(),
          };

          allNewItems.push(newsItem);
          seenLinks.add(item.link); // Track this link
          seenTitles.add(normalizedTitle); // Track this title
          itemsFromThisFeed++;
          feedStats[source] = (feedStats[source] || 0) + 1;
        }

        successCount++;
      } catch (error) {
        console.error(`Error fetching feed ${feedUrl}:`, error);
        errorCount++;
      }
    }

    // Sort new items by publication date (newest first)
    allNewItems.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate).getTime();
      const dateB = new Date(b.isoDate || b.pubDate).getTime();
      return dateB - dateA; // Newest first
    });

    // Add new items to the beginning
    newsData.news.unshift(...allNewItems);

    // Sort all news by publication date (newest first)
    newsData.news.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate).getTime();
      const dateB = new Date(b.isoDate || b.pubDate).getTime();
      return dateB - dateA; // Newest first
    });

    // Keep only the latest MAX_NEWS_ITEMS
    if (newsData.news.length > MAX_NEWS_ITEMS) {
      newsData.news = newsData.news.slice(0, MAX_NEWS_ITEMS);
    }

    // Save to file
    await fs.writeFile(dataFile, JSON.stringify(newsData, null, 2), "utf-8");

    // Log filtering statistics
    console.log('\n📊 MARKET NEWS FILTER STATISTICS:');
    console.log(`✅ Accepted: ${allNewItems.length} news items`);
    console.log(`❌ Filtered: ${filteredCount} news items`);
    console.log(`🔄 Duplicates: ${duplicateCount} news items`);
    console.log(`📈 Acceptance Rate: ${Math.round((allNewItems.length / (filteredCount + allNewItems.length || 1)) * 100)}%`);
    console.log(`🗂️  Total News in DB: ${newsData.news.length}\n`);

    return NextResponse.json({
      success: true,
      message: `Fetched news from ${successCount} feeds`,
      newItems: allNewItems.length,
      totalNews: newsData.news.length,
      successFeeds: successCount,
      errorFeeds: errorCount,
      filteredOut: filteredCount,
      duplicates: duplicateCount,
      sourceDistribution: feedStats,
      filterStats: {
        filtered: filteredCount,
        duplicates: duplicateCount,
        accepted: allNewItems.length,
        total: filteredCount + allNewItems.length,
        acceptanceRate: `${Math.round((allNewItems.length / (filteredCount + allNewItems.length)) * 100)}%`
      }
    });
  } catch (error: any) {
    console.error("Error fetching market news:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
