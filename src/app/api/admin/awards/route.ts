import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface Award {
  id: string;
  year: string;
  title: string;
  description: string;
}

// GET - List all awards
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

    // Load awards
    const awardsFile = path.join(process.cwd(), "data", "awards.json");
    let awards: Award[] = [];
    try {
      const data = await readFile(awardsFile, "utf-8");
      awards = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by year (newest first)
    awards.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return NextResponse.json({
      awards,
      total: awards.length,
    });
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new award
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
    const { year, title, description } = body;

    if (!year || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new award
    const awardId = `award-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAward: Award = {
      id: awardId,
      year,
      title,
      description,
    };

    // Load existing awards
    const awardsFile = path.join(process.cwd(), "data", "awards.json");
    let awards: Award[] = [];
    try {
      const data = await readFile(awardsFile, "utf-8");
      awards = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new award
    awards.push(newAward);

    // Save updated awards
    await writeFile(awardsFile, JSON.stringify(awards, null, 2));

    return NextResponse.json({
      message: "Award created successfully",
      award: newAward,
    });
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update an award
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
    const { id, year, title, description } = body;

    if (!id || !year || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load awards
    const awardsFile = path.join(process.cwd(), "data", "awards.json");
    let awards: Award[] = [];
    try {
      const data = await readFile(awardsFile, "utf-8");
      awards = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No awards found" },
        { status: 404 }
      );
    }

    // Find award to update
    const awardIndex = awards.findIndex((a) => a.id === id);
    if (awardIndex === -1) {
      return NextResponse.json(
        { error: "Award not found" },
        { status: 404 }
      );
    }

    // Update award
    const updatedAward: Award = {
      ...awards[awardIndex],
      year,
      title,
      description,
    };

    awards[awardIndex] = updatedAward;

    // Save updated awards
    await writeFile(awardsFile, JSON.stringify(awards, null, 2));

    return NextResponse.json({
      message: "Award updated successfully",
      award: updatedAward,
    });
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an award
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

    // Get award ID from query
    const { searchParams } = new URL(request.url);
    const awardId = searchParams.get("id");

    if (!awardId) {
      return NextResponse.json(
        { error: "Award ID is required" },
        { status: 400 }
      );
    }

    // Load awards
    const awardsFile = path.join(process.cwd(), "data", "awards.json");
    let awards: Award[] = [];
    try {
      const data = await readFile(awardsFile, "utf-8");
      awards = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No awards found" },
        { status: 404 }
      );
    }

    // Find award to delete
    const awardIndex = awards.findIndex((a) => a.id === awardId);
    if (awardIndex === -1) {
      return NextResponse.json(
        { error: "Award not found" },
        { status: 404 }
      );
    }

    // Remove from array
    awards.splice(awardIndex, 1);

    // Save updated awards
    await writeFile(awardsFile, JSON.stringify(awards, null, 2));

    return NextResponse.json({
      message: "Award deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
