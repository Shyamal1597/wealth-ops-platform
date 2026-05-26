"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

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

export default function NSERSSPage() {
  const [feeds, setFeeds] = useState<Record<string, FeedData>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const rssFeeds = [
    {
      key: "announcements",
      name: "Online Announcements",
      icon: AlertCircle,
      description: "Latest corporate announcements and disclosures",
      category: "Announcements",
    },
    {
      key: "annualReports",
      name: "Annual Reports",
      icon: FileText,
      description: "Company annual reports and financial statements",
      category: "Reports",
    },
    {
      key: "boardMeetings",
      name: "Board Meetings",
      icon: Users,
      description: "Board meeting notifications and outcomes",
      category: "Governance",
    },
    {
      key: "brsr",
      name: "BRSR (Business Responsibility & Sustainability Report)",
      icon: BookOpen,
      description: "Business responsibility and sustainability reports",
      category: "Reports",
    },
    {
      key: "corporateAction",
      name: "Corporate Action",
      icon: TrendingUp,
      description: "Dividends, splits, bonus, rights issues, and more",
      category: "Corporate Actions",
    },
    {
      key: "corporateGovernance",
      name: "Corporate Governance",
      icon: Shield,
      description: "Corporate governance reports and compliance",
      category: "Governance",
    },
    {
      key: "dailyBuyback",
      name: "Daily Buyback",
      icon: DollarSign,
      description: "Daily buyback transactions and announcements",
      category: "Corporate Actions",
    },
    {
      key: "financialResults",
      name: "Financial Results",
      icon: BarChart3,
      description: "Quarterly and annual financial results",
      category: "Reports",
    },
    {
      key: "insiderTrading",
      name: "Insider Trading",
      icon: Users,
      description: "Insider trading disclosures and notifications",
      category: "Compliance",
    },
    {
      key: "investorComplaints",
      name: "Investor Complaints",
      icon: AlertCircle,
      description: "Investor complaint status and resolutions",
      category: "Compliance",
    },
    {
      key: "offerDocuments",
      name: "Offer Documents",
      icon: FileText,
      description: "IPO, FPO, and other offer documents",
      category: "Offerings",
    },
    {
      key: "shareholdingPattern",
      name: "Shareholding Pattern",
      icon: Share2,
      description: "Quarterly shareholding pattern disclosures",
      category: "Reports",
    },
    {
      key: "statementOfDeviation",
      name: "Statement of Deviation",
      icon: FileText,
      description: "Statements of deviation from prospectus",
      category: "Compliance",
    },
  ];

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
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
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

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Announcements": return AlertCircle;
      case "Reports": return FileText;
      case "Governance": return Shield;
      case "Corporate Actions": return TrendingUp;
      case "Compliance": return BookOpen;
      case "Offerings": return Building2;
      default: return Rss;
    }
  };

  return (
    <>
      {/* Hero Section */}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary-100">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Rss className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Stay Updated with NSE RSS Feeds
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The National Stock Exchange (NSE) provides RSS feeds for various corporate disclosures, announcements,
                      and regulatory filings. These feeds help investors stay informed about important developments affecting
                      listed companies.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Below you'll find the latest updates from each NSE RSS feed category. Click on any item to view full details
                      on the NSE website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* RSS Feeds Content */}
      {loading ? (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading NSE RSS feeds...</p>
            </div>
          </Container>
        </section>
      ) : (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto space-y-12">
              {rssFeeds.map((feedConfig) => {
                const feedData = feeds[feedConfig.key];
                const FeedIcon = feedConfig.icon;

                return (
                  <div key={feedConfig.key} id={feedConfig.key}>
                    {/* Feed Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <FeedIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{feedConfig.name}</h2>
                        <p className="text-gray-600">{feedConfig.description}</p>
                      </div>
                    </div>

                    {/* Feed Items */}
                    {feedData?.error ? (
                      <Card className="border-2 border-red-200 bg-red-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 text-red-800">
                            <AlertCircle className="h-5 w-5" />
                            <p>Failed to load feed. Please try again later.</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : feedData?.items && feedData.items.length > 0 ? (
                      <div className="grid gap-4">
                        {feedData.items.map((item) => (
                          <Card key={item.id} className="border-2 hover:border-primary-200 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 mb-2 text-lg hover:text-primary-600 transition-colors">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                      {item.title}
                                    </a>
                                  </h3>
                                  {item.content && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                      {item.content}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(item.pubDate)}
                                    </div>
                                    {item.attachmentCount && (
                                      <div className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {item.attachmentCount} attachments
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  className="border-primary-600 text-primary-600 hover:bg-primary-50 flex-shrink-0"
                                >
                                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    View Details
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-2 border-gray-200">
                        <CardContent className="p-6">
                          <p className="text-gray-500 text-center">No items available in this feed.</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* View More Link */}
                    {feedData?.items && feedData.items.length > 0 && (
                      <div className="mt-4 text-center">
                        <a
                          href={`https://nsearchives.nseindia.com/content/RSS/${feedConfig.key === 'brsr' ? 'brsr' :
                            feedConfig.key === 'announcements' ? 'Online_announcements' :
                            feedConfig.key === 'annualReports' ? 'Annual_Reports' :
                            feedConfig.key === 'boardMeetings' ? 'Board_Meetings' :
                            feedConfig.key === 'corporateAction' ? 'Corporate_action' :
                            feedConfig.key === 'corporateGovernance' ? 'Corporate_Governance' :
                            feedConfig.key === 'dailyBuyback' ? 'Daily_Buyback' :
                            feedConfig.key === 'financialResults' ? 'Financial_Results' :
                            feedConfig.key === 'insiderTrading' ? 'Insider_Trading' :
                            feedConfig.key === 'investorComplaints' ? 'Investor_Complaints' :
                            feedConfig.key === 'offerDocuments' ? 'Offer_Documents' :
                            feedConfig.key === 'shareholdingPattern' ? 'Shareholding_Pattern' :
                            'Statement_Of_Deviation'}.xml`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-2"
                        >
                          View Full RSS Feed
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* How to Use RSS Feeds */}
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
                  title: "Choose Feed",
                  description: "Browse the feeds above and select the category relevant to your interests",
                },
                {
                  step: 2,
                  title: "Subscribe",
                  description: "Click 'View Full RSS Feed' and open in your RSS reader application",
                },
                {
                  step: 3,
                  title: "Stay Updated",
                  description: "Receive automatic updates whenever new content is published",
                },
              ].map((item, index) => (
                <Card key={index} className="text-center">
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
                      To view these RSS feeds in a reader application, you can use popular options like:
                    </p>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Feedly - Web-based RSS reader</li>
                      <li>• Inoreader - Advanced RSS reader with filtering</li>
                      <li>• RSS Reader extensions for Chrome/Firefox</li>
                      <li>• Built-in RSS readers in email clients</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need More Information?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Visit the official NSE website for more resources and information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <a href="https://www.nseindia.com/static/rss-feed" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
