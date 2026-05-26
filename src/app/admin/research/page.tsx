'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RESEARCH_STRUCTURE, ResearchReport, ResearchCategory, ResearchSubcategory } from '@/lib/research-types';
import { Upload, Trash2, FileText, Download } from 'lucide-react';

export default function ResearchAdminPage() {
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [reportType, setReportType] = useState<'research' | 'daily'>('research');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResearchCategory>('Fundamental');
  const [subcategory, setSubcategory] = useState<ResearchSubcategory>('Company');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Fetch reports
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/research');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('description', description);
      formData.append('reportType', reportType);

      const response = await fetch('/api/research', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Report uploaded successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        // Refresh list
        fetchReports();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`/api/research?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Report deleted successfully');
        fetchReports();
      } else {
        alert('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete report');
    }
  };

  const subcategories = RESEARCH_STRUCTURE[category] || [];

  return (
    <>
      <section className="bg-black text-white py-12">
        <Container>
          <h1 className="text-4xl font-bold mb-2">Research Admin</h1>
          <p className="text-xl text-primary-100">Upload and manage research reports</p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Report
                </CardTitle>
                <CardDescription>
                  Add a new research report to the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report Type *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reportType"
                          value="research"
                          checked={reportType === 'research'}
                          onChange={(e) => setReportType('research')}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm">Research Report</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reportType"
                          value="daily"
                          checked={reportType === 'daily'}
                          onChange={(e) => setReportType('daily')}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm">Daily Update (Morning Buzz)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCategory = e.target.value as ResearchCategory;
                        setCategory(newCategory);
                        // Reset subcategory when category changes
                        setSubcategory(RESEARCH_STRUCTURE[newCategory][0] as ResearchSubcategory);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="Fundamental">Fundamental</option>
                      <option value="Technical">Technical</option>
                      <option value="Economic">Economic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subcategory *
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value as ResearchSubcategory)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      {subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File (PDF) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full"
                      required
                    />
                    {file && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Report'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Reports ({reports.length})
                </CardTitle>
                <CardDescription>
                  Manage existing research reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : reports.length === 0 ? (
                    <p className="text-gray-500">No reports uploaded yet</p>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-600">
                              {report.category} → {report.subcategory}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(report.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={report.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {report.description && (
                          <p className="text-sm text-gray-700 mt-2">{report.description}</p>
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
    </>
  );
}
