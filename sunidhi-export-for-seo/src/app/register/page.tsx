"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, AlertCircle, CheckCircle2, Phone, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import {
  initializeRecaptcha,
  sendOTP,
  verifyOTP,
  clearRecaptcha,
  formatPhoneNumber,
  isValidIndianPhone,
} from "@/lib/firebase";
import type { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

type RegistrationStep = "details" | "otp" | "success";

export default function RegisterPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  // Multi-step state
  const [step, setStep] = useState<RegistrationStep>("details");
  const [otpCode, setOtpCode] = useState("");

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Firebase OTP state
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [clientId, setClientId] = useState("");

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    if (!recaptchaVerifier) {
      try {
        const verifier = initializeRecaptcha("recaptcha-container", "invisible");
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
        setError("Failed to initialize security verification. Please refresh the page.");
      }
    }

    return () => {
      // Cleanup on unmount
      if (recaptchaVerifier) {
        clearRecaptcha(recaptchaVerifier);
      }
    };
  }, []);

  // Resend timer
  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [otpSent, resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Validate details and send OTP
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      // Validate username
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError("Username can only contain letters, numbers, and underscores");
        setIsLoading(false);
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Invalid email format");
        setIsLoading(false);
        return;
      }

      // Validate phone number
      if (!isValidIndianPhone(formData.phone)) {
        setError("Invalid Indian mobile number. Must be 10 digits starting with 6-9.");
        setIsLoading(false);
        return;
      }

      // Format phone to international format
      const formattedPhone = formatPhoneNumber(formData.phone);

      if (!recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }

      // Send OTP via Firebase
      const confirmation = await sendOTP(formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setSuccess("OTP sent successfully! Check your phone.");
      setStep("otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(error.message || "Failed to send OTP. Please try again.");

      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        clearRecaptcha(recaptchaVerifier);
        const newVerifier = initializeRecaptcha("recaptcha-container", "invisible");
        setRecaptchaVerifier(newVerifier);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and create account
  const handleVerifyOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!confirmationResult) {
        throw new Error("No OTP confirmation found. Please request a new OTP.");
      }

      if (!otpCode || otpCode.length !== 6) {
        setError("Please enter a valid 6-digit OTP code");
        setIsLoading(false);
        return;
      }

      // Verify OTP with Firebase
      const idToken = await verifyOTP(confirmationResult, otpCode);
      setFirebaseIdToken(idToken);

      // Now create the account with Firebase token
      const formattedPhone = formatPhoneNumber(formData.phone);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formattedPhone,
          firebaseIdToken: idToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess("Account created successfully!");
      setClientId(data.clientId || "");
      setStep("success");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtpCode("");
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Format phone to international format
      const formattedPhone = formatPhoneNumber(formData.phone);

      if (!recaptchaVerifier) {
        const newVerifier = initializeRecaptcha("recaptcha-container", "invisible");
        setRecaptchaVerifier(newVerifier);
      }

      // Send OTP via Firebase
      const confirmation = await sendOTP(formattedPhone, recaptchaVerifier!);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setSuccess("OTP resent successfully! Check your phone.");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError(error.message || "Failed to resend OTP. Please try again.");

      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        clearRecaptcha(recaptchaVerifier);
        const newVerifier = initializeRecaptcha("recaptcha-container", "invisible");
        setRecaptchaVerifier(newVerifier);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Sunidhi Securities today</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {["details", "otp", "success"].map((s, index) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step === s
                        ? "bg-primary-600 text-white"
                        : index < ["details", "otp", "success"].indexOf(step)
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index < ["details", "otp", "success"].indexOf(step) ? "✓" : index + 1}
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        index < ["details", "otp", "success"].indexOf(step)
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between max-w-md mx-auto mt-2 text-xs text-gray-600">
              <span>Details</span>
              <span>Verify</span>
              <span>Done</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === "details" && "Personal Details"}
                {step === "otp" && "Enter OTP"}
                {step === "success" && "Registration Successful!"}
              </CardTitle>
              <CardDescription>
                {step === "details" && "Fill in your details and we'll send you an OTP"}
                {step === "otp" && "Enter the 6-digit code sent to your phone"}
                {step === "success" && "Your account has been created successfully"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Alerts */}
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

              {/* Step 1: Personal Details */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Confirm Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Re-enter password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="9876543210"
                        required
                        maxLength={10}
                      />
                      <span className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                        +91
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 10-digit mobile number without country code
                    </p>
                  </div>

                  {/* reCAPTCHA Container (invisible) */}
                  <div id="recaptcha-container"></div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⌛</span>
                        Sending OTP...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Send OTP & Continue
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: Enter OTP */}
              {step === "otp" && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                      📱 OTP sent to <strong>+91{formData.phone}</strong>
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Check your SMS messages for the 6-digit code
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter OTP Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    {!canResend && (
                      <p>Resend OTP in {resendTimer} seconds</p>
                    )}
                    {canResend && (
                      <button
                        onClick={handleResendOTP}
                        className="text-primary-600 hover:underline font-medium"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStep("details");
                        setOtpCode("");
                        setOtpSent(false);
                      }}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={isLoading || otpCode.length !== 6}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⌛</span>
                          Verifying...
                        </span>
                      ) : (
                        "Verify & Create Account"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Sunidhi!</h3>
                  <p className="text-gray-600 mb-4">Your account has been created successfully.</p>

                  {clientId && (
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg mb-4">
                      <p className="text-sm font-medium text-primary-900 mb-1">Your Client ID:</p>
                      <p className="text-2xl font-mono font-bold text-primary-600">{clientId}</p>
                      <p className="text-xs text-primary-700 mt-1">Save this for future reference</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4">Redirecting to login page...</p>

                  <Link href="/login">
                    <Button>Go to Login</Button>
                  </Link>
                </div>
              )}

              {/* Terms & Conditions - Show only on details step */}
              {step === "details" && (
                <div className="mt-6 text-center text-sm">
                  <div className="flex items-start gap-2 text-sm mb-4">
                    <input type="checkbox" required className="mt-1" />
                    <span className="text-gray-600 text-left">
                      I agree to the{" "}
                      <Link href="/legal/privacy-policy" className="text-primary-600 hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/legal/privacy-policy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>

                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary-600 font-medium hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
