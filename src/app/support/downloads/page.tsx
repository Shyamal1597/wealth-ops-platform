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
  name: string;
  file: string;
}

interface TabConfig {
  id: TabId;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  accentColor: string;
  headerBg: string;
  forms: FormItem[];
}

function formUrl(filename: string) {
  return `/forms/${encodeURIComponent(filename)}`;
}

const TABS: TabConfig[] = [
  {
    id: "equity",
    label: "Equity & BSE",
    icon: <TrendingUp className="h-4 w-4" />,
    accentColor: "text-blue-700",
    headerBg: "bg-blue-50 border-blue-200",
    forms: [
      {
        name: "Individual Client Registration Form (09/07/2025)",
        file: "1315486115Individual Client Registration form 09072025.pdf",
      },
      {
        name: "Non-Individual Client Registration Form (09/07/2025)",
        file: "412079703Non-Individual Client Registration Form 09072025.pdf",
      },
      {
        name: "CKYC Form – Individual",
        file: "1636583788_CKYC-FORM_INDIVIDUAL.pdf",
      },
      {
        name: "CKYC-KRA Form – Non-Individual",
        file: "1052170211_CKYC-KRA-FORM_NON-INDIVIDUAL.pdf",
      },
      {
        name: "Individual Client FATCA Format",
        file: "632414905Individual Client -FATCA Format.pdf",
      },
      {
        name: "Non-Individual Client FATCA Format",
        file: "1938392331Non-Individual Client -FATCA Format.pdf",
      },
      {
        name: "FATCA Form for Individual",
        file: "509887835_FATCA-form-for-Individual.pdf",
      },
      {
        name: "Nominee Form with Opt-Out Self Declaration",
        file: "774412172Nominee Form With Opt Out Self Declaration.pdf",
      },
      {
        name: "Format for Availing MTF Facility (09/07/2025)",
        file: "1425675770_Format-for-Availing-MTF-Facility_09072025.pdf",
      },
      {
        name: "Declaration for Commodity Category",
        file: "841094080_DECLARATION-FOR--COMMODITY-CATEGORY.pdf",
      },
      {
        name: "Undertaking Cum Declaration – KRA / CKYC Details",
        file: "397559448_Undertaking-Cum-Declaration-from-client-to-fetch-KRA---CKYC-Details.pdf",
      },
      {
        name: "Combined Account Closure Form (Trading & DP)",
        file: "1250232975_Combined-Account-closure-Form-for-Trading-and-DP.pdf",
      },
      {
        name: "Self Declaration – Common Email ID & Mobile No.",
        file: "1680636187_Self-Declaration-to-accept-Common-Email-id-and-Mobile-no._08022024.pdf",
      },
      {
        name: "Combined Modification Form (Trading & DP)",
        file: "607753444Combined-Modification-Form-for-Trading-and-DP-account-details.pdf",
      },
      {
        name: "SOP – Centralised Demise Information via KRA",
        file: "735034110_SOP-for-Centralised-Demise-Information-of-demise-of-investor-through-KRA.pdf",
      },
      {
        name: "Client Reactivation Form – Trading",
        file: "666780711_Client-Reactivation-Form---Trading.pdf",
      },
      {
        name: "Client Reactivation Form – Non-Individual",
        file: "309889068_Client-Reactivation-form-for-Non--Individual.pdf",
      },
      {
        name: "Family Declaration – Common Email ID & Mobile No.",
        file: "891067512_Family-Declaration-for-Common-Email--ID--and-Mobile-No..pdf",
      },
      {
        name: "Format of HUF Creation Deed",
        file: "326581155_FORMAT-OF-HUF-CREATION-DEED.pdf",
      },
    ],
  },
  {
    id: "depository",
    label: "Depository",
    icon: <Layers className="h-4 w-4" />,
    accentColor: "text-green-700",
    headerBg: "bg-green-50 border-green-200",
    forms: [
      {
        name: "Demat Account Opening Form",
        file: "771283942Sunidhi Form-DMAT Final.pdf",
      },
      {
        name: "DIS – Request Instruction Slip",
        file: "669219932_Request-instruction-slip.pdf",
      },
      {
        name: "Transmission Request Form – Death of Joint Holder",
        file: "2058630641Transmission_Request_Form-Death_of_Joint_Holder_New.pdf",
      },
      {
        name: "Transmission Request Form – Death of Sole Holder (Nomination Recorded)",
        file: "292820211Transmission_Request_Form-Death_of_Sole_Holder_where_nomination_is_recorded_New.pdf",
      },
      {
        name: "Repurchase / Redemption Request Form – Mutual Fund Units",
        file: "2065021145Repurchase_Redemption_Request_Form_for_Mutual_Fund_Units.pdf",
      },
      {
        name: "Request Letter – Addition of Beneficiary Details for Off-Market Transfer",
        file: "1915700324_Request-Letter-for-Addition-for-beneficiary-Details-for-executing-Off-Market-Transfer.pdf",
      },
    ],
  },
  {
    id: "ap-support",
    label: "AP Support",
    icon: <Users className="h-4 w-4" />,
    accentColor: "text-purple-700",
    headerBg: "bg-purple-50 border-purple-200",
    forms: [
      {
        name: "Updation of Additional Office (Branch) Address of AP",
        file: "1011287790_Updation-of-Additional-Office-(Branch)-address-of-AP.pdf",
      },
      {
        name: "Modification in Email ID / Mobile No. / Contact Person Name of AP",
        file: "796443294_Modification-in-e-mail-Id-Mobile-No-Contact-person-name-of-the-AP-.pdf",
      },
      {
        name: "Change in Registered Office Address of AP",
        file: "998351678_Change-in-Registered-office-address-of-AP.pdf",
      },
    ],
  },
  {
    id: "mandatory",
    label: "Mandatory Information",
    shortLabel: "Mandatory",
    icon: <AlertCircle className="h-4 w-4" />,
    accentColor: "text-orange-700",
    headerBg: "bg-orange-50 border-orange-200",
    forms: [
      {
        name: "List of Authorised Persons with Terminal Details (31/03/2026)",
        file: "331897791List of AP with terminal details as on 31032026.pdf",
      },
      {
        name: "Branch Details",
        file: "13556810602099879383Branch Details.pdf",
      },
      {
        name: "List of APs Cancelled by Members – Disciplinary Reasons",
        file: "1595172966List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf",
      },
      {
        name: "List of APs Cancelled by Members – Disciplinary Reasons (Updated)",
        file: "4637170071697863426_List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf",
      },
      {
        name: "eKYC User Manual & Basic Requirements (v1.2)",
        file: "16090313USER-MANUAL-And-BASIC-REQUIRMENTS-EKYC-Version1.2.pdf",
      },
      {
        name: "Re-KYC User Manual & Basic Requirements (v1.2)",
        file: "720198387USER-MANUAL-And-BASIC-REQUIRMENTS-RE-KYC-Version1.2.pdf",
      },
      {
        name: "Procedure & Flow Chart – Client Grievance (Aug 2023)",
        file: "1936870993procedure_and_flow_chart_of_Client _grievance_Aug_08_2023.pdf",
      },
    ],
  },
  {
    id: "policies",
    label: "Policies",
    icon: <ShieldCheck className="h-4 w-4" />,
    accentColor: "text-red-700",
    headerBg: "bg-red-50 border-red-200",
    forms: [
      {
        name: "PMLA Policy – Combined Version I (28/03/2025)",
        file: "276059171PMLA policy_combined _version I _28.03.2025.pdf",
      },
      {
        name: "Policy on Treatment of Inactive Clients",
        file: "1466033186_Policy-on-Treatment-of-Inactive-Clients.pdf",
      },
      {
        name: "Policy on Prohibition of Unauthenticated News Circulation",
        file: "1639914064_Policy-on-Prohibition-on-unauthenticated-news-circulation.pdf",
      },
      {
        name: "Policy on Client Code Modification",
        file: "1163209386_Policy-on-Client-Code-Modification.pdf",
      },
      {
        name: "Surveillance Policy for Trading",
        file: "1379131523_Survellience-Policy-for-Trading.pdf",
      },
      {
        name: "Surveillance Policy for Depository",
        file: "391187829_Surveillance-Policy-for-Depository.pdf",
      },
    ],
  },
];

const totalForms = TABS.reduce((sum, t) => sum + t.forms.length, 0);

export default function DownloadsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("equity");

  const currentTab = TABS.find((t) => t.id === activeTab)!;

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
              {totalForms} documents across {TABS.length} categories
            </p>
          </div>
        </Container>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <Container>
          <div className="flex overflow-x-auto -mb-px">
            {TABS.map((tab) => (
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
                  {tab.forms.length}
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
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border mb-6 ${currentTab.headerBg}`}
            >
              <span className={currentTab.accentColor}>{currentTab.icon}</span>
              <span className={`font-semibold text-sm ${currentTab.accentColor}`}>
                {currentTab.label}
              </span>
              <span className="text-xs text-gray-500">
                — {currentTab.forms.length} document
                {currentTab.forms.length !== 1 ? "s" : ""}
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
                  {currentTab.forms.map((form, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-400 font-mono tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-red-400 flex-shrink-0" />
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
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
