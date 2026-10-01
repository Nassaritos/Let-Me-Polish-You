import { Hero } from "@/components/hero/Hero";
import { PolandMarquee } from "@/components/home/PolandMarquee";
import { ProgramChooser } from "@/components/programs/ProgramChooser";
import { PolandLife } from "@/components/home/PolandLife";
import { WhereCouldYouGo } from "@/components/cities/WhereCouldYouGo";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { LiveNow } from "@/components/home/LiveNow";
import { AboutAiesec } from "@/components/about/AboutAiesec";
import { Stories } from "@/components/stories/Stories";
import { FinalCta } from "@/components/home/FinalCta";
import { GisNotice } from "@/components/ui/GisNotice";
import { computeStats, getPolandOpportunities, summarizeCities } from "@/lib/gis/opportunities";
import { toSummary } from "@/lib/gis/normalize";
import { PROGRAMS } from "@/lib/programs";
import type { OpportunitySummary } from "@/lib/types";

// Regenerate at least every 5 minutes, even if a GIS call failed during render.
export const revalidate = 300;

/** A varied selection: round-robin across programmes, soonest start first. */
function pickFeatured(all: OpportunitySummary[], n = 6): OpportunitySummary[] {
  const open = all
    .filter((o) => o.availability === "open")
    .sort((a, b) => (a.earliestStart ?? "9999").localeCompare(b.earliestStart ?? "9999") || (b.openings ?? 0) - (a.openings ?? 0));
  const queues = PROGRAMS.map((p) => open.filter((o) => o.program === p));
  const out: OpportunitySummary[] = [];
  while (out.length < n && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && out.length < n) out.push(next);
    }
  }
  return out;
}

export default async function HomePage() {
  const result = await getPolandOpportunities();
  const stats = result.ok ? computeStats(result.data) : null;
  const places = result.ok ? summarizeCities(result.data) : [];
  const summaries = result.ok ? result.data.map(toSummary) : [];

  return (
    <>
      <Hero
        live={
          stats
            ? {
                available: stats.available,
                places: stats.cities,
                byProgram: { igv: stats.byProgram.igv.available, igta: stats.byProgram.igta.available, igte: stats.byProgram.igte.available },
              }
            : null
        }
      />
      <PolandMarquee />
      <ProgramChooser
        counts={stats ? { igv: stats.byProgram.igv.available, igta: stats.byProgram.igta.available, igte: stats.byProgram.igte.available } : null}
      />

      {result.ok ? (
        <>
          <LiveNow items={pickFeatured(summaries)} total={stats?.available ?? 0} fetchedAt={result.fetchedAt} stale={result.stale} />
          <WhereCouldYouGo base={<PolandMapBase tone="dark" />} places={places} />
        </>
      ) : (
        <section className="frame bg-white py-20">
          <GisNotice reason={result.reason} />
        </section>
      )}

      <PolandLife />
      <AboutAiesec />
      <Stories />
      <FinalCta />
    </>
  );
}
