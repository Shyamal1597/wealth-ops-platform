import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { existsSync } from "fs";

// Define the interface for a Daily Update explicitly here since it might be slightly different than ResearchReport
interface DailyUpdate {
    id: string;
    title: string;
    category?: string;
    subcategory?: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadDate: string;
    reportDate: string;
    description?: string;
}

export async function GET(request: NextRequest) {
    try {
        const dataFile = path.join(process.cwd(), "data", "daily-updates.json");

        if (!existsSync(dataFile)) {
            return NextResponse.json({ updates: [] });
        }

        const fileContent = await fs.readFile(dataFile, "utf-8");
        const data = JSON.parse(fileContent);
        const updates: DailyUpdate[] = data.updates || [];

        // Sort by report date (newest first)
        updates.sort((a, b) => {
            const dateA = new Date(a.reportDate || a.uploadDate).getTime();
            const dateB = new Date(b.reportDate || b.uploadDate).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({ updates });
    } catch (error: any) {
        console.error("Error fetching daily updates:", error);
        return NextResponse.json(
            { error: "Failed to fetch daily updates", updates: [] },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing update ID" }, { status: 400 });
        }

        const dataFile = path.join(process.cwd(), "data", "daily-updates.json");

        if (!existsSync(dataFile)) {
            return NextResponse.json({ error: "No updates found" }, { status: 404 });
        }

        const fileContent = await fs.readFile(dataFile, "utf-8");
        const data = JSON.parse(fileContent);
        const updates: DailyUpdate[] = data.updates || [];

        const updateIndex = updates.findIndex((u) => u.id === id);
        if (updateIndex === -1) {
            return NextResponse.json({ error: "Daily update not found" }, { status: 404 });
        }

        const update = updates[updateIndex];

        // Delete the file from the filesystem if it exists
        const filePath = path.join(process.cwd(), "public", update.filePath);
        if (existsSync(filePath)) {
            await fs.unlink(filePath);
        }

        // Remove from array and save
        updates.splice(updateIndex, 1);
        data.updates = updates;

        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting daily update:", error);
        return NextResponse.json(
            { error: "Failed to delete daily update" },
            { status: 500 }
        );
    }
}
