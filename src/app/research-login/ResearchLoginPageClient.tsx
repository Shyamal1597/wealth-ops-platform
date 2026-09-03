'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, AlertCircle, FileText, Key, Mail, CheckCircle2, Smartphone, RefreshCw } from "lucide-react";

export default function ResearchLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/markets/research';

  // Step Management: 1 = Login, 2 = OTP, 3 = Password Setup
  const [step, setStep] = useState(1);
  const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false);
  const [isForgotClientIdFlow, setIsForgotClientIdFlow] = useState(false);

  // States
  const [clientId, setClientId] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // Used for forgot client ID
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP delivery info
  const [otpMethod, setOtpMethod] = useState<'sms' | 'email'>('sms');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // Resend OTP timer
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isForgotPasswordFlow
            ? { clientId, action: 'forgot_password' }
            : { clientId, password }
        )
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresActivation) {
          // OTP has been sent — show the OTP step
          setOtpMethod(data.otpMethod || 'email');
          if (data.maskedPhone) setMaskedPhone(data.maskedPhone);
          if (data.maskedEmail) setMaskedEmail(data.maskedEmail);
          setResendTimer(60);
          setStep(2);
        } else {
          // Standard login success
          sessionStorage.setItem('clientData', JSON.stringify({
            clientId: data.clientId,
            name: data.name,
            isClient: true
          }));
          window.dispatchEvent(new Event('clientSessionChange'));
          router.push(redirectTo);
        }
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsResending(true);

    try {
      const response = await fetch('/api/auth/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, action: 'resend_otp' })
      });

      const data = await response.json();

      if (response.ok && data.requiresActivation) {
        setOtpMethod(data.otpMethod || 'email');
        if (data.maskedPhone) setMaskedPhone(data.maskedPhone);
        if (data.maskedEmail) setMaskedEmail(data.maskedEmail);
        setResendTimer(60);
        setOtp('');
      } else {
        setError(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-client-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, otp })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred connecting to the verification server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotClientIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-client-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4); // Use step 4 as the success message screen
      } else {
        setError(data.error || 'Failed to process request.');
      }
    } catch (err) {
      setError('Servers are currently unreachable. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/set-client-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, otp, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Log the user in...
        sessionStorage.setItem('clientData', JSON.stringify({
          clientId: data.client.clientId,
          name: data.client.name,
          isClient: true
        }));
        window.dispatchEvent(new Event('clientSessionChange'));
        router.push(redirectTo);
      } else {
        setError(data.error || 'Failed to setup password.');
      }
    } catch (err) {
      setError('Servers are currently unreachable. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Get the display string for which method OTP was sent to
  const otpDestination = otpMethod === 'sms'
    ? `+91 ${maskedPhone}`
    : maskedEmail;

  return (
    <>
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Client Login</h1>
          </div>
          <p className="text-xl text-primary-100">Access Premium Research Reports</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step === 1 && <Lock className="h-8 w-8 text-primary-600" />}
                  {step === 2 && (otpMethod === 'sms'
                    ? <Smartphone className="h-8 w-8 text-primary-600" />
                    : <Mail className="h-8 w-8 text-primary-600" />
                  )}
                  {step === 3 && <Key className="h-8 w-8 text-primary-600" />}
                </div>
                <CardTitle className="text-center text-2xl">
                  <span className="sr-only">
                    {step === 4 ? 'Check your messages' : `Step ${step} of 3`}
                  </span>
                  {step === 1 && (isForgotPasswordFlow ? 'Reset Password' : isForgotClientIdFlow ? 'Recover Client ID' : 'Client Portal Login')}
                  {step === 2 && (otpMethod === 'sms' ? "SMS Verification" : "Email Verification")}
                  {step === 3 && "Set Password"}
                  {step === 4 && "Recovery Details Sent"}
                </CardTitle>
                <CardDescription className="text-center">
                  {step === 1 && (isForgotPasswordFlow ? "Enter your Client ID to receive a verification code and reset your password." : isForgotClientIdFlow ? "Enter your registered Email or Mobile Number to recover your Client ID." : "Enter your client credentials to access. First-time legacy users only require their Client ID to begin.")}
                  {step === 2 && (
                    otpMethod === 'sms'
                      ? `We've sent a 6-digit verification code via SMS to ${otpDestination}`
                      : `We've emailed a 6-digit secure activation code to ${otpDestination}`
                  )}
                  {step === 3 && "Secure your account with a permanent, private password"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div aria-live="polite" className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* STEP 1: INITIAL LOGIN / FORGOT PASSWORD / FORGOT CLIENT ID */}
                {step === 1 && (
                  <>
                    {!isForgotClientIdFlow ? (
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                              Client ID
                            </label>
                            {!isForgotPasswordFlow && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsForgotClientIdFlow(true);
                                  setError('');
                                }}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Forgot Client ID?
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            id="clientId"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g. 256000"
                            required
                          />
                        </div>

                        {!isForgotPasswordFlow && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsForgotPasswordFlow(true);
                                  setError('');
                                }}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Leave blank if activating for the first time"
                            />
                            <p className="text-xs text-gray-500 mt-1">If this is your first time accessing the new portal, enter your Client ID and click Login to trigger activation.</p>
                          </div>
                        )}

                        <Button type="submit" aria-busy={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none" disabled={isLoading}>
                          {isLoading
                            ? (isForgotPasswordFlow ? 'Sending Code...' : 'Authenticating...')
                            : (isForgotPasswordFlow ? 'Send Verification Code' : 'Login to Access Research')}
                        </Button>

                        {isForgotPasswordFlow && (
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPasswordFlow(false);
                                setError('');
                              }}
                              className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                              Cancel and return to login
                            </button>
                          </div>
                        )}
                      </form>
                    ) : (
                      <form onSubmit={handleForgotClientIdSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address or Mobile Number
                          </label>
                          <input
                            type="text"
                            id="contactInfo"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="you@email.com or 9876543210"
                            required
                          />
                        </div>

                        <Button type="submit" aria-busy={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none" disabled={isLoading}>
                          {isLoading ? 'Searching...' : 'Send me my Client ID'}
                        </Button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgotClientIdFlow(false);
                              setContactInfo('');
                              setError('');
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                          >
                            Cancel and return to login
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}

                {/* STEP 2: OTP VERIFICATION (SMS or Email) */}
                {step === 2 && (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    {/* OTP Method Badge */}
                    <div className={`p-3 rounded-md flex items-center gap-3 text-sm ${otpMethod === 'sms'
                      ? 'bg-blue-50 border border-blue-200 text-blue-800'
                      : 'bg-purple-50 border border-purple-200 text-purple-800'
                      }`}>
                      {otpMethod === 'sms'
                        ? <Smartphone className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        : <Mail className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      }
                      <div>
                        <p className="font-semibold">
                          {otpMethod === 'sms' ? 'SMS OTP Sent' : 'Email OTP Sent'}
                        </p>
                        <p className="text-xs mt-0.5">
                          Check your {otpMethod === 'sms' ? 'phone' : 'inbox'} for the 6-digit code
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-4 text-center text-2xl tracking-[1em] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        placeholder="000000"
                        required
                        autoFocus
                      />
                    </div>

                    <Button type="submit" aria-busy={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>

                    {/* Resend OTP */}
                    <div className="text-center text-sm">
                      {resendTimer > 0 ? (
                        <p className="text-gray-500">
                          Resend code in <span className="font-mono font-semibold">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isResending}
                          className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                        >
                          <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                          {isResending ? 'Sending...' : 'Resend OTP'}
                        </button>
                      )}
                    </div>

                    <div className="text-center">
                      <button type="button" onClick={() => { setStep(1); setIsForgotPasswordFlow(false); }} className="text-sm text-gray-500 hover:text-gray-700 underline">
                        Cancel Verification
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: SET NEW PASSWORD */}
                {step === 3 && (
                  <form onSubmit={handlePasswordSetup} className="space-y-4">
                    <div aria-live="polite" className="flex items-center gap-2 mb-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                      <span>Identity verified! Create your new password to sign in.</span>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password (Min 8 characters)
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <Button type="submit" aria-busy={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none" disabled={isLoading}>
                      {isLoading ? 'Saving Password...' : 'Save Password & Login'}
                    </Button>
                  </form>
                )}

              </CardContent>

              {step === 1 && (
                <CardFooter className="flex flex-col !pt-0">
                  <div className="w-full mt-2 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 mb-1">Don't have a demat account?</p>
                        <p className="text-blue-800 mb-2">
                          Open a demat account with Sunidhi Securities to access premium research.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push('/open-account')}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Open Account
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center w-full">
                    {!isForgotPasswordFlow && (
                      <p className="text-sm text-gray-600">
                        Issues logging in?{' '}
                        <a href="/support/contact" className="text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap">
                          Contact Tech Support
                        </a>
                      </p>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
