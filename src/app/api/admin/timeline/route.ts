import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "data", "timeline.json");
    const data = await readFile(filePath, "utf-8");
    const timeline = JSON.parse(data);
    timeline.sort((a: any, b: any) => a.order - b.order);
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Error loading timeline:", error);
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const filePath = path.join(process.cwd(), "data", "timeline.json");
    const data = await readFile(filePath, "utf-8");
    const timeline = JSON.parse(data);

    const newItem = {
      id: `timeline-${Date.now()}`,
      ...body
    };

    timeline.push(newItem);
    await writeFile(filePath, JSON.stringify(timeline, null, 2));

    return NextResponse.json({ message: "Timeline item added", item: newItem });
  } catch (error) {
    console.error("Error adding timeline item:", error);
    return NextResponse.json({ error: "Failed to add timeline item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    const filePath = path.join(process.cwd(), "data", "timeline.json");
    const data = await readFile(filePath, "utf-8");
    const timeline = JSON.parse(data);

    const index = timeline.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Timeline item not found" }, { status: 404 });
    }

    timeline[index] = { ...timeline[index], ...updates };
    await writeFile(filePath, JSON.stringify(timeline, null, 2));

    return NextResponse.json({ message: "Timeline item updated" });
  } catch (error) {
    console.error("Error updating timeline item:", error);
    return NextResponse.json({ error: "Failed to update timeline item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "timeline.json");
    const data = await readFile(filePath, "utf-8");
    let timeline = JSON.parse(data);

    timeline = timeline.filter((item: any) => item.id !== id);
    await writeFile(filePath, JSON.stringify(timeline, null, 2));

    return NextResponse.json({ message: "Timeline item deleted" });
  } catch (error) {
    console.error("Error deleting timeline item:", error);
    return NextResponse.json({ error: "Failed to delete timeline item" }, { status: 500 });
  }
}
