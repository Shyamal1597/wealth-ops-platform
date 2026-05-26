"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";

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

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    image: "",
    featured: false,
    tags: "",
  });

  useEffect(() => {
    // Check authentication
    const adminDataStr = sessionStorage.getItem("adminData");
    if (!adminDataStr) {
      router.push("/admin/login");
      return;
    }

    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      publishedAt: editingBlog?.publishedAt || new Date().toISOString(),
      id: editingBlog?.id || Date.now().toString(),
    };

    try {
      const response = await fetch("/api/admin/blogs", {
        method: editingBlog ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        alert(editingBlog ? "Blog updated successfully!" : "Blog created successfully!");
        setShowForm(false);
        setEditingBlog(null);
        resetForm();
        fetchBlogs();
      } else {
        alert("Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      featured: blog.featured,
      tags: blog.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`/api/admin/blogs?id=${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        alert("Blog deleted successfully!");
        fetchBlogs();
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      image: "",
      featured: false,
      tags: "",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-16">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage blog posts</p>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingBlog(null);
                resetForm();
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "New Blog"}
            </Button>
          </div>

          {/* Blog Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingBlog ? "Edit Blog" : "Create New Blog"}</CardTitle>
                <CardDescription>
                  Fill in the details below to {editingBlog ? "update" : "create"} a blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: formData.slug || generateSlug(e.target.value),
                          });
                        }}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="Blog title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="url-friendly-slug"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Author *</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="Author name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="e.g., Market Analysis, Investment Tips"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Brief description (shown in blog list)"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full border rounded-md px-4 py-2 font-mono text-sm"
                      placeholder="Full blog content (supports markdown)"
                      rows={12}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="stocks, investing, market analysis"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Mark as Featured
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      {editingBlog ? "Update Blog" : "Create Blog"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBlog(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Blogs List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blogs yet. Create your first blog post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{blog.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {blog.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(blog.publishedAt)}
                              </span>
                              <span className="text-primary-600">{blog.category}</span>
                              {blog.featured && (
                                <span className="bg-primary-600 text-white px-2 py-0.5 rounded text-xs">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
