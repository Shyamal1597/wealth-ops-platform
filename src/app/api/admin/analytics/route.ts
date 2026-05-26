import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { verifyAdminToken } from "@/lib/admin-auth";

const ANALYTICS_FILE = path.join(process.cwd(), "data", "analytics.json");

interface Visit {
  timestamp: string;
  path: string;
  userAgent: string;
  ip: string;
}

interface Analytics {
  totalVisits: number;
  visits: Visit[];
}

async function getAnalytics(): Promise<Analytics> {
  try {
    if (!existsSync(ANALYTICS_FILE)) {
      return { totalVisits: 0, visits: [] };
    }
    const data = await readFile(ANALYTICS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading analytics file:", error);
    return { totalVisits: 0, visits: [] };
  }
}

// GET /api/admin/analytics - Get all analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await getAnalytics();

    // Group visits by date
    const visitsByDate: { [key: string]: number } = {};
    const visitsByPath: { [key: string]: number } = {};

    analytics.visits.forEach((visit) => {
      const date = new Date(visit.timestamp).toISOString().split('T')[0];
      visitsByDate[date] = (visitsByDate[date] || 0) + 1;
      visitsByPath[visit.path] = (visitsByPath[visit.path] || 0) + 1;
    });

    return NextResponse.json({
      totalVisits: analytics.totalVisits,
      visits: analytics.visits,
      visitsByDate,
      visitsByPath,
      recentVisits: analytics.visits.slice(-100).reverse(), // Last 100 visits
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
