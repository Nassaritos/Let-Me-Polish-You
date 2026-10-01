/**
 * Program definitions shared by server and client code.
 * Contains no secrets and no opportunity data — only how each AIESEC
 * programme is identified in GIS and how it is presented on the site.
 */

export const PROGRAMS = ["igv", "igta", "igte"] as const;
export type Program = (typeof PROGRAMS)[number];

export interface ProgramInfo {
  id: Program;
  /** GIS programme id */
  gisId: number;
  /** Short code shown in the UI */
  code: string;
  name: string;
  /** One-word verb used as the program's editorial headline */
  verb: string;
  /** Plain-language label used in filters ("Volunteer", "Work", "Teach") */
  intent: string;
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
    code: "iGV",
    name: "Global Volunteer",
    verb: "Give",
    intent: "Volunteer",
    tagline: "Volunteer on a project that pushes a UN Global Goal forward.",
    aiesecSegment: "global-volunteer",
    gisShortNames: ["gv", "igv", "ogv", "global volunteer"],
  },
  igta: {
    id: "igta",
    gisId: 8,
    code: "iGTa",
    name: "Global Talent",
    verb: "Grow",
    intent: "Intern",
    tagline: "An international internship that moves your career.",
    aiesecSegment: "global-talent",
    gisShortNames: ["gt", "gta", "igt", "igta", "ogta", "global talent"],
  },
  igte: {
    id: "igte",
    gisId: 9,
    code: "iGTe",
    name: "Global Teacher",
    verb: "Teach",
    intent: "Teach",
    tagline: "Teach in a Polish school — and learn more than you teach.",
    aiesecSegment: "global-teacher",
    gisShortNames: ["gte", "igte", "ogte", "global teacher"],
  },
};

export function isProgram(value: unknown): value is Program {
  return typeof value === "string" && (PROGRAMS as readonly string[]).includes(value);
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
