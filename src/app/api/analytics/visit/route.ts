import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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

async function saveAnalytics(analytics: Analytics): Promise<void> {
  try {
    await writeFile(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
  } catch (error) {
    console.error("Error saving analytics:", error);
  }
}

// POST /api/analytics/visit - Track a visit
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      // If body is empty or invalid JSON, use default
      body = { path: "/" };
    }

    const { path: visitPath } = body;

    const analytics = await getAnalytics();

    const visit: Visit = {
      timestamp: new Date().toISOString(),
      path: visitPath || "/",
      userAgent: request.headers.get("user-agent") || "Unknown",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
    };

    analytics.totalVisits += 1;
    analytics.visits.push(visit);

    await saveAnalytics(analytics);

    return NextResponse.json({ success: true, totalVisits: analytics.totalVisits });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
