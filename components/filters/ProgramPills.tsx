"use client";

import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";

interface Props {
  value: Program | "all";
  onChange: (v: Program | "all") => void;
  counts?: Partial<Record<Program | "all", number>>;
  tone?: "light" | "dark";
  className?: string;
}

/** All / iGV / iGTa / iGTe as chunky pills in the programme colours. */
export function ProgramPills({ value, onChange, counts, tone = "light", className = "" }: Props) {
  const options: (Program | "all")[] = ["all", ...PROGRAMS];
  return (
    <div role="group" aria-label="Program" className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const active = o === value;
        const label = o === "all" ? "All" : `${PROGRAM_INFO[o].verb} · ${PROGRAM_INFO[o].code}`;
        const activeCls = o === "all" ? (tone === "dark" ? "bg-white text-navy" : "bg-navy text-white") : `${PROGRAM_STYLE[o].bg} text-navy`;
        const idleCls =
          tone === "dark"
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-white text-navy ring-2 ring-inset ring-line hover:ring-navy";
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={`chip shrink-0 !px-4 !py-2.5 font-display text-[0.95rem] transition-all duration-300 ${active ? activeCls : idleCls}`}
          >
            {o !== "all" && !active && <span className={`h-2.5 w-2.5 rounded-full ${PROGRAM_STYLE[o].bg}`} aria-hidden="true" />}
            {label}
            {counts?.[o] !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-[0.78rem] tabular-nums ${active ? "bg-white/60 text-navy" : tone === "dark" ? "bg-white/15" : "bg-mist"}`}>
                {counts[o]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
