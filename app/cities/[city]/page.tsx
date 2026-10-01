import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compareOpportunities, getActiveLocalCommittees, getPolandOpportunities, summarizeCities } from "@/lib/gis/opportunities";
import { getPlacePhoto } from "@/lib/place-photos";
import { toSummary } from "@/lib/gis/normalize";
import { PROGRAMS, PROGRAM_INFO, programHref, type Program } from "@/lib/programs";
import { PROGRAM_STYLE, placeColor } from "@/lib/program-style";
import { cityPhoto } from "@/lib/images";
import { CITY_GUIDE } from "@/lib/content/cities";
import type { LocalCommittee } from "@/lib/lcs";
import { cityCenter, nearestBigCity, slugify } from "@/lib/cities";
import type { CitySummary, Opportunity } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { PolandMap, type MapPoint } from "@/components/map/PolandMap";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { SwooshWord } from "@/components/brand/Swoosh";
import { GisNotice } from "@/components/ui/GisNotice";
import { Arrow } from "@/components/ui/Arrow";

export const revalidate = 300;
export const dynamicParams = true;

type Params = Promise<{ city: string }>;

/** Active local teams based in a city (e.g. Warsaw has SGH and UW). */
function teamsIn(slug: string, active: LocalCommittee[]) {
  return active.filter((lc) => slugify(lc.city) === slug);
}

/** Every place with live data, plus every city with an active local team. */
export async function generateStaticParams() {
  const [res, active] = await Promise.all([getPolandOpportunities(), getActiveLocalCommittees()]);
  const slugs = new Set(active.map((lc) => slugify(lc.city)));
  if (res.ok) for (const c of summarizeCities(res.data)) slugs.add(c.slug);
  return [...slugs].map((city) => ({ city }));
}

function cityName(slug: string, active: LocalCommittee[], summary?: CitySummary) {
  return summary?.name ?? teamsIn(slug, active)[0]?.city;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const [res, active] = await Promise.all([getPolandOpportunities(), getActiveLocalCommittees()]);
  const summary = res.ok ? summarizeCities(res.data).find((x) => x.slug === city) : undefined;
  const name = cityName(city, active, summary);
  if (!name) return { title: "Place in Poland" };
  const title = `Volunteer, intern or teach in ${name}`;
  const description = `Live AIESEC opportunities in and around ${name}, Poland, and the local AIESEC team that hosts them.`;
  return { title, description, alternates: { canonical: `/cities/${city}` }, openGraph: { title, description, url: `/cities/${city}` } };
}

function byProgram(list: Opportunity[]): Record<Program, number> {
  const out: Record<Program, number> = { igv: 0, igta: 0, igte: 0 };
  for (const o of list) if (o.availability === "open") out[o.program]++;
  return out;
}

