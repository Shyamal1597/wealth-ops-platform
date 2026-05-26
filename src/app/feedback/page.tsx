"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          category: "",
          message: "",
        });
      } else {
        const data = await response.json();
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">We Value Your Feedback</h1>
            <p className="text-xl text-white">
              Help us improve our services by sharing your thoughts, suggestions, or concerns
            </p>
          </div>
        </Container>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900">Feedback Submitted Successfully!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Thank you for your feedback. We have received your message and will review it shortly.
                      A copy has been sent to our team.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900">Submission Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Website">Website Feedback</option>
                    <option value="Services">Services Feedback</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Trading Platform">Trading Platform</option>
                    <option value="Suggestion">General Suggestion</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                    placeholder="Please share your detailed feedback, suggestions, or concerns..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⌛</span>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Submit Feedback
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Additional Information */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Your feedback will be sent directly to our management team.
              </p>
              <p className="mt-2">
                For urgent matters, please contact us directly at{" "}
                <a href="mailto:onlinetrading@sunidhi.com" className="text-primary-600 hover:underline">
                  onlinetrading@sunidhi.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
