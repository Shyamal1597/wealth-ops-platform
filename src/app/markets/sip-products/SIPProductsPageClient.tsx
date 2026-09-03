'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield, TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight,
  ChevronDown, ChevronUp, Lock, DollarSign, PieChart, Activity, Clock,
  RefreshCw, Target, AlertTriangle, Zap
} from 'lucide-react';
import Link from 'next/link';

interface Holding {
  stock: string;
  currentPrice: number;
  recommendedWeight: number;
  recommendedAmount: number;
  recommendedQty: number;
  currentQty: number;
  transactionQty: number;
  action: string;
}

interface Performance {
  totalInvested: number;
  currentValue: number;
  unrealizedGains: number;
  benchmarkTotalInvested: number;
  benchmarkCurrentValue: number;
  benchmarkUnrealizedGains: number;
  cumulativeReturn: number;
  benchmarkCumulativeReturn: number;
  timeWeightedReturnNonAnnualized: number;
  benchmarkTWRNonAnnualized: number;
  annualizedTWR: number;
  benchmarkAnnualizedTWR: number;
  moneyWeightedReturnAnnualized: number;
  benchmarkMWRAnnualized: number;
  moneyWeightedReturnNonAnnualized: number;
  benchmarkMWRNonAnnualized: number;
  investmentPeriod: number;
  portfolioTurnover: number;
}

interface StockPerf {
  stock: string;
  totalShares: number;
  investedValue: number;
  currentPrice: number;
  avgPurchasePrice: number;
  currentValue: number;
  cumulativeReturn: number;
}

interface RealizedGain {
  company: string;
  longTermGain: number;
  shortTermGain: number;
}

interface CapitalMovement {
  date: string;
  netInjection: number;
  cumulativeCapital: number;
}

interface TierData {
  date: string;
  additionalCapital: number;
  numberOfStocks: number;
  sectorsExcluded: string;
  totalValue: number;
  holdings: Holding[];
  performance: Performance | null;
  stockPerformance: StockPerf[] | null;
  realizedGains: RealizedGain[] | null;
  capitalMovement: CapitalMovement[] | null;
  corporateCashPayouts?: string;
}

interface ProfileData {
  label: string;
  marketCap: string;
  description: string;
  color: string;
  tiers: { [key: string]: TierData };
}

interface SIPData {
  lastUpdated: string;
  profiles: { [key: string]: ProfileData };
}

