import type { Program } from "./programs";

/**
 * Official AIESEC product colours. Product-coloured surfaces always carry
 * ink (black) text — white text on teal/orange fails contrast.
 */
export const PROGRAM_STYLE: Record<
  Program,
  { hex: string; bg: string; text: string; ink: string; soft: string; border: string; ring: string }
> = {
  igv: { hex: "#f85a40", bg: "bg-gv", text: "text-gv", ink: "text-gv-ink", soft: "bg-[#feebe7]", border: "border-gv", ring: "ring-gv" },
  igta: { hex: "#0cb9c1", bg: "bg-gta", text: "text-gta", ink: "text-gta-ink", soft: "bg-[#e2f7f8]", border: "border-gta", ring: "ring-gta" },
  igte: { hex: "#f48924", bg: "bg-gte", text: "text-gte", ink: "text-gte-ink", soft: "bg-[#fef0e2]", border: "border-gte", ring: "ring-gte" },
};

/** Simple line icons per programme (24×24 paths). */
export const PROGRAM_ICON: Record<Program, string> = {
  igv: "M12 20s-6.5-3.9-8.4-7.6C2.2 9.6 4 6.5 7 6.5c2 0 3.2 1.2 5 3 1.8-1.8 3-3 5-3 3 0 4.8 3.1 3.4 5.9C18.5 16.1 12 20 12 20Z",
  igta: "M4 8h16v11H4zM9 8V5.5h6V8M4 13h16",
  igte: "M12 7c-2-1.6-4.6-2.2-8-2v13c3.4-.2 6 .4 8 2 2-1.6 4.6-2.2 8-2V5c-3.4-.2-6 .4-8 2Zm0 0v13",
};

/** Map marker colour for a place: its product colour, or ink when several products are present. */
export function placeColor(byProgram: Record<Program, number>, program: Program | "all" = "all"): string {
  if (program !== "all") return PROGRAM_STYLE[program].hex;
  const present = (Object.keys(byProgram) as Program[]).filter((p) => byProgram[p] > 0);
  return present.length === 1 ? PROGRAM_STYLE[present[0]].hex : "#151515";
}
