import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Save, FileJson, AlertCircle, FileSpreadsheet,
  CheckCircle, X, BarChart3,
} from 'lucide-react';

// ─── Types mirroring sip-parser.ts output (as received from the API) ─────────

interface RebalancingTier {
  date: string;
  additionalCapital: number;
  numberOfStocks: number;
  sectorsExcluded: string;
  totalValue: number;
  holdings: Array<{
    stock: string;
    currentPrice: number;
    recommendedWeight: number;
    recommendedAmount: number;
    recommendedQty: number;
    currentQty: number;
    transactionQty: number;
    action: string;
  }>;
}

interface PerformanceTier {
  additionalCapital: number;
  performance: {
    totalInvested: number;
    currentValue: number;
    unrealizedGains: number;
    cumulativeReturn: number;
    [key: string]: number;
  };
  stockPerformance: Array<{
    stock: string;
    totalShares: number;
    investedValue: number;
    currentPrice: number;
    avgPurchasePrice: number;
    currentValue: number;
    cumulativeReturn: number;
  }>;
  realizedGains: Array<{ company: string; longTermGain: number; shortTermGain: number }>;
  capitalMovement: Array<{ date: string; netInjection: number; cumulativeCapital: number }>;
}

interface ParsedRebalancingResult {
  type: 'rebalancing';
  profile: string;
  tiers: Record<string, RebalancingTier>;
}

interface ParsedPerformanceResult {
  type: 'performance';
  profile: string;
  tiers: Record<string, PerformanceTier>;
}

