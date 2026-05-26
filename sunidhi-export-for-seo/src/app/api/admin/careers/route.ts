import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

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

// GET - List all job postings
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

    // Load job postings
    const jobsFile = path.join(process.cwd(), "data", "job-postings.json");
    let jobs: JobPosting[] = [];
    try {
      const data = await readFile(jobsFile, "utf-8");
      jobs = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or is empty
    }

    // Sort by posted date (newest first)
    jobs.sort((a, b) =>
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );

    return NextResponse.json({
      jobs,
      total: jobs.length,
      active: jobs.filter(j => j.active).length,
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new job posting
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
    const { title, location, type, experience, description, active } = body;

    if (!title || !location || !type || !experience || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new job posting
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newJob: JobPosting = {
      id: jobId,
      title,
      location,
      type,
      experience,
      description,
      active: active !== false, // default to true
      postedDate: new Date().toISOString(),
    };

    // Load existing jobs
    const jobsFile = path.join(process.cwd(), "data", "job-postings.json");
    let jobs: JobPosting[] = [];
    try {
      const data = await readFile(jobsFile, "utf-8");
      jobs = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }

    // Add new job
    jobs.push(newJob);

    // Save updated jobs
    await writeFile(jobsFile, JSON.stringify(jobs, null, 2));

    return NextResponse.json({
      message: "Job posting created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a job posting
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
    const { id, title, location, type, experience, description, active } = body;

    if (!id || !title || !location || !type || !experience || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load jobs
    const jobsFile = path.join(process.cwd(), "data", "job-postings.json");
    let jobs: JobPosting[] = [];
    try {
      const data = await readFile(jobsFile, "utf-8");
      jobs = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No job postings found" },
        { status: 404 }
      );
    }

    // Find job to update
    const jobIndex = jobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Update job
    const updatedJob: JobPosting = {
      ...jobs[jobIndex],
      title,
      location,
      type,
      experience,
      description,
      active: active !== false,
    };

    jobs[jobIndex] = updatedJob;

    // Save updated jobs
    await writeFile(jobsFile, JSON.stringify(jobs, null, 2));

    return NextResponse.json({
      message: "Job posting updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job posting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a job posting
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

    // Get job ID from query
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Load jobs
    const jobsFile = path.join(process.cwd(), "data", "job-postings.json");
    let jobs: JobPosting[] = [];
    try {
      const data = await readFile(jobsFile, "utf-8");
      jobs = JSON.parse(data);
    } catch (err) {
      return NextResponse.json(
        { error: "No job postings found" },
        { status: 404 }
      );
    }

    // Find job to delete
    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      );
    }

    // Remove from array
    jobs.splice(jobIndex, 1);

    // Save updated jobs
    await writeFile(jobsFile, JSON.stringify(jobs, null, 2));

    return NextResponse.json({
      message: "Job posting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
