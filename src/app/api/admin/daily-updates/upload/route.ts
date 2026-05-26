import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const reportDate = formData.get("reportDate") as string;
        const description = formData.get("description") as string;

        if (!file || !title || !reportDate) {
            return NextResponse.json(
                { error: "Missing required fields: file, title, or reportDate" },
                { status: 400 }
            );
        }

        // Daily Updates are usually stored alongside research reports or in their own specific directory
        const uploadDir = path.join(process.cwd(), "public", "research-reports");

        if (!existsSync(uploadDir)) {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Save the file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileExtension = path.extname(file.name);
        const sanitizedFilename = `${reportId}${fileExtension}`;
        const filePath = path.join(uploadDir, sanitizedFilename);

        await fs.writeFile(filePath, buffer);

        const dataFile = path.join(process.cwd(), "data", "daily-updates.json");

        let data: { updates: any[] } = { updates: [] };

        if (existsSync(dataFile)) {
            const fileContent = await fs.readFile(dataFile, "utf-8");
            data = JSON.parse(fileContent);
            if (!data.updates) data.updates = [];
        }

        // Add new update to array
        const newUpdate = {
            id: reportId,
            title,
            category: "Fundamental",
            subcategory: "Daily",
            fileName: file.name,
            filePath: `/research-reports/${sanitizedFilename}`,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            reportDate: reportDate,
            description: description || undefined
        };

        data.updates.push(newUpdate);

        // Save updated reports to JSON
        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, update: newUpdate });
    } catch (error) {
        console.error("Error uploading daily update:", error);
        return NextResponse.json(
            { error: "Failed to upload daily update" },
            { status: 500 }
        );
    }
}
