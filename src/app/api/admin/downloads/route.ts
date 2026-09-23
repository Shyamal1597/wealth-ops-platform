import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminPermission } from "@/lib/admin-auth";
import { getDownloadsData, updateForm, removeForm, type DownloadsTabId } from "@/lib/downloads-store";

const TAB_IDS: DownloadsTabId[] = ["equity", "depository", "ap-support", "mandatory", "policies"];

async function requireAdmin() {
  const token = (await cookies()).get("admin-token")?.value;
  if (!token) return null;
  return verifyAdminPermission(token, "manage_downloads");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getDownloadsData());
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tabId, formId, name } = (await request.json()) as { tabId: DownloadsTabId; formId: string; name: string };
  if (!TAB_IDS.includes(tabId) || !formId || !name?.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated = updateForm(tabId, formId, { name: name.trim() });
  if (!updated) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tabId = request.nextUrl.searchParams.get("tabId") as DownloadsTabId | null;
  const formId = request.nextUrl.searchParams.get("formId");
  if (!tabId || !TAB_IDS.includes(tabId) || !formId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const removed = removeForm(tabId, formId);
  if (!removed) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
