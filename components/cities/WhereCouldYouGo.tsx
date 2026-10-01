"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PROGRAMS, PROGRAM_INFO, programHref, type Program } from "@/lib/programs";
import { PROGRAM_STYLE, placeColor } from "@/lib/program-style";
import type { CitySummary } from "@/lib/types";
import type { PlacePhoto } from "@/lib/place-photos";
import { PolandMap, type MapPoint } from "@/components/map/PolandMap";
import { ProgramPills } from "@/components/filters/ProgramPills";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Arrow } from "@/components/ui/Arrow";

export function WhereCouldYouGo({ base, places, photos }: { base: React.ReactNode; places: CitySummary[]; photos: Record<string, PlacePhoto> }) {
  const [program, setProgram] = useState<Program | "all">("all");
  const countFor = (c: CitySummary) => (program === "all" ? c.available : c.byProgram[program]);

  const visible = useMemo(
    () => places.filter((c) => countFor(c) > 0).sort((a, b) => countFor(b) - countFor(a) || a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [places, program],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const current = visible.find((c) => c.slug === selected) ?? visible[0] ?? null;

  const sum = (f: (c: CitySummary) => number) => places.reduce((n, c) => n + f(c), 0);
  const counts: Record<Program | "all", number> = {
    all: sum((c) => c.available),
    igv: sum((c) => c.byProgram.igv),
    igta: sum((c) => c.byProgram.igta),
    igte: sum((c) => c.byProgram.igte),
  };
  const placeCount = places.filter((c) => c.available > 0).length;

  const points: MapPoint[] = visible
    .filter((c) => c.coordinates)
    .map((c, i) => ({
      id: c.slug,
      label: c.name,
      lat: c.coordinates!.lat,
      lng: c.coordinates!.lng,
      count: countFor(c),
      // mixed places are white on the dark map
      color: placeColor(c.byProgram, program) === "#151515" ? "#ffffff" : placeColor(c.byProgram, program),
      labelled: i < 5,
      description: `${countFor(c)} live ${countFor(c) === 1 ? "opportunity" : "opportunities"}`,
    }));

  const photo = current ? photos[current.slug] : undefined;
  const exploreHref = (slug: string) => (program === "all" ? `/opportunities?city=${slug}` : `${programHref(program)}?city=${slug}`);

  return (
    <section id="places" aria-labelledby="places-title" className="on-dark relative overflow-hidden bg-ink py-20 text-white md:py-28">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionTitle id="places-title" tone="white" script="big cities, small towns" before="Where could" swoosh="you" after="go?" />
        </div>
        <div className="md:col-span-5">
          <p className="text-[1.08rem] leading-relaxed text-white/80">
            Every dot is a place with live projects right now — {placeCount} {placeCount === 1 ? "place" : "places"} today. Tap one
            to see what&apos;s there.
          </p>
          <ProgramPills value={program} onChange={(v) => { setProgram(v); setSelected(null); }} counts={counts} tone="dark" className="mt-5" />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="frame mt-12 text-lg text-white/80">No live projects for this experience right now — try another one.</p>
      ) : (
        <div className="frame mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PolandMap
              base={base}
              points={points}
              tone="dark"
              selected={current?.slug}
              highlighted={highlighted}
              onSelect={setSelected}
              onHighlight={setHighlighted}
              title="Map of Poland with places that have live AIESEC opportunities"
            />
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              {PROGRAMS.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" /> {PROGRAM_INFO[p].name}
                </span>
              ))}
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-white" aria-hidden="true" /> More than one
              </span>
            </p>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {current && (
                <motion.article
                  key={current.slug + program}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl bg-white text-ink"
                  aria-live="polite"
                >
                  {photo && (
                    <figure className="relative h-48 overflow-hidden bg-mist">
                      <Image src={photo.src} alt={photo.alt} fill sizes="480px" className="object-cover" style={{ objectPosition: photo.position }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden="true" />
                      <p className="display-caps absolute bottom-7 left-5 right-5 text-3xl text-white">{current.name}</p>
                      <figcaption className="absolute bottom-2 left-5 right-5 truncate text-[0.68rem] text-white/80">
                        {photo.illustrative ? (
                          "Illustrative photo of Poland"
                        ) : photo.credit ? (
                          <a href={photo.credit.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Photo: {photo.credit.author} · {photo.credit.license} · Wikimedia Commons
                          </a>
                        ) : null}
                      </figcaption>
                    </figure>
                  )}
                  <div className="p-5">
                    <ul className="space-y-1.5">
                      {PROGRAMS.filter((p) => current.byProgram[p] > 0).map((p) => (
                        <li key={p} className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" />
                            {PROGRAM_INFO[p].name}
                          </span>
                          <span className={`tabular-nums ${PROGRAM_STYLE[p].ink}`}>{current.byProgram[p]} live</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={exploreHref(current.slug)} className="btn btn-red">
                        See projects <Arrow />
                      </Link>
                      <Link href={`/cities/${current.slug}`} className="btn btn-ghost text-ink hover:bg-ink hover:text-white">
                        About {current.name}
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>

            <ul className="no-scrollbar mt-6 flex max-h-[19rem] flex-wrap gap-2 overflow-y-auto pr-1" aria-label="Places with live opportunities">
              {visible.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.slug)}
                    onMouseEnter={() => setHighlighted(c.slug)}
                    onMouseLeave={() => setHighlighted(null)}
                    aria-pressed={current?.slug === c.slug}
                    className={`chip transition-colors ${current?.slug === c.slug ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    {c.name} <span className="tabular-nums opacity-80">{countFor(c)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
