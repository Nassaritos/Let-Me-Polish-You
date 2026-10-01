import Link from "next/link";
import { PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { SDG_COLORS, sdgName } from "@/lib/sdg";
import type { OpportunitySummary } from "@/lib/types";
import { formatDuration, formatMonth, formatSalary } from "@/lib/utils/format";
import { Rosette } from "@/components/brand/Rosette";
import { Arrow } from "@/components/ui/Arrow";

export function AvailabilityBadge({ o, className = "" }: { o: Pick<OpportunitySummary, "availability" | "openings">; className?: string }) {
  if (o.availability === "closed") return <span className={`chip bg-mist text-grey ${className}`}>Applications closed</span>;
  if (o.availability === "full") return <span className={`chip bg-mist text-grey ${className}`}>Fully booked</span>;
  return (
    <span className={`chip bg-[#e3f9ee] text-[#05663b] ${className}`}>
      <span className="h-2 w-2 rounded-full bg-green" aria-hidden="true" />
      {o.openings === undefined ? "Open" : `${o.openings} ${o.openings === 1 ? "spot" : "spots"} left`}
    </span>
  );
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="eyebrow !text-[0.66rem] text-grey">{label}</dt>
      <dd className="mt-0.5 truncate font-display text-[1.02rem] font-bold">{value}</dd>
    </div>
  );
}

/** Boarding-pass style card. All content comes from live GIS data. */
export function OpportunityCard({ o, hole = "#ffffff" }: { o: OpportunitySummary; hole?: string }) {
  const info = PROGRAM_INFO[o.program];
  const style = PROGRAM_STYLE[o.program];
  const unavailable = o.availability !== "open";
  const start = formatMonth(o.earliestStart);
  const duration = formatDuration(o.durationWeeks, true);
  const salary = o.program !== "igv" ? formatSalary(o.salary) : undefined;
  const subtitle = o.organisation;

  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-[1.5rem] bg-white text-navy shadow-[0_2px_0_rgba(10,31,68,0.06),0_14px_34px_-22px_rgba(10,31,68,0.45)] ring-1 ring-line transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 ${
        unavailable ? "opacity-70" : ""
      }`}
    >
      {/* stub */}
      <div className={`relative flex w-16 shrink-0 flex-col items-center justify-between py-5 ${style.bg} sm:w-[4.5rem]`}>
        <span className="eyebrow [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[0.8rem]">
          {info.verb} · {info.code}
        </span>
        <Rosette color="#0a1f44" hole={style.hex} variant={o.program === "igta" ? "star" : "flower"} className="h-9 w-9 transition-transform duration-700 group-hover:rotate-90" />
      </div>
      {/* perforation */}
      <div className="relative w-0 border-l-2 border-dashed border-line" aria-hidden="true">
        <span className="absolute -left-[11px] -top-[11px] h-5 w-5 rounded-full" style={{ background: hole }} />
        <span className="absolute -bottom-[11px] -left-[11px] h-5 w-5 rounded-full" style={{ background: hole }} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow truncate text-blue-ink">{o.city ?? "Poland"}</p>
          <AvailabilityBadge o={o} className="shrink-0 !py-1 text-[0.75rem]" />
        </div>
        <h3 className="display mt-3 text-[1.65rem] leading-[1.02]">
          <Link href={`/opportunities/${o.id}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {o.title}
          </Link>
        </h3>
        {subtitle && <p className="mt-1.5 line-clamp-1 font-bold text-grey">{subtitle}</p>}

        {o.program === "igv" && o.sdgGoal && (
          <p className="mt-3 flex items-center gap-2 text-[0.9rem] font-bold">
            <span className="rounded-md px-1.5 py-0.5 font-display text-[0.75rem] text-white" style={{ background: SDG_COLORS[o.sdgGoal] }}>
              SDG {o.sdgGoal}
            </span>
            {sdgName(o.sdgGoal)}
          </p>
        )}
        {salary && <p className="mt-3 text-[0.9rem] font-bold"><span className="eyebrow mr-2 text-gta-ink">Salary</span>{salary}</p>}

        <dl className="mt-auto grid grid-cols-3 gap-3 border-t-2 border-dashed border-line pt-4">
          <Fact label="Duration" value={duration} />
          <Fact label="Starts" value={start} />
          <Fact label="Spots" value={o.openings !== undefined ? String(o.openings) : undefined} />
        </dl>
        <span className="mt-4 inline-flex items-center gap-2 self-end font-display font-bold text-blue-ink">
          View <span className="sr-only">{o.title}</span>
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
