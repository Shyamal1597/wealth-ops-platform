"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Globe,
  ArrowLeft,
  Download,
} from "lucide-react";

interface Visit {
  timestamp: string;
  path: string;
  userAgent: string;
  ip: string;
}

interface AnalyticsData {
  totalVisits: number;
  visits: Visit[];
  visitsByDate: { [key: string]: number };
  visitsByPath: { [key: string]: number };
  recentVisits: Visit[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in as admin
    const storedAdminData = sessionStorage.getItem("adminData");
    if (!storedAdminData) {
      router.push("/admin/login");
      return;
    }

    // CRITICAL SECURITY: Check if admin has view_analytics permission
    const admin = JSON.parse(storedAdminData);
    const hasAnalyticsPermission =
      admin.role === "super_admin" ||
      admin.permissions.includes("view_analytics") ||
      admin.permissions.includes("manage_all_pages");

    if (!hasAnalyticsPermission) {
      // Redirect to dashboard if no permission
      router.push("/admin/dashboard");
      return;
    }

    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics. Please try again.");
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;

    const headers = ["Timestamp", "Page Path", "IP Address", "User Agent"];
    const rows = analytics.visits.map((visit) => [
      new Date(visit.timestamp).toLocaleString(),
      visit.path,
      visit.ip,
      visit.userAgent,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunidhi-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <section className="py-16 min-h-screen bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 min-h-screen bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Retry
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  if (!analytics) return null;

  const topPages = Object.entries(analytics.visitsByPath)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const visitsByDateSorted = Object.entries(analytics.visitsByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-30); // Last 30 days

  return (
    <section className="py-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Website Analytics</h1>
                  <p className="text-gray-600">Track visitor activity and page views</p>
                </div>
              </div>

              <Button onClick={exportToCSV}>
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Visits</p>
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalVisits}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Unique Pages</p>
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(analytics.visitsByPath).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pages visited</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Today's Visits</p>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.visitsByDate[new Date().toISOString().split("T")[0]] || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current day</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Active Days</p>
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(analytics.visitsByDate).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Days tracked</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map(([path, count], index) => {
                    const maxCount = topPages[0][1];
                    const percentage = (count / maxCount) * 100;

                    return (
                      <div key={path}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700 truncate flex-1">
                            {index + 1}. {path}
                          </p>
                          <span className="text-sm font-semibold text-gray-900 ml-2">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {topPages.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No page visits yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visits by Date */}
            <Card>
              <CardHeader>
                <CardTitle>Visits Over Time</CardTitle>
                <CardDescription>Daily visitor trends (last 30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visitsByDateSorted.reverse().slice(0, 15).map(([date, count]) => {
                    const maxCount = Math.max(...visitsByDateSorted.map(([, c]) => c));
                    const percentage = (count / maxCount) * 100;

                    return (
                      <div key={date}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <span className="text-sm font-semibold text-gray-900">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {visitsByDateSorted.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No visits recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Visits Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent Visits (Last 100)
              </CardTitle>
              <CardDescription>Detailed view of recent visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Timestamp
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Page Path
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Browser
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentVisits.map((visit, index) => {
                      // Extract browser from user agent
                      const browserMatch = visit.userAgent.match(
                        /(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/
                      );
                      const browser = browserMatch
                        ? browserMatch[0].split("/")[0]
                        : "Unknown";

                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(visit.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                            {visit.path}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{visit.ip}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{browser}</td>
                        </tr>
                      );
                    })}

                    {analytics.recentVisits.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">
                          No visits recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
