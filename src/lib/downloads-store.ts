import path from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";

export type DownloadsTabId = "equity" | "depository" | "ap-support" | "mandatory" | "policies";

export interface DownloadFormItem {
  id: string;
  name: string;
  file: string;
}

export type DownloadsStore = Record<DownloadsTabId, DownloadFormItem[]>;

const DATA_PATH = path.join(process.cwd(), "data", "downloads.json");

// Seeded from the forms already published on the old site - used only to
// populate a fresh install; everything here is editable from the admin panel.
const SEED_RAW: Record<DownloadsTabId, Array<{ name: string; file: string }>> = {
  equity: [
    { name: "Individual Client Registration Form (09/07/2025)", file: "1315486115Individual Client Registration form 09072025.pdf" },
    { name: "Non-Individual Client Registration Form (09/07/2025)", file: "412079703Non-Individual Client Registration Form 09072025.pdf" },
    { name: "CKYC Form – Individual", file: "1636583788_CKYC-FORM_INDIVIDUAL.pdf" },
    { name: "CKYC-KRA Form – Non-Individual", file: "1052170211_CKYC-KRA-FORM_NON-INDIVIDUAL.pdf" },
    { name: "Individual Client FATCA Format", file: "632414905Individual Client -FATCA Format.pdf" },
    { name: "Non-Individual Client FATCA Format", file: "1938392331Non-Individual Client -FATCA Format.pdf" },
    { name: "FATCA Form for Individual", file: "509887835_FATCA-form-for-Individual.pdf" },
    { name: "Nominee Form with Opt-Out Self Declaration", file: "774412172Nominee Form With Opt Out Self Declaration.pdf" },
    { name: "Format for Availing MTF Facility (09/07/2025)", file: "1425675770_Format-for-Availing-MTF-Facility_09072025.pdf" },
    { name: "Declaration for Commodity Category", file: "841094080_DECLARATION-FOR--COMMODITY-CATEGORY.pdf" },
    { name: "Undertaking Cum Declaration – KRA / CKYC Details", file: "397559448_Undertaking-Cum-Declaration-from-client-to-fetch-KRA---CKYC-Details.pdf" },
    { name: "Combined Account Closure Form (Trading & DP)", file: "1250232975_Combined-Account-closure-Form-for-Trading-and-DP.pdf" },
    { name: "Self Declaration – Common Email ID & Mobile No.", file: "1680636187_Self-Declaration-to-accept-Common-Email-id-and-Mobile-no._08022024.pdf" },
    { name: "Combined Modification Form (Trading & DP)", file: "607753444Combined-Modification-Form-for-Trading-and-DP-account-details.pdf" },
    { name: "SOP – Centralised Demise Information via KRA", file: "735034110_SOP-for-Centralised-Demise-Information-of-demise-of-investor-through-KRA.pdf" },
    { name: "Client Reactivation Form – Trading", file: "666780711_Client-Reactivation-Form---Trading.pdf" },
    { name: "Client Reactivation Form – Non-Individual", file: "309889068_Client-Reactivation-form-for-Non--Individual.pdf" },
    { name: "Family Declaration – Common Email ID & Mobile No.", file: "891067512_Family-Declaration-for-Common-Email--ID--and-Mobile-No..pdf" },
    { name: "Format of HUF Creation Deed", file: "326581155_FORMAT-OF-HUF-CREATION-DEED.pdf" },
  ],
  depository: [
    { name: "Demat Account Opening Form", file: "771283942Sunidhi Form-DMAT Final.pdf" },
    { name: "DIS – Request Instruction Slip", file: "669219932_Request-instruction-slip.pdf" },
    { name: "Transmission Request Form – Death of Joint Holder", file: "2058630641Transmission_Request_Form-Death_of_Joint_Holder_New.pdf" },
    { name: "Transmission Request Form – Death of Sole Holder (Nomination Recorded)", file: "292820211Transmission_Request_Form-Death_of_Sole_Holder_where_nomination_is_recorded_New.pdf" },
    { name: "Repurchase / Redemption Request Form – Mutual Fund Units", file: "2065021145Repurchase_Redemption_Request_Form_for_Mutual_Fund_Units.pdf" },
    { name: "Request Letter – Addition of Beneficiary Details for Off-Market Transfer", file: "1915700324_Request-Letter-for-Addition-for-beneficiary-Details-for-executing-Off-Market-Transfer.pdf" },
  ],
  "ap-support": [
    { name: "Updation of Additional Office (Branch) Address of AP", file: "1011287790_Updation-of-Additional-Office-(Branch)-address-of-AP.pdf" },
    { name: "Modification in Email ID / Mobile No. / Contact Person Name of AP", file: "796443294_Modification-in-e-mail-Id-Mobile-No-Contact-person-name-of-the-AP-.pdf" },
    { name: "Change in Registered Office Address of AP", file: "998351678_Change-in-Registered-office-address-of-AP.pdf" },
  ],
  mandatory: [
    { name: "List of Authorised Persons with Terminal Details (31/03/2026)", file: "331897791List of AP with terminal details as on 31032026.pdf" },
    { name: "Branch Details", file: "13556810602099879383Branch Details.pdf" },
    { name: "List of APs Cancelled by Members – Disciplinary Reasons", file: "1595172966List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf" },
    { name: "List of APs Cancelled by Members – Disciplinary Reasons (Updated)", file: "4637170071697863426_List-of-AP-cancelled-by-Members-on-account-of-Disciplinary-reason.pdf" },
    { name: "eKYC User Manual & Basic Requirements (v1.2)", file: "16090313USER-MANUAL-And-BASIC-REQUIRMENTS-EKYC-Version1.2.pdf" },
    { name: "Re-KYC User Manual & Basic Requirements (v1.2)", file: "720198387USER-MANUAL-And-BASIC-REQUIRMENTS-RE-KYC-Version1.2.pdf" },
    { name: "Procedure & Flow Chart – Client Grievance (Aug 2023)", file: "1936870993procedure_and_flow_chart_of_Client _grievance_Aug_08_2023.pdf" },
  ],
  policies: [
    { name: "PMLA Policy – Combined Version I (28/03/2025)", file: "276059171PMLA policy_combined _version I _28.03.2025.pdf" },
    { name: "Policy on Treatment of Inactive Clients", file: "1466033186_Policy-on-Treatment-of-Inactive-Clients.pdf" },
    { name: "Policy on Prohibition of Unauthenticated News Circulation", file: "1639914064_Policy-on-Prohibition-on-unauthenticated-news-circulation.pdf" },
    { name: "Policy on Client Code Modification", file: "1163209386_Policy-on-Client-Code-Modification.pdf" },
    { name: "Surveillance Policy for Trading", file: "1379131523_Survellience-Policy-for-Trading.pdf" },
    { name: "Surveillance Policy for Depository", file: "391187829_Surveillance-Policy-for-Depository.pdf" },
  ],
};

