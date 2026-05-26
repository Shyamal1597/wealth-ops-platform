"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  MessageSquare,
  FileText,
  BookOpen,
  Download,
  Calendar,
  Mail,
  Phone,
  Upload,
  Trash2,
  Eye,
  Plus,
  X,
  Edit,
  Briefcase,
  Award,
  Users,
  ImageIcon,
  Clock,
  Heart,
  Building,
  Newspaper,
  BarChart3,
} from "lucide-react";
import { ResearchReport, RESEARCH_STRUCTURE, ResearchCategory } from "@/lib/research-types";

interface AdminData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  submittedAt: string;
}

interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  active: boolean;
  postedDate: string;
}

interface Award {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface Leader {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  order: number;
}

interface LifeImage {
  id: string;
  title: string;
  category: string;
  image: string;
  order: number;
}

interface TimelineItem {
  id: string;
  image: string;
  caption: string;
  order: number;
}

interface CSRData {
  hero: {
    title: string;
    subtitle: string;
  };
  introduction: {
    title: string;
    content: string;
  };
  initiatives: any[];
}

interface FoundationData {
  hero: {
    title: string;
    subtitle: string;
  };
  introduction: {
    title: string;
    content: string;
  };
  programs: any[];
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [lifeImages, setLifeImages] = useState<LifeImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [csrData, setCSRData] = useState<CSRData | null>(null);
  const [foundationData, setFoundationData] = useState<FoundationData | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"feedbacks" | "reports" | "content" | "careers" | "awards" | "leadership" | "life" | "timeline" | "csr" | "foundation" | "blogs">("feedbacks");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showJobEditModal, setShowJobEditModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showAwardEditModal, setShowAwardEditModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showLeaderEditModal, setShowLeaderEditModal] = useState(false);
  const [showLifeImageModal, setShowLifeImageModal] = useState(false);
  const [showLifeImageEditModal, setShowLifeImageEditModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showTimelineEditModal, setShowTimelineEditModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showBlogEditModal, setShowBlogEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<ResearchReport | null>(null);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [editingLifeImage, setEditingLifeImage] = useState<LifeImage | null>(null);
  const [editingTimelineItem, setEditingTimelineItem] = useState<TimelineItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "Fundamental" as ResearchCategory,
    subcategory: "" as any,
    secondaryCategory: undefined as ResearchCategory | undefined,
    secondarySubcategory: "" as any,
    analystName: "",
    reportDate: "",
    description: "",
    file: null as File | null,
  });

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    type: "",
    experience: "",
    description: "",
    active: true,
  });

  // Award form state
  const [awardForm, setAwardForm] = useState({
    year: "",
    title: "",
    description: "",
  });

  // Leader form state
  const [leaderForm, setLeaderForm] = useState({
    name: "",
    position: "",
    description: "",
    image: "",
    order: 999,
  });

  // Life image form state
  const [lifeImageForm, setLifeImageForm] = useState({
    title: "",
    category: "",
    image: "",
    order: 999,
  });

  // Timeline form state
  const [timelineForm, setTimelineForm] = useState({
    image: "",
    caption: "",
    order: 999,
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Sunidhi Research Team",
    category: "",
    image: "",
    featured: false,
    tags: [] as string[],
  });

  // Helper function to check permissions
  const hasPermission = (permission: string) => {
    if (!admin) return false;
    // Super admin has all permissions
    if (admin.role === "super_admin") return true;
    // Check for specific permission or full access
    return admin.permissions.includes(permission) || admin.permissions.includes("manage_all_pages");
  };

  useEffect(() => {
    // Get admin from session storage
    const adminDataStr = sessionStorage.getItem("adminData");
    if (adminDataStr) {
      setAdmin(JSON.parse(adminDataStr));
      loadFeedbacks();
      loadReports();
      loadJobs();
      loadAwards();
      loadLeaders();
      loadLifeImages();
      loadTimeline();
      loadCSR();
      loadFoundation();
      loadBlogs();
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const loadFeedbacks = async () => {
    try {
      const response = await fetch("/api/admin/feedbacks");
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks);
      } else if (response.status === 401) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch("/api/admin/research");
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/admin/careers");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  };

  const loadAwards = async () => {
    try {
      const response = await fetch("/api/admin/awards");
      if (response.ok) {
        const data = await response.json();
        setAwards(data.awards);
      }
    } catch (error) {
      console.error("Error loading awards:", error);
    }
  };

  const loadLeaders = async () => {
    try {
      const response = await fetch("/api/admin/leadership");
      if (response.ok) {
        const data = await response.json();
        setLeaders(data.leaders);
      }
    } catch (error) {
      console.error("Error loading leaders:", error);
    }
  };

  const loadLifeImages = async () => {
    try {
      const response = await fetch("/api/admin/life-images");
      if (response.ok) {
        const data = await response.json();
        setLifeImages(data.images);
      }
    } catch (error) {
      console.error("Error loading life images:", error);
    }
  };

  const loadTimeline = async () => {
    try {
      const response = await fetch("/api/admin/timeline");
      if (response.ok) {
        const data = await response.json();
        setTimeline(data.timeline);
      }
    } catch (error) {
      console.error("Error loading timeline:", error);
    }
  };

  const loadCSR = async () => {
    try {
      const response = await fetch("/api/admin/csr");
      if (response.ok) {
        const data = await response.json();
        setCSRData(data.csr);
      }
    } catch (error) {
      console.error("Error loading CSR data:", error);
    }
  };

  const loadFoundation = async () => {
    try {
      const response = await fetch("/api/admin/foundation");
      if (response.ok) {
        const data = await response.json();
        setFoundationData(data.foundation);
      }
    } catch (error) {
      console.error("Error loading Foundation data:", error);
    }
  };

  const loadBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      sessionStorage.removeItem("adminData");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const downloadFeedbackDoc = (feedbackId: string) => {
    window.open(`/feedback-submissions/${feedbackId}.docx`, "_blank");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title || !uploadForm.subcategory || !uploadForm.reportDate) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("category", uploadForm.category);
      formData.append("subcategory", uploadForm.subcategory);
      if (uploadForm.description) formData.append("description", uploadForm.description);
      if (uploadForm.analystName) formData.append("analystName", uploadForm.analystName);
      formData.append("reportDate", uploadForm.reportDate);
      if (uploadForm.secondaryCategory) formData.append("secondaryCategory", uploadForm.secondaryCategory);
      if (uploadForm.secondarySubcategory) formData.append("secondarySubcategory", uploadForm.secondarySubcategory);

      const response = await fetch("/api/admin/research/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Research report uploaded successfully!");
        setShowUploadModal(false);
        setUploadForm({
          title: "",
          category: "Fundamental",
          subcategory: "",
          secondaryCategory: undefined,
          secondarySubcategory: "",
          analystName: "",
          reportDate: "",
          description: "",
          file: null,
        });
        loadReports(); // Refresh reports list
      } else {
        const data = await response.json();
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reportId: string, reportTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${reportTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/research?id=${reportId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Report deleted successfully!");
        loadReports(); // Refresh reports list
      } else {
        alert("Failed to delete report");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed. Please try again.");
    }
  };

  const handleEditClick = (report: ResearchReport) => {
    // Set the editing report
    setEditingReport(report);

    // Pre-fill the form with report data
    // Convert ISO date to YYYY-MM-DD format for input field
    const reportDate = (report as any).reportDate
      ? new Date((report as any).reportDate).toISOString().split('T')[0]
      : "";

    setUploadForm({
      title: report.title,
      category: report.category as any,
      subcategory: report.subcategory as any,
      secondaryCategory: (report as any).secondaryCategory || "",
      secondarySubcategory: (report as any).secondarySubcategory || "",
      analystName: (report as any).analystName || "",
      reportDate: reportDate,
      description: report.description || "",
      file: null, // Don't include file for editing
    });

    // Open the edit modal
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingReport || !uploadForm.title || !uploadForm.subcategory || !uploadForm.reportDate) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/research/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingReport.id,
          title: uploadForm.title,
          category: uploadForm.category,
          subcategory: uploadForm.subcategory,
          secondaryCategory: uploadForm.secondaryCategory,
          secondarySubcategory: uploadForm.secondarySubcategory,
          analystName: uploadForm.analystName,
          reportDate: uploadForm.reportDate,
          description: uploadForm.description,
        }),
      });

      if (response.ok) {
        alert("Report updated successfully!");
        setShowEditModal(false);
        setEditingReport(null);
        setUploadForm({
          title: "",
          category: "Fundamental",
          subcategory: "",
          secondaryCategory: undefined,
          secondarySubcategory: "",
          analystName: "",
          reportDate: "",
          description: "",
          file: null,
        });
        loadReports(); // Refresh reports list
      } else {
        const data = await response.json();
        alert(`Update failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.location || !jobForm.type || !jobForm.experience || !jobForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobForm),
      });

      if (response.ok) {
        alert("Job posting created successfully!");
        setShowJobModal(false);
        setJobForm({
          title: "",
          location: "",
          type: "",
          experience: "",
          description: "",
          active: true,
        });
        loadJobs(); // Refresh jobs list
      } else {
        const data = await response.json();
        alert(`Failed to create job: ${data.error}`);
      }
    } catch (error) {
      console.error("Create job error:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !jobForm.title || !jobForm.location || !jobForm.type || !jobForm.experience || !jobForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/careers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingJob.id,
          ...jobForm,
        }),
      });

      if (response.ok) {
        alert("Job posting updated successfully!");
        setShowJobEditModal(false);
        setEditingJob(null);
        setJobForm({
          title: "",
          location: "",
          type: "",
          experience: "",
          description: "",
          active: true,
        });
        loadJobs(); // Refresh jobs list
      } else {
        const data = await response.json();
        alert(`Failed to update job: ${data.error}`);
      }
    } catch (error) {
      console.error("Update job error:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/careers?id=${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Job posting deleted successfully!");
        loadJobs(); // Refresh jobs list
      } else {
        alert("Failed to delete job posting");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleJobEditClick = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      active: job.active,
    });
    setShowJobEditModal(true);
  };

  const handleCreateAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.year || !awardForm.title || !awardForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/awards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(awardForm),
      });

      if (response.ok) {
        alert("Award created successfully!");
        setShowAwardModal(false);
        setAwardForm({
          year: "",
          title: "",
          description: "",
        });
        loadAwards(); // Refresh awards list
      } else {
        const data = await response.json();
        alert(`Failed to create award: ${data.error}`);
      }
    } catch (error) {
      console.error("Create award error:", error);
      alert("Failed to create award. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAward || !awardForm.year || !awardForm.title || !awardForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/awards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingAward.id,
          ...awardForm,
        }),
      });

      if (response.ok) {
        alert("Award updated successfully!");
        setShowAwardEditModal(false);
        setEditingAward(null);
        setAwardForm({
          year: "",
          title: "",
          description: "",
        });
        loadAwards(); // Refresh awards list
      } else {
        const data = await response.json();
        alert(`Failed to update award: ${data.error}`);
      }
    } catch (error) {
      console.error("Update award error:", error);
      alert("Failed to update award. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAward = async (awardId: string, awardTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${awardTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/awards?id=${awardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Award deleted successfully!");
        loadAwards(); // Refresh awards list
      } else {
        alert("Failed to delete award");
      }
    } catch (error) {
      console.error("Delete award error:", error);
      alert("Failed to delete award. Please try again.");
    }
  };

  const handleAwardEditClick = (award: Award) => {
    setEditingAward(award);
    setAwardForm({
      year: award.year,
      title: award.title,
      description: award.description,
    });
    setShowAwardEditModal(true);
  };

  const handleCreateLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderForm.name || !leaderForm.position || !leaderForm.description || !leaderForm.image) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/leadership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaderForm),
      });

      if (response.ok) {
        alert("Leader added successfully!");
        setShowLeaderModal(false);
        setLeaderForm({
          name: "",
          position: "",
          description: "",
          image: "",
          order: 999,
        });
        loadLeaders();
      } else {
        const data = await response.json();
        alert(`Failed to add leader: ${data.error}`);
      }
    } catch (error) {
      console.error("Create leader error:", error);
      alert("Failed to add leader. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader || !leaderForm.name || !leaderForm.position || !leaderForm.description || !leaderForm.image) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/leadership", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingLeader.id,
          ...leaderForm,
        }),
      });

      if (response.ok) {
        alert("Leader updated successfully!");
        setShowLeaderEditModal(false);
        setEditingLeader(null);
        setLeaderForm({
          name: "",
          position: "",
          description: "",
          image: "",
          order: 999,
        });
        loadLeaders();
      } else {
        const data = await response.json();
        alert(`Failed to update leader: ${data.error}`);
      }
    } catch (error) {
      console.error("Update leader error:", error);
      alert("Failed to update leader. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLeader = async (leaderId: string, leaderName: string) => {
    if (!confirm(`Are you sure you want to delete "${leaderName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/leadership?id=${leaderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Leader deleted successfully!");
        loadLeaders();
      } else {
        alert("Failed to delete leader");
      }
    } catch (error) {
      console.error("Delete leader error:", error);
      alert("Failed to delete leader. Please try again.");
    }
  };

  const handleLeaderEditClick = (leader: Leader) => {
    setEditingLeader(leader);
    setLeaderForm({
      name: leader.name,
      position: leader.position,
      description: leader.description,
      image: leader.image,
      order: leader.order,
    });
    setShowLeaderEditModal(true);
  };

  // Life image handlers
  const handleCreateLifeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lifeImageForm.title || !lifeImageForm.category || !lifeImageForm.image) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/life-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lifeImageForm),
      });

      if (response.ok) {
        alert("Life image added successfully!");
        setShowLifeImageModal(false);
        setLifeImageForm({
          title: "",
          category: "",
          image: "",
          order: 999,
        });
        loadLifeImages();
      } else {
        const data = await response.json();
        alert(`Failed to add life image: ${data.error}`);
      }
    } catch (error) {
      console.error("Create life image error:", error);
      alert("Failed to add life image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateLifeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLifeImage || !lifeImageForm.title || !lifeImageForm.category || !lifeImageForm.image) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/life-images", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingLifeImage.id,
          ...lifeImageForm,
        }),
      });

      if (response.ok) {
        alert("Life image updated successfully!");
        setShowLifeImageEditModal(false);
        setEditingLifeImage(null);
        setLifeImageForm({
          title: "",
          category: "",
          image: "",
          order: 999,
        });
        loadLifeImages();
      } else {
        const data = await response.json();
        alert(`Failed to update life image: ${data.error}`);
      }
    } catch (error) {
      console.error("Update life image error:", error);
      alert("Failed to update life image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLifeImage = async (imageId: string, imageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${imageTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/life-images?id=${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Life image deleted successfully!");
        loadLifeImages();
      } else {
        alert("Failed to delete life image");
      }
    } catch (error) {
      console.error("Delete life image error:", error);
      alert("Failed to delete life image. Please try again.");
    }
  };

  const handleCreateTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineForm.image || !timelineForm.caption) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timelineForm),
      });

      if (response.ok) {
        alert("Timeline item added successfully!");
        setShowTimelineModal(false);
        setTimelineForm({
          image: "",
          caption: "",
          order: 999,
        });
        loadTimeline();
      } else {
        const data = await response.json();
        alert(`Failed to add timeline item: ${data.error}`);
      }
    } catch (error) {
      console.error("Create timeline item error:", error);
      alert("Failed to add timeline item. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimelineItem || !timelineForm.image || !timelineForm.caption) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/admin/timeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTimelineItem.id,
          ...timelineForm,
        }),
      });

      if (response.ok) {
        alert("Timeline item updated successfully!");
        setShowTimelineEditModal(false);
        setEditingTimelineItem(null);
        setTimelineForm({
          image: "",
          caption: "",
          order: 999,
        });
        loadTimeline();
      } else {
        const data = await response.json();
        alert(`Failed to update timeline item: ${data.error}`);
      }
    } catch (error) {
      console.error("Update timeline item error:", error);
      alert("Failed to update timeline item. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTimelineItem = async (itemId: string, caption: string) => {
    if (!confirm(`Are you sure you want to delete "${caption}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/timeline?id=${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Timeline item deleted successfully!");
        loadTimeline();
      } else {
        alert("Failed to delete timeline item");
      }
    } catch (error) {
      console.error("Delete timeline item error:", error);
      alert("Failed to delete timeline item. Please try again.");
    }
  };

  const handleTimelineEditClick = (item: TimelineItem) => {
    setEditingTimelineItem(item);
    setTimelineForm({
      image: item.image,
      caption: item.caption,
      order: item.order,
    });
    setShowTimelineEditModal(true);
  };

  const handleUpdateCSR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrData) return;

    setUploading(true);
    try {
      const response = await fetch("/api/admin/csr", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(csrData),
      });

      if (response.ok) {
        alert("CSR content updated successfully!");
        loadCSR();
      } else {
        alert("Failed to update CSR content");
      }
    } catch (error) {
      console.error("Update CSR error:", error);
      alert("Failed to update CSR content. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateFoundation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundationData) return;

    setUploading(true);
    try {
      const response = await fetch("/api/admin/foundation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foundationData),
      });

      if (response.ok) {
        alert("Foundation content updated successfully!");
        loadFoundation();
      } else {
        alert("Failed to update Foundation content");
      }
    } catch (error) {
      console.error("Update Foundation error:", error);
      alert("Failed to update Foundation content. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.category) {
      alert("Please fill in all required fields");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogForm),
      });

      if (response.ok) {
        alert("Blog created successfully!");
        setShowBlogModal(false);
        setBlogForm({
          title: "",
          excerpt: "",
          content: "",
          author: "Sunidhi Research Team",
          category: "",
          image: "",
          featured: false,
          tags: [],
        });
        loadBlogs();
      } else {
        const data = await response.json();
        alert(`Failed to create blog: ${data.error}`);
      }
    } catch (error) {
      console.error("Create blog error:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setUploading(true);
    try {
      const response = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingBlog,
          ...blogForm,
        }),
      });

      if (response.ok) {
        alert("Blog updated successfully!");
        setShowBlogEditModal(false);
        setEditingBlog(null);
        loadBlogs();
      } else {
        alert("Failed to update blog");
      }
    } catch (error) {
      console.error("Update blog error:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Blog deleted successfully!");
        loadBlogs();
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete blog error:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleBlogEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      featured: blog.featured,
      tags: blog.tags,
    });
    setShowBlogEditModal(true);
  };

  const handleLifeImageEditClick = (image: LifeImage) => {
    setEditingLifeImage(image);
    setLifeImageForm({
      title: image.title,
      category: image.category,
      image: image.image,
      order: image.order,
    });
    setShowLifeImageEditModal(true);
  };

  const availableSubcategories = RESEARCH_STRUCTURE[uploadForm.category] || [];
  const secondarySubcategories = uploadForm.secondaryCategory
    ? RESEARCH_STRUCTURE[uploadForm.secondaryCategory] || []
    : [];

  // Extract unique titles and analyst names for autosuggest
  const uniqueTitles = useMemo(() => {
    const titles = reports.map(r => r.title).filter(Boolean);
    return Array.from(new Set(titles)).sort();
  }, [reports]);

  const uniqueAnalysts = useMemo(() => {
    const analysts = reports.map(r => (r as any).analystName).filter(Boolean);
    return Array.from(new Set(analysts)).sort();
  }, [reports]);

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⌛</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
        <Container>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {admin.fullName}!</p>
            </div>
            <div className="flex gap-3">
              {hasPermission("view_analytics") && (
                <Button
                  onClick={() => router.push("/admin/analytics")}
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              )}
              {admin.role === "super_admin" && (
                <Button
                  onClick={() => router.push("/admin/manage-admins")}
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Admins
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 flex-wrap">
            {hasPermission("manage_feedbacks") && (
              <button
                onClick={() => setActiveTab("feedbacks")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "feedbacks"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="inline h-5 w-5 mr-2" />
                Feedbacks ({feedbacks.length})
              </button>
            )}
            {hasPermission("upload_reports") && (
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "reports"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="inline h-5 w-5 mr-2" />
                Research Reports ({reports.length})
              </button>
            )}
            {hasPermission("manage_careers") && (
              <button
                onClick={() => setActiveTab("careers")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "careers"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Briefcase className="inline h-5 w-5 mr-2" />
                Job Postings ({jobs.length})
              </button>
            )}
            {hasPermission("manage_awards") && (
              <button
                onClick={() => setActiveTab("awards")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "awards"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Award className="inline h-5 w-5 mr-2" />
                Awards ({awards.length})
              </button>
            )}
            {hasPermission("manage_leadership") && (
              <button
                onClick={() => setActiveTab("leadership")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "leadership"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="inline h-5 w-5 mr-2" />
                Leadership ({leaders.length})
              </button>
            )}
            {hasPermission("manage_life_images") && (
              <button
                onClick={() => setActiveTab("life")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "life"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <ImageIcon className="inline h-5 w-5 mr-2" />
                Life @ Sunidhi ({lifeImages.length})
              </button>
            )}
            {hasPermission("manage_timeline") && (
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Clock className="inline h-5 w-5 mr-2" />
                Journey Timeline ({timeline.length})
              </button>
            )}
            {hasPermission("manage_csr") && (
              <button
                onClick={() => setActiveTab("csr")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "csr"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Heart className="inline h-5 w-5 mr-2" />
                CSR
              </button>
            )}
            {hasPermission("manage_foundation") && (
              <button
                onClick={() => setActiveTab("foundation")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "foundation"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building className="inline h-5 w-5 mr-2" />
                Foundation
              </button>
            )}
            {hasPermission("manage_blogs") && (
              <button
                onClick={() => setActiveTab("blogs")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "blogs"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Newspaper className="inline h-5 w-5 mr-2" />
                Blog ({blogs.length})
              </button>
            )}
            {hasPermission("upload_content") && (
              <button
                onClick={() => setActiveTab("content")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "content"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BookOpen className="inline h-5 w-5 mr-2" />
                Educational Content
              </button>
            )}
          </div>

          {/* Feedbacks Tab */}
          {activeTab === "feedbacks" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Customer Feedbacks</h2>
                <p className="text-sm text-gray-600">
                  Total: {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""}
                </p>
              </div>

              {feedbacks.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks yet</h3>
                  <p className="text-gray-600">
                    Feedback submissions will appear here
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">{feedback.subject}</h3>
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                              {feedback.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {feedback.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {feedback.email}
                            </div>
                            {feedback.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {feedback.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(feedback.submittedAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => downloadFeedbackDoc(feedback.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Doc
                        </Button>
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{feedback.message}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Research Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Research Reports Management</h2>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New Report
                </Button>
              </div>

              {reports.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports uploaded yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by uploading your first research report
                  </p>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Research Report
                  </Button>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Report Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category & Subcategory
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Analyst Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Report Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Upload Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {report.title}
                                  </div>
                                  {report.description && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                      {report.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded w-fit">
                                  {report.category}
                                </span>
                                <span className="inline-flex text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded w-fit">
                                  {report.subcategory}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {(report as any).analystName || "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {(report as any).reportDate
                                  ? new Date((report as any).reportDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }).replace(/\//g, "-")
                                  : "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(report.uploadDate).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <a
                                  href={report.filePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" size="sm" title="View PDF">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </a>
                                <Button
                                  onClick={() => handleEditClick(report)}
                                  variant="outline"
                                  size="sm"
                                  title="Edit Report"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(report.id, report.title)}
                                  variant="outline"
                                  size="sm"
                                  title="Delete Report"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Careers Tab */}
          {activeTab === "careers" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Job Postings Management</h2>
                <Button
                  onClick={() => setShowJobModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              {jobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by posting your first job opening
                  </p>
                  <Button
                    onClick={() => setShowJobModal(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Experience
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posted Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Briefcase className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                <div className="text-sm font-medium text-gray-900">
                                  {job.title}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{job.location}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{job.type}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{job.experience}</div>
                            </td>
                            <td className="px-6 py-4">
                              {job.active ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(job.postedDate).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleJobEditClick(job)}
                                  variant="outline"
                                  size="sm"
                                  title="Edit Job"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteJob(job.id, job.title)}
                                  variant="outline"
                                  size="sm"
                                  title="Delete Job"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === "awards" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Awards & Recognition Management</h2>
                <Button
                  onClick={() => setShowAwardModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Award
                </Button>
              </div>

              {awards.length === 0 ? (
                <Card className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No awards yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first award or recognition
                  </p>
                  <Button
                    onClick={() => setShowAwardModal(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Award
                  </Button>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Year
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Award Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {awards.map((award) => (
                          <tr key={award.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{award.year}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                <div className="text-sm font-medium text-gray-900">
                                  {award.title}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-md">{award.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleAwardEditClick(award)}
                                  variant="outline"
                                  size="sm"
                                  title="Edit Award"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteAward(award.id, award.title)}
                                  variant="outline"
                                  size="sm"
                                  title="Delete Award"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leadership Tab */}
          {activeTab === "leadership" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Leadership Team Management</h2>
                <Button
                  onClick={() => setShowLeaderModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Leader
                </Button>
              </div>

              {leaders.length === 0 ? (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leaders yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first leadership team member
                  </p>
                  <Button
                    onClick={() => setShowLeaderModal(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Leader
                  </Button>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image Path
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leaders.map((leader) => (
                          <tr key={leader.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{leader.order}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                <div className="text-sm font-medium text-gray-900">
                                  {leader.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{leader.position}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-md">{leader.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{leader.image}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleLeaderEditClick(leader)}
                                  variant="outline"
                                  size="sm"
                                  title="Edit Leader"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteLeader(leader.id, leader.name)}
                                  variant="outline"
                                  size="sm"
                                  title="Delete Leader"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Life at Sunidhi Images Tab */}
          {activeTab === "life" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Life at Sunidhi Images Management</h2>
                <Button
                  onClick={() => setShowLifeImageModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Image
                </Button>
              </div>

              {lifeImages.length === 0 ? (
                <Card className="p-12 text-center">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by adding your first Life at Sunidhi image
                  </p>
                  <Button
                    onClick={() => setShowLifeImageModal(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Image
                  </Button>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image Path
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lifeImages.map((image) => (
                          <tr key={image.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{image.order}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <ImageIcon className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                <div className="text-sm font-medium text-gray-900">
                                  {image.title}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{image.category}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{image.image}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleLifeImageEditClick(image)}
                                  variant="outline"
                                  size="sm"
                                  title="Edit Image"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteLifeImage(image.id, image.title)}
                                  variant="outline"
                                  size="sm"
                                  title="Delete Image"
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Journey Timeline Management</h2>
                <Button onClick={() => setShowTimelineModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Timeline Item
                </Button>
              </div>

              {timeline.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No timeline items yet. Add your first one!</p>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caption</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeline.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={item.image} alt={item.caption} className="h-16 w-24 object-cover rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{item.caption}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleTimelineEditClick(item)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              <Edit className="h-4 w-4 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteTimelineItem(item.id, item.caption)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Timeline Modal */}
              {showTimelineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleCreateTimelineItem} className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Add Timeline Item</h3>
                        <button type="button" onClick={() => setShowTimelineModal(false)}>
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Path <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={timelineForm.image}
                            onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="/images/timeline-1.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Path to the image (e.g., /images/timeline-1.jpg)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Caption <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={timelineForm.caption}
                            onChange={(e) => setTimelineForm({ ...timelineForm, caption: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Our First Office - 1965"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={timelineForm.order}
                            onChange={(e) => setTimelineForm({ ...timelineForm, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Lower numbers appear first
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button type="submit" disabled={uploading} className="flex-1">
                          {uploading ? "Adding..." : "Add Timeline Item"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowTimelineModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              {/* Edit Timeline Modal */}
              {showTimelineEditModal && editingTimelineItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleUpdateTimelineItem} className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Edit Timeline Item</h3>
                        <button type="button" onClick={() => setShowTimelineEditModal(false)}>
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Path <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={timelineForm.image}
                            onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="/images/timeline-1.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Caption <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={timelineForm.caption}
                            onChange={(e) => setTimelineForm({ ...timelineForm, caption: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={timelineForm.order}
                            onChange={(e) => setTimelineForm({ ...timelineForm, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button type="submit" disabled={uploading} className="flex-1">
                          {uploading ? "Updating..." : "Update Timeline Item"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowTimelineEditModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* CSR Tab */}
          {activeTab === "csr" && csrData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">CSR Content Management</h2>
              <form onSubmit={handleUpdateCSR} className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={csrData.hero.title}
                        onChange={(e) => setCSRData({
                          ...csrData,
                          hero: { ...csrData.hero, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={csrData.hero.subtitle}
                        onChange={(e) => setCSRData({
                          ...csrData,
                          hero: { ...csrData.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Introduction Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={csrData.introduction.title}
                        onChange={(e) => setCSRData({
                          ...csrData,
                          introduction: { ...csrData.introduction, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={csrData.introduction.content}
                        onChange={(e) => setCSRData({
                          ...csrData,
                          introduction: { ...csrData.introduction, content: e.target.value }
                        })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Foundation Tab */}
          {activeTab === "foundation" && foundationData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Foundation Content Management</h2>
              <form onSubmit={handleUpdateFoundation} className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={foundationData.hero.title}
                        onChange={(e) => setFoundationData({
                          ...foundationData,
                          hero: { ...foundationData.hero, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={foundationData.hero.subtitle}
                        onChange={(e) => setFoundationData({
                          ...foundationData,
                          hero: { ...foundationData.hero, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Introduction Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={foundationData.introduction.title}
                        onChange={(e) => setFoundationData({
                          ...foundationData,
                          introduction: { ...foundationData.introduction, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={foundationData.introduction.content}
                        onChange={(e) => setFoundationData({
                          ...foundationData,
                          introduction: { ...foundationData.introduction, content: e.target.value }
                        })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === "blogs" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <Button onClick={() => {
                  setEditingBlog(null);
                  setBlogForm({
                    title: "",
                    excerpt: "",
                    content: "",
                    author: "Sunidhi Research Team",
                    category: "Investment Basics",
                    image: "/images/blog/default.jpg",
                    featured: false,
                    tags: [],
                  });
                  setShowBlogModal(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Blog Post
                </Button>
              </div>

              {blogs.length === 0 ? (
                <Card className="p-8 text-center">
                  <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Blog Posts Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first blog post to get started</p>
                  <Button onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({
                      title: "",
                      excerpt: "",
                      content: "",
                      author: "Sunidhi Research Team",
                      category: "Investment Basics",
                      image: "/images/blog/default.jpg",
                      featured: false,
                      tags: [],
                    });
                    setShowBlogModal(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                  </Button>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Published
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                                {blog.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {blog.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(blog.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {blog.featured ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Featured
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Standard
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleBlogEditClick(blog)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <Edit className="h-4 w-4 inline" />
                              </button>
                              <button
                                                                  onClick={() => handleDeleteBlog(blog.id, blog.title)}                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Educational Content Tab */}
          {activeTab === "content" && (
            <div>
              <Card className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Educational Content Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload and manage educational materials for your clients
                </p>
                <Button disabled className="bg-gray-400">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Upload Educational Content (Coming Soon)
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  This feature will allow you to upload articles, videos, and tutorials
                </p>
              </Card>
            </div>
          )}
        </div>
      </Container>

      {/* Upload Modal */}
      {showUploadModal && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Research Report</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Report Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="title-suggestions"
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Q4 2025 Market Analysis"
                  />
                  <datalist id="title-suggestions">
                    {uniqueTitles.map((title, index) => (
                      <option key={index} value={title} />
                    ))}
                  </datalist>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      required
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          category: e.target.value as any,
                          subcategory: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Fundamental">Fundamental</option>
                      <option value="Technical">Technical</option>
                      <option value="Economic">Economic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subcategory <span className="text-red-600">*</span>
                    </label>
                    <select
                      required
                      value={uploadForm.subcategory}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, subcategory: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select subcategory</option>
                      {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Analyst Name
                    </label>
                    <input
                      type="text"
                      list="analyst-suggestions"
                      value={uploadForm.analystName}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, analystName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., John Doe"
                    />
                    <datalist id="analyst-suggestions">
                      {uniqueAnalysts.map((analyst, index) => (
                        <option key={index} value={analyst} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={uploadForm.reportDate}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, reportDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {uploadForm.reportDate && (
                      <p className="text-xs text-gray-600 mt-1">
                        Formatted: {new Date(uploadForm.reportDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).replace(/\//g, "-")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Category
                    </label>
                    <select
                      value={uploadForm.secondaryCategory}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          secondaryCategory: e.target.value as any,
                          secondarySubcategory: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select category (optional)</option>
                      <option value="Fundamental">Fundamental</option>
                      <option value="Technical">Technical</option>
                      <option value="Economic">Economic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Subcategory
                    </label>
                    <select
                      value={uploadForm.secondarySubcategory}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, secondarySubcategory: e.target.value as any })
                      }
                      disabled={!uploadForm.secondaryCategory}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subcategory (optional)</option>
                      {secondarySubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    PDF File <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf"
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        file: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only PDF files are allowed. Maximum size: 10MB
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Report
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Job Create Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Post New Job</h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Senior Financial Analyst"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Job Type <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Full-time, Part-time"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Required <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, experience: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 3-5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the job role, responsibilities, and requirements..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active-job"
                    checked={jobForm.active}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, active: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active-job" className="ml-2 text-sm font-medium text-gray-700">
                    Active Status (Visible to applicants)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Job
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Job Edit Modal */}
      {showJobEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Job Posting</h2>
                <button
                  onClick={() => {
                    setShowJobEditModal(false);
                    setEditingJob(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Senior Financial Analyst"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Job Type <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Full-time, Part-time"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Required <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, experience: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 3-5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the job role, responsibilities, and requirements..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active-job-edit"
                    checked={jobForm.active}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, active: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active-job-edit" className="ml-2 text-sm font-medium text-gray-700">
                    Active Status (Visible to applicants)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Job
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowJobEditModal(false);
                      setEditingJob(null);
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Research Report</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingReport(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                {/* Current File Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2 text-blue-900">
                    Current PDF File
                  </label>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{editingReport.fileName}</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Note: You can only edit metadata. To change the PDF file, please delete and re-upload the report.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Report Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="title-suggestions"
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Q4 2025 Market Analysis"
                  />
                  <datalist id="title-suggestions">
                    {uniqueTitles.map((title, index) => (
                      <option key={index} value={title} />
                    ))}
                  </datalist>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      required
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          category: e.target.value as any,
                          subcategory: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Fundamental">Fundamental</option>
                      <option value="Technical">Technical</option>
                      <option value="Economic">Economic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subcategory <span className="text-red-600">*</span>
                    </label>
                    <select
                      required
                      value={uploadForm.subcategory}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, subcategory: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select subcategory</option>
                      {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Analyst Name
                    </label>
                    <input
                      type="text"
                      list="analyst-suggestions"
                      value={uploadForm.analystName}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, analystName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., John Doe"
                    />
                    <datalist id="analyst-suggestions">
                      {uniqueAnalysts.map((analyst, index) => (
                        <option key={index} value={analyst} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={uploadForm.reportDate}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, reportDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {uploadForm.reportDate && (
                      <p className="text-xs text-gray-600 mt-1">
                        Formatted: {new Date(uploadForm.reportDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).replace(/\//g, "-")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Category
                    </label>
                    <select
                      value={uploadForm.secondaryCategory}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          secondaryCategory: e.target.value as any,
                          secondarySubcategory: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select category (optional)</option>
                      <option value="Fundamental">Fundamental</option>
                      <option value="Technical">Technical</option>
                      <option value="Economic">Economic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Subcategory
                    </label>
                    <select
                      value={uploadForm.secondarySubcategory}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, secondarySubcategory: e.target.value as any })
                      }
                      disabled={!uploadForm.secondaryCategory}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subcategory (optional)</option>
                      {secondarySubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the report"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Report
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingReport(null);
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Award Create Modal */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Award</h2>
                <button
                  onClick={() => setShowAwardModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAward} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={awardForm.year}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, year: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Award Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={awardForm.title}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Best Stock Broker - Regional Category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={awardForm.description}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the award..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Award
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAwardModal(false)}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Award Edit Modal */}
      {showAwardEditModal && editingAward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Award</h2>
                <button
                  onClick={() => {
                    setShowAwardEditModal(false);
                    setEditingAward(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateAward} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={awardForm.year}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, year: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Award Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={awardForm.title}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Best Stock Broker - Regional Category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={awardForm.description}
                    onChange={(e) =>
                      setAwardForm({ ...awardForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the award..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Award
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAwardEditModal(false);
                      setEditingAward(null);
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leader Create Modal */}
      {showLeaderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Leader</h2>
                <button
                  onClick={() => setShowLeaderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateLeader} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.name}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Jayesh Parekh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.position}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={leaderForm.description}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the leader..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Path <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.image}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, image: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., /images/Jayesh-Parekh.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the path to the image file in the public folder
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={leaderForm.order}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, order: parseInt(e.target.value) || 999 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (default: 999)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Leader
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowLeaderModal(false)}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leader Edit Modal */}
      {showLeaderEditModal && editingLeader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Leader</h2>
                <button
                  onClick={() => {
                    setShowLeaderEditModal(false);
                    setEditingLeader(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateLeader} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.name}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Jayesh Parekh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.position}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={leaderForm.description}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the leader..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Path <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.image}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, image: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., /images/Jayesh-Parekh.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the path to the image file in the public folder
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={leaderForm.order}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, order: parseInt(e.target.value) || 999 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (default: 999)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Leader
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowLeaderEditModal(false);
                      setEditingLeader(null);
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Life Image Create Modal */}
      {showLifeImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Life Image</h2>
                <button
                  onClick={() => setShowLifeImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateLifeImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lifeImageForm.title}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Life at Sunidhi - Main"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={lifeImageForm.category}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    <option value="main">Main</option>
                    <option value="work-culture">Work Culture</option>
                    <option value="fun-at-work">Fun at Work</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose where this image will appear on the page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Path <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lifeImageForm.image}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, image: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., /images/1-Life-at-Sunidhi-1.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the path to the image file in the public folder
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={lifeImageForm.order}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, order: parseInt(e.target.value) || 999 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (default: 999)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Life Image
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowLifeImageModal(false)}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Life Image Edit Modal */}
      {showLifeImageEditModal && editingLifeImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Life Image</h2>
                <button
                  onClick={() => {
                    setShowLifeImageEditModal(false);
                    setEditingLifeImage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateLifeImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lifeImageForm.title}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Life at Sunidhi - Main"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={lifeImageForm.category}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    <option value="main">Main</option>
                    <option value="work-culture">Work Culture</option>
                    <option value="fun-at-work">Fun at Work</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose where this image will appear on the page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Path <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lifeImageForm.image}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, image: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., /images/1-Life-at-Sunidhi-1.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the path to the image file in the public folder
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={lifeImageForm.order}
                    onChange={(e) =>
                      setLifeImageForm({ ...lifeImageForm, order: parseInt(e.target.value) || 999 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first (default: 999)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Life Image
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowLifeImageEditModal(false);
                      setEditingLifeImage(null);
                    }}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingBlog ? "Edit Blog Post" : "Create Blog Post"}
                </h2>
                <button
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlog(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Understanding Mutual Funds"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      required
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Investment Basics">Investment Basics</option>
                      <option value="Stock Market">Stock Market</option>
                      <option value="Tax Planning">Tax Planning</option>
                      <option value="Trading Strategies">Trading Strategies</option>
                      <option value="Market Analysis">Market Analysis</option>
                      <option value="Company News">Company News</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Author <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Sunidhi Research Team"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Excerpt <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief summary of the blog post (1-2 sentences)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Full blog post content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Featured Image URL <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="/images/blog/your-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload image to /public/images/blog/ first, then enter the path here
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={blogForm.tags.join(", ")}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mutual Funds, Investment, Beginner Guide"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={blogForm.featured}
                    onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Mark as Featured Blog
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowBlogModal(false);
                      setEditingBlog(null);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBlog ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Blog
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blog
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
