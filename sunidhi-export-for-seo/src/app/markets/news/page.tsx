"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, Clock, Filter, RefreshCw, TrendingUp, Search } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  content?: string;
  pubDate: string;
  isoDate?: string;
  source?: string;
  image?: string | null;
  receivedAt: string;
  matchType?: string; // For debugging: shows where the match was found
}

export default function MarketNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFreshNews = async () => {
    try {
      // Fetch fresh news from RSS feeds
      await fetch('/api/fetch-market-news');
    } catch (error) {
      console.error("Error fetching fresh news:", error);
    }
  };

  const fetchNews = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await fetch(
        `/api/market-news?limit=200&source=${selectedSource}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      // News is already sorted by date (newest first) from the API
      setNews(data.news);
      setSources(["all", ...data.sources]);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter and search news - Search in TITLE, SOURCE, and CONTENT with debouncing
  useEffect(() => {
    // If no search query, show all news immediately
    if (!searchQuery.trim()) {
      setFilteredNews([...news]); // Create new array to force re-render
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce search to avoid filtering on every keystroke
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();

      // Match query in title, source, OR content
      let filtered = news.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const source = (item.source || '').toLowerCase();
        const content = (item.content || '').toLowerCase();

        return title.includes(query) || source.includes(query) || content.includes(query);
      });

      // Sort by match priority: title matches first, then source, then content
      filtered.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        const aSource = (a.source || '').toLowerCase();
        const bSource = (b.source || '').toLowerCase();

        const aTitleMatch = aTitle.includes(query);
        const bTitleMatch = bTitle.includes(query);
        const aSourceMatch = aSource.includes(query);
        const bSourceMatch = bSource.includes(query);

        // Title matches come first
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;

        // Then source matches
        if (aSourceMatch && !bSourceMatch) return -1;
        if (!aSourceMatch && bSourceMatch) return 1;

        // Content matches last (maintaining chronological order)
        return 0;
      });

      setFilteredNews([...filtered]); // Create new array to force re-render
      setIsSearching(false);
    }, 300); // 300ms debounce - only search after user stops typing

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [news, searchQuery]);

  const refreshNewsFromFeeds = async () => {
    setIsRefreshing(true);
    await fetchFreshNews();
    await fetchNews(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchNews();

    // Auto-refresh display every 10 minutes (reduced frequency for better performance)
    const displayInterval = setInterval(() => fetchNews(true), 10 * 60 * 1000);

    // Auto-fetch fresh news from RSS feeds every 30 minutes
    const fetchInterval = setInterval(() => {
      fetchFreshNews().then(() => fetchNews(true));
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(displayInterval);
      clearInterval(fetchInterval);
    };
  }, [selectedSource]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 200) + "...";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Market News</h1>
              <p className="text-xl text-white/90 mt-2">
                Real-time updates from leading financial sources
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* News Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl">
                {isSearching ? (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-primary-600"></div>
                  </div>
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type="text"
                  placeholder="Search news by title, source, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Search is already happening in real-time via onChange
                      // Just blur the input to show results clearly
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {searchQuery && !isSearching && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600">
                  {isSearching ? 'Searching...' : `Found ${filteredNews.length} result${filteredNews.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                </p>
              )}
            </div>

            {/* Filter Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filter by source:</span>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <button
                      key={source}
                      onClick={() => setSelectedSource(source)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSource === source
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {source === "all" ? "All Sources" : source}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={refreshNewsFromFeeds}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Fetching fresh news..." : "Refresh"}
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading latest market news...</p>
              </div>
            )}

            {/* News List */}
            {!isLoading && filteredNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key={`news-grid-${filteredNews.length}`}>
                {filteredNews.map((item, index) => (
                  <Card key={`${item.id}-${index}`} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TrendingUp className="h-16 w-16 text-primary-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary-700 shadow-lg">
                            {item.source || "News"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {formatDate(item.pubDate || item.receivedAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {item.content && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {stripHtml(item.content)}
                          </p>
                        )}

                        <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1 group-hover:ml-0" />
                        </div>
                      </CardContent>
                    </a>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredNews.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  {searchQuery ? (
                    <>
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        No news articles match your search for "{searchQuery}". Try different keywords or clear your search.
                      </p>
                      <Button onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No news available
                      </h3>
                      <p className="text-gray-600 mb-6">
                        There are no market news updates at the moment. Check back soon!
                      </p>
                      <Button onClick={() => fetchNews()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh News
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      About Market News
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      We aggregate real-time market news from leading financial publications including
                      LiveMint, Economic Times, The Hindu Business, Times of India, MarketWatch, CNBC,
                      and Financial Times. News is sorted by publication date with the latest stories at the top.
                      Fresh news is automatically fetched from RSS feeds every 30 minutes to keep you informed
                      about the latest market developments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