function buildSeed(): DownloadsStore {
  const store = {} as DownloadsStore;
  for (const tabId of Object.keys(SEED_RAW) as DownloadsTabId[]) {
    store[tabId] = SEED_RAW[tabId].map((f) => ({ id: randomUUID(), ...f }));
  }
  return store;
}

function readStore(): DownloadsStore {
  if (!existsSync(DATA_PATH)) {
    const dataDir = path.dirname(DATA_PATH);
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    const seed = buildSeed();
    writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeStore(store: DownloadsStore): void {
  writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function getDownloadsData(): DownloadsStore {
  return readStore();
}

export function addForm(tabId: DownloadsTabId, name: string, file: string): DownloadFormItem {
  const store = readStore();
  const item: DownloadFormItem = { id: randomUUID(), name, file };
  store[tabId] = [...(store[tabId] || []), item];
  writeStore(store);
  return item;
}

export function updateForm(tabId: DownloadsTabId, formId: string, updates: Partial<Pick<DownloadFormItem, "name" | "file">>): DownloadFormItem | null {
  const store = readStore();
  const list = store[tabId] || [];
  const idx = list.findIndex((f) => f.id === formId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  writeStore(store);
  return list[idx];
}

export function removeForm(tabId: DownloadsTabId, formId: string): boolean {
  const store = readStore();
  const list = store[tabId] || [];
  const next = list.filter((f) => f.id !== formId);
  if (next.length === list.length) return false;
  store[tabId] = next;
  writeStore(store);
  return true;
}
