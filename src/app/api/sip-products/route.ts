import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "sip-products.json");

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: "SIP product data not found" }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reading SIP products data:", error);
    return NextResponse.json({ error: "Failed to load SIP product data" }, { status: 500 });
  }
}
