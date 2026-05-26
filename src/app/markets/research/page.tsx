'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { RESEARCH_STRUCTURE, ResearchReport, ResearchCategory, ResearchSubcategory } from '@/lib/research-types';

interface ExtendedReport extends ResearchReport {
  reportDate?: string;
  isFree?: boolean;
}

export default function ResearchPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ExtendedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<ResearchSubcategory | 'All'>('All');

  // Check authentication on mount, then poll every 30 s so a session
  // invalidated by another browser is detected without a manual refresh.
  useEffect(() => {
    checkAuthentication();
    fetchReports();

    const interval = setInterval(verifySessionSilently, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, selectedCategory, selectedSubcategory]);

  const checkAuthentication = async () => {
    try {
      // Always verify with the server on every page load.
      // This is the only way to detect that another browser has taken over
      // the session (single-session enforcement via the session store).
      const res = await fetch('/api/auth/client-verify');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          // Keep sessionStorage in sync so the header & other components
          // that read it (e.g. the client name display) are up-to-date.
          sessionStorage.setItem('clientData', JSON.stringify({
            clientId: data.clientId,
            name: data.name,
          }));
          setIsAuthenticated(true);
          return;
        }
      }

      // Server says session is invalid (expired, or superseded by another
      // browser login) — clear any stale local state and tell the Header.
      sessionStorage.removeItem('clientData');
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('clientSessionChange'));
    } catch {
      // Network error — fall back to sessionStorage so the page doesn't
      // flash "not logged in" during a brief connectivity blip.
      const clientData = sessionStorage.getItem('clientData');
      setIsAuthenticated(!!clientData);
    }
  };

  // Lightweight background poll — does NOT flash a loading state.
  // If the server reports the session as invalid (another browser logged in),
  // we immediately clear local state so the page transitions to "logged out".
  const verifySessionSilently = async () => {
    try {
      const res = await fetch('/api/auth/client-verify');
      if (!res.ok) {
        sessionStorage.removeItem('clientData');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('clientSessionChange'));
        return;
      }
      const data = await res.json();
      if (!data.authenticated) {
        sessionStorage.removeItem('clientData');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('clientSessionChange'));
      }
    } catch {
      // Network blip — keep current state, try again at next interval
    }
  };

  // Determine if a report is free (older than 1 year)
  const isReportFree = (reportDate?: string): boolean => {
    if (!reportDate) return false;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const reportDateObj = new Date(reportDate);
    return reportDateObj < oneYearAgo;
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/research');

      const data = await response.json();

      // Add isFree flag to each report
      const reportsWithFreeFlag = (data.reports || []).map((report: ExtendedReport) => ({
        ...report,
        isFree: isReportFree(report.reportDate)
      }));

      setReports(reportsWithFreeFlag);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'All') {
      filtered = filtered.filter(r => r.subcategory === selectedSubcategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        (r.description && r.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredReports(filtered);
  };

  const availableSubcategories = selectedCategory !== 'All'
    ? RESEARCH_STRUCTURE[selectedCategory]
    : [];

  const handleDownload = async (report: ExtendedReport) => {
    try {
      const res = await fetch(`/api/research/download?id=${report.id}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        return;
      }
      if (res.status === 401) {
        sessionStorage.removeItem('clientData');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('clientSessionChange'));
        router.push('/research-login');
      }
    } catch {
      // Network error — do nothing, let user retry
    }
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Reports</h1>
          <p className="text-xl text-primary-100">Expert analysis and investment recommendations</p>
          {isAuthenticated && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Logged in - Access to all premium reports</span>
            </div>
          )}
        </Container>
      </section>

      {!isAuthenticated && (
        <div className="bg-blue-50 border-b border-blue-200">
          <Container>
            <div className="py-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Note:</span> Reports older than 1 year are free to access.
                  For latest premium reports, please{' '}
                  <button
                    onClick={() => router.push('/research-login')}
                    className="font-semibold underline hover:text-blue-700"
                  >
                    login with your client credentials
                  </button>
                  {' '}or{' '}
                  <button
                    onClick={() => router.push('/open-account')}
                    className="font-semibold underline hover:text-blue-700"
                  >
                    open a demat account
                  </button>
                  .
                </p>
              </div>
            </div>
          </Container>
        </div>
      )}

      <section className="py-12">
        <Container>
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find the research reports you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value as any);
                      setSelectedSubcategory('All');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Fundamental">Fundamental</option>
                    <option value="Technical">Technical</option>
                    <option value="Economic">Economic</option>
                  </select>
                </div>

                {/* Subcategory Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={selectedCategory === 'All'}
                  >
                    <option value="All">All Subcategories</option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4 text-gray-600">
            Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reports found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search filters or check back later
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Analyst
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Access
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {report.title}
                              </div>
                              {report.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {report.description.substring(0, 60)}{report.description.length > 60 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded w-fit">
                              {report.category}
                            </span>
                            <span className="inline-flex text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded w-fit">
                              {report.subcategory}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(report as any).analystName || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(report as any).reportDate
                              ? new Date((report as any).reportDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).replace(/\//g, "-")
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {report.isFree ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Free
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                              <Lock className="h-3 w-3" />
                              Premium
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {report.isFree || isAuthenticated ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(report)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push('/research-login')}
                              className="border-primary-600 text-primary-600 hover:bg-primary-50"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Login to Access
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
