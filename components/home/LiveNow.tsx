import Link from "next/link";
import type { OpportunitySummary } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { LiveStamp } from "@/components/ui/LiveStamp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/** Step 2 of the journey: real projects you can apply to today. */
export function LiveNow({ items, total, fetchedAt, stale }: { items: OpportunitySummary[]; total: number; fetchedAt: string; stale?: boolean }) {
  return (
    <section aria-labelledby="live-title" className="bg-white py-20 md:py-28">
      <div className="frame flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <LiveStamp fetchedAt={fetchedAt} stale={stale} />
          <SectionTitle id="live-title" className="mt-3" before="Open" swoosh="right now" />
          <p className="mt-4 max-w-lg text-[1.08rem] text-grey">Real projects with real dates and open spots — a few picks from all {total}.</p>
        </Reveal>
        <Link href="/opportunities" className="btn btn-red self-start md:self-end">
          See all {total} opportunities <Arrow />
        </Link>
      </div>
      {items.length > 0 ? (
        <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 pt-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
          {items.map((o, i) => (
            <Reveal as="li" key={o.id} delay={(i % 3) * 0.06} className="w-[86vw] shrink-0 snap-center sm:w-[60vw] md:w-auto">
              <OpportunityCard o={o} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="frame mt-10 max-w-xl text-lg">No open projects at this exact moment — new ones are added all the time. Check back soon.</p>
      )}
    </section>
  );
}
