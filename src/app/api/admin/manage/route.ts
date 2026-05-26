import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdmins,
  findAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  verifyAdminToken,
} from "@/lib/admin-auth";
import { sendAdminCredentials } from "@/lib/email";

// Helper function to verify super admin access
async function verifySuperAdmin(request: NextRequest): Promise<{ authorized: boolean; adminId?: string; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");

  if (!token) {
    return { authorized: false, error: "Unauthorized - No token provided" };
  }

  const decoded = await verifyAdminToken(token.value);
  if (!decoded) {
    return { authorized: false, error: "Unauthorized - Invalid token" };
  }

  const admin = await findAdmin(decoded.username);
  if (!admin || admin.role !== "super_admin") {
    return { authorized: false, error: "Forbidden - Super admin access required" };
  }

  return { authorized: true, adminId: admin.id };
}

// GET - List all admins (Super Admin only)
export async function GET(request: NextRequest) {
  try {
    const verification = await verifySuperAdmin(request);
    if (!verification.authorized) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.error?.includes("Forbidden") ? 403 : 401 }
      );
    }

    const admins = await getAdmins();

    // Remove passwords from response
    const sanitizedAdmins = admins.map(({ password, ...admin }) => admin);

    return NextResponse.json({ admins: sanitizedAdmins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new admin (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const verification = await verifySuperAdmin(request);
    if (!verification.authorized) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.error?.includes("Forbidden") ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { username, email, password, fullName, permissions, sendEmail } = body;

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields: username, email, password, fullName" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await findAdmin(username) || await findAdmin(email);
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this username or email already exists" },
        { status: 409 }
      );
    }

    // Create new admin
    const newAdmin = await createAdmin({
      username,
      email,
      password,
      fullName,
      role: "admin", // Regular admins only, not super_admin
      permissions: permissions || [
        "manage_feedbacks",
        "upload_reports",
        "upload_content",
        "view_analytics",
      ],
      approvedBy: verification.adminId,
    });

    // Send credentials via email if requested
    let emailSent = false;
    let emailError = null;
    if (sendEmail) {
      emailSent = await sendAdminCredentials(email, username, password, fullName);
      if (!emailSent) {
        emailError = "Failed to send email. Please check SMTP configuration in .env.local";
        console.warn("Failed to send credentials email to:", email);
        console.warn("Make sure SMTP_USER and SMTP_PASSWORD are configured correctly");
      }
    }

    // Remove password from response
    const { password: _, ...sanitizedAdmin } = newAdmin;

    return NextResponse.json({
      message: "Admin created successfully",
      admin: sanitizedAdmin,
      emailSent: sendEmail && emailSent,
      emailError: emailError,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update admin (Super Admin only)
export async function PUT(request: NextRequest) {
  try {
    const verification = await verifySuperAdmin(request);
    if (!verification.authorized) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.error?.includes("Forbidden") ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { adminId, updates } = body;

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Prevent updating super admin role
    if (updates.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot change admin role to super_admin" },
        { status: 403 }
      );
    }

    const updatedAdmin = await updateAdmin(adminId, updates);

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...sanitizedAdmin } = updatedAdmin;

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: sanitizedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete admin (Super Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const verification = await verifySuperAdmin(request);
    if (!verification.authorized) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.error?.includes("Forbidden") ? 403 : 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Prevent deleting self
    if (adminId === verification.adminId) {
      return NextResponse.json(
        { error: "Cannot delete your own admin account" },
        { status: 403 }
      );
    }

    // Prevent deleting super admin
    const adminToDelete = (await getAdmins()).find((a) => a.id === adminId);
    if (adminToDelete?.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot delete super admin account" },
        { status: 403 }
      );
    }

    const deleted = await deleteAdmin(adminId);

    if (!deleted) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