export default async function CityPage({ params }: { params: Params }) {
  const { city } = await params;
  const [res, active] = await Promise.all([getPolandOpportunities(), getActiveLocalCommittees()]);
  if (!res.ok) {
    return (
      <section className="frame pb-20 pt-32">
        <GisNotice reason={res.reason} />
      </section>
    );
  }

  const summary = summarizeCities(res.data).find((c) => c.slug === city);
  const teams = teamsIn(city, active);
  const name = cityName(city, active, summary);
  if (!name) notFound();

  const teamKeys = new Set(teams.map((t) => t.key));
  const here = res.data.filter((o) => o.citySlug === city);
  const hosted = res.data.filter((o) => o.hostLcKey && teamKeys.has(o.hostLcKey));
  // Projects to show: everything the local team hosts, plus anything located in the city itself.
  const relevant = [...new Map([...hosted, ...here].map((o) => [o.id, o])).values()].sort(compareOpportunities);
  const open = relevant.filter((o) => o.availability === "open");
  const later = relevant.filter((o) => o.availability !== "open");
  const counts = byProgram(relevant);
  const coordinates = summary?.coordinates ?? cityCenter(name);

  const photo = coordinates || cityPhoto(city) ? await getPlacePhoto({ name, slug: city, coordinates }) : undefined;
  const guide = CITY_GUIDE[city];
  const nearest = coordinates && !guide && !teams.length ? nearestBigCity(coordinates, name) : undefined;

  // Map: the city itself plus each town where its team hosts projects.
  const places = summarizeCities(relevant);
  const points: MapPoint[] = places
    .filter((c) => c.coordinates)
    .map((c) => ({
      id: c.slug,
      label: c.name,
      lat: c.coordinates!.lat,
      lng: c.coordinates!.lng,
      count: c.available || c.total,
      color: placeColor(c.byProgram),
      labelled: c.slug === city || c.available >= 2,
    }));
  if (coordinates && !points.some((p) => p.id === city)) {
    points.push({ id: city, label: name, lat: coordinates.lat, lng: coordinates.lng, count: 0, color: "#fc3a3a", labelled: true });
  }

  const teamNames = teams.map((t) => `AIESEC ${t.name}`).join(" & ");

  return (
    <>
      <header className="bg-white pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="frame grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={photo ? "lg:col-span-7" : "lg:col-span-10"}>
            <Link href="/poland#places" className="font-bold text-grey hover:text-red-ink">
              ← All places
            </Link>
            <p className="script mt-6 text-[clamp(2rem,3.6vw,3.2rem)] text-red">imagine living in…</p>
            <h1 className="display-caps break-words text-[clamp(3rem,9vw,8rem)]">
              <SwooshWord>{name}</SwooshWord>
            </h1>
            {guide && <p className="mt-5 text-[1.3rem] font-bold">{guide.vibe}</p>}
            {nearest && (
              <p className="mt-3 text-[1.1rem] font-bold text-ink-2">
                A smaller Polish town · about {nearest.km} km from {nearest.name} as the crow flies.
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <p className="display mr-2 text-5xl tabular-nums text-red-ink">{open.length}</p>
              <p className="mr-4 font-bold leading-tight">
                live {open.length === 1 ? "opportunity" : "opportunities"}
                <br />
                {teams.length ? `with ${teamNames}` : `in ${name}`}
              </p>
              {PROGRAMS.filter((p) => counts[p] > 0).map((p) => (
                <Link key={p} href={`${programHref(p)}${summary ? `?city=${city}` : ""}`} className={`chip ${PROGRAM_STYLE[p].bg} text-ink`}>
                  {PROGRAM_INFO[p].name} <span className="rounded-full bg-white/60 px-2">{counts[p]}</span>
                </Link>
              ))}
            </div>
          </div>
          {photo && (
            <figure className="lg:col-span-5">
              <div className="label-box -rotate-2 p-2.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[0.4rem]">
                  <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
                </div>
              </div>
              {(photo.credit || photo.illustrative) && (
                <figcaption className="mt-3 text-sm text-grey">
                  {photo.illustrative ? (
                    "Illustrative photo of Poland."
                  ) : (
                    <a href={photo.credit!.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {name}. Photo: {photo.credit!.author} · {photo.credit!.license} · Wikimedia Commons
                    </a>
                  )}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </header>

      {teams.length > 0 && (
        <section aria-labelledby="team-title" className="border-t border-line bg-mist py-14 md:py-16">
          <div className="frame grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-red-ink">Your local team</p>
              <h2 id="team-title" className="display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)]">
                {teamNames}
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-2">
                {open.length
                  ? `Students from ${name} who prepare the projects below — in the city and in towns around it — and look after you while you're here.`
                  : `Students from ${name} who host AIESEC projects in and around the city. Nothing is open with them right now — new projects appear regularly.`}
              </p>
            </div>
            <ul className="flex flex-wrap items-start gap-8 lg:col-span-7 lg:justify-end">
              {teams.map((t) => (
                <li key={t.key} className="text-center">
                  <Image src={t.logo} alt={`AIESEC ${t.name} — ${t.tagline}`} sizes="280px" className="h-auto w-[min(280px,70vw)]" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="frame grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-red-ink">{guide ? "Life here" : "Where it is"}</p>
          <h2 className="display mt-2 text-[clamp(1.8rem,3.6vw,3rem)]">{guide ? `What ${name} feels like` : `Finding ${name}`}</h2>
          {guide ? (
            <ul className="mt-6 space-y-3">
              {guide.notes.map((n) => (
                <li key={n} className="flex gap-3 text-[1.08rem] font-bold">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-red" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-md text-[1.08rem] leading-relaxed text-grey">
              Many AIESEC projects happen outside the big cities — in towns and villages where an international volunteer is a
              big deal. {nearest ? `${name} is about ${nearest.km} km from ${nearest.name}.` : ""}
            </p>
          )}
          {teams.length > 0 && places.length > 1 && (
            <p className="mt-6 text-[0.95rem] text-grey">The map shows every place where {teamNames} hosts projects right now.</p>
          )}
        </div>
        <div className="rounded-2xl bg-mist p-5 md:p-8 lg:col-span-7">
          <PolandMap base={<PolandMapBase />} points={points} title={`Map of Poland showing ${name} and nearby projects`} />
        </div>
      </section>

      <section aria-labelledby="city-opps" className="bg-mist py-14 md:py-20">
        <div className="frame">
          <h2 id="city-opps" className="display text-[clamp(1.8rem,3.6vw,3rem)]">
            {open.length
              ? teams.length
                ? `Projects hosted by ${teamNames}`
                : `Live in ${name}`
              : `Nothing open ${teams.length ? `with ${teamNames}` : `in ${name}`} right now`}
          </h2>
          {open.length ? (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {open.map((o) => (
                <li key={o.id}>
                  <OpportunityCard o={toSummary(o)} hole="#f6f5f3" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-lg text-grey">New projects appear regularly — meanwhile, explore other places in Poland.</p>
          )}
          {later.length > 0 && (
            <details className="mt-10">
              <summary className="cursor-pointer font-bold text-red-ink">Full or closed projects ({later.length})</summary>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {later.map((o) => (
                  <li key={o.id}>
                    <OpportunityCard o={toSummary(o)} hole="#f6f5f3" />
                  </li>
                ))}
              </ul>
            </details>
          )}
          <Link href="/opportunities" className="btn btn-red mt-10">
            Explore all of Poland <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
