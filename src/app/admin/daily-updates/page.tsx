'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, FileText, Download, Edit, X } from 'lucide-react';

interface DailyUpdate {
    id: string;
    title: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadDate: string;
    reportDate: string;
    description?: string;
}

export default function DailyUpdatesAdminPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [updates, setUpdates] = useState<DailyUpdate[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState<DailyUpdate | null>(null);

    // Upload Form state
    const [uploadForm, setUploadForm] = useState({
        title: '',
        reportDate: new Date().toISOString().split('T')[0],
        description: '',
        file: null as File | null,
    });

    // Edit Form state
    const [editForm, setEditForm] = useState({
        title: '',
        reportDate: '',
        description: '',
    });

    // Fetch updates and authorize
    useEffect(() => {
        const storedAdminData = sessionStorage.getItem("adminData");
        if (!storedAdminData) {
            router.push("/admin/login");
            return;
        }

        try {
            const adminData = JSON.parse(storedAdminData);
            const hasAccess =
                adminData.role === "super_admin" ||
                (adminData.permissions && (
                    adminData.permissions.includes("manage_daily_updates") ||
                    adminData.permissions.includes("manage_all_pages")
                ));

            if (!hasAccess) {
                router.push("/admin/dashboard");
                return;
            }

            setIsAuthorized(true);
            fetchUpdates();
        } catch (e) {
            router.push("/admin/login");
        }
    }, [router]);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/daily-updates');
            const data = await response.json();
            setUpdates(data.updates || []);
        } catch (error) {
            console.error('Error fetching daily updates:', error);
            alert('Failed to fetch daily updates');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadForm.file || !uploadForm.title || !uploadForm.reportDate) {
            alert('Please fill in all required fields');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadForm.file);
            formData.append('title', uploadForm.title);
            formData.append('reportDate', uploadForm.reportDate);
            formData.append('description', uploadForm.description);

            const response = await fetch('/api/admin/daily-updates/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Daily Update uploaded successfully!');
                setUploadForm({
                    title: '',
                    reportDate: new Date().toISOString().split('T')[0],
                    description: '',
                    file: null,
                });
                // Reset file input in DOM
                const fileInput = document.getElementById('uploadFile') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                fetchUpdates();
            } else {
                const error = await response.json();
                alert(`Upload failed: ${error.error}`);
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Failed to upload daily update');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/daily-updates?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Daily Update deleted successfully');
                fetchUpdates();
            } else {
                alert('Failed to delete daily update');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete daily update');
        }
    };

    const handleEditClick = (update: DailyUpdate) => {
        setEditingUpdate(update);
        setEditForm({
            title: update.title,
            reportDate: update.reportDate || update.uploadDate.split('T')[0],
            description: update.description || '',
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUpdate || !editForm.title || !editForm.reportDate) {
            alert('Missing required fields');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch('/api/admin/daily-updates/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingUpdate.id,
                    title: editForm.title,
                    reportDate: editForm.reportDate,
                    description: editForm.description,
                }),
            });

            if (response.ok) {
                alert('Daily update edited successfully!');
                setShowEditModal(false);
                setEditingUpdate(null);
                fetchUpdates();
            } else {
                const data = await response.json();
                alert(`Update failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Error updating:', error);
            alert('Failed to update. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Checking permissions...</p>
            </div>
        );
    }

    return (
        <>
            <section className="bg-black text-white py-12">
                <Container>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Daily Updates Admin</h1>
                            <p className="text-xl text-primary-100">Upload and manage Morning Buzz reports</p>
                        </div>
                        <a href="/admin/dashboard" className="text-primary-400 hover:text-white transition">
                            &larr; Back to Dashboard
                        </a>
                    </div>
                </Container>
            </section>

            <section className="py-12 bg-gray-50 min-h-screen">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Upload Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Upload New Daily Update
                                </CardTitle>
                                <CardDescription>
                                    Add a new Morning Buzz report to the database
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Report Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={uploadForm.title}
                                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                            placeholder="e.g. Morning Buzz 25 Dec 2025"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Report Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={uploadForm.reportDate}
                                            onChange={(e) => setUploadForm({ ...uploadForm, reportDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Description <span className="text-gray-400 text-xs">(optional)</span>
                                        </label>
                                        <textarea
                                            value={uploadForm.description}
                                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            File (PDF) *
                                        </label>
                                        <input
                                            id="uploadFile"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                                            className="w-full"
                                            required
                                        />
                                        {uploadForm.file && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Selected: {uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Upload Update'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Updates List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Uploaded Updates ({updates.length})
                                </CardTitle>
                                <CardDescription>
                                    Manage existing Morning Buzz reports
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {loading ? (
                                        <p className="text-gray-500">Loading...</p>
                                    ) : updates.length === 0 ? (
                                        <p className="text-gray-500">No updates uploaded yet</p>
                                    ) : (
                                        updates.map((update) => (
                                            <div
                                                key={update.id}
                                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{update.title}</h3>
                                                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                            <span>Report: {update.reportDate || update.uploadDate.split('T')[0]}</span>
                                                            <span>File: {update.fileName}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <a
                                                            href={update.filePath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleEditClick(update)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Edit Details"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(update.id, update.fileName)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {update.description && (
                                                    <p className="text-sm text-gray-700 mt-2">{update.description}</p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Container>
            </section>

            {/* Edit Modal */}
            {showEditModal && editingUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">Edit Daily Update</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Report Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Report Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.reportDate}
                                        onChange={(e) => setEditForm({ ...editForm, reportDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave blank if no description is needed</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-primary-600 hover:bg-primary-700"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
