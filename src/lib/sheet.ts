import Papa from "papaparse";
import { SHEET_ID, SHEET_TAB } from "../config";

export const COLUMNS = [
  "과정코드",
  "과정명",
  "분야",
  "대상",
  "이수구분",
  "교육방식",
  "교육시간",
  "정원",
  "교육기간",
  "신청기간",
  "담당부서",
  "한줄소개",
  "상세소개",
  "학습목표",
  "주요내용",
  "신청링크",
  "문의",
] as const;

export type Course = Record<(typeof COLUMNS)[number], string>;

export interface LoadResult {
  courses: Course[];
  /** "sheet" = live Google Sheet, "backup" = bundled data_backup.csv */
  source: "sheet" | "backup";
  /** Why the live sheet could not be used (only set when source is "backup") */
  reason?: string;
}

// headers=1: tell gviz the first row is the header; without it gviz may merge several top rows into the header.
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(SHEET_TAB)}`;
const BACKUP_URL = "./data_backup.csv";

function parseCsv(text: string): Course[] {
  const parsed = Papa.parse<Record<string, string>>(text.replace(/^\uFEFF/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });
  const header = parsed.meta.fields ?? [];
  const missing = COLUMNS.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    throw new Error(`필수 컬럼이 없습니다: ${missing.join(", ")}`);
  }
  return parsed.data
    .map((row) => {
      const course = {} as Course;
      for (const col of COLUMNS) course[col] = normalize(row[col] ?? "");
      return course;
    })
    .filter((c) => c.과정코드 !== "");
}

// Sheets/Excel sometimes turn a single date into "2026-03-12 00:00:00".
function normalize(value: string): string {
  return value.trim().replace(/ 00:00:00$/, "");
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function loadCourses(): Promise<LoadResult> {
  try {
    // Cache-bust so a sheet edit shows up on the next reload.
    const text = await fetchText(`${SHEET_URL}&_=${Date.now()}`);
    return { courses: parseCsv(text), source: "sheet" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const courses = parseCsv(await fetchText(BACKUP_URL));
    return { courses, source: "backup", reason };
  }
}

export function splitList(value: string): string[] {
  return value
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}
