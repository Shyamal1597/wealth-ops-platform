'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, Loader2, CheckCircle2, Plus, Trash2, Save } from 'lucide-react';

type ComplaintsSegment = 'stock-broker' | 'research-analyst' | 'depository-participant';

interface YearlyComplaintRow {
  year: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
}

interface SegmentComplaintsData {
  label: string;
  registrationLabel: string;
  pdfFileName: string;
  pdfUpdatedAt: string | null;
  yearlyData: YearlyComplaintRow[];
}

type ComplaintsStore = Record<ComplaintsSegment, SegmentComplaintsData>;

const SEGMENTS: ComplaintsSegment[] = ['stock-broker', 'research-analyst', 'depository-participant'];

function SegmentPanel({ segment, data, onChanged }: { segment: ComplaintsSegment; data: SegmentComplaintsData; onChanged: () => void }) {
  const [rows, setRows] = useState<YearlyComplaintRow[]>(data.yearlyData);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setRows(data.yearlyData); }, [data.yearlyData]);

  const updateRow = (index: number, field: keyof YearlyComplaintRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { year: '', carriedForward: 'NIL', received: 'NIL', resolved: 'NIL', pending: 'NIL' }]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/investor-complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, yearlyData: rows }),
      });
      if (!res.ok) throw new Error();
      setMessage({ text: 'Saved', type: 'success' });
      onChanged();
    } catch {
      setMessage({ text: 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('segment', segment);
      const res = await fetch('/api/admin/investor-complaints/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      setMessage({ text: 'PDF uploaded', type: 'success' });
      onChanged();
    } catch (err: any) {
      setMessage({ text: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.label}</h3>
            <CardDescription>{data.registrationLabel}</CardDescription>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-600">
              PDF: {data.pdfUpdatedAt ? `updated ${new Date(data.pdfUpdatedAt).toLocaleDateString()}` : 'not yet uploaded'}
            </p>
            <a
              href={`/legal-documents/${data.pdfFileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-xs"
            >
              View current PDF
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload This Month&apos;s PDF
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 font-semibold text-gray-900">Year</th>
                <th className="text-left p-2 font-semibold text-gray-900">Carried Forward</th>
                <th className="text-left p-2 font-semibold text-gray-900">Received</th>
                <th className="text-left p-2 font-semibold text-gray-900">Resolved</th>
                <th className="text-left p-2 font-semibold text-gray-900">Pending</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row, i) => (
                <tr key={i}>
                  {(['year', 'carriedForward', 'received', 'resolved', 'pending'] as const).map((field) => (
                    <td key={field} className="p-1.5">
                      <input
                        value={row[field]}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                      />
                    </td>
                  ))}
                  <td className="p-1.5">
                    <button type="button" onClick={() => removeRow(i)} aria-label={`Remove row ${row.year || i + 1}`}>
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Year
          </Button>
          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-sm flex items-center gap-1 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {message.text}
              </span>
            )}
            <Button type="button" size="sm" disabled={saving} onClick={save}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvestorComplaintsAdminPanel() {
  const [store, setStore] = useState<ComplaintsStore | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/investor-complaints');
      if (!res.ok) throw new Error();
      setStore(await res.json());
    } catch {
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!store) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <p className="text-gray-600">Failed to load investor complaints data.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary-600" />
          Investor Complaints Data
        </h2>
        <p className="text-sm text-gray-600">
          Update the monthly SEBI-mandated investor-complaints PDF and the on-page summary table for each registration. Both feed directly into the public Investor Charter page.
        </p>
      </div>

      {SEGMENTS.map((segment) => (
        <SegmentPanel key={segment} segment={segment} data={store[segment]} onChanged={load} />
      ))}
    </div>
  );
}
