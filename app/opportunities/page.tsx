import type { Metadata } from "next";
import { Explorer } from "@/components/opportunities/Explorer";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { GisNotice } from "@/components/ui/GisNotice";
import { LiveStamp } from "@/components/ui/LiveStamp";
import { Rosette } from "@/components/brand/Rosette";
import { getOpportunitySummaries } from "@/lib/gis/opportunities";
import { parseFilters } from "@/lib/filters";
import { PROGRAM_INFO, isProgram } from "@/lib/programs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const p = (await searchParams).program;
  const program = typeof p === "string" && isProgram(p) ? PROGRAM_INFO[p] : null;
  const title = program ? `${program.code} ${program.name} opportunities in Poland` : "Live opportunities in Poland";
  const description = program
    ? `${program.tagline} Browse live ${program.name} opportunities hosted by AIESEC in Poland.`
    : "Browse live Global Volunteer, Global Talent and Global Teacher opportunities hosted by AIESEC in Poland.";
  return {
    title,
    description,
    alternates: { canonical: program ? `/opportunities?program=${program.id}` : "/opportunities" },
    openGraph: { title, description, url: "/opportunities" },
  };
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, result] = await Promise.all([searchParams, getOpportunitySummaries()]);
  const initial = parseFilters(params);
  const open = result.ok ? result.data.filter((o) => o.availability === "open") : [];
  const places = new Set(open.map((o) => o.citySlug).filter(Boolean)).size;

  return (
    <>
      <header className="relative overflow-hidden bg-blue pb-12 pt-32 text-white md:pb-16 md:pt-40">
        <Rosette color="#1b8cf6" hole="#037ef3" className="pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem]" />
        <div className="frame relative">
          <p className="hand text-[clamp(1.6rem,2.6vw,2.2rem)] text-yellow">real projects, real dates —</p>
          <h1 className="display-tight text-[clamp(3.4rem,9vw,8.5rem)]">
            Where could <span className="text-yellow">you</span> go?
          </h1>
          {result.ok && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="text-[1.2rem] font-bold">
                {open.length} live {open.length === 1 ? "opportunity" : "opportunities"} in {places} {places === 1 ? "place" : "places"} across Poland.
              </p>
              <LiveStamp fetchedAt={result.fetchedAt} stale={result.stale} className="!text-white/85" />
            </div>
          )}
        </div>
      </header>

      {result.ok ? (
        <Explorer all={result.data} initial={initial} mapBase={<PolandMapBase />} />
      ) : (
        <section className="frame py-16">
          <GisNotice reason={result.reason} />
        </section>
      )}
    </>
  );
}
