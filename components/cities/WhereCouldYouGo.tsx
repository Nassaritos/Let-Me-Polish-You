"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { PROGRAM_STYLE, placeColor } from "@/lib/program-style";
import { cityPhoto } from "@/lib/images";
import type { CitySummary } from "@/lib/types";
import { PolandMap, type MapPoint } from "@/components/map/PolandMap";
import { ProgramPills } from "@/components/filters/ProgramPills";
import { Rosette } from "@/components/brand/Rosette";
import { Arrow } from "@/components/ui/Arrow";

export function WhereCouldYouGo({ base, places }: { base: React.ReactNode; places: CitySummary[] }) {
  const [program, setProgram] = useState<Program | "all">("all");
  const countFor = (c: CitySummary) => (program === "all" ? c.available : c.byProgram[program]);

  const visible = useMemo(
    () =>
      places
        .filter((c) => countFor(c) > 0)
        .sort((a, b) => countFor(b) - countFor(a) || a.name.localeCompare(b.name)),
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
      color: placeColor(c.byProgram, program),
      labelled: i < 5,
      description: `${countFor(c)} live ${countFor(c) === 1 ? "opportunity" : "opportunities"}`,
    }));

  const photo = cityPhoto(current?.slug);
  const exploreHref = (slug: string) => `/opportunities?city=${slug}${program !== "all" ? `&program=${program}` : ""}`;

  return (
    <section id="places" aria-labelledby="places-title" className="relative overflow-hidden bg-navy py-24 text-white md:py-32">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-yellow">Big cities. Small towns.</p>
          <h2 id="places-title" className="display mt-3 text-[clamp(2.8rem,7vw,6.8rem)]">
            Where could <span className="text-yellow">you</span> go?
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-[1.1rem] leading-relaxed text-white/80">
            Every dot is a place with live projects right now — {placeCount} {placeCount === 1 ? "place" : "places"} today. Tap one
            to see what&apos;s there.
          </p>
          <ProgramPills value={program} onChange={(v) => { setProgram(v); setSelected(null); }} counts={counts} tone="dark" className="mt-5" />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="frame mt-12 text-lg text-white/80">No live projects for this program right now — try another one.</p>
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
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {PROGRAMS.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" /> {PROGRAM_INFO[p].code}
                </span>
              ))}
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow" aria-hidden="true" /> mixed
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
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-[1.75rem] bg-white text-navy"
                  aria-live="polite"
                >
                  <div className="relative h-44 overflow-hidden bg-blue">
                    {photo ? (
                      <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="480px" className="object-cover" style={{ objectPosition: photo.position }} />
                    ) : (
                      <Rosette color="#1b8cf6" hole="#037ef3" className="absolute -right-10 -top-16 h-72 w-72" />
                    )}
                    <p className="display absolute bottom-4 left-5 text-4xl text-white drop-shadow-[0_2px_12px_rgba(10,31,68,0.6)]">{current.name}</p>
                  </div>
                  <div className="p-5">
                    <dl className="grid grid-cols-3 gap-3">
                      {PROGRAMS.map((p) => (
                        <div key={p} className={`rounded-xl p-3 ${PROGRAM_STYLE[p].soft}`}>
                          <dt className="eyebrow">{PROGRAM_INFO[p].code}</dt>
                          <dd className="display mt-1 text-3xl tabular-nums">{current.byProgram[p]}</dd>
                        </div>
                      ))}
                    </dl>
                    {current.openings > 0 && (
                      <p className="mt-3 font-bold text-grey">
                        {current.openings} open {current.openings === 1 ? "spot" : "spots"} right now
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={exploreHref(current.slug)} className="btn btn-primary">
                        See projects <Arrow />
                      </Link>
                      <Link href={`/cities/${current.slug}`} className="btn btn-ghost text-navy hover:bg-navy hover:text-white">
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
                    className={`chip transition-colors ${current?.slug === c.slug ? "bg-yellow text-navy" : "bg-white/10 text-white hover:bg-white/20"}`}
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
