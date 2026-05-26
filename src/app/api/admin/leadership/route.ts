import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface Leader {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  order: number;
}

// GET - List all leaders
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Load leaders
    const leadersFile = path.join(process.cwd(), "data", "leadership.json");
    let leaders: Leader[] = [];
    try {
      const data = await readFile(leadersFile, "utf-8");
      leaders = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by order
    leaders.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      leaders,
      total: leaders.length,
    });
  } catch (error) {
    console.error("Error fetching leaders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new leader
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, position, description, image, order } = body;

    if (!name || !position || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new leader
    const leaderId = `leader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newLeader: Leader = {
      id: leaderId,
      name,
      position,
      description,
      image,
      order: order || 999,
    };

    // Load existing leaders
    const leadersFile = path.join(process.cwd(), "data", "leadership.json");
    let leaders: Leader[] = [];
    try {
      const data = await readFile(leadersFile, "utf-8");
      leaders = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new leader
    leaders.push(newLeader);

    // Save updated leaders
    await writeFile(leadersFile, JSON.stringify(leaders, null, 2));

    return NextResponse.json({
      message: "Leader created successfully",
      leader: newLeader,
    });
  } catch (error) {
    console.error("Error creating leader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a leader
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { id, name, position, description, image, order } = body;

    if (!id || !name || !position || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load leaders
    const leadersFile = path.join(process.cwd(), "data", "leadership.json");
    let leaders: Leader[] = [];
    try {
      const data = await readFile(leadersFile, "utf-8");
      leaders = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No leaders found" },
        { status: 404 }
      );
    }

    // Find leader to update
    const leaderIndex = leaders.findIndex((l) => l.id === id);
    if (leaderIndex === -1) {
      return NextResponse.json(
        { error: "Leader not found" },
        { status: 404 }
      );
    }

    // Update leader
    const updatedLeader: Leader = {
      ...leaders[leaderIndex],
      name,
      position,
      description,
      image,
      order: order || leaders[leaderIndex].order,
    };

    leaders[leaderIndex] = updatedLeader;

    // Save updated leaders
    await writeFile(leadersFile, JSON.stringify(leaders, null, 2));

    return NextResponse.json({
      message: "Leader updated successfully",
      leader: updatedLeader,
    });
  } catch (error) {
    console.error("Error updating leader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a leader
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get leader ID from query
    const { searchParams } = new URL(request.url);
    const leaderId = searchParams.get("id");

    if (!leaderId) {
      return NextResponse.json(
        { error: "Leader ID is required" },
        { status: 400 }
      );
    }

    // Load leaders
    const leadersFile = path.join(process.cwd(), "data", "leadership.json");
    let leaders: Leader[] = [];
    try {
      const data = await readFile(leadersFile, "utf-8");
      leaders = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No leaders found" },
        { status: 404 }
      );
    }

    // Find leader to delete
    const leaderIndex = leaders.findIndex((l) => l.id === leaderId);
    if (leaderIndex === -1) {
      return NextResponse.json(
        { error: "Leader not found" },
        { status: 404 }
      );
    }

    // Remove from array
    leaders.splice(leaderIndex, 1);

    // Save updated leaders
    await writeFile(leadersFile, JSON.stringify(leaders, null, 2));

    return NextResponse.json({
      message: "Leader deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting leader:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
