import type { Program } from "./programs";

/**
 * Normalized opportunity model. Everything except identity is optional
 * because GIS data is frequently incomplete — UI must hide what is missing,
 * never fill it in.
 */

export type Availability = "open" | "full" | "closed";

/**
 * GIS distinguishes "provided" (the host arranges it) from "covered" (the
 * host pays for it). Each is true/false when GIS says so, undefined when unknown.
 */
export interface LogisticsItem {
  provided?: boolean;
  covered?: boolean;
}

export interface Logistics {
  accommodation?: LogisticsItem;
  food?: LogisticsItem & { meals?: number };
  transportation?: LogisticsItem;
  computer?: LogisticsItem;
}

export interface WeekPlan {
  week: number;
  activities: string[];
}

export interface SkillLike {
  name: string;
  /** "required" | "preferred" when GIS says so */
  option?: string;
  level?: string | number;
}

export interface Slot {
  id?: string;
  start?: string;
  end?: string;
  openings?: number;
  closes?: string;
  status?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  program: Program;

  /** Global project / sub-product name, e.g. "Global Classroom" */
  project?: string;
  city?: string;
  citySlug?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  /** True when GIS gave no usable coordinates and the city centre is used instead. */
  coordinatesApproximate?: boolean;
  organisation?: string;
  hostLc?: string;
  /** Key of the matching AIESEC in Poland local committee (see lib/lcs.ts) */
  hostLcKey?: string;

  description?: string;
  projectDescription?: string;

  duration?: { min?: number; max?: number; label?: string };

  /** Openings currently available, as reported by GIS */
  openings?: number;
  applicants?: number;
  status?: string;
  availability: Availability;

  dates?: {
    opened?: string;
    earliestStart?: string;
    latestEnd?: string;
    applicationClose?: string;
    updated?: string;
  };

  /** goal 1–17, target like "4.6", description = the UN target text */
  sdg?: { goal?: number; target?: string; description?: string };

  logistics?: Logistics;

  salary?: { amount: number; currency?: string; period?: string };

  languages?: SkillLike[];
  skills?: SkillLike[];
  backgrounds?: SkillLike[];
  /** Role description / learning points (iGTa, iGTe) */
  learningPoints?: string[];
  weeklyPlan?: WeekPlan[];
  slots?: Slot[];

  aiesecUrl: string;
}

/** Compact projection sent to client components for filtering and cards. */
export interface OpportunitySummary {
  id: string;
  title: string;
  program: Program;
  project?: string;
  city?: string;
  citySlug?: string;
  coordinates?: { lat: number; lng: number };
  organisation?: string;
  hostLcKey?: string;
  excerpt?: string;
  durationWeeks?: { min?: number; max?: number; label?: string };
  openings?: number;
  availability: Availability;
  earliestStart?: string;
  latestEnd?: string;
  applicationClose?: string;
  /** "YYYY-MM" months in which a slot starts */
  startMonths: string[];
  sdgGoal?: number;
  logistics?: Opportunity["logistics"];
  salary?: Opportunity["salary"];
  languages: string[];
  skills: string[];
  backgrounds: string[];
  /** Lower-cased haystack for instant search */
  search: string;
}

export interface CitySummary {
  slug: string;
  name: string;
  total: number;
  available: number;
  openings: number;
  byProgram: Record<Program, number>;
  coordinates?: { lat: number; lng: number };
}

export type GisResult<T> =
  | { ok: true; data: T; fetchedAt: string; stale?: boolean }
  | { ok: false; reason: "unconfigured" | "unavailable" };
