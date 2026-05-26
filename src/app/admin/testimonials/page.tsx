"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Star, Building2, Clock, Check, X, AlertCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  company: string;
  duration: string;
  text: string;
  rating: number;
  image: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    duration: "",
    text: "",
    rating: 5,
    image: "",
    active: true,
    order: 999,
  });

  useEffect(() => {
    // Check authentication
    const adminDataStr = sessionStorage.getItem("adminData");
    if (!adminDataStr) {
      router.push("/admin/login");
      return;
    }

    fetchTestimonials();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: editingTestimonial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingTestimonial?.id,
        }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        setSuccess(editingTestimonial ? "Testimonial updated successfully!" : "Testimonial created successfully!");
        setShowForm(false);
        setEditingTestimonial(null);
        resetForm();
        fetchTestimonials();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save testimonial");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      setError("Error saving testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      duration: testimonial.duration,
      text: testimonial.text,
      rating: testimonial.rating,
      image: testimonial.image,
      active: testimonial.active,
      order: testimonial.order,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        setSuccess("Testimonial deleted successfully!");
        fetchTestimonials();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setError("Error deleting testimonial");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      duration: "",
      text: "",
      rating: 5,
      image: "",
      active: true,
      order: 999,
    });
  };

  return (
    <section className="py-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage client testimonials</p>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingTestimonial(null);
                resetForm();
                setError("");
                setSuccess("");
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "New Testimonial"}
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
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
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <X className="h-5 w-5 text-green-600" />
              </button>
            </div>
          )}

          {/* Testimonial Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingTestimonial ? "Edit Testimonial" : "Create New Testimonial"}</CardTitle>
                <CardDescription>
                  Fill in the details below to {editingTestimonial ? "update" : "create"} a testimonial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Client Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company *</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., XYZ Corporation"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 25 Years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating *</label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Order *</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="1"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Testimonial Text *</label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter the client testimonial here..."
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Client Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="/images/testimonials/client-name.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload image to /public/images/testimonials/ folder and enter the path here
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="active" className="text-sm font-medium">
                      Active (Display on website)
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      {editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingTestimonial(null);
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

          {/* Testimonials List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No testimonials yet. Create your first testimonial!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={!testimonial.active ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder-avatar.png";
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                              {!testimonial.active && (
                                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                                  Inactive
                                </span>
                              )}
                              <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
                                Order: {testimonial.order}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {testimonial.company}
                              </span>
                              {testimonial.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {testimonial.duration}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                            <p className="text-gray-700 text-sm italic">"{testimonial.text}"</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(testimonial.id, testimonial.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
