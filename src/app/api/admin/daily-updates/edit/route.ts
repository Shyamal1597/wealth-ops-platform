import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { existsSync } from "fs";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, reportDate, description } = body;

        if (!id || !title || !reportDate) {
            return NextResponse.json(
                { error: "Missing required fields: id, title, or reportDate" },
                { status: 400 }
            );
        }

        const dataFile = path.join(process.cwd(), "data", "daily-updates.json");

        if (!existsSync(dataFile)) {
            return NextResponse.json({ error: "No updates found" }, { status: 404 });
        }

        const fileContent = await fs.readFile(dataFile, "utf-8");
        const data = JSON.parse(fileContent);

        if (!data.updates) {
            return NextResponse.json({ error: "No updates record found" }, { status: 404 });
        }

        const updateIndex = data.updates.findIndex((u: any) => u.id === id);
        if (updateIndex === -1) {
            return NextResponse.json({ error: "Daily update not found" }, { status: 404 });
        }

        // Keep all existing fields except what we are explicitly updating
        data.updates[updateIndex] = {
            ...data.updates[updateIndex],
            title,
            reportDate,
            description: description || undefined
        };

        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

        return NextResponse.json({
            success: true,
            update: data.updates[updateIndex]
        });
    } catch (error) {
        console.error("Error editing daily update:", error);
        return NextResponse.json(
            { error: "Failed to edit daily update" },
            { status: 500 }
        );
    }
}
