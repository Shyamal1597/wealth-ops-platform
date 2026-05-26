"use client";

import { useState, useEffect, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Rss,
  FileText,
  Building2,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  DollarSign,
  Calendar,
  BookOpen,
  AlertCircle,
  Share2,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { expandSearch } from "@/lib/nse-aliases";

interface FeedItem {
  id: string;
  title: string;
  link: string;
  content: string;
  pubDate: string;
  isoDate: string;
  feedType: string;
  feedName: string;
  pdfLink?: string | null;
  attachmentCount?: string | null;
}

interface FeedData {
  name: string;
  items: FeedItem[];
  count: number;
  error?: string;
}

const RSS_FEEDS = [
  {
    key: "announcements",
    name: "Announcements",
    icon: AlertCircle,
    description: "Latest corporate announcements and disclosures",
  },
  {
    key: "annualReports",
    name: "Annual Reports",
    icon: FileText,
    description: "Company annual reports and financial statements",
  },
  {
    key: "boardMeetings",
    name: "Board Meetings",
    icon: Users,
    description: "Board meeting notifications and outcomes",
  },
  {
    key: "brsr",
    name: "BRSR",
    icon: BookOpen,
    description: "Business responsibility and sustainability reports",
  },
  {
    key: "corporateAction",
    name: "Corporate Action",
    icon: TrendingUp,
    description: "Dividends, splits, bonus, rights issues, and more",
  },
  {
    key: "corporateGovernance",
    name: "Corp. Governance",
    icon: Shield,
    description: "Corporate governance reports and compliance",
  },
  {
    key: "dailyBuyback",
    name: "Daily Buyback",
    icon: DollarSign,
    description: "Daily buyback transactions and announcements",
  },
  {
    key: "financialResults",
    name: "Financial Results",
    icon: BarChart3,
    description: "Quarterly and annual financial results",
  },
  {
    key: "insiderTrading",
    name: "Insider Trading",
    icon: Users,
    description: "Insider trading disclosures and notifications",
  },
  {
    key: "investorComplaints",
    name: "Investor Complaints",
    icon: AlertCircle,
    description: "Investor complaint status and resolutions",
  },
  {
    key: "offerDocuments",
    name: "Offer Documents",
    icon: Building2,
    description: "IPO, FPO, and other offer documents",
  },
  {
    key: "shareholdingPattern",
    name: "Shareholding",
    icon: Share2,
    description: "Quarterly shareholding pattern disclosures",
  },
  {
    key: "statementOfDeviation",
    name: "Stmt. of Deviation",
    icon: FileText,
    description: "Statements of deviation from prospectus",
  },
];

const NSE_XML_URL: Record<string, string> = {
  announcements: "Online_announcements",
  annualReports: "Annual_Reports",
  boardMeetings: "Board_Meetings",
  brsr: "brsr",
  corporateAction: "Corporate_action",
  corporateGovernance: "Corporate_Governance",
  dailyBuyback: "Daily_Buyback",
  financialResults: "Financial_Results",
  insiderTrading: "Insider_Trading",
  investorComplaints: "Investor_Complaints",
  offerDocuments: "Offer_Documents",
  shareholdingPattern: "Shareholding_Pattern",
  statementOfDeviation: "Statement_Of_Deviation",
};


export default function NSERSSPage() {
  const [feeds, setFeeds] = useState<Record<string, FeedData>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(RSS_FEEDS[0].key);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/nse-feeds");
      const data = await response.json();
      if (data.success) {
        setFeeds(data.feeds);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching NSE feeds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const terms = expandSearch(searchTerm); // original + any alias expansions
    return RSS_FEEDS.flatMap((feedConfig) => {
      const items = (feeds[feedConfig.key]?.items ?? []).filter((item) => {
        const haystack = (item.title + " " + (item.content ?? "")).toLowerCase();
        return terms.some((t) => haystack.includes(t));
      });
      return items.length > 0 ? [{ feedConfig, items }] : [];
    });
  }, [searchTerm, feeds]);

  const totalSearchHits = searchResults?.reduce((n, g) => n + g.items.length, 0) ?? 0;

  const activeFeedConfig = RSS_FEEDS.find((f) => f.key === activeTab)!;
  const activeFeedData = feeds[activeTab];
  const ActiveIcon = activeFeedConfig.icon;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rss className="h-4 w-4" />
              Live Data Feeds from NSE
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              NSE RSS Feeds
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Access real-time corporate announcements, financial results, and regulatory disclosures from the National Stock Exchange
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {lastUpdated && (
                <p className="text-sm text-white/80">
                  Last updated: {formatDate(lastUpdated.toISOString())}
                </p>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={fetchFeeds}
                disabled={loading}
                className="bg-white text-primary-600 hover:bg-gray-100 border-0 text-lg px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Refresh Feeds
                  </>
                )}
              </Button>
            </div>

            {/* Cross-stream company search */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-2xl mx-auto w-full">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-3">
                Search across all feeds
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Company name, e.g. Reliance, Infosys…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-3 py-2.5 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tabbed Feed Section */}
      <section className="py-12 bg-gray-50 min-h-[600px]">
        <Container>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-500 text-lg">Loading NSE RSS feeds…</p>
            </div>
          ) : searchResults !== null ? (
            /* ── Search Results View ── */
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary-600" />
                    Results for &ldquo;{searchTerm}&rdquo;
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {totalSearchHits} result{totalSearchHits !== 1 ? "s" : ""} across {searchResults.length} feed{searchResults.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" /> Clear search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="p-12 text-center">
                    <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No results found for &ldquo;{searchTerm}&rdquo;</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try a different company name or check the spelling.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {searchResults.map(({ feedConfig, items }) => {
                    const Icon = feedConfig.icon;
                    return (
                      <div key={feedConfig.key}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-800">{feedConfig.name}</h3>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                            {items.length}
                          </span>
                        </div>
                        <div className="grid gap-3 pl-10">
                          {items.map((item) => (
                            <Card
                              key={item.id}
                              className="border hover:border-primary-300 transition-all hover:shadow-md bg-white"
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1.5 text-base leading-snug hover:text-primary-600 transition-colors">
                                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {item.title}
                                      </a>
                                    </h4>
                                    {item.content && (
                                      <p className="text-gray-500 text-sm mb-2.5 line-clamp-2">
                                        {item.content}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(item.pubDate)}
                                      </div>
                                      {item.attachmentCount && (
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-3 w-3" />
                                          {item.attachmentCount} attachment{item.attachmentCount !== "1" ? "s" : ""}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="border-primary-200 text-primary-600 hover:bg-primary-50 flex-shrink-0"
                                  >
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                      View <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── Normal Tabbed View ── */
            <div>
              {/* Tab Bar */}
              <div className="overflow-x-auto pb-2 mb-8">
                <div className="flex gap-2 min-w-max">
                  {RSS_FEEDS.map((feed) => {
                    const Icon = feed.icon;
                    const isActive = activeTab === feed.key;
                    const hasError = !!feeds[feed.key]?.error;
                    return (
                      <button
                        key={feed.key}
                        onClick={() => setActiveTab(feed.key)}
                        className={`
                          inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                          whitespace-nowrap transition-all duration-150
                          ${isActive
                            ? "bg-primary-600 text-white shadow-md"
                            : hasError
                            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {feed.name}
                        {feeds[feed.key] && !hasError && (
                          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"}`}>
                            {feeds[feed.key].count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ActiveIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activeFeedConfig.name}</h2>
                    <p className="text-sm text-gray-500">{activeFeedConfig.description}</p>
                  </div>
                </div>
                <a
                  href={`https://nsearchives.nseindia.com/content/RSS/${NSE_XML_URL[activeTab]}.xml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
                >
                  View Raw XML Feed
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Feed Items */}
              {activeFeedData?.error ? (
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <p>Failed to load this feed. Please refresh or try again later.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : activeFeedData?.items && activeFeedData.items.length > 0 ? (
                <div className="grid gap-3">
                  {activeFeedData.items.map((item) => (
                    <Card key={item.id} className="border hover:border-primary-300 transition-all hover:shadow-md bg-white">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1.5 text-base leading-snug hover:text-primary-600 transition-colors">
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                {item.title}
                              </a>
                            </h3>
                            {item.content && (
                              <p className="text-gray-500 text-sm mb-2.5 line-clamp-2">
                                {item.content}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.pubDate)}
                              </div>
                              {item.attachmentCount && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {item.attachmentCount} attachment{item.attachmentCount !== "1" ? "s" : ""}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild className="border-primary-200 text-primary-600 hover:bg-primary-50 flex-shrink-0">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                              View <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="p-12 text-center">
                    <Rss className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No items available in this feed.</p>
                  </CardContent>
                </Card>
              )}

              {/* Mobile raw feed link */}
              {activeFeedData?.items && activeFeedData.items.length > 0 && (
                <div className="mt-4 sm:hidden text-center">
                  <a
                    href={`https://nsearchives.nseindia.com/content/RSS/${NSE_XML_URL[activeTab]}.xml`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-2"
                  >
                    View Raw XML Feed <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Use RSS Feeds
              </h2>
              <p className="text-lg text-gray-600">
                Follow these steps to subscribe to NSE RSS feeds
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: "Choose a Feed",
                  description: "Select a category tab above that matches your area of interest",
                },
                {
                  step: 2,
                  title: "Subscribe",
                  description: "Click 'View Raw XML Feed' and open the URL in your RSS reader",
                },
                {
                  step: 3,
                  title: "Stay Updated",
                  description: "Receive automatic updates whenever new content is published by NSE",
                },
              ].map((item) => (
                <Card key={item.step} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Recommended RSS Readers</h3>
                    <p className="text-blue-800 text-sm leading-relaxed mb-2">
                      To subscribe to these feeds, use a dedicated RSS reader:
                    </p>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Feedly — web-based RSS reader</li>
                      <li>• Inoreader — advanced reader with filtering</li>
                      <li>• RSS extensions for Chrome / Firefox</li>
                      <li>• Built-in RSS readers in email clients</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need More Information?</h2>
            <p className="text-xl text-white/90 mb-8">
              Visit the official NSE website for more resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <a
                  href="https://www.nseindia.com/static/rss-feed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit NSE RSS Page
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Link href="/support/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 text-center">
              <strong>Disclaimer:</strong> These RSS feeds are provided by the National Stock Exchange of India (NSE).
              Sunidhi Securities is not responsible for the content or accuracy of information provided through these feeds.
              Please verify all information independently before making investment decisions.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
