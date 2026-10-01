import Link from "next/link";
import { PROGRAM_INFO } from "@/lib/programs";
import { SDG_COLORS, sdgName } from "@/lib/sdg";
import { lcByKey } from "@/lib/lcs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import type { OpportunitySummary } from "@/lib/types";
import { formatDuration, formatMonth, formatSalary } from "@/lib/utils/format";
import { ProgramIcon } from "@/components/brand/ProgramIcon";
import { Arrow } from "@/components/ui/Arrow";

export function AvailabilityBadge({ o, className = "" }: { o: Pick<OpportunitySummary, "availability" | "openings">; className?: string }) {
  if (o.availability === "closed") return <span className={`chip bg-mist text-grey ${className}`}>Applications closed</span>;
  if (o.availability === "full") return <span className={`chip bg-mist text-grey ${className}`}>Fully booked</span>;
  return (
    <span className={`chip bg-red-soft text-red-ink ${className}`}>
      <span className="h-2 w-2 rounded-full bg-red" aria-hidden="true" />
      {o.openings === undefined ? "Open" : `${o.openings} ${o.openings === 1 ? "spot" : "spots"} left`}
    </span>
  );
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="eyebrow !text-[0.62rem] text-grey">{label}</dt>
      <dd className="mt-0.5 truncate font-display text-[0.98rem] font-extrabold">{value}</dd>
    </div>
  );
}

/** Boarding-pass style card. All content comes from live GIS data. */
export function OpportunityCard({ o, hole = "#ffffff" }: { o: OpportunitySummary; hole?: string }) {
  const info = PROGRAM_INFO[o.program];
  const unavailable = o.availability !== "open";
  const start = formatMonth(o.earliestStart);
  const duration = formatDuration(o.durationWeeks, true);
  const salary = o.program !== "igv" ? formatSalary(o.salary) : undefined;
  const lc = lcByKey(o.hostLcKey);
  const style = PROGRAM_STYLE[o.program];

  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-2xl bg-white text-ink shadow-[0_2px_0_rgba(0,0,0,0.05),0_16px_34px_-24px_rgba(0,0,0,0.5)] ring-1 ring-line transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 ${
        unavailable ? "opacity-70" : ""
      }`}
    >
      {/* stub */}
      <div className={`relative flex w-14 shrink-0 flex-col items-center justify-between py-5 sm:w-16 ${unavailable ? "bg-line text-grey" : `${style.bg} text-ink`}`}>
        <span className="eyebrow rotate-180 whitespace-nowrap text-[0.7rem] [writing-mode:vertical-rl]">{info.name}</span>
        <ProgramIcon program={o.program} className="h-6 w-6" />
      </div>
      {/* perforation */}
      <div className="relative w-0 border-l-2 border-dashed border-line" aria-hidden="true">
        <span className="absolute -left-[11px] -top-[11px] h-5 w-5 rounded-full" style={{ background: hole }} />
        <span className="absolute -bottom-[11px] -left-[11px] h-5 w-5 rounded-full" style={{ background: hole }} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className={`eyebrow truncate ${style.ink}`}>{o.city ?? "Poland"}</p>
          <AvailabilityBadge o={o} className="shrink-0 !py-1 text-[0.74rem]" />
        </div>
        <h3 className="display mt-3 text-[1.45rem] leading-[1.08]">
          <Link href={`/opportunities/${o.id}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {o.title}
          </Link>
        </h3>
        {o.organisation && <p className="mt-1.5 line-clamp-1 font-bold text-grey">{o.organisation}</p>}

        {o.program === "igv" && o.sdgGoal && (
          <p className="mt-3 flex items-center gap-2 text-[0.88rem] font-bold">
            <span className="rounded-md px-1.5 py-0.5 font-display text-[0.72rem] text-white" style={{ background: SDG_COLORS[o.sdgGoal] }}>
              SDG {o.sdgGoal}
            </span>
            {sdgName(o.sdgGoal)}
          </p>
        )}
        {salary && (
          <p className="mt-3 text-[0.9rem] font-bold">
            <span className={`eyebrow mr-2 ${style.ink}`}>Salary</span>
            {salary}
          </p>
        )}

        <dl className="mt-auto grid grid-cols-3 gap-3 border-t-2 border-dashed border-line pt-4">
          <Fact label="Duration" value={duration} />
          <Fact label="Starts" value={start} />
          <Fact label="Spots" value={o.openings !== undefined ? String(o.openings) : undefined} />
        </dl>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="truncate text-[0.8rem] text-grey">{lc ? `Hosted by AIESEC ${lc.name}` : ""}</span>
          <span className={`inline-flex shrink-0 items-center gap-2 font-display font-extrabold ${style.ink}`}>
            View <span className="sr-only">{o.title}</span>
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
