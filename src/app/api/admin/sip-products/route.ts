import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "sip-products.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET - Read SIP products data
export async function GET() {
  try {
    const data = readData();
    if (!data) {
      return NextResponse.json({ error: "SIP product data not found" }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reading SIP products:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

// PUT - Update a specific profile/tier data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, tier, field, value } = body;

    if (!profile || !tier || !field) {
      return NextResponse.json({ error: "Missing profile, tier, or field" }, { status: 400 });
    }

    const data = readData();
    if (!data) {
      return NextResponse.json({ error: "SIP product data not found" }, { status: 404 });
    }

    if (!data.profiles[profile] || !data.profiles[profile].tiers[tier]) {
      return NextResponse.json({ error: "Invalid profile or tier" }, { status: 400 });
    }

    // Update the specific field
    data.profiles[profile].tiers[tier][field] = value;
    data.lastUpdated = new Date().toISOString().split("T")[0];

    writeData(data);

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating SIP products:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

// POST - Bulk update an entire tier's data (used by admin form save)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, tier, tierData } = body;

    if (!profile || !tier || !tierData) {
      return NextResponse.json({ error: "Missing profile, tier, or tierData" }, { status: 400 });
    }

    const data = readData();
    if (!data) {
      return NextResponse.json({ error: "SIP product data not found" }, { status: 404 });
    }

    if (!data.profiles[profile]) {
      return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
    }

    // Merge tier data
    data.profiles[profile].tiers[tier] = {
      ...data.profiles[profile].tiers[tier],
      ...tierData,
    };
    data.lastUpdated = new Date().toISOString().split("T")[0];

    writeData(data);

    return NextResponse.json({ message: "Tier data saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving SIP product tier:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
