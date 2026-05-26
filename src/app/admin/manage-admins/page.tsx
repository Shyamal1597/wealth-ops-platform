"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AdminSessionGuard } from "@/components/admin/AdminSessionGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Trash2,
  Edit,
  Mail,
  Shield,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin";
  permissions: string[];
  createdAt: string;
  approvedBy?: string;
}

interface AdminData {
  role: string;
}

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

export default function ManageAdminsPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    sendEmail: true,
    permissions: [] as string[],
  });

  const router = useRouter();

  const availablePermissions: Permission[] = [
    // Core Permissions
    {
      id: "view_analytics",
      label: "View Analytics",
      description: "Access website analytics and visitor statistics",
      category: "Analytics"
    },
    {
      id: "manage_admins",
      label: "Manage Admins",
      description: "Create, edit, and delete admin accounts (Super Admin only)",
      category: "System"
    },

    // Content Management
    {
      id: "manage_feedbacks",
      label: "Manage Feedbacks",
      description: "View and respond to customer feedback submissions",
      category: "Content"
    },
    {
      id: "manage_blogs",
      label: "Manage Blogs",
      description: "Create, edit, publish, and delete blog posts",
      category: "Content"
    },
    {
      id: "upload_reports",
      label: "Upload Research Reports",
      description: "Upload and manage research reports and documents",
      category: "Content"
    },
    {
      id: "manage_daily_updates",
      label: "Manage Daily Updates",
      description: "Upload, edit, and manage Morning Buzz daily updates",
      category: "Content"
    },
    {
      id: "manage_testimonials",
      label: "Manage Testimonials",
      description: "Add, edit, and delete client testimonials",
      category: "Content"
    },
    {
      id: "upload_content",
      label: "Upload General Content",
      description: "Upload and manage general website content and media",
      category: "Content"
    },

    // Homepage & Features
    {
      id: "manage_homepage",
      label: "Manage Homepage",
      description: "Edit homepage sections, statistics, and service offerings",
      category: "Website"
    },
    {
      id: "manage_app_features",
      label: "Manage App Features",
      description: "Manage mobile app features and screenshots",
      category: "Website"
    },
    {
      id: "manage_site_content",
      label: "Manage Site Content",
      description: "Edit general website pages and content sections",
      category: "Website"
    },

    // About Section
    {
      id: "manage_leadership",
      label: "Manage Leadership",
      description: "Add, edit, and manage leadership team profiles",
      category: "About"
    },
    {
      id: "manage_awards",
      label: "Manage Awards",
      description: "Add, edit, and manage company awards and recognitions",
      category: "About"
    },
    {
      id: "manage_timeline",
      label: "Manage Timeline",
      description: "Edit company history timeline and milestones",
      category: "About"
    },
    {
      id: "manage_life_images",
      label: "Manage Life @ Sunidhi",
      description: "Upload and manage workplace culture images",
      category: "About"
    },
    {
      id: "manage_careers",
      label: "Manage Careers",
      description: "Create, edit, and manage job postings",
      category: "About"
    },

    // CSR & Foundation
    {
      id: "manage_csr",
      label: "Manage CSR",
      description: "Edit CSR initiatives and programs",
      category: "Social"
    },
    {
      id: "manage_foundation",
      label: "Manage Foundation",
      description: "Edit foundation programs and activities",
      category: "Social"
    },

    // Products
    {
      id: "manage_sip_products",
      label: "Manage SIP Products",
      description: "Create, edit, and manage Direct Equity SIP stock portfolios",
      category: "Content"
    },

    // Full Access
    {
      id: "manage_all_pages",
      label: "Full Access (All Pages)",
      description: "Complete access to all admin features and pages",
      category: "System"
    },
  ];

  useEffect(() => {
    // Check if user is logged in as admin
    const storedAdminData = sessionStorage.getItem("adminData");
    if (!storedAdminData) {
      router.push("/admin/login");
      return;
    }

    const parsedAdminData = JSON.parse(storedAdminData);
    setAdminData(parsedAdminData);

    // Check if user is super admin
    if (parsedAdminData.role !== "super_admin") {
      router.push("/admin/dashboard");
      return;
    }

    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/manage");

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data.admins);
    } catch (err) {
      setError("Failed to load admins. Please try again.");
      console.error("Error fetching admins:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin");
      }

      // Show success message with email status
      if (data.emailError) {
        setSuccess(`Admin created successfully! ⚠️ ${data.emailError}`);
      } else if (formData.sendEmail && data.emailSent) {
        setSuccess(`Admin created successfully! ✅ Credentials sent via email to ${formData.email}`);
      } else {
        setSuccess("Admin created successfully!");
      }
      setShowCreateForm(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        sendEmail: true,
        permissions: [],
      });
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/manage?adminId=${adminId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete admin");
      }

      setSuccess(`Admin "${adminName}" deleted successfully!`);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || "Failed to delete admin");
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "", // Don't pre-fill password
      fullName: admin.fullName,
      sendEmail: false,
      permissions: admin.permissions,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updates: any = {
        permissions: formData.permissions,
      };

      // Only include password if it's been changed
      if (formData.password) {
        updates.password = formData.password;
      }

      const response = await fetch("/api/admin/manage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: editingAdmin.id,
          updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update admin");
      }

      setSuccess(`Admin "${editingAdmin.fullName}" updated successfully!`);
      setShowEditForm(false);
      setEditingAdmin(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        sendEmail: true,
        permissions: [],
      });
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || "Failed to update admin");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  if (isLoading) {
    return (
      <section className="py-16 min-h-screen bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-gray-600">Loading admin management...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 min-h-screen bg-gray-50">
      <AdminSessionGuard />
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
                  <p className="text-gray-600">Create and manage administrator accounts</p>
                </div>
              </div>

              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create New Admin
                </Button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError("")} className="ml-auto">
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <X className="h-5 w-5 text-green-600" />
              </button>
            </div>
          )}

          {/* Edit Admin Form */}
          {showEditForm && editingAdmin && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Admin: {editingAdmin.fullName}
                </CardTitle>
                <CardDescription>
                  Update permissions and password for this administrator account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateAdmin} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        New Password (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Leave blank to keep current password"
                        disabled={isUpdating}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only fill if you want to change the password
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Permissions
                      <span className="text-xs font-normal text-gray-600 ml-2">
                        ({formData.permissions.length} selected)
                      </span>
                    </label>

                    <div className="space-y-4">
                      {["System", "Analytics", "Content", "Website", "About", "Social"].map((category) => {
                        const categoryPermissions = availablePermissions.filter(
                          (p) => p.category === category
                        );

                        if (categoryPermissions.length === 0) return null;

                        return (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-sm text-gray-900 mb-3">
                              {category} Permissions
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {categoryPermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-start gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50"
                                >
                                  <input
                                    type="checkbox"
                                    id={`edit-${permission.id}`}
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                    className="mt-1"
                                    disabled={isUpdating || permission.id === "manage_admins"}
                                  />
                                  <label htmlFor={`edit-${permission.id}`} className="flex-1 cursor-pointer">
                                    <p className="font-medium text-sm">{permission.label}</p>
                                    <p className="text-xs text-gray-600">{permission.description}</p>
                                    {permission.id === "manage_admins" && (
                                      <p className="text-xs text-red-600 mt-1">
                                        ⚠️ Super Admin only
                                      </p>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Select Options */}
                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const allPermissions = availablePermissions
                            .filter((p) => p.id !== "manage_admins")
                            .map((p) => p.id);
                          setFormData({ ...formData, permissions: allPermissions });
                        }}
                        disabled={isUpdating}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, permissions: [] })}
                        disabled={isUpdating}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Admin Account"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingAdmin(null);
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Create Admin Form */}
          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create New Admin Account
                </CardTitle>
                <CardDescription>
                  Fill in the details to create a new administrator account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdmin} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter full name"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Username *</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter username"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="admin@sunidhi.com"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter secure password"
                        required
                        disabled={isCreating}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Permissions
                      <span className="text-xs font-normal text-gray-600 ml-2">
                        ({formData.permissions.length} selected)
                      </span>
                    </label>

                    <div className="space-y-4">
                      {/* Group permissions by category */}
                      {["System", "Analytics", "Content", "Website", "About", "Social"].map((category) => {
                        const categoryPermissions = availablePermissions.filter(
                          (p) => p.category === category
                        );

                        if (categoryPermissions.length === 0) return null;

                        return (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-sm text-gray-900 mb-3">
                              {category} Permissions
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {categoryPermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-start gap-3 p-3 border border-gray-100 rounded-md hover:bg-gray-50"
                                >
                                  <input
                                    type="checkbox"
                                    id={permission.id}
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                    className="mt-1"
                                    disabled={isCreating || permission.id === "manage_admins"}
                                  />
                                  <label htmlFor={permission.id} className="flex-1 cursor-pointer">
                                    <p className="font-medium text-sm">{permission.label}</p>
                                    <p className="text-xs text-gray-600">{permission.description}</p>
                                    {permission.id === "manage_admins" && (
                                      <p className="text-xs text-red-600 mt-1">
                                        ⚠️ Super Admin only
                                      </p>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Select Options */}
                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Select all non-system permissions
                          const allPermissions = availablePermissions
                            .filter((p) => p.id !== "manage_admins")
                            .map((p) => p.id);
                          setFormData({ ...formData, permissions: allPermissions });
                        }}
                        disabled={isCreating}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, permissions: [] })}
                        disabled={isCreating}
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Select only content permissions
                          const contentPermissions = availablePermissions
                            .filter((p) => p.category === "Content")
                            .map((p) => p.id);
                          setFormData({ ...formData, permissions: contentPermissions });
                        }}
                        disabled={isCreating}
                      >
                        Content Only
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={formData.sendEmail}
                      onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                      disabled={isCreating}
                    />
                    <label htmlFor="sendEmail" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm text-blue-900">
                          Send credentials via email
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Admin will receive login credentials at the provided email address
                      </p>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Admin Account"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Admin List */}
          <Card>
            <CardHeader>
              <CardTitle>Administrator Accounts ({admins.length})</CardTitle>
              <CardDescription>
                Manage existing administrator accounts and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${admin.role === "super_admin" ? "bg-red-100" : "bg-blue-100"
                          }`}>
                          {admin.role === "super_admin" ? (
                            <ShieldCheck className="h-6 w-6 text-red-600" />
                          ) : (
                            <Shield className="h-6 w-6 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{admin.fullName}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${admin.role === "super_admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                              }`}>
                              {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <span className="font-medium">Username:</span> {admin.username}
                            </p>
                            <p>
                              <span className="font-medium">Email:</span> {admin.email}
                            </p>
                            <p>
                              <span className="font-medium">Created:</span>{" "}
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="mt-3">
                            {admin.role === "super_admin" && (
                              <p className="text-xs text-green-600 font-medium mb-1">
                                ✓ Super Admin — automatically has all current and future permissions
                              </p>
                            )}
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Permissions ({admin.role === "super_admin" ? availablePermissions.length : admin.permissions.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(admin.role === "super_admin"
                                ? availablePermissions.map((p) => p.id)
                                : admin.permissions
                              ).map((permission) => {
                                // Find the permission details to get category
                                const permissionDetails = availablePermissions.find(
                                  (p) => p.id === permission
                                );
                                const category = permissionDetails?.category || "Other";

                                // Color based on category
                                const categoryColors: Record<string, string> = {
                                  System: "bg-red-100 text-red-700 border-red-200",
                                  Analytics: "bg-purple-100 text-purple-700 border-purple-200",
                                  Content: "bg-blue-100 text-blue-700 border-blue-200",
                                  Website: "bg-green-100 text-green-700 border-green-200",
                                  About: "bg-yellow-100 text-yellow-700 border-yellow-200",
                                  Social: "bg-pink-100 text-pink-700 border-pink-200",
                                  Other: "bg-gray-100 text-gray-700 border-gray-200",
                                };

                                return (
                                  <span
                                    key={permission}
                                    className={`text-xs px-2 py-1 border rounded ${categoryColors[category]
                                      }`}
                                    title={permissionDetails?.description || permission}
                                  >
                                    {permissionDetails?.label || permission.replace(/_/g, " ")}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {admin.role !== "super_admin" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAdmin(admin)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id, admin.fullName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {admins.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No administrators found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
