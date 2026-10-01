import type { Metadata } from "next";
import { Explorer } from "@/components/opportunities/Explorer";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { GisNotice } from "@/components/ui/GisNotice";
import { LiveStamp } from "@/components/ui/LiveStamp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getOpportunitySummaries } from "@/lib/gis/opportunities";
import { parseFilters } from "@/lib/filters";
import { PROGRAM_INFO, programFromParam } from "@/lib/programs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const p = programFromParam((await searchParams).program);
  const program = p ? PROGRAM_INFO[p] : null;
  const title = program ? `${program.name} opportunities in Poland` : "All opportunities in Poland";
  const description = program
    ? `${program.tagline} Browse live ${program.name} opportunities hosted by AIESEC in Poland.`
    : "Browse every live Global Volunteer, Global Talent and Global Teacher opportunity hosted by AIESEC in Poland.";
  return { title, description, alternates: { canonical: "/opportunities" }, openGraph: { title, description, url: "/opportunities" } };
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, result] = await Promise.all([searchParams, getOpportunitySummaries()]);
  const initial = parseFilters(params);
  const open = result.ok ? result.data.filter((o) => o.availability === "open") : [];
  const places = new Set(open.map((o) => o.citySlug).filter(Boolean)).size;

  return (
    <>
      <header className="bg-white pb-10 pt-28 md:pb-12 md:pt-36">
        <div className="frame flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle as="h1" size="xl" script="every project, one place" before="All" swoosh="opportunities" />
          {result.ok && (
            <div className="md:pb-3 md:text-right">
              <p className="text-[1.15rem] font-bold">
                {open.length} live in {places} {places === 1 ? "place" : "places"} across Poland
              </p>
              <LiveStamp fetchedAt={result.fetchedAt} stale={result.stale} className="mt-2 md:justify-end" />
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
