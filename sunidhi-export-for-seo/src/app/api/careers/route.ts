import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  active: boolean;
  postedDate: string;
}

// GET - List all active job postings (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Load job postings
    const jobsFile = path.join(process.cwd(), "data", "job-postings.json");
    let jobs: JobPosting[] = [];
    try {
      const data = await readFile(jobsFile, "utf-8");
      jobs = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty, return empty array
      return NextResponse.json({ jobs: [] });
    }

    // Filter only active jobs
    const activeJobs = jobs.filter(j => j.active);

    // Sort by posted date (newest first)
    activeJobs.sort((a, b) =>
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );

    return NextResponse.json({ jobs: activeJobs });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json({ jobs: [] });
  }
}
