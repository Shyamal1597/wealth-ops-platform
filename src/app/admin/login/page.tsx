"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting to admin dashboard...");
        // Store admin data in session storage
        sessionStorage.setItem("adminData", JSON.stringify(data.admin));
        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Admin login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">Admin Portal</h1>
            <p className="text-gray-300">Sunidhi Securities - Backend Management</p>
          </div>

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter admin username or email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⌛</span>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Login to Admin Panel
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  <Link href="/" className="text-primary-600 font-medium hover:underline">
                    ← Back to Website
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </Container>
    </section>
  );
}
