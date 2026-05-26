'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

interface DailyUpdate {
  id: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  reportDate: string;
  description?: string;
}

export default function DailyUpdatesPage() {
  const [updates, setUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyUpdates();
  }, []);

  const fetchDailyUpdates = async () => {
    try {
      const response = await fetch('/api/daily-updates');
      const data = await response.json();
      setUpdates(data.updates || []);
    } catch (error) {
      console.error('Error fetching daily updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Daily Market Updates</h1>
          </div>
          <p className="text-xl text-primary-100">
            Morning Buzz - Your daily dose of market insights and news
          </p>
        </Container>
      </section>

      <section className="py-12 bg-gray-50">
        <Container>
          {/* Info Card */}
          <Card className="mb-8 border-l-4 border-l-primary-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">About Morning Buzz</h3>
                  <p className="text-gray-600">
                    Get the latest market updates every morning. Our Morning Buzz reports provide you with essential market news,
                    trends, and analysis to start your trading day informed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates Count */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Updates
              <span className="ml-3 text-lg font-normal text-gray-500">
                ({updates.length} report{updates.length !== 1 ? 's' : ''})
              </span>
            </h2>
          </div>

          {/* Updates List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-gray-500 mt-4">Loading updates...</p>
            </div>
          ) : updates.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No updates available</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Check back later for the latest market updates
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {updates.map((update) => (
                <Card key={update.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
                          <h3 className="font-semibold text-lg text-gray-900">
                            {update.title}
                          </h3>
                        </div>

                        {update.description && (
                          <p className="text-gray-600 text-sm mb-3 ml-8">
                            {update.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 ml-8 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(update.reportDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span>{(update.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={update.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Button className="bg-primary-600 hover:bg-primary-700">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
