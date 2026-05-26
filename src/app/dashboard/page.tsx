"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, CreditCard, LogOut, TrendingUp, Wallet, BarChart3 } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  accountType: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user from session storage (set during login)
    const userDataStr = sessionStorage.getItem("userData");
    if (userDataStr) {
      setUser(JSON.parse(userDataStr));
    } else {
      // No user data, redirect to login
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      sessionStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⌛</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <Container>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user.fullName}!</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8 space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Account Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="font-medium">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Account Type
                  </label>
                  <p className="font-medium">{user.accountType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Member Since</label>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Portfolio Value</p>
                  <p className="text-2xl font-bold">₹0.00</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold">₹0.00</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Trades</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Demo Notice */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold mb-2">Demo Account</h3>
            <p className="text-sm text-gray-700">
              This is a demonstration dashboard. In a production environment, this would connect to your
              trading account and display real-time portfolio information, transaction history, and trading tools.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
