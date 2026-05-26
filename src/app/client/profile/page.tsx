'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Shield, Calendar, LogOut, Save, AlertCircle, CheckCircle2, Key, Loader2 } from "lucide-react";

interface ClientProfile {
    clientId: string;
    name: string;
    email: string;
    mobile: string;
    accountStatus: string;
    accountOpenDate: string;
}

export default function ClientProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<ClientProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editable fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [requiresOtp, setRequiresOtp] = useState(false);

    // Password change
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const clientData = sessionStorage.getItem('clientData');
        if (!clientData) {
            router.push('/research-login');
            return;
        }

        try {
            const parsed = JSON.parse(clientData);
            fetchProfile(parsed.clientId);
        } catch {
            router.push('/research-login');
        }
    }, [router]);

    const fetchProfile = async (clientId: string) => {
        try {
            const res = await fetch(`/api/auth/client-profile?clientId=${encodeURIComponent(clientId)}`);
            const data = await res.json();

            if (res.ok) {
                setProfile(data);
                setName(data.name || '');
                setEmail(data.email || '');
                setMobile(data.mobile || '');
            } else {
                setError(data.error || 'Failed to load profile');
            }
        } catch {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!profile) return;
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            if (mobile !== profile.mobile && email !== profile.email) {
                setError('Please update one contact method at a time for security verification.');
                setSaving(false);
                return;
            }

            const res = await fetch('/api/auth/client-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: profile.clientId,
                    name,
                    email,
                    mobile,
                    ...(requiresOtp && otp ? { otp } : {})
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.requiresOtpVerification) {
                    setRequiresOtp(true);
                    setSuccess(data.message);
                } else {
                    setSuccess(data.message || 'Profile updated successfully');
                    setRequiresOtp(false);
                    setOtp('');
                    setProfile({ ...profile, name, email, mobile }); // Ensure local state refreshes
                    
                    // Update sessionStorage with new name/contact details
                    const clientData = sessionStorage.getItem('clientData');
                    if (clientData) {
                        const parsed = JSON.parse(clientData);
                        sessionStorage.setItem('clientData', JSON.stringify({ ...parsed, name, email, mobile }));
                        window.dispatchEvent(new Event('clientSessionChange')); // Trigger header refresh
                    }
                }
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch {
            setError('Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!profile) return;
        setError('');
        setSuccess('');

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/auth/client-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: profile.clientId,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch {
            setError('Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('clientData');
        window.dispatchEvent(new Event('clientSessionChange'));
        router.push('/');
    };

    if (loading) {
        return (
            <section className="py-24">
                <Container>
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading your profile...</span>
                    </div>
                </Container>
            </section>
        );
    }

    if (!profile) {
        return (
            <section className="py-24">
                <Container>
                    <div className="max-w-md mx-auto text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-700 mb-4">Unable to load your profile.</p>
                        <Button onClick={() => router.push('/research-login')}>Return to Login</Button>
                    </div>
                </Container>
            </section>
        );
    }

    const statusColor =
        profile.accountStatus === 'active'
            ? 'bg-green-100 text-green-700'
            : profile.accountStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700';

    return (
        <>
            <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
                <Container>
                    <div className="flex items-center gap-3 mb-4">
                        <User className="h-10 w-10" />
                        <h1 className="text-4xl md:text-5xl font-bold">My Profile</h1>
                    </div>
                    <p className="text-xl text-primary-100">Manage your account details and preferences</p>
                </Container>
            </section>

            <section className="py-12">
                <Container>
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Messages */}
                        {error && (
                            <div aria-live="polite" className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div aria-live="polite" className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                <p className="text-sm text-green-800">{success}</p>
                            </div>
                        )}

                        {/* Account Info (Read-Only) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Account Information</CardTitle>
                                <CardDescription>Your account details — these cannot be changed online</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="profile-name" className="flex items-center gap-2 text-sm text-gray-500 uppercase tracking-wide mb-1.5 font-semibold">
                                            <User className="h-4 w-4" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="profile-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-50 text-gray-900 font-medium"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Client ID</p>
                                            <p className="font-medium text-gray-900">{profile.clientId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                                            <p className="font-medium text-gray-900">
                                                {profile.accountOpenDate
                                                    ? new Date(profile.accountOpenDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Account Status</p>
                                            <span className={`inline-block mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColor}`}>
                                                {profile.accountStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editable Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Details</CardTitle>
                                <CardDescription>Update your email address and mobile number</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="profile-email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <Mail className="h-4 w-4" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="profile-email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (requiresOtp) setRequiresOtp(false);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="profile-mobile" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <Phone className="h-4 w-4" /> Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="profile-mobile"
                                        value={mobile}
                                        onChange={(e) => {
                                            setMobile(e.target.value);
                                            if (requiresOtp) setRequiresOtp(false);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="9876543210"
                                    />
                                </div>
                                {requiresOtp && (
                                    <div>
                                        <label htmlFor="profile-otp" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                            <Shield className="h-4 w-4" /> 6-Digit OTP
                                        </label>
                                        <input
                                            type="text"
                                            id="profile-otp"
                                            value={otp}
                                            maxLength={6}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-4 py-2 text-center text-xl tracking-[0.5em] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                                            placeholder="000000"
                                            autoFocus
                                        />
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-primary-600 hover:bg-primary-700"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        {saving ? (requiresOtp ? 'Verifying...' : 'Saving...') : (requiresOtp ? 'Verify OTP & Save' : 'Save Changes')}
                                    </Button>
                                    {requiresOtp && (
                                        <Button variant="outline" onClick={() => { setRequiresOtp(false); setOtp(''); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Password Change */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Password</CardTitle>
                                <CardDescription>Change your login password</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!showPasswordForm ? (
                                    <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                                        <Key className="h-4 w-4 mr-2" /> Change Password
                                    </Button>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                id="current-password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                New Password (min 8 characters)
                                            </label>
                                            <input
                                                type="password"
                                                id="new-password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirm-new-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleChangePassword}
                                                disabled={saving}
                                                className="bg-primary-600 hover:bg-primary-700"
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                                                {saving ? 'Updating...' : 'Update Password'}
                                            </Button>
                                            <Button variant="outline" onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Logout */}
                        <Card className="border-red-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Sign Out</p>
                                        <p className="text-sm text-gray-500">End your current session on this device</p>
                                    </div>
                                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </Container>
            </section>
        </>
    );
}
