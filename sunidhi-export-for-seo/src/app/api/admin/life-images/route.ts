import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface LifeImage {
  id: string;
  title: string;
  category: string;
  image: string;
  order: number;
}

// GET - List all life images
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

    // Load life images
    const imagesFile = path.join(process.cwd(), "data", "life-images.json");
    let images: LifeImage[] = [];
    try {
      const data = await readFile(imagesFile, "utf-8");
      images = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by order
    images.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (error) {
    console.error("Error fetching life images:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new life image
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
    const { title, category, image, order } = body;

    if (!title || !category || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new life image
    const imageId = `life-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newImage: LifeImage = {
      id: imageId,
      title,
      category,
      image,
      order: order || 999,
    };

    // Load existing images
    const imagesFile = path.join(process.cwd(), "data", "life-images.json");
    let images: LifeImage[] = [];
    try {
      const data = await readFile(imagesFile, "utf-8");
      images = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new image
    images.push(newImage);

    // Save updated images
    await writeFile(imagesFile, JSON.stringify(images, null, 2));

    return NextResponse.json({
      message: "Life image created successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error creating life image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a life image
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
    const { id, title, category, image, order } = body;

    if (!id || !title || !category || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load images
    const imagesFile = path.join(process.cwd(), "data", "life-images.json");
    let images: LifeImage[] = [];
    try {
      const data = await readFile(imagesFile, "utf-8");
      images = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No life images found" },
        { status: 404 }
      );
    }

    // Find image to update
    const imageIndex = images.findIndex((img) => img.id === id);
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: "Life image not found" },
        { status: 404 }
      );
    }

    // Update image
    const updatedImage: LifeImage = {
      ...images[imageIndex],
      title,
      category,
      image,
      order: order || images[imageIndex].order,
    };

    images[imageIndex] = updatedImage;

    // Save updated images
    await writeFile(imagesFile, JSON.stringify(images, null, 2));

    return NextResponse.json({
      message: "Life image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error("Error updating life image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a life image
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

    // Get image ID from query
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Load images
    const imagesFile = path.join(process.cwd(), "data", "life-images.json");
    let images: LifeImage[] = [];
    try {
      const data = await readFile(imagesFile, "utf-8");
      images = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No life images found" },
        { status: 404 }
      );
    }

    // Find image to delete
    const imageIndex = images.findIndex((img) => img.id === imageId);
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: "Life image not found" },
        { status: 404 }
      );
    }

    // Remove from array
    images.splice(imageIndex, 1);

    // Save updated images
    await writeFile(imagesFile, JSON.stringify(images, null, 2));

    return NextResponse.json({
      message: "Life image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting life image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
