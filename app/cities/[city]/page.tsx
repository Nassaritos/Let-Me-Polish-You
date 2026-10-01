import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolandOpportunities, summarizeCities } from "@/lib/gis/opportunities";
import { toSummary } from "@/lib/gis/normalize";
import { PROGRAMS, PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE, placeColor } from "@/lib/program-style";
import { cityPhoto } from "@/lib/images";
import { CITY_GUIDE } from "@/lib/content/cities";
import { nearestBigCity } from "@/lib/cities";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { PolandMap } from "@/components/map/PolandMap";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { Rosette } from "@/components/brand/Rosette";
import { GisNotice } from "@/components/ui/GisNotice";
import { Arrow } from "@/components/ui/Arrow";

export const revalidate = 300;
export const dynamicParams = true;

type Params = Promise<{ city: string }>;

/** Pre-render pages for every place currently in GIS; new places render on demand. */
export async function generateStaticParams() {
  const res = await getPolandOpportunities();
  return res.ok ? summarizeCities(res.data).map((c) => ({ city: c.slug })) : [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const res = await getPolandOpportunities();
  const c = res.ok ? summarizeCities(res.data).find((x) => x.slug === city) : undefined;
  if (!c) return { title: "Place in Poland" };
  const title = `Volunteer, intern or teach in ${c.name}`;
  const description = `${c.available} live AIESEC ${c.available === 1 ? "opportunity" : "opportunities"} in ${c.name}, Poland. See what life there feels like and find your project.`;
  return { title, description, alternates: { canonical: `/cities/${c.slug}` }, openGraph: { title, description, url: `/cities/${c.slug}` } };
}

export default async function CityPage({ params }: { params: Params }) {
  const { city } = await params;
  const res = await getPolandOpportunities();
  if (!res.ok) {
    return (
      <div className="bg-blue pt-28">
        <section className="frame pb-20">
          <GisNotice reason={res.reason} />
        </section>
      </div>
    );
  }

  const summary = summarizeCities(res.data).find((c) => c.slug === city);
  if (!summary) notFound();

  const opps = res.data.filter((o) => o.citySlug === city).map(toSummary);
  const open = opps.filter((o) => o.availability === "open");
  const later = opps.filter((o) => o.availability !== "open");
  const photo = cityPhoto(city);
  const guide = CITY_GUIDE[city];
  const nearest = summary.coordinates ? nearestBigCity(summary.coordinates, summary.name) : undefined;
  const isBigCity = Boolean(guide);

  return (
    <>
      <header className="relative overflow-hidden bg-blue pb-14 pt-28 text-white md:pb-20 md:pt-36">
        {!photo && <Rosette color="#1b8cf6" hole="#037ef3" className="pointer-events-none absolute -right-28 -top-10 h-[34rem] w-[34rem]" />}
        <div className="frame relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={photo ? "lg:col-span-7" : "lg:col-span-9"}>
            <Link href="/#places" className="font-bold text-white/80 hover:text-white">
              ← All places
            </Link>
            <p className="hand mt-6 text-[clamp(1.6rem,2.6vw,2.2rem)] text-yellow">imagine living in…</p>
            <h1 className="display-tight text-[clamp(3.6rem,11vw,10rem)] break-words">{summary.name}</h1>
            {guide && <p className="mt-4 text-[1.35rem] font-bold">{guide.vibe}</p>}
            {nearest && !isBigCity && (
              <p className="mt-3 text-[1.1rem] font-bold text-white/85">
                A smaller Polish town · about {nearest.km} km from {nearest.name} as the crow flies.
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <p className="display mr-2 text-5xl tabular-nums">{summary.available}</p>
              <p className="mr-4 font-bold leading-tight">
                live {summary.available === 1 ? "opportunity" : "opportunities"}
                <br />
                in {summary.name}
              </p>
              {PROGRAMS.filter((p) => summary.byProgram[p] > 0).map((p) => (
                <Link key={p} href={`/opportunities?city=${city}&program=${p}`} className={`chip ${PROGRAM_STYLE[p].bg} text-navy`}>
                  {PROGRAM_INFO[p].verb} · {PROGRAM_INFO[p].code} <span className="rounded-full bg-white/70 px-2">{summary.byProgram[p]}</span>
                </Link>
              ))}
            </div>
          </div>
          {photo && (
            <figure className="lg:col-span-5">
              <div className="photo relative aspect-[4/3] -rotate-2 ring-8 ring-white">
                <Image src={photo.src} alt={photo.alt} fill priority placeholder="blur" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
              </div>
            </figure>
          )}
        </div>
      </header>

      <section className="on-light frame grid gap-10 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-blue-ink">{guide ? "Life here" : "Where it is"}</p>
          <h2 className="display mt-2 text-[clamp(2rem,4vw,3.4rem)]">{guide ? `What ${summary.name} feels like` : `Finding ${summary.name}`}</h2>
          {guide ? (
            <ul className="mt-6 space-y-3">
              {guide.notes.map((n) => (
                <li key={n} className="flex gap-3 text-[1.1rem] font-bold">
                  <Rosette color="#037ef3" hole="#fff" className="mt-1 h-5 w-5 shrink-0" />
                  {n}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-grey">
              Many AIESEC projects happen outside the big cities — in towns and villages where an international volunteer is a
              big deal. {nearest ? `${summary.name} is about ${nearest.km} km from ${nearest.name}.` : ""} The host organisation and
              AIESEC team will help you with the details.
            </p>
          )}
        </div>
        <div className="rounded-[1.75rem] bg-mist p-5 md:p-8 lg:col-span-7">
          <PolandMap
            base={<PolandMapBase />}
            points={
              summary.coordinates
                ? [
                    {
                      id: summary.slug,
                      label: summary.name,
                      lat: summary.coordinates.lat,
                      lng: summary.coordinates.lng,
                      count: summary.available || summary.total,
                      color: placeColor(summary.byProgram, "all"),
                      labelled: true,
                    },
                  ]
                : []
            }
            title={`Map of Poland showing ${summary.name}`}
          />
        </div>
      </section>

      <section aria-labelledby="city-opps" className="on-light bg-mist py-14 md:py-20">
        <div className="frame">
          <h2 id="city-opps" className="display text-[clamp(2rem,4vw,3.4rem)]">
            {open.length ? `Live in ${summary.name}` : `Nothing open in ${summary.name} right now`}
          </h2>
          {open.length ? (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {open.map((o) => (
                <li key={o.id}>
                  <OpportunityCard o={o} hole="#f5f5f5" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-lg text-grey">Spots here are full or closed at the moment. New projects appear regularly — or explore nearby places.</p>
          )}
          {later.length > 0 && (
            <details className="mt-10">
              <summary className="cursor-pointer font-bold text-blue-ink">
                Full or closed projects in {summary.name} ({later.length})
              </summary>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {later.map((o) => (
                  <li key={o.id}>
                    <OpportunityCard o={o} hole="#f5f5f5" />
                  </li>
                ))}
              </ul>
            </details>
          )}
          <Link href="/opportunities" className="btn btn-primary mt-10">
            Explore all of Poland <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
