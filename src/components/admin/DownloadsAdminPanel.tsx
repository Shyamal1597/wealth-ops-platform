'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Loader2, CheckCircle2, AlertCircle, Trash2, Pencil, Save, X, Plus } from 'lucide-react';

type DownloadsTabId = 'equity' | 'depository' | 'ap-support' | 'mandatory' | 'policies';

interface DownloadFormItem {
  id: string;
  name: string;
  file: string;
}

type DownloadsStore = Record<DownloadsTabId, DownloadFormItem[]>;

const TABS: { id: DownloadsTabId; label: string }[] = [
  { id: 'equity', label: 'Equity & BSE' },
  { id: 'depository', label: 'Depository' },
  { id: 'ap-support', label: 'AP Support' },
  { id: 'mandatory', label: 'Mandatory Information' },
  { id: 'policies', label: 'Policies' },
];

export default function DownloadsAdminPanel() {
  const [store, setStore] = useState<DownloadsStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DownloadsTabId>('equity');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/downloads');
      if (!res.ok) throw new Error();
      setStore(await res.json());
    } catch {
      setStore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (form: DownloadFormItem) => {
    setEditingId(form.id);
    setEditingName(form.name);
  };

  const saveEdit = async (formId: string) => {
    try {
      const res = await fetch('/api/admin/downloads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabId: activeTab, formId, name: editingName }),
      });
      if (!res.ok) throw new Error();
      setMessage({ text: 'Renamed', type: 'success' });
      setEditingId(null);
      load();
    } catch {
      setMessage({ text: 'Failed to rename', type: 'error' });
    }
  };

  const deleteForm = async (formId: string, name: string) => {
    if (!confirm(`Remove "${name}" from the Downloads page? The file itself is not deleted.`)) return;
    try {
      const res = await fetch(`/api/admin/downloads?tabId=${activeTab}&formId=${formId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMessage({ text: 'Removed', type: 'success' });
      load();
    } catch {
      setMessage({ text: 'Failed to remove', type: 'error' });
    }
  };

  const submitAdd = async () => {
    if (!newFile || !newName.trim()) {
      setMessage({ text: 'Name and PDF are both required', type: 'error' });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('tabId', activeTab);
      formData.append('name', newName.trim());
      const res = await fetch('/api/admin/downloads/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      setMessage({ text: 'Added', type: 'success' });
      setShowAdd(false);
      setNewName('');
      setNewFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      load();
    } catch (err: any) {
      setMessage({ text: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

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
        <p className="text-gray-600">Failed to load Downloads &amp; Forms data.</p>
      </Card>
    );
  }

  const forms = store[activeTab] || [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Download className="h-5 w-5 text-primary-600" />
          Downloads &amp; Forms
        </h2>
        <p className="text-sm text-gray-600">
          Add, rename, or remove the documents listed on the public Downloads &amp; Forms page.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowAdd(false); setEditingId(null); }}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({(store[tab.id] || []).length})
          </button>
        ))}
      </div>

      {message && (
        <div className={`flex items-center gap-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <p className="text-sm text-gray-600">{forms.length} document{forms.length !== 1 ? 's' : ''}</p>
          <Button type="button" size="sm" onClick={() => setShowAdd((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAdd && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
              <input
                type="text"
                placeholder="Document name (as shown to visitors)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" disabled={uploading} onClick={submitAdd}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {forms.map((form) => (
              <div key={form.id} className="flex items-center justify-between gap-3 py-3">
                {editingId === form.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    <button type="button" onClick={() => saveEdit(form.id)} aria-label="Save name">
                      <Save className="h-4 w-4 text-green-600 hover:text-green-800" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel edit">
                      <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-900">{form.name}</span>
                    <a
                      href={`/forms/${encodeURIComponent(form.file)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                      aria-label={`View ${form.name}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={() => startEdit(form)} aria-label={`Rename ${form.name}`}>
                      <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>
                    <button type="button" onClick={() => deleteForm(form.id, form.name)} aria-label={`Remove ${form.name}`}>
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </>
                )}
              </div>
            ))}
            {forms.length === 0 && (
              <p className="text-sm text-gray-500 py-6 text-center">No documents in this category yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
