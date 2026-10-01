import type { Metadata } from "next";
import Link from "next/link";
import { PolandLife } from "@/components/home/PolandLife";
import { PolandMarquee } from "@/components/home/PolandMarquee";
import { WhereCouldYouGo } from "@/components/cities/WhereCouldYouGo";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { getPlacePhotos } from "@/lib/place-photos";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GisNotice } from "@/components/ui/GisNotice";
import { Arrow } from "@/components/ui/Arrow";
import { getPolandOpportunities, summarizeCities } from "@/lib/gis/opportunities";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Life in Poland",
  description: "What living in Poland actually feels like — and every city and town where AIESEC projects are open right now.",
  alternates: { canonical: "/poland" },
};

export default async function PolandPage() {
  const result = await getPolandOpportunities();
  const places = result.ok ? summarizeCities(result.data) : [];
  const photos = await getPlacePhotos(places.filter((c) => c.available > 0));
  return (
    <>
      <header className="bg-white pb-6 pt-28 md:pt-36">
        <div className="frame max-w-5xl">
          <SectionTitle as="h1" size="xl" script="imagine living in" swoosh="Poland" />
          <p className="mt-6 max-w-2xl text-[1.15rem] leading-relaxed text-ink-2">
            Big cities and small towns, mountains and lakes, pierogi and festivals — here&apos;s a feel for the weeks you&apos;d
            spend here, and every place where a project is open right now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#places" className="btn btn-red">
              Where could you go? <Arrow direction="down" />
            </a>
            <Link href="/opportunities" className="btn btn-ghost text-ink hover:bg-ink hover:text-white">
              All opportunities
            </Link>
          </div>
        </div>
      </header>
      <PolandLife />
      <PolandMarquee />
      {result.ok ? (
        <WhereCouldYouGo base={<PolandMapBase tone="dark" />} places={places} photos={photos} />
      ) : (
        <section className="frame py-16">
          <GisNotice reason={result.reason} />
        </section>
      )}
      <section className="bg-white py-16">
        <div className="frame flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[1.15rem] leading-relaxed">
            Wherever you go, a local AIESEC team of students hosts you — they know the area, and they&apos;re often your
            first friends here.
          </p>
          <Link href="/about#teams" className="btn btn-ink shrink-0">
            Meet the local teams <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