type ParseResult = ParsedRebalancingResult | ParsedPerformanceResult;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SIPProductsAdminPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('50000');
  const [jsonInput, setJsonInput] = useState('');

  // Upload state — two independent cards (rebalancing + performance)
  const [uploadingKind, setUploadingKind] = useState<'rebalancing' | 'performance' | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const rebalancingInputRef = useRef<HTMLInputElement>(null);
  const performanceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (data && selectedProfile && selectedTier) {
      const tierData = data.profiles[selectedProfile]?.tiers[selectedTier];
      if (tierData) setJsonInput(JSON.stringify(tierData, null, 2));
    }
  }, [data, selectedProfile, selectedTier]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/sip-products');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        const profiles = Object.keys(json.profiles || {});
        if (profiles.length > 0) setSelectedProfile(profiles[0]);
      }
    } catch {
      setMessage({ text: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTier = async () => {
    try {
      setSaving(true);
      setMessage({ text: '', type: '' });
      const parsedData = JSON.parse(jsonInput);
      const res = await fetch('/api/admin/sip-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: selectedProfile, tier: selectedTier, tierData: parsedData }),
      });
      if (res.ok) {
        setMessage({ text: 'Tier data saved successfully', type: 'success' });
        await fetchData();
      } else {
        const err = await res.json();
        setMessage({ text: err.error || 'Failed to save', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: `Invalid JSON: ${e.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, kind: 'rebalancing' | 'performance') => {
    setUploadingKind(kind);
    setParseResult(null);
    setMessage({ text: '', type: '' });

    const form = new FormData();
    form.append('file', file);
    form.append('kind', kind);
    // Send selected profile and tier as hints — used when the file doesn't embed them
    if (selectedProfile) form.append('profile', selectedProfile);
    if (selectedTier)    form.append('tier', selectedTier);

    try {
      const res  = await fetch('/api/admin/sip-products/parse', { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok && json.success) {
        setParseResult(json.data as ParseResult);
      } else {
        setMessage({ text: json.error || 'Parse failed', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Upload failed — check your connection', type: 'error' });
    } finally {
      setUploadingKind(null);
    }
  };

  /**
   * Apply a rebalancing tier to the JSON editor.
   * Also syncs stockPerformance — adds skeleton entries for new stocks so
   * live prices start working immediately; existing entries are preserved.
   */
  const applyRebalancingTier = (tierKey: string) => {
    if (!parseResult || parseResult.type !== 'rebalancing') return;
    const profile  = parseResult.profile;
    const tierData = parseResult.tiers[tierKey];

    const existing      = data?.profiles?.[profile]?.tiers?.[tierKey] ?? {};
    const existingPerf: any[] = existing.stockPerformance ?? [];
    const existingNames = new Set(existingPerf.map((sp: any) => sp.stock));

    // New active stocks not yet tracked → add skeleton so live prices work now
    const newEntries = tierData.holdings
      .filter(h => h.recommendedWeight > 0 && !existingNames.has(h.stock))
      .map(h => ({
        stock:            h.stock,
        totalShares:      h.recommendedQty,
        investedValue:    h.recommendedAmount,
        currentPrice:     h.currentPrice,
        avgPurchasePrice: h.currentPrice,
        currentValue:     h.recommendedAmount,
        cumulativeReturn: 0,
      }));

    const merged = {
      ...existing,
      date:              tierData.date,
      additionalCapital: tierData.additionalCapital,
      numberOfStocks:    tierData.numberOfStocks,
      sectorsExcluded:   tierData.sectorsExcluded,
      totalValue:        tierData.totalValue,
      holdings:          tierData.holdings,
      stockPerformance:  [...existingPerf, ...newEntries],
    };

    setSelectedProfile(profile);
    setSelectedTier(tierKey);
    setJsonInput(JSON.stringify(merged, null, 2));
    setParseResult(null);

    const added = newEntries.length;
    setMessage({
      text: `Tier ₹${parseInt(tierKey).toLocaleString('en-IN')} loaded.${added ? ` Added ${added} new stock${added > 1 ? 's' : ''} to performance tracking.` : ''} Review and click Save Changes.`,
      type: 'info',
    });
  };

  /**
   * Apply a performance tier to the JSON editor.
   * Updates performance metrics, stockPerformance, realizedGains, capitalMovement
   * while preserving rebalancing fields (date, holdings, etc.).
   */
  const applyPerformanceTier = (tierKey: string) => {
    if (!parseResult || parseResult.type !== 'performance') return;
    const profile  = parseResult.profile;
    const tierData = parseResult.tiers[tierKey];

    const existing = data?.profiles?.[profile]?.tiers?.[tierKey] ?? {};
    const merged = {
      ...existing,
      performance:     tierData.performance,
      stockPerformance: tierData.stockPerformance,
      realizedGains:   tierData.realizedGains,
      capitalMovement: tierData.capitalMovement,
    };

    setSelectedProfile(profile);
    setSelectedTier(tierKey);
    setJsonInput(JSON.stringify(merged, null, 2));
    setParseResult(null);
    setMessage({
      text: `Performance data for ₹${parseInt(tierKey).toLocaleString('en-IN')} tier loaded. Review and click Save Changes.`,
      type: 'info',
    });
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading SIP Products data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">SIP Products Management</h2>
        <div className="text-sm text-gray-500">Last Updated: {data?.lastUpdated || 'N/A'}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Profile / Tier selector */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Select Portfolio</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile</label>
                <div className="flex flex-col gap-2">
                  {data?.profiles && Object.keys(data.profiles).map((profile: string) => (
                    <button
                      key={profile}
                      onClick={() => setSelectedProfile(profile)}
                      className={`px-4 py-2 text-left rounded-md text-sm font-medium transition-colors ${
                        selectedProfile === profile
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {data.profiles[profile].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Tier</label>
                <div className="flex gap-2">
                  {['50000', '100000'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTier === tier
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ₹{parseInt(tier).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rebalancing Report Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Rebalancing Report</CardTitle>
              <CardDescription>Monthly holdings file (XLSX or CSV)</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={rebalancingInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'rebalancing'); e.target.value = ''; }}
              />
              <div
                className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => rebalancingInputRef.current?.click()}
              >
                <FileSpreadsheet className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  {uploadingKind === 'rebalancing' ? 'Parsing rebalancing file...' : 'Click to select rebalancing file'}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  disabled={uploadingKind !== null}
                  onClick={(e) => { e.stopPropagation(); rebalancingInputRef.current?.click(); }}
                >
                  {uploadingKind === 'rebalancing' ? 'Uploading...' : 'Upload Rebalancing'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Report Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Performance Report</CardTitle>
              <CardDescription>Monthly performance metrics (XLSX or CSV)</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={performanceInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'performance'); e.target.value = ''; }}
              />
              <div
                className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => performanceInputRef.current?.click()}
              >
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  {uploadingKind === 'performance' ? 'Parsing performance file...' : 'Click to select performance file'}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  disabled={uploadingKind !== null}
                  onClick={(e) => { e.stopPropagation(); performanceInputRef.current?.click(); }}
                >
                  {uploadingKind === 'performance' ? 'Uploading...' : 'Upload Performance'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Parsed result card — rebalancing ───────────────────────────── */}
          {parseResult?.type === 'rebalancing' && (
            <Card className="border-green-300 bg-green-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Rebalancing Report
                  </CardTitle>
                  <button onClick={() => setParseResult(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardDescription className="text-green-700">
                  Profile: <strong className="capitalize">{parseResult.profile}</strong> — click a tier to load it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(parseResult.tiers).map(([tierKey, tier]) => (
                  <div key={tierKey} className="bg-white rounded-md border border-green-200 p-3">
                    <div className="mb-2">
                      <p className="font-medium text-sm">₹{parseInt(tierKey).toLocaleString('en-IN')} / month</p>
                      <p className="text-xs text-gray-500">Date: {tier.date} · {tier.holdings.length} holdings</p>
                      <p className="text-xs text-gray-500">Total: ₹{fmt(tier.totalValue)}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => applyRebalancingTier(tierKey)}
                    >
                      Apply to Editor
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Parsed result card — performance ───────────────────────────── */}
          {parseResult?.type === 'performance' && (
            <Card className="border-blue-300 bg-blue-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Report
                  </CardTitle>
                  <button onClick={() => setParseResult(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardDescription className="text-blue-700">
                  Profile: <strong className="capitalize">{parseResult.profile}</strong> — click a tier to load it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(parseResult.tiers).map(([tierKey, tier]) => {
                  const p = tier.performance;
                  const ret = p.cumulativeReturn ?? 0;
                  return (
                    <div key={tierKey} className="bg-white rounded-md border border-blue-200 p-3">
                      <div className="mb-2">
                        <p className="font-medium text-sm">₹{parseInt(tierKey).toLocaleString('en-IN')} / month</p>
                        <p className="text-xs text-gray-500">
                          Value: ₹{fmt(p.currentValue)} · Invested: ₹{fmt(p.totalInvested)}
                        </p>
                        <p className={`text-xs font-medium ${ret >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Return: {ret > 0 ? '+' : ''}{ret.toFixed(1)}% · {tier.stockPerformance.length} stocks tracked
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => applyPerformanceTier(tierKey)}
                      >
                        Apply Performance Data
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: JSON Editor */}
        <div className="w-full md:w-2/3">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary-600" />
                  Manual Data Editor
                </CardTitle>
                <CardDescription>Review parsed data or edit the raw JSON directly</CardDescription>
              </div>
              <Button onClick={handleSaveTier} disabled={saving} className="flex gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col pt-4">
              {message.text && (
                <div className={`mx-4 mb-4 px-4 py-3 rounded-md text-sm font-medium flex items-start gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  message.type === 'info'    ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{message.text}</span>
                </div>
              )}
              <div className="flex-1 px-4 pb-4">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-[500px] p-4 font-mono text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  spellCheck={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
