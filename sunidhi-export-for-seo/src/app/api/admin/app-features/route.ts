import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  screenshot: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET - List all app features
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

    // Load app features
    const appFeaturesFile = path.join(process.cwd(), "data", "app-features.json");
    let appFeatures: AppFeature[] = [];
    try {
      const data = await readFile(appFeaturesFile, "utf-8");
      appFeatures = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by order
    appFeatures.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      appFeatures,
      total: appFeatures.length,
    });
  } catch (error) {
    console.error("Error fetching app features:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new app feature
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
    const { title, description, icon, screenshot, active, order } = body;

    if (!title || !description || !icon || !screenshot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new app feature
    const featureId = `feature${Date.now()}`;
    const newFeature: AppFeature = {
      id: featureId,
      title,
      description,
      icon,
      screenshot,
      active: active !== undefined ? active : true,
      order: order || 999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Load existing app features
    const appFeaturesFile = path.join(process.cwd(), "data", "app-features.json");
    let appFeatures: AppFeature[] = [];
    try {
      const data = await readFile(appFeaturesFile, "utf-8");
      appFeatures = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new feature
    appFeatures.push(newFeature);

    // Save updated app features
    await writeFile(appFeaturesFile, JSON.stringify(appFeatures, null, 2));

    return NextResponse.json({
      message: "App feature created successfully",
      feature: newFeature,
    });
  } catch (error) {
    console.error("Error creating app feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update an app feature
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
    const { id, title, description, icon, screenshot, active, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Feature ID is required" },
        { status: 400 }
      );
    }

    // Load app features
    const appFeaturesFile = path.join(process.cwd(), "data", "app-features.json");
    let appFeatures: AppFeature[] = [];
    try {
      const data = await readFile(appFeaturesFile, "utf-8");
      appFeatures = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No app features found" },
        { status: 404 }
      );
    }

    // Find feature to update
    const featureIndex = appFeatures.findIndex((f) => f.id === id);
    if (featureIndex === -1) {
      return NextResponse.json(
        { error: "App feature not found" },
        { status: 404 }
      );
    }

    // Update feature
    const updatedFeature: AppFeature = {
      ...appFeatures[featureIndex],
      title: title || appFeatures[featureIndex].title,
      description: description || appFeatures[featureIndex].description,
      icon: icon || appFeatures[featureIndex].icon,
      screenshot: screenshot || appFeatures[featureIndex].screenshot,
      active: active !== undefined ? active : appFeatures[featureIndex].active,
      order: order !== undefined ? order : appFeatures[featureIndex].order,
      updatedAt: new Date().toISOString(),
    };

    appFeatures[featureIndex] = updatedFeature;

    // Save updated app features
    await writeFile(appFeaturesFile, JSON.stringify(appFeatures, null, 2));

    return NextResponse.json({
      message: "App feature updated successfully",
      feature: updatedFeature,
    });
  } catch (error) {
    console.error("Error updating app feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an app feature
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

    // Get feature ID from query
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get("id");

    if (!featureId) {
      return NextResponse.json(
        { error: "Feature ID is required" },
        { status: 400 }
      );
    }

    // Load app features
    const appFeaturesFile = path.join(process.cwd(), "data", "app-features.json");
    let appFeatures: AppFeature[] = [];
    try {
      const data = await readFile(appFeaturesFile, "utf-8");
      appFeatures = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No app features found" },
        { status: 404 }
      );
    }

    // Find feature to delete
    const featureIndex = appFeatures.findIndex((f) => f.id === featureId);
    if (featureIndex === -1) {
      return NextResponse.json(
        { error: "App feature not found" },
        { status: 404 }
      );
    }

    // Remove from array
    appFeatures.splice(featureIndex, 1);

    // Save updated app features
    await writeFile(appFeaturesFile, JSON.stringify(appFeatures, null, 2));

    return NextResponse.json({
      message: "App feature deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting app feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
