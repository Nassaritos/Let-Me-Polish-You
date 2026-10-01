import { PROGRAM_INFO, programFromParam, type Program } from "./programs";
import type { OpportunitySummary } from "./types";

/**
 * Explorer filter state ⇄ URL. Shared by the server page (initial render)
 * and the client explorer (instant updates + history.replaceState).
 */
export interface Filters {
  program: Program | "all";
  q: string;
  city: string | null; // city slug
  duration: DurationBucket | null;
  start: string | null; // "YYYY-MM"
  sdg: number | null;
  includeUnavailable: boolean;
}

export const DURATION_BUCKETS = [
  { id: "short", label: "Up to 8 weeks", min: 0, max: 8 },
  { id: "medium", label: "2–6 months", min: 9, max: 26 },
  { id: "long", label: "6+ months", min: 27, max: 999 },
] as const;
export type DurationBucket = (typeof DURATION_BUCKETS)[number]["id"];

export const EMPTY_FILTERS: Filters = {
  program: "all",
  q: "",
  city: null,
  duration: null,
  start: null,
  sdg: null,
  includeUnavailable: false,
};

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function get(p: Params, k: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(k) ?? undefined;
  const v = p[k];
  return Array.isArray(v) ? v[0] : v;
}

export function parseFilters(p: Params): Filters {
  const program = programFromParam(get(p, "program"));
  const duration = get(p, "duration");
  const start = get(p, "start");
  const sdg = Number(get(p, "sdg"));
  return {
    program: program ?? "all",
    q: (get(p, "q") ?? "").slice(0, 80),
    city: get(p, "city")?.toLowerCase().replace(/[^a-z0-9-]/g, "") || null,
    duration: DURATION_BUCKETS.some((b) => b.id === duration) ? (duration as DurationBucket) : null,
    start: start && /^\d{4}-\d{2}$/.test(start) ? start : null,
    sdg: Number.isInteger(sdg) && sdg >= 1 && sdg <= 17 ? sdg : null,
    includeUnavailable: get(p, "all") === "1",
  };
}

/** `lockedProgram`: on a program page the program is the page itself, not a query param. */
export function filtersToQuery(f: Filters, lockedProgram?: Program): string {
  const q = new URLSearchParams();
  if (f.program !== "all" && !lockedProgram) q.set("program", PROGRAM_INFO[f.program].slug);
  if (f.city) q.set("city", f.city);
  if (f.q.trim()) q.set("q", f.q.trim());
  if (f.duration) q.set("duration", f.duration);
  if (f.start) q.set("start", f.start);
  if (f.sdg) q.set("sdg", String(f.sdg));
  if (f.includeUnavailable) q.set("all", "1");
  const s = q.toString();
  return s ? `?${s}` : "";
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
}

function inBucket(o: OpportunitySummary, id: DurationBucket) {
  const b = DURATION_BUCKETS.find((x) => x.id === id)!;
  const min = o.durationWeeks?.min ?? o.durationWeeks?.max;
  const max = o.durationWeeks?.max ?? o.durationWeeks?.min;
  if (min === undefined || max === undefined) return false;
  return min <= b.max && max >= b.min;
}

/** Apply every filter except the ones listed in `skip` (used for facet counts). */
export function applyFilters(all: OpportunitySummary[], f: Filters, skip: (keyof Filters)[] = []): OpportunitySummary[] {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean);
  return all.filter((o) => {
    if (!skip.includes("includeUnavailable") && !f.includeUnavailable && o.availability !== "open") return false;
    if (!skip.includes("program") && f.program !== "all" && o.program !== f.program) return false;
    if (!skip.includes("city") && f.city && o.citySlug !== f.city) return false;
    if (!skip.includes("duration") && f.duration && !inBucket(o, f.duration)) return false;
    if (!skip.includes("start") && f.start && !o.startMonths.includes(f.start)) return false;
    if (!skip.includes("sdg") && f.sdg && o.sdgGoal !== f.sdg) return false;
    if (!skip.includes("q") && terms.length && !terms.every((t) => o.search.includes(t))) return false;
    return true;
  });
}

export function activeFilterCount(f: Filters): number {
  return [f.city, f.duration, f.start, f.sdg, f.includeUnavailable || null].filter(Boolean).length;
}
