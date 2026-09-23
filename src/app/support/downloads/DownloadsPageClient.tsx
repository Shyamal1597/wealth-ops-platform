"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Download,
  FileText,
  TrendingUp,
  Layers,
  Users,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

type TabId = "equity" | "depository" | "ap-support" | "mandatory" | "policies";

interface FormItem {
  id: string;
  name: string;
  file: string;
}

interface TabMeta {
  id: TabId;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  accentColor: string;
  headerBg: string;
}

function formUrl(filename: string) {
  return `/forms/${encodeURIComponent(filename)}`;
}

const TAB_META: TabMeta[] = [
  { id: "equity", label: "Equity & BSE", icon: <TrendingUp className="h-4 w-4" />, accentColor: "text-blue-700", headerBg: "bg-blue-50 border-blue-200" },
  { id: "depository", label: "Depository", icon: <Layers className="h-4 w-4" />, accentColor: "text-green-700", headerBg: "bg-green-50 border-green-200" },
  { id: "ap-support", label: "AP Support", icon: <Users className="h-4 w-4" />, accentColor: "text-purple-700", headerBg: "bg-purple-50 border-purple-200" },
  { id: "mandatory", label: "Mandatory Information", shortLabel: "Mandatory", icon: <AlertCircle className="h-4 w-4" />, accentColor: "text-orange-700", headerBg: "bg-orange-50 border-orange-200" },
  { id: "policies", label: "Policies", icon: <ShieldCheck className="h-4 w-4" />, accentColor: "text-red-700", headerBg: "bg-red-50 border-red-200" },
];

export default function DownloadsPage({ forms }: { forms: Record<TabId, FormItem[]> }) {
  const [activeTab, setActiveTab] = useState<TabId>("equity");

  const currentMeta = TAB_META.find((t) => t.id === activeTab)!;
  const currentForms = forms[activeTab] || [];
  const totalForms = TAB_META.reduce((sum, t) => sum + (forms[t.id]?.length || 0), 0);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Download className="h-4 w-4" />
              Downloads Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Downloads &amp; Forms
            </h1>
            <p className="text-xl text-white/80">
              Access all important forms, policies and documents for your
              trading account
            </p>
            <p className="text-sm text-white/50 mt-3">
              {totalForms} documents across {TAB_META.length} categories
            </p>
          </div>
        </Container>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <Container>
          <div className="flex overflow-x-auto -mb-px">
            {TAB_META.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-700 bg-primary-50/40"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.shortLabel ?? tab.label}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {(forms[tab.id] || []).length}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Forms List */}
      <section className="py-10 bg-gray-50 min-h-[520px]">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Tab header pill */}
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border mb-6 ${currentMeta.headerBg}`}
            >
              <span className={currentMeta.accentColor}>{currentMeta.icon}</span>
              <span className={`font-semibold text-sm ${currentMeta.accentColor}`}>
                {currentMeta.label}
              </span>
              <span className="text-xs text-gray-500">
                — {currentForms.length} document
                {currentForms.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentForms.map((form, idx) => (
                    <tr
                      key={form.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400 font-mono tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-gray-900 font-medium leading-snug">
                            {form.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={formUrl(form.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Download ${form.name} PDF (opens in a new tab)`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentForms.length === 0 && (
                <p className="text-sm text-gray-500 py-8 text-center">No documents in this category yet.</p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              All documents are in PDF format. Ensure you have a PDF viewer
              installed to open them.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
