import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export interface HomepageData {
  hero: {
    badge: {
      text: string;
      icon: string;
    };
    title: string;
    titleHighlight: string;
    subtitle: string;
    active: boolean;
    updatedAt: string;
  };
  statistics: Array<{
    id: string;
    value: string;
    label: string;
    icon: string;
    order: number;
    active: boolean;
  }>;
  servicesSection: {
    title: string;
    subtitle: string;
    active: boolean;
  };
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    link: string;
    order: number;
    active: boolean;
  }>;
  whyChooseUs: {
    title: string;
    subtitle: string;
    active: boolean;
    reasons: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      order: number;
      active: boolean;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
    active: boolean;
  };
}

// GET - Get homepage content
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

    // Load homepage data
    const homepageFile = path.join(process.cwd(), "data", "homepage.json");
    let homepage: HomepageData;
    try {
      const data = await readFile(homepageFile, "utf-8");
      homepage = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "Homepage data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      homepage,
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update homepage content
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
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: "Section and data are required" },
        { status: 400 }
      );
    }

    // Load homepage data
    const homepageFile = path.join(process.cwd(), "data", "homepage.json");
    let homepage: HomepageData;
    try {
      const fileData = await readFile(homepageFile, "utf-8");
      homepage = JSON.parse(fileData);
    } catch (err) {
      return NextResponse.json(
        { error: "Homepage data not found" },
        { status: 404 }
      );
    }

    // Update the specific section
    switch (section) {
      case "hero":
        homepage.hero = {
          ...homepage.hero,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        break;
      case "statistics":
        homepage.statistics = data;
        break;
      case "servicesSection":
        homepage.servicesSection = data;
        break;
      case "services":
        homepage.services = data;
        break;
      case "whyChooseUs":
        homepage.whyChooseUs = data;
        break;
      case "cta":
        homepage.cta = data;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid section" },
          { status: 400 }
        );
    }

    // Save updated homepage data
    await writeFile(homepageFile, JSON.stringify(homepage, null, 2));

    return NextResponse.json({
      message: "Homepage updated successfully",
      homepage,
    });
  } catch (error) {
    console.error("Error updating homepage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
