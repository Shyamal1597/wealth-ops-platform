import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  duration: string;
  text: string;
  rating: number;
  image: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// GET - List all testimonials
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

    // Load testimonials
    const testimonialsFile = path.join(process.cwd(), "data", "testimonials.json");
    let testimonials: Testimonial[] = [];
    try {
      const data = await readFile(testimonialsFile, "utf-8");
      testimonials = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by order
    testimonials.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      testimonials,
      total: testimonials.length,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial
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
    const { name, company, duration, text, rating, image, active, order } = body;

    if (!name || !company || !text || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new testimonial
    const testimonialId = `test${Date.now()}`;
    const newTestimonial: Testimonial = {
      id: testimonialId,
      name,
      company,
      duration: duration || "",
      text,
      rating,
      image: image || "",
      active: active !== undefined ? active : true,
      order: order || 999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Load existing testimonials
    const testimonialsFile = path.join(process.cwd(), "data", "testimonials.json");
    let testimonials: Testimonial[] = [];
    try {
      const data = await readFile(testimonialsFile, "utf-8");
      testimonials = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new testimonial
    testimonials.push(newTestimonial);

    // Save updated testimonials
    await writeFile(testimonialsFile, JSON.stringify(testimonials, null, 2));

    return NextResponse.json({
      message: "Testimonial created successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a testimonial
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
    const { id, name, company, duration, text, rating, image, active, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Load testimonials
    const testimonialsFile = path.join(process.cwd(), "data", "testimonials.json");
    let testimonials: Testimonial[] = [];
    try {
      const data = await readFile(testimonialsFile, "utf-8");
      testimonials = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No testimonials found" },
        { status: 404 }
      );
    }

    // Find testimonial to update
    const testimonialIndex = testimonials.findIndex((t) => t.id === id);
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Update testimonial
    const updatedTestimonial: Testimonial = {
      ...testimonials[testimonialIndex],
      name: name || testimonials[testimonialIndex].name,
      company: company || testimonials[testimonialIndex].company,
      duration: duration !== undefined ? duration : testimonials[testimonialIndex].duration,
      text: text || testimonials[testimonialIndex].text,
      rating: rating || testimonials[testimonialIndex].rating,
      image: image !== undefined ? image : testimonials[testimonialIndex].image,
      active: active !== undefined ? active : testimonials[testimonialIndex].active,
      order: order !== undefined ? order : testimonials[testimonialIndex].order,
      updatedAt: new Date().toISOString(),
    };

    testimonials[testimonialIndex] = updatedTestimonial;

    // Save updated testimonials
    await writeFile(testimonialsFile, JSON.stringify(testimonials, null, 2));

    return NextResponse.json({
      message: "Testimonial updated successfully",
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a testimonial
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

    // Get testimonial ID from query
    const { searchParams } = new URL(request.url);
    const testimonialId = searchParams.get("id");

    if (!testimonialId) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Load testimonials
    const testimonialsFile = path.join(process.cwd(), "data", "testimonials.json");
    let testimonials: Testimonial[] = [];
    try {
      const data = await readFile(testimonialsFile, "utf-8");
      testimonials = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No testimonials found" },
        { status: 404 }
      );
    }

    // Find testimonial to delete
    const testimonialIndex = testimonials.findIndex((t) => t.id === testimonialId);
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Remove from array
    testimonials.splice(testimonialIndex, 1);

    // Save updated testimonials
    await writeFile(testimonialsFile, JSON.stringify(testimonials, null, 2));

    return NextResponse.json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
