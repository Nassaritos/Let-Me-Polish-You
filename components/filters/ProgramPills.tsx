"use client";

import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { ProgramIcon } from "@/components/brand/ProgramIcon";
import { PROGRAM_STYLE } from "@/lib/program-style";

interface Props {
  value: Program | "all";
  onChange: (v: Program | "all") => void;
  counts?: Partial<Record<Program | "all", number>>;
  tone?: "light" | "dark";
  className?: string;
}

/** All / Global Volunteer / Global Talent / Global Teacher */
export function ProgramPills({ value, onChange, counts, tone = "light", className = "" }: Props) {
  const options: (Program | "all")[] = ["all", ...PROGRAMS];
  return (
    <div role="group" aria-label="Experience" className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const active = o === value;
        const label = o === "all" ? "All experiences" : PROGRAM_INFO[o].name;
        const idle =
          tone === "dark" ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-ink ring-2 ring-inset ring-line hover:ring-ink";
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={`chip shrink-0 !px-4 !py-2.5 font-display text-[0.88rem] font-extrabold transition-all duration-200 ${
              active ? (o === "all" ? (tone === "dark" ? "bg-white text-ink" : "bg-ink text-white") : `${PROGRAM_STYLE[o].bg} text-ink`) : idle
            }`}
          >
            {o !== "all" && (
              <span className={`grid h-5 w-5 place-items-center rounded-full ${active ? "bg-white/40" : PROGRAM_STYLE[o].bg} text-ink`}>
                <ProgramIcon program={o} className="h-3 w-3" />
              </span>
            )}
            {label}
            {counts?.[o] !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-[0.76rem] tabular-nums ${active ? "bg-white/50" : tone === "dark" ? "bg-white/15" : "bg-mist"}`}>
                {counts[o]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
