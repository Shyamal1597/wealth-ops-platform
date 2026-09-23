import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { getComplaintsData, updateYearlyData, type ComplaintsSegment, type YearlyComplaintRow } from "@/lib/investor-complaints-store";

const SEGMENTS: ComplaintsSegment[] = ["stock-broker", "research-analyst", "depository-participant"];

async function requireAdmin(request: NextRequest) {
  const token = (await cookies()).get("admin-token")?.value;
  if (!token) return null;
  return verifyAdminPermission(token, "manage_investor_complaints");
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getComplaintsData());
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { segment, yearlyData } = (await request.json()) as {
    segment: ComplaintsSegment;
    yearlyData: YearlyComplaintRow[];
  };

  if (!SEGMENTS.includes(segment)) {
    return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
  }
  if (!Array.isArray(yearlyData) || yearlyData.some((r) => !r.year)) {
    return NextResponse.json({ error: "Invalid yearly data" }, { status: 400 });
  }

  const store = updateYearlyData(segment, yearlyData);
  return NextResponse.json(store[segment]);
}
