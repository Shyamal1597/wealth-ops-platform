import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["pdf_link", "pdfLink"],
      ["attachment_count", "attachmentCount"],
    ],
  },
});

const NSE_RSS_FEEDS = {
  announcements: "https://nsearchives.nseindia.com/content/RSS/Online_announcements.xml",
  annualReports: "https://nsearchives.nseindia.com/content/RSS/Annual_Reports.xml",
  boardMeetings: "https://nsearchives.nseindia.com/content/RSS/Board_Meetings.xml",
  brsr: "https://nsearchives.nseindia.com/content/RSS/brsr.xml",
  corporateAction: "https://nsearchives.nseindia.com/content/RSS/Corporate_action.xml",
  corporateGovernance: "https://nsearchives.nseindia.com/content/RSS/Corporate_Governance.xml",
  dailyBuyback: "https://nsearchives.nseindia.com/content/RSS/Daily_Buyback.xml",
  financialResults: "https://nsearchives.nseindia.com/content/RSS/Financial_Results.xml",
  insiderTrading: "https://nsearchives.nseindia.com/content/RSS/Insider_Trading.xml",
  investorComplaints: "https://nsearchives.nseindia.com/content/RSS/Investor_Complaints.xml",
  offerDocuments: "https://nsearchives.nseindia.com/content/RSS/Offer_Documents.xml",
  shareholdingPattern: "https://nsearchives.nseindia.com/content/RSS/Shareholding_Pattern.xml",
  statementOfDeviation: "https://nsearchives.nseindia.com/content/RSS/Statement_Of_Deviation.xml",
};

const FEED_NAMES = {
  announcements: "Online Announcements",
  annualReports: "Annual Reports",
  boardMeetings: "Board Meetings",
  brsr: "BRSR (Business Responsibility & Sustainability Report)",
  corporateAction: "Corporate Action",
  corporateGovernance: "Corporate Governance",
  dailyBuyback: "Daily Buyback",
  financialResults: "Financial Results",
  insiderTrading: "Insider Trading",
  investorComplaints: "Investor Complaints",
  offerDocuments: "Offer Documents",
  shareholdingPattern: "Shareholding Pattern",
  statementOfDeviation: "Statement of Deviation",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedType = searchParams.get("feed");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (feedType && NSE_RSS_FEEDS[feedType as keyof typeof NSE_RSS_FEEDS]) {
      // Fetch specific feed
      const feedUrl = NSE_RSS_FEEDS[feedType as keyof typeof NSE_RSS_FEEDS];
      const feed = await parser.parseURL(feedUrl);

      const items = feed.items.slice(0, limit).map((item, index) => ({
        id: `${feedType}-${index}`,
        title: item.title || "Untitled",
        link: item.link || "#",
        content: item.contentSnippet || item.content || "",
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
        feedType,
        feedName: FEED_NAMES[feedType as keyof typeof FEED_NAMES],
        pdfLink: (item as any).pdfLink || null,
        attachmentCount: (item as any).attachmentCount || null,
      }));

      return NextResponse.json({
        success: true,
        feedType,
        feedName: FEED_NAMES[feedType as keyof typeof FEED_NAMES],
        items,
        count: items.length,
      });
    } else {
      // Fetch all feeds in parallel
      const entries = Object.entries(NSE_RSS_FEEDS);
      const results = await Promise.all(
        entries.map(async ([key, url]) => {
          try {
            const feed = await parser.parseURL(url);
            const items = feed.items.map((item, index) => ({
              id: `${key}-${index}`,
              title: item.title || "Untitled",
              link: item.link || "#",
              content: item.contentSnippet || item.content || "",
              pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
              isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
              feedType: key,
              feedName: FEED_NAMES[key as keyof typeof FEED_NAMES],
              pdfLink: (item as any).pdfLink || null,
              attachmentCount: (item as any).attachmentCount || null,
            }));
            return [key, { name: FEED_NAMES[key as keyof typeof FEED_NAMES], items, count: items.length }] as const;
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            return [key, { name: FEED_NAMES[key as keyof typeof FEED_NAMES], items: [], count: 0, error: "Failed to fetch feed" }] as const;
          }
        })
      );

      const allFeeds = Object.fromEntries(results);

      return NextResponse.json({
        success: true,
        feeds: allFeeds,
      });
    }
  } catch (error: any) {
    console.error("Error fetching NSE feeds:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