const formatCurrency = (val: number) => {
  if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatPercent = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

const profileIcons: { [key: string]: React.ReactNode } = {
  conservative: <Shield className="h-8 w-8" />,
  moderate: <Target className="h-8 w-8" />,
  aggressive: <Zap className="h-8 w-8" />,
};

export default function SIPProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<SIPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('50000');
  const [showRealizedGains, setShowRealizedGains] = useState(false);
  const [showCapitalMovement, setShowCapitalMovement] = useState(false);
  const [livePrices, setLivePrices] = useState<{ [stock: string]: number | null }>({});
  const [livePricesLoading, setLivePricesLoading] = useState(false);
  const [livePricesFetchedAt, setLivePricesFetchedAt] = useState<string>('');

  useEffect(() => {
    checkAuthentication();
    fetchData();

    // Poll every 30 s — detect session takeover from another browser
    // without requiring a manual page refresh.
    const interval = setInterval(verifySessionSilently, 30_000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthentication = async () => {
    try {
      const res = await fetch('/api/auth/client-verify');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          sessionStorage.setItem('clientData', JSON.stringify({
            clientId: data.clientId,
            name: data.name,
          }));
          setIsAuthenticated(true);
          return;
        }
      }
      sessionStorage.removeItem('clientData');
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('clientSessionChange'));
    } catch {
      const clientData = sessionStorage.getItem('clientData');
      setIsAuthenticated(!!clientData);
    }
  };

  const verifySessionSilently = async () => {
    try {
      const res = await fetch('/api/auth/client-verify');
      if (!res.ok) {
        sessionStorage.removeItem('clientData');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('clientSessionChange'));
        return;
      }
      const data = await res.json();
      if (!data.authenticated) {
        sessionStorage.removeItem('clientData');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('clientSessionChange'));
      }
    } catch {
      // Network blip — keep current state
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sip-products');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        // Default to first profile
        const profiles = Object.keys(json.profiles);
        if (profiles.length > 0) setSelectedProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error fetching SIP data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live EOD prices from Yahoo Finance
  const fetchLivePrices = async (stockNames: string[]) => {
    if (stockNames.length === 0) return;
    setLivePricesLoading(true);
    try {
      const res = await fetch(`/api/stock-prices?stocks=${encodeURIComponent(stockNames.join(','))}`);
      if (res.ok) {
        const json = await res.json();
        setLivePrices(json.prices || {});
        // Prefer the IST trading date returned by the API (e.g. "2026-04-15")
        if (json.tradingDate) {
          const [y, m, d] = json.tradingDate.split('-');
          const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
          setLivePricesFetchedAt(
            dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          );
        } else if (json.lastFetched) {
          const d = new Date(json.lastFetched);
          setLivePricesFetchedAt(d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
        }
      }
    } catch (error) {
      console.error('Error fetching live prices:', error);
    } finally {
      setLivePricesLoading(false);
    }
  };

  // Fetch live prices when profile/tier changes
  useEffect(() => {
    if (!data || !selectedProfile || !selectedTier) return;
    const p = data.profiles[selectedProfile];
    const t = p?.tiers[selectedTier];
    if (t?.stockPerformance) {
      const names = t.stockPerformance.map(sp => sp.stock);
      fetchLivePrices(names);
    }
  }, [data, selectedProfile, selectedTier]);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading SIP Product Dashboard...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Unavailable</h2>
            <p className="text-gray-500">SIP product data could not be loaded. Please try again later.</p>
          </div>
        </Container>
      </section>
    );
  }

  const profile = data.profiles[selectedProfile];
  const tier = profile?.tiers[selectedTier];

  // ── Live-price derived figures ────────────────────────────────────────────
  // Compute current value from Yahoo EOD prices (or JSON snapshot fallback).
  // This is used as a single source of truth for Current Value, Unrealized P&L,
  // and Cumulative Return so all three figures stay consistent.
  const liveTotalCurrentValue: number | null = (() => {
    if (!tier?.stockPerformance?.length) return null;
    return tier.stockPerformance.reduce((sum, sp) => {
      const yahoo = livePrices[sp.stock] ?? null;
      const close = yahoo != null ? yahoo : sp.currentPrice;
      return sum + close * sp.totalShares;
    }, 0);
  })();

  const liveUnrealizedGains: number =
    liveTotalCurrentValue != null && tier?.performance
      ? liveTotalCurrentValue - tier.performance.totalInvested
      : tier?.performance?.unrealizedGains ?? 0;

  const liveCumulativeReturn: number =
    liveTotalCurrentValue != null && tier?.performance && tier.performance.totalInvested > 0
      ? ((liveTotalCurrentValue - tier.performance.totalInvested) / tier.performance.totalInvested) * 100
      : tier?.performance?.cumulativeReturn ?? 0;

  // Auth gate — show locked view for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <PieChart className="h-4 w-4" />
                Sunidhi Research — Exclusive Product
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Direct Equity <span className="text-primary-400">SIP</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Professionally managed stock portfolios tailored to your risk appetite —
                Conservative, Moderate, and Aggressive strategies with monthly rebalancing.
              </p>
              <Link
                href="/research-login?redirect=/markets/sip-products"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                <Lock className="h-4 w-4" />
                Client Login to View Portfolios
              </Link>
            </div>
          </Container>
        </section>

        {/* Profile Overview Cards (teaser) */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Risk Profiles</h2>
              <p className="text-gray-600 text-lg">Choose the portfolio that matches your investment goals</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {Object.entries(data.profiles).map(([key, p]) => (
                <Card key={key} className="text-center border-2 hover:shadow-xl transition-all" style={{ borderColor: p.color }}>
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                      {profileIcons[key]}
                    </div>
                    <CardTitle className="text-xl">{p.label}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-1">Market Cap: {p.marketCap}</p>
                    <p className="text-sm text-gray-500">SIP: ₹50,000 / ₹1,00,000 per month</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </>
    );
  }

  // Authenticated view
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <PieChart className="h-4 w-4" />
              Last Updated: {data.lastUpdated}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Direct Equity <span className="text-primary-400">SIP</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Professionally managed stock portfolios with monthly rebalancing
            </p>
          </div>
        </Container>
      </section>

      {/* Profile Selector */}
      <section className="py-8 bg-gray-50 border-b">
        <Container>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {Object.entries(data.profiles).map(([key, p]) => (
              <button
                key={key}
                onClick={() => { setSelectedProfile(key); setSelectedTier('50000'); setShowRealizedGains(false); setShowCapitalMovement(false); }}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all font-medium ${
                  selectedProfile === key
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                style={selectedProfile === key ? { backgroundColor: p.color, borderColor: p.color } : {}}
              >
                {profileIcons[key]}
                <div className="text-left">
                  <div className="font-bold">{p.label}</div>
                  <div className="text-xs opacity-80">{p.marketCap}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tier Selector */}
          <div className="flex justify-center gap-3">
            {['50000', '100000'].map((t) => (
              <button
                key={t}
                onClick={() => { setSelectedTier(t); setShowRealizedGains(false); setShowCapitalMovement(false); }}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  selectedTier === t
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                ₹{parseInt(t).toLocaleString('en-IN')} / month
              </button>
            ))}
          </div>
        </Container>
      </section>

      {tier && (
        <>
          {/* Meta Info Bar */}
          <section className="py-4 bg-white border-b">
            <Container>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <span><strong>Date:</strong> {tier.date}</span>
                <span className="hidden md:inline">|</span>
                <span><strong>Stocks:</strong> {tier.numberOfStocks}</span>
                <span className="hidden md:inline">|</span>
                <span><strong>Market Cap:</strong> {profile.marketCap}</span>
                <span className="hidden md:inline">|</span>
                <span><strong>Sectors Excluded:</strong> {tier.sectorsExcluded}</span>
                <span className="hidden md:inline">|</span>
                <span><strong>Additional Capital:</strong> ₹{tier.additionalCapital.toLocaleString('en-IN')}</span>
              </div>
            </Container>
          </section>

          {/* KPI Cards */}
          {tier.performance && (
            <section className="py-8 bg-white">
              <Container>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <KPICard
                    label="Total Invested"
                    value={formatCurrency(tier.performance.totalInvested)}
                    icon={<DollarSign className="h-5 w-5" />}
                    color="blue"
                    updateFreq="monthly"
                  />
                  <KPICard
                    label="Current Value"
                    value={formatCurrency(liveTotalCurrentValue ?? tier.performance.currentValue)}
                    icon={<BarChart3 className="h-5 w-5" />}
                    color="purple"
                    updateFreq="live"
                  />
                  <KPICard
                    label="Unrealized P&L"
                    value={formatCurrency(liveUnrealizedGains)}
                    icon={liveUnrealizedGains >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    color={liveUnrealizedGains >= 0 ? 'green' : 'red'}
                    subtext={formatPercent(liveCumulativeReturn)}
                    updateFreq="live"
                  />
                  <KPICard
                    label="Benchmark P&L"
                    value={formatCurrency(tier.performance.benchmarkUnrealizedGains)}
                    icon={<Activity className="h-5 w-5" />}
                    color={tier.performance.benchmarkUnrealizedGains >= 0 ? 'green' : 'red'}
                    subtext={formatPercent(tier.performance.benchmarkCumulativeReturn)}
                    updateFreq="monthly"
                  />
                  <KPICard
                    label="Investment Period"
                    value={`${tier.performance.investmentPeriod} Yrs`}
                    icon={<Clock className="h-5 w-5" />}
                    color="gray"
                    updateFreq="monthly"
                  />
                  <KPICard
                    label="Turnover"
                    value={`${tier.performance.portfolioTurnover}%`}
                    icon={<RefreshCw className="h-5 w-5" />}
                    color="gray"
                    updateFreq="monthly"
                  />
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="font-medium">Update frequency:</span>
                  <span className="inline-flex items-center gap-1.5"><LiveBadge /> refreshes daily at NSE market close</span>
                  <span className="inline-flex items-center gap-1.5"><MonthlyBadge /> sourced from monthly rebalancing report</span>
                </div>
              </Container>
            </section>
          )}

          {/* Performance Comparison Table */}
          {tier.performance && (
            <section className="py-8 bg-gray-50">
              <Container>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                  Comparative Performance Metrics
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-4 font-semibold text-gray-700">Metric</th>
                            <th className="text-right p-4 font-semibold text-gray-700">Portfolio</th>
                            <th className="text-right p-4 font-semibold text-gray-700">Benchmark Index</th>
                            <th className="text-right p-4 font-semibold text-gray-700">Alpha</th>
                          </tr>
                        </thead>
                        <tbody>
                          <PerfRow label="Total Invested (INR)"                       updateFreq="monthly" portfolio={formatCurrency(tier.performance.totalInvested)}                                   benchmark={formatCurrency(tier.performance.benchmarkTotalInvested)} />
                          <PerfRow label="Current Value (INR)"                        updateFreq="live"    portfolio={formatCurrency(liveTotalCurrentValue ?? tier.performance.currentValue)}           benchmark={formatCurrency(tier.performance.benchmarkCurrentValue)} />
                          <PerfRow label="Unrealized Gains (INR)"                     updateFreq="live"    portfolio={formatCurrency(liveUnrealizedGains)}                                              benchmark={formatCurrency(tier.performance.benchmarkUnrealizedGains)} isValue />
                          <PerfRow label="Cumulative Return (%)"                      updateFreq="live"    portfolio={formatPercent(liveCumulativeReturn)}                                              benchmark={formatPercent(tier.performance.benchmarkCumulativeReturn)}       alpha={liveCumulativeReturn - tier.performance.benchmarkCumulativeReturn} />
                          <PerfRow label="Time-Weighted Return (Non-Annualized) (%)"  updateFreq="monthly" portfolio={formatPercent(tier.performance.timeWeightedReturnNonAnnualized)}                  benchmark={formatPercent(tier.performance.benchmarkTWRNonAnnualized)}        alpha={tier.performance.timeWeightedReturnNonAnnualized - tier.performance.benchmarkTWRNonAnnualized} />
                          <PerfRow label="Annualized Time-Weighted Return (%)"        updateFreq="monthly" portfolio={formatPercent(tier.performance.annualizedTWR)}                                    benchmark={formatPercent(tier.performance.benchmarkAnnualizedTWR)}           alpha={tier.performance.annualizedTWR - tier.performance.benchmarkAnnualizedTWR} />
                          <PerfRow label="Money-Weighted Return (Annualized) (%)"     updateFreq="monthly" portfolio={formatPercent(tier.performance.moneyWeightedReturnAnnualized)}                    benchmark={formatPercent(tier.performance.benchmarkMWRAnnualized)}           alpha={tier.performance.moneyWeightedReturnAnnualized - tier.performance.benchmarkMWRAnnualized} />
                          <PerfRow label="Money-Weighted Return (Non-Annualized) (%)" updateFreq="monthly" portfolio={formatPercent(tier.performance.moneyWeightedReturnNonAnnualized)}                 benchmark={formatPercent(tier.performance.benchmarkMWRNonAnnualized)}        alpha={tier.performance.moneyWeightedReturnNonAnnualized - tier.performance.benchmarkMWRNonAnnualized} />
                          <PerfRow label="Investment Period (Years)"                  updateFreq="monthly" portfolio={`${tier.performance.investmentPeriod}`}                                          benchmark={`${tier.performance.investmentPeriod}`} />
                          <PerfRow label="Portfolio Turnover (%)"                     updateFreq="monthly" portfolio={`${tier.performance.portfolioTurnover}%`}                                        benchmark="N/A" />
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </Container>
            </section>
          )}

          {/* Current Holdings Table */}
          <section className="py-8 bg-white">
            <Container>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <PieChart className="h-6 w-6 text-primary-600" />
                  Current Holdings — SIP Recommendation
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full" title="Sum of recommended allocation amounts at the prices used in this report. Not a live market value.">
                  Rec. Portfolio Value: {formatCurrency(tier.totalValue)}
                </span>
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left p-3 font-semibold text-gray-700">Stock</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Current Price</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Weight (%)</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Rec. Amount</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Rec. Qty</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Current Qty</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Txn Qty</th>
                          <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tier.holdings.map((h, i) => (
                          <tr key={i} className={`border-t ${h.recommendedWeight === 0 ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                            <td className="p-3 font-medium text-gray-900">{h.stock}</td>
                            <td className="p-3 text-right text-gray-700">₹{h.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-right text-gray-700">{h.recommendedWeight > 0 ? `${h.recommendedWeight}%` : '—'}</td>
                            <td className="p-3 text-right text-gray-700">{h.recommendedAmount > 0 ? formatCurrency(h.recommendedAmount) : '—'}</td>
                            <td className="p-3 text-right text-gray-700">{h.recommendedQty}</td>
                            <td className="p-3 text-right text-gray-700">{h.currentQty}</td>
                            <td className="p-3 text-right text-gray-700">{h.transactionQty}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                h.action === 'Buy' ? 'bg-green-100 text-green-800' :
                                h.action === 'Sell' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {h.action === 'Buy' && <ArrowUpRight className="h-3 w-3" />}
                                {h.action === 'Sell' && <ArrowDownRight className="h-3 w-3" />}
                                {h.action}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                          <td className="p-3 text-gray-900">Rec. Portfolio Total</td>
                          <td className="p-3" colSpan={2}></td>
                          <td className="p-3 text-right text-gray-900">{formatCurrency(tier.totalValue)}</td>
                          <td className="p-3" colSpan={4}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-gray-50 border-t text-xs text-gray-500 space-y-1">
                    <p><strong>RECOMMENDED QUANTITY</strong> — Qty including today&apos;s SIP</p>
                    <p><strong>CURRENT QUANTITY</strong> — Qty before today&apos;s SIP</p>
                    <p><strong>TRANSACTION QUANTITY</strong> — Today&apos;s Transaction Qty</p>
                  </div>
                </CardContent>
              </Card>
            </Container>
          </section>

          {/* Individual Stock Performance */}
          {tier.stockPerformance && tier.stockPerformance.length > 0 && (
            <section className="py-8 bg-gray-50">
              <Container>
                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary-600" />
                    Individual Stock Performance
                  </h2>
                  {livePricesFetchedAt && !livePricesLoading && (
                    <span className="text-xs flex items-center gap-1.5 font-semibold text-gray-700">
                      <Clock className="h-3.5 w-3.5" />
                      EOD price as of {livePricesFetchedAt}
                      <span className="inline-flex items-center gap-1 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>Live</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1" />
                        <span>Snapshot</span>
                      </span>
                    </span>
                  )}
                  {livePricesLoading && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Fetching latest EOD close prices…
                    </span>
                  )}
                </div>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-3 font-semibold text-gray-700">Stock</th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Total Shares<MonthlyBadge /></div>
                            </th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Invested Value<MonthlyBadge /></div>
                            </th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Avg Purchase Price<MonthlyBadge /></div>
                            </th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Latest Close<LiveBadge /></div>
                            </th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Current Value<LiveBadge /></div>
                            </th>
                            <th className="text-right p-3 font-semibold text-gray-700">
                              <div className="flex items-center justify-end gap-1.5">Return (%)<LiveBadge /></div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tier.stockPerformance.map((sp, i) => {
                            // Yahoo price if available, else fall back to JSON snapshot price
                            const yahooPrice: number | null = livePrices[sp.stock] ?? null;
                            const isLive = yahooPrice != null;
                            const displayClose = isLive ? yahooPrice! : sp.currentPrice;
                            const currentValue = displayClose * sp.totalShares;
                            const returnPct = ((displayClose * sp.totalShares - sp.investedValue) / sp.investedValue) * 100;
                            return (
                              <tr key={i} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900">{sp.stock}</td>
                                <td className="p-3 text-right text-gray-700">{sp.totalShares}</td>
                                <td className="p-3 text-right text-gray-700">{formatCurrency(sp.investedValue)}</td>
                                <td className="p-3 text-right text-gray-700">
                                  ₹{sp.avgPurchasePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    {/* green = live from Yahoo, gray = JSON snapshot, spinner = loading */}
                                    {livePricesLoading ? (
                                      <RefreshCw className="h-2.5 w-2.5 animate-spin text-gray-400 flex-shrink-0" />
                                    ) : (
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLive ? 'bg-green-500' : 'bg-gray-300'}`}
                                        title={isLive ? 'Live EOD price' : 'Price from last data update'}
                                      />
                                    )}
                                    <span className={`font-semibold ${displayClose >= sp.avgPurchasePrice ? 'text-green-700' : 'text-red-700'}`}>
                                      ₹{displayClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 text-right text-gray-700">
                                  {formatCurrency(currentValue)}
                                </td>
                                <td className={`p-3 text-right font-bold ${returnPct >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  <span className="inline-flex items-center gap-1">
                                    {returnPct >= 0
                                      ? <ArrowUpRight className="h-3 w-3" />
                                      : <ArrowDownRight className="h-3 w-3" />}
                                    {formatPercent(returnPct)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Total row */}
                          {(() => {
                            const totalCurrentValue = tier.stockPerformance.reduce((sum, sp) => {
                              const yahoo = livePrices[sp.stock] ?? null;
                              const close = yahoo != null ? yahoo : sp.currentPrice;
                              return sum + close * sp.totalShares;
                            }, 0);
                            return (
                              <tr className="border-t-2 border-gray-400 bg-gray-100">
                                <td className="p-3 font-bold text-gray-900" colSpan={5}>
                                  Total Current Value
                                </td>
                                <td className="p-3 text-right font-bold text-gray-900">
                                  {formatCurrency(totalCurrentValue)}
                                </td>
                                <td className="p-3" />
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </Container>
            </section>
          )}

          {/* Realized Gains — Collapsible */}
          {tier.realizedGains && tier.realizedGains.length > 0 && (
            <section className="py-8 bg-white">
              <Container>
                <button
                  onClick={() => setShowRealizedGains(!showRealizedGains)}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                    Realized Gains (Booked Trades)
                  </h2>
                  {showRealizedGains ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </button>

                {showRealizedGains && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                              <th className="text-right p-3 font-semibold text-gray-700">Long Term Gain</th>
                              <th className="text-right p-3 font-semibold text-gray-700">Short Term Gain</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tier.realizedGains.map((rg, i) => (
                              <tr key={i} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900">{rg.company}</td>
                                <td className={`p-3 text-right ${rg.longTermGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  {formatCurrency(rg.longTermGain)}
                                </td>
                                <td className={`p-3 text-right ${rg.shortTermGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  {rg.shortTermGain !== 0 ? formatCurrency(rg.shortTermGain) : '₹0.00'}
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                              <td className="p-3 text-gray-900">Total</td>
                              <td className="p-3 text-right text-gray-900">
                                {formatCurrency(tier.realizedGains.reduce((s, r) => s + r.longTermGain, 0))}
                              </td>
                              <td className={`p-3 text-right font-bold ${tier.realizedGains.reduce((s, r) => s + r.shortTermGain, 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {formatCurrency(tier.realizedGains.reduce((s, r) => s + r.shortTermGain, 0))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Container>
            </section>
          )}

          {/* Capital Movement — Collapsible */}
          {tier.capitalMovement && tier.capitalMovement.length > 0 && (
            <section className="py-8 bg-gray-50">
              <Container>
                <button
                  onClick={() => setShowCapitalMovement(!showCapitalMovement)}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary-600" />
                    Capital Movement Overview
                  </h2>
                  {showCapitalMovement ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </button>

                {showCapitalMovement && (
                  <>
                    {/* Net Capital Movement */}
                    <div className="mb-4 p-4 bg-white rounded-lg border text-sm">
                      <strong>Net Capital Movement:</strong> ₹0 {/* As per reports */}
                    </div>

                    {/* Capital Movement Bar Visualization */}
                    <Card className="mb-4">
                      <CardContent className="p-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Cumulative Capital Growth</h3>
                        <div className="space-y-2">
                          {tier.capitalMovement.map((cm, i) => {
                            const maxCap = tier.capitalMovement![tier.capitalMovement!.length - 1].cumulativeCapital;
                            const pct = (cm.cumulativeCapital / maxCap) * 100;
                            return (
                              <div key={i} className="flex items-center gap-3 text-xs">
                                <span className="w-24 text-gray-500 flex-shrink-0">{cm.date}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${pct}%`, backgroundColor: profile.color }}
                                  />
                                </div>
                                <span className="w-24 text-right text-gray-700 font-medium flex-shrink-0">{formatCurrency(cm.cumulativeCapital)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Capital Movement Table */}
                    <Card>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                                <th className="text-right p-3 font-semibold text-gray-700">Net Injection</th>
                                <th className="text-right p-3 font-semibold text-gray-700">Cumulative Capital</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tier.capitalMovement.map((cm, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                  <td className="p-3 text-gray-700">{cm.date}</td>
                                  <td className="p-3 text-right text-gray-700">{formatCurrency(cm.netInjection)}</td>
                                  <td className="p-3 text-right text-gray-900 font-medium">{formatCurrency(cm.cumulativeCapital)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Container>
            </section>
          )}

          {/* Corporate Cash Payouts */}
          {tier.corporateCashPayouts && (
            <section className="py-4 bg-white">
              <Container>
                <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border">
                  <strong>Corporate Cash Payouts:</strong> {tier.corporateCashPayouts}
                </div>
              </Container>
            </section>
          )}

          {/* SEBI Disclaimer */}
          <section className="py-8 bg-gray-100">
            <Container>
              <div className="max-w-5xl mx-auto text-xs text-gray-500 space-y-3">
                <h3 className="font-bold text-sm text-gray-700 mb-2">Disclosures and Disclaimers</h3>
                <p>This Report is published by Sunidhi Securities &amp; Finance Limited (hereinafter referred to as &ldquo;Sunidhi&rdquo;) SEBI Research Analyst Registration Number: INH000001329 for private circulation. Sunidhi is a registered Stock Broker with National Stock Exchange of India Limited, BSE Limited and Metropolitan Stock Exchange of India Limited in cash, derivatives and currency derivatives segments. It is also having registration as a Depository Participant with CDSL.</p>
                <p>Sunidhi has other business divisions with independent research teams separated by Chinese walls, and therefore may, at times, have different or contrary views on stocks and markets.</p>
                <p>This report is meant for personal informational purposes and is not to be construed as a solicitation or financial advice or an offer to buy or sell any securities or related financial instruments. While utmost care has been taken in preparing this report, we claim no responsibility for its accuracy. Past performance is not necessarily indicative of future results.</p>
                <p className="pt-2 border-t border-gray-300">
                  <strong>Sunidhi Securities &amp; Finance Ltd.</strong> — Research Analyst — INH000001329 | 
                  Kalpataru Inspire, Unit.1, 8th floor, Opp. Grand Hyatt Hotel, Santacruz East, Mumbai-400055 | 
                  BSE/NSE/MSEI Registration: INZ000169235 | 
                  Compliance Officer: Mr. Mahesh Desai | Phone: 9122-66771777
                </p>
              </div>
            </Container>
          </section>
        </>
      )}
    </>
  );
}

// Update-frequency badge helpers
const LiveBadge    = () => <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full leading-none">● Live</span>;
const MonthlyBadge = () => <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none">↻ Monthly</span>;

// KPI Card Component
function KPICard({ label, value, icon, color, subtext, updateFreq }: {
  label: string; value: string; icon: React.ReactNode; color: string;
  subtext?: string; updateFreq?: 'live' | 'monthly';
}) {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <Card className={`border ${colorClasses[color] || colorClasses.gray}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1 opacity-70">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        {updateFreq && (
          <div className="mb-1.5">
            {updateFreq === 'live' ? <LiveBadge /> : <MonthlyBadge />}
          </div>
        )}
        <div className="text-lg font-bold">{value}</div>
        {subtext && <div className="text-xs mt-1 font-medium">{subtext}</div>}
      </CardContent>
    </Card>
  );
}

// Performance Row Component
function PerfRow({ label, portfolio, benchmark, alpha, isValue, updateFreq }: {
  label: string; portfolio: string; benchmark: string;
  alpha?: number; isValue?: boolean; updateFreq?: 'live' | 'monthly';
}) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4 text-gray-700 font-medium">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {updateFreq === 'live'    && <LiveBadge />}
          {updateFreq === 'monthly' && <MonthlyBadge />}
        </div>
      </td>
      <td className="p-4 text-right font-semibold text-gray-900">{portfolio}</td>
      <td className="p-4 text-right text-gray-600">{benchmark}</td>
      <td className="p-4 text-right">
        {alpha !== undefined ? (
          <span className={`font-bold ${alpha >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {alpha > 0 ? '+' : ''}{alpha.toFixed(1)}%
          </span>
        ) : ''}
      </td>
    </tr>
  );
}
