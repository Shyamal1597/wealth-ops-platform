import path from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export type ComplaintsSegment = "stock-broker" | "research-analyst" | "depository-participant";

export interface YearlyComplaintRow {
  year: string;
  carriedForward: string;
  received: string;
  resolved: string;
  pending: string;
}

export interface SegmentComplaintsData {
  label: string;
  registrationLabel: string;
  pdfFileName: string;
  pdfUpdatedAt: string | null;
  yearlyData: YearlyComplaintRow[];
}

export type ComplaintsStore = Record<ComplaintsSegment, SegmentComplaintsData>;

const DATA_PATH = path.join(process.cwd(), "data", "investor-complaints.json");

// Real figures as they stood on the old site at the time of the website
// migration (Sept 2026) - used only to seed a fresh install; every field is
// editable from the admin panel afterward.
const SEED: ComplaintsStore = {
  "stock-broker": {
    label: "Stock Broker",
    registrationLabel: "SEBI Regn: INZ000169235",
    pdfFileName: "investor-complaints-stock-broker.pdf",
    pdfUpdatedAt: null,
    yearlyData: [
      { year: "2018-19", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2019-20", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2020-21", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2021-22", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2022-23", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2023-24", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2024-25", carriedForward: "NIL", received: "1", resolved: "1", pending: "NIL" },
      { year: "2025-26", carriedForward: "NIL", received: "2", resolved: "2", pending: "NIL" },
      { year: "2026-27", carriedForward: "NIL", received: "1", resolved: "1", pending: "NIL" },
    ],
  },
  "research-analyst": {
    label: "Research Analyst",
    registrationLabel: "SEBI Regn: INH000001329",
    pdfFileName: "investor-complaints-research-analyst.pdf",
    pdfUpdatedAt: null,
    yearlyData: [
      { year: "2018-19", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2019-20", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2020-21", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2021-22", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2022-23", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2023-24", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2024-25", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2025-26", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
      { year: "2026-27", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
    ],
  },
  "depository-participant": {
    label: "Depository Participant",
    registrationLabel: "DP ID: 23500 (IN-DP-410-2019)",
    pdfFileName: "investor-complaints-depository-participant.pdf",
    pdfUpdatedAt: null,
    yearlyData: [
      { year: "2020-21", carriedForward: "NIL", received: "2", resolved: "2", pending: "NIL" },
      { year: "2021-22", carriedForward: "NIL", received: "1", resolved: "1", pending: "NIL" },
      { year: "2022-23", carriedForward: "NIL", received: "2", resolved: "2", pending: "NIL" },
      { year: "2023-24", carriedForward: "NIL", received: "2", resolved: "2", pending: "NIL" },
      { year: "2024-25", carriedForward: "NIL", received: "3", resolved: "3", pending: "NIL" },
      { year: "2025-26", carriedForward: "NIL", received: "NIL", resolved: "NIL", pending: "NIL" },
    ],
  },
};

function readStore(): ComplaintsStore {
  if (!existsSync(DATA_PATH)) {
    const dataDir = path.dirname(DATA_PATH);
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    writeFileSync(DATA_PATH, JSON.stringify(SEED, null, 2));
    return SEED;
  }
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeStore(store: ComplaintsStore): void {
  writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function getComplaintsData(): ComplaintsStore {
  return readStore();
}

export function getSegmentData(segment: ComplaintsSegment): SegmentComplaintsData {
  return readStore()[segment];
}

export function updateYearlyData(segment: ComplaintsSegment, yearlyData: YearlyComplaintRow[]): ComplaintsStore {
  const store = readStore();
  store[segment] = { ...store[segment], yearlyData };
  writeStore(store);
  return store;
}

export function recordPdfUpload(segment: ComplaintsSegment): ComplaintsStore {
  const store = readStore();
  store[segment] = { ...store[segment], pdfUpdatedAt: new Date().toISOString() };
  writeStore(store);
  return store;
}

export function totals(rows: YearlyComplaintRow[]) {
  const sum = (key: keyof Omit<YearlyComplaintRow, "year">) =>
    rows.reduce((acc, r) => acc + (r[key] === "NIL" || r[key] === "" ? 0 : Number(r[key]) || 0), 0);
  const fmt = (n: number) => (n === 0 ? "NIL" : String(n));
  return {
    carriedForward: fmt(sum("carriedForward")),
    received: fmt(sum("received")),
    resolved: fmt(sum("resolved")),
    pending: fmt(sum("pending")),
  };
}
