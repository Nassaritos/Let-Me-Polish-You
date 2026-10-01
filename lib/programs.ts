/**
 * Program definitions shared by server and client code.
 * Customers know these as Global Volunteer, Global Talent and Global Teacher —
 * internal ids (igv/igta/igte) never appear in the interface.
 */

export const PROGRAMS = ["igv", "igta", "igte"] as const;
export type Program = (typeof PROGRAMS)[number];

export interface ProgramInfo {
  id: Program;
  /** GIS programme id */
  gisId: number;
  /** Public URL slug, e.g. /global-volunteer */
  slug: "global-volunteer" | "global-talent" | "global-teacher";
  /** Customer-facing name */
  name: string;
  /** One-word mood used in headlines */
  verb: string;
  /** What you do: "Volunteer", "Intern", "Teach" */
  action: string;
  tagline: string;
  /** Segment used in the public aiesec.org opportunity URL */
  aiesecSegment: string;
  /** Recognised GIS short names for this programme */
  gisShortNames: string[];
}

export const PROGRAM_INFO: Record<Program, ProgramInfo> = {
  igv: {
    id: "igv",
    gisId: 7,
    slug: "global-volunteer",
    name: "Global Volunteer",
    verb: "Give",
    action: "Volunteer",
    tagline: "Volunteer on a project that pushes a UN Global Goal forward.",
    aiesecSegment: "global-volunteer",
    gisShortNames: ["gv", "igv", "ogv", "global volunteer"],
  },
  igta: {
    id: "igta",
    gisId: 8,
    slug: "global-talent",
    name: "Global Talent",
    verb: "Grow",
    action: "Intern",
    tagline: "An international internship that moves your career.",
    aiesecSegment: "global-talent",
    gisShortNames: ["gt", "gta", "igt", "igta", "ogta", "global talent"],
  },
  igte: {
    id: "igte",
    gisId: 9,
    slug: "global-teacher",
    name: "Global Teacher",
    verb: "Teach",
    action: "Teach",
    tagline: "Teach in a Polish school — and learn more than you teach.",
    aiesecSegment: "global-teacher",
    gisShortNames: ["gte", "igte", "ogte", "global teacher"],
  },
};

export function isProgram(value: unknown): value is Program {
  return typeof value === "string" && (PROGRAMS as readonly string[]).includes(value);
}

/** Accepts public slugs ("global-volunteer", "volunteer") and legacy ids ("igv"). */
export function programFromParam(value: unknown): Program | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.toLowerCase();
  if (isProgram(v)) return v;
  return PROGRAMS.find((p) => PROGRAM_INFO[p].slug === v || PROGRAM_INFO[p].slug.replace("global-", "") === v);
}

export function programFromGis(input: { id?: unknown; short?: unknown }): Program | undefined {
  const id = Number(input.id);
  for (const p of PROGRAMS) if (PROGRAM_INFO[p].gisId === id) return p;
  const short = typeof input.short === "string" ? input.short.trim().toLowerCase() : "";
  if (!short) return undefined;
  for (const p of PROGRAMS) if (PROGRAM_INFO[p].gisShortNames.includes(short)) return p;
  return undefined;
}

export function aiesecOpportunityUrl(program: Program, id: string): string {
  return `https://aiesec.org/opportunity/${PROGRAM_INFO[program].aiesecSegment}/${encodeURIComponent(id)}`;
}

export function programHref(program: Program): string {
  return `/${PROGRAM_INFO[program].slug}`;
}
