import { PROGRAMS, type Program } from "./programs";

/** Tailwind classes per programme — official AIESEC product colours. */
export const PROGRAM_STYLE: Record<Program, { bg: string; ink: string; border: string; hex: string; soft: string }> = {
  igv: { bg: "bg-gv", ink: "text-gv-ink", border: "border-gv", hex: "#f85a40", soft: "bg-[#fee9e5]" },
  igta: { bg: "bg-gta", ink: "text-gta-ink", border: "border-gta", hex: "#0cb9c1", soft: "bg-[#e1f6f7]" },
  igte: { bg: "bg-gte", ink: "text-gte-ink", border: "border-gte", hex: "#f48924", soft: "bg-[#fdeedd]" },
};

/** Marker colour for a place: its programme colour, or yellow when several programmes are present. */
export function placeColor(byProgram: Record<Program, number>, program: Program | "all"): string {
  if (program !== "all") return PROGRAM_STYLE[program].hex;
  const present = PROGRAMS.filter((p) => byProgram[p] > 0);
  return present.length === 1 ? PROGRAM_STYLE[present[0]].hex : "#ffc845";
}
