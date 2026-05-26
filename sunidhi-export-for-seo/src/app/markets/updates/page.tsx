"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Newspaper, RefreshCw, AlertCircle } from "lucide-react";

interface NewsArticle {
  title: string;
  description: string;
  link?: string;
  pubDate: string;
  source?: string;
  author?: string;
}

export default function UpdatesPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/news', {
        method: 'GET',
        cache: forceRefresh ? 'no-store' : 'default'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news updates');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Handle both {articles: [...]} and direct array responses
      const articles = Array.isArray(data) ? data : (data.articles || []);
      setNews(articles);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Unable to load news updates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Daily Updates</h1>
          </div>
          <p className="text-xl text-primary-100">Stay informed with the latest market news and updates</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading latest updates...</p>
            </div>
          ) : error ? (
            <div className="max-w-4xl mx-auto">
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="py-8">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-orange-900 mb-2">Unable to Load News</h3>
                      <p className="text-orange-700 mb-4">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchNews(true)}
                        disabled={refreshing}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                  {news.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {news.length} article{news.length !== 1 ? 's' : ''} • Updates every 5 minutes
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNews(true)}
                  disabled={refreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {news.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No news updates available</p>
                    <p className="text-sm text-gray-500">Check back soon for the latest market news</p>
                  </CardContent>
                </Card>
              ) : (
                news.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 leading-tight">
                            {article.title}
                          </CardTitle>
                          {article.description && (
                            <CardDescription className="text-base leading-relaxed">
                              {article.description}
                            </CardDescription>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                            {article.source && (
                              <span className="font-medium">Source: {article.source}</span>
                            )}
                            {article.author && (
                              <span>By {article.author}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(article.pubDate)}
                        </span>
                      </div>
                    </CardHeader>
                    {article.link && (
                      <CardContent>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                          Read Full Article
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
