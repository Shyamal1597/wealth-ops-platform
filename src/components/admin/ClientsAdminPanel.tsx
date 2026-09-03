import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserPlus, Upload, Search, Loader2, CheckCircle2, AlertCircle, X,
  RefreshCw, Users,
} from 'lucide-react';

interface ClientListItem {
  clientId: string;
  name: string;
  email?: string;
  mobile?: string;
  accountStatus?: string;
  requiresActivation?: boolean;
  accountOpenDate?: string;
}

interface SkippedRow {
  clientId: string;
  reason: string;
}

const PAGE_SIZE = 25;

export default function ClientsAdminPanel() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ clientId: '', name: '', email: '', mobile: '' });
  const [adding, setAdding] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ inserted: number; skipped: SkippedRow[]; totalRows: number } | null>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const [resendingId, setResendingId] = useState<string | null>(null);

  // Debounce the raw search input — avoids firing a full-table-scan search
  // request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadClients = useCallback(async () => {
    // Tag each request so a slower, older response can't overwrite a newer one
    // (e.g. typing a new search term while on page 3 fires a page-3 fetch and,
    // once the page-reset effect below runs, a page-1 fetch — without this,
    // whichever happens to resolve second wins, even if it's the stale one).
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        status: statusFilter,
      });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

      const res = await fetch(`/api/admin/clients?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load clients');
      const data = await res.json();
      if (requestId !== requestIdRef.current) return; // a newer request has since started — discard this one
      setClients(data.clients || []);
      setTotal(data.total || 0);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setMessage({ text: 'Failed to load clients', type: 'error' });
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { loadClients(); }, [loadClients]);

  // Reset to page 1 whenever the (debounced) search/filter changes
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to add client', type: 'error' });
        return;
      }
      setMessage({ text: `Client ${addForm.clientId} added. They'll get their activation code the first time they log in.`, type: 'success' });
      setAddForm({ clientId: '', name: '', email: '', mobile: '' });
      setShowAddModal(false);
      loadClients();
    } catch {
      setMessage({ text: 'Failed to add client', type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkUploading(true);
    setBulkResult(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append('file', bulkFile);
      const res = await fetch('/api/admin/clients/bulk', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Bulk upload failed', type: 'error' });
        return;
      }
      setBulkResult({ inserted: data.inserted, skipped: data.skipped || [], totalRows: data.totalRows });
      if (data.inserted > 0) loadClients();
    } catch {
      setMessage({ text: 'Bulk upload failed', type: 'error' });
    } finally {
      setBulkUploading(false);
    }
  };

  const handleResendActivation = async (clientId: string) => {
    setResendingId(clientId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/clients/resend-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to resend activation code', type: 'error' });
        return;
      }
      const dest = data.otpMethod === 'sms' ? data.maskedPhone : data.maskedEmail;
      setMessage({ text: `Activation code sent to ${dest} (${data.otpMethod}).`, type: 'success' });
    } catch {
      setMessage({ text: 'Failed to resend activation code', type: 'error' });
    } finally {
      setResendingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="status"
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
          {message.text}
          <button onClick={() => setMessage(null)} aria-label="Dismiss message" className="ml-auto p-1 hover:opacity-70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Real page-section heading (CardTitle below hardcodes an h3 — a bare Card here would
          otherwise jump straight from the dashboard's h1 to an h3 with no h2 in between). */}
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Users className="h-5 w-5 text-primary-600" aria-hidden="true" />
        Clients
      </h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardDescription>
              Manage which Client IDs can log in to the Research Reports and SIP Products portals. New clients always go through the same OTP first-login flow as everyone else.
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => { setBulkResult(null); setBulkFile(null); setShowBulkModal(true); }}>
              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
              Bulk Upload
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Client ID, name, email, or mobile"
                aria-label="Search clients"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending')}
              aria-label="Filter by activation status"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Awaiting activation</option>
            </select>
            <Button variant="outline" onClick={loadClients} aria-label="Refresh client list">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Client ID</th>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Name</th>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Email</th>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Mobile</th>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Status</th>
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500"><Loader2 className="h-5 w-5 animate-spin inline mr-2" aria-hidden="true" />Loading…</td></tr>
                ) : clients.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No clients found.</td></tr>
                ) : (
                  clients.map((c) => {
                    const pending = c.requiresActivation !== false && c.accountStatus !== 'active';
                    return (
                      <tr key={c.clientId} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-mono text-gray-900">{c.clientId}</td>
                        <td className="px-4 py-2.5 text-gray-900">{c.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{c.email || '—'}</td>
                        <td className="px-4 py-2.5 text-gray-600">{c.mobile || '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pending ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {pending ? 'Awaiting activation' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {pending && (
                            <button
                              onClick={() => handleResendActivation(c.clientId)}
                              disabled={resendingId === c.clientId}
                              className="text-primary-600 hover:text-primary-700 font-medium text-xs disabled:opacity-50"
                            >
                              {resendingId === c.clientId ? 'Sending…' : 'Resend code'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>{total.toLocaleString()} client{total !== 1 ? 's' : ''} total</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-client-title">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 id="add-client-title" className="text-lg font-semibold">Add Client</h3>
              <button onClick={() => setShowAddModal(false)} aria-label="Close dialog" className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label htmlFor="new-client-id" className="block text-sm font-medium text-gray-700 mb-1">Client ID *</label>
                <input
                  id="new-client-id"
                  type="text"
                  required
                  value={addForm.clientId}
                  onChange={(e) => setAddForm({ ...addForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="new-client-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  id="new-client-name"
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="new-client-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="new-client-email"
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="new-client-mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  id="new-client-mobile"
                  type="tel"
                  value={addForm.mobile}
                  onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p className="text-xs text-gray-500">At least one of email or mobile is required — that's where their activation code goes on first login.</p>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={adding}>
                  {adding ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />Adding…</> : 'Add Client'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="bulk-upload-title">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 id="bulk-upload-title" className="text-lg font-semibold">Bulk Upload Clients</h3>
              <button onClick={() => setShowBulkModal(false)} aria-label="Close dialog" className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!bulkResult ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  CSV or XLSX file with columns: <code className="bg-gray-100 px-1 rounded">clientId</code>, <code className="bg-gray-100 px-1 rounded">name</code>, <code className="bg-gray-100 px-1 rounded">email</code>, <code className="bg-gray-100 px-1 rounded">mobile</code> (email/mobile optional per row, but at least one is required). Up to 50,000 rows per file.
                </p>
                <input
                  ref={bulkInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  aria-label="Choose CSV or XLSX file of clients"
                  onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:text-sm file:font-medium hover:file:bg-primary-100"
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowBulkModal(false)}>Cancel</Button>
                  <Button onClick={handleBulkUpload} disabled={!bulkFile || bulkUploading}>
                    {bulkUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />Uploading…</> : 'Upload'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">{bulkResult.inserted} of {bulkResult.totalRows} client(s) added.</span>
                </div>
                {bulkResult.skipped.length > 0 && (
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Client ID</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Skipped because</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bulkResult.skipped.map((s, i) => (
                          <tr key={i}>
                            <td className="px-3 py-1.5 font-mono">{s.clientId}</td>
                            <td className="px-3 py-1.5 text-gray-600">{s.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setShowBulkModal(false)}>Done</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
