"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { PROGRAMS, type Program } from "@/lib/programs";
import { PROGRAM_STYLE, placeColor } from "@/lib/program-style";
import { SDG_COLORS, sdgName } from "@/lib/sdg";
import type { OpportunitySummary } from "@/lib/types";
import {
  DURATION_BUCKETS,
  EMPTY_FILTERS,
  activeFilterCount,
  applyFilters,
  filtersToQuery,
  type Filters,
} from "@/lib/filters";
import { monthKeyLabel } from "@/lib/utils/format";
import { OpportunityCard } from "./OpportunityCard";
import { ProgramPills } from "@/components/filters/ProgramPills";
import { PolandMap, type MapPoint } from "@/components/map/PolandMap";

interface Props {
  all: OpportunitySummary[];
  initial: Filters;
  mapBase: React.ReactNode;
}

function Chip({ active, onClick, children, count, color }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number; color?: string }) {
  const disabled = count === 0 && !active;
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`chip shrink-0 transition-all duration-200 ${
        active ? "bg-navy text-white" : disabled ? "bg-mist text-grey/60" : "bg-white text-navy ring-2 ring-inset ring-line hover:ring-navy"
      }`}
    >
      {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />}
      {children}
      {count !== undefined && <span className={`tabular-nums ${active ? "text-white/70" : "text-grey"}`}>{count}</span>}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow mb-2.5 text-grey">{title}</legend>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">{children}</div>
    </fieldset>
  );
}

export function Explorer({ all, initial, mapBase }: Props) {
  const [f, setF] = useState<Filters>(initial);
  const [view, setView] = useState<"cards" | "map">("cards");
  const [sheet, setSheet] = useState(false);
  const [allPlaces, setAllPlaces] = useState(false);
  const deferredQ = useDeferredValue(f.q);
  const filters = useMemo(() => ({ ...f, q: deferredQ }), [f, deferredQ]);
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));
  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: prev[k] === v ? null : v }));

  // Keep the URL shareable without a server round trip.
  useEffect(() => {
    const url = `${window.location.pathname}${filtersToQuery(f)}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [f]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const results = useMemo(() => applyFilters(all, filters), [all, filters]);

  /* ---- facets (each counted with every *other* filter applied) ---- */
  const facet = (skip: keyof Filters) => applyFilters(all, filters, [skip]);
  const programCounts = useMemo(() => {
    const base = facet("program");
    return { all: base.length, ...Object.fromEntries(PROGRAMS.map((p) => [p, base.filter((o) => o.program === p).length])) } as Record<Program | "all", number>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters]);

  const cities = useMemo(() => {
    const base = facet("city");
    const map = new Map<string, { slug: string; name: string; n: number }>();
    for (const o of all) if (o.citySlug && o.city && !map.has(o.citySlug)) map.set(o.citySlug, { slug: o.citySlug, name: o.city, n: 0 });
    for (const o of base) if (o.citySlug) map.get(o.citySlug)!.n++;
    return [...map.values()].filter((c) => c.n > 0 || c.slug === filters.city).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters]);

  const durations = useMemo(() => {
    const base = facet("duration");
    return DURATION_BUCKETS.map((b) => ({ ...b, n: applyFilters(base, { ...EMPTY_FILTERS, includeUnavailable: true, duration: b.id }).length }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters]);

  const months = useMemo(() => {
    const base = facet("start");
    const counts = new Map<string, number>();
    const now = new Date().toISOString().slice(0, 7);
    for (const o of all) for (const m of o.startMonths) if (m >= now && !counts.has(m)) counts.set(m, 0);
    for (const o of base) for (const m of o.startMonths) if (counts.has(m)) counts.set(m, counts.get(m)! + 1);
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(0, 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters]);

  const sdgs = useMemo(() => {
    const base = facet("sdg");
    const goals = [...new Set(all.map((o) => o.sdgGoal).filter((g): g is number => Boolean(g)))].sort((a, b) => a - b);
    return goals.map((g) => ({ g, n: base.filter((o) => o.sdgGoal === g).length }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, filters]);

  const unavailableCount = useMemo(
    () => applyFilters(all, { ...filters, includeUnavailable: true }).filter((o) => o.availability !== "open").length,
    [all, filters],
  );

  const mapPoints: MapPoint[] = useMemo(() => {
    const byPlace = new Map<string, { o: OpportunitySummary; n: number; byProgram: Record<Program, number>; lat: number; lng: number; k: number }>();
    for (const o of results) {
      if (!o.citySlug || !o.coordinates) continue;
      const e = byPlace.get(o.citySlug) ?? { o, n: 0, byProgram: { igv: 0, igta: 0, igte: 0 }, lat: 0, lng: 0, k: 0 };
      e.n++;
      e.byProgram[o.program]++;
      e.lat += o.coordinates.lat;
      e.lng += o.coordinates.lng;
      e.k++;
      byPlace.set(o.citySlug, e);
    }
    return [...byPlace.entries()].map(([slug, e], i) => ({
      id: slug,
      label: e.o.city ?? slug,
      lat: e.lat / e.k,
      lng: e.lng / e.k,
      count: e.n,
      color: placeColor(e.byProgram, filters.program),
      labelled: i < 6,
      description: `${e.n} matching ${e.n === 1 ? "opportunity" : "opportunities"}`,
    }));
  }, [results, filters.program]);

  const activeCount = activeFilterCount(f);
  const reset = () => setF({ ...EMPTY_FILTERS, program: f.program });

  const filterPanel = (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Group title="Where?">
        {(allPlaces ? cities : cities.filter((c, i) => i < 10 || c.slug === f.city)).map((c) => (
          <Chip key={c.slug} active={f.city === c.slug} count={c.n} onClick={() => toggle("city", c.slug)}>
            {c.name}
          </Chip>
        ))}
        {cities.length > 10 && (
          <button type="button" onClick={() => setAllPlaces((v) => !v)} className="chip shrink-0 font-bold text-blue-ink hover:bg-blue-soft" aria-expanded={allPlaces}>
            {allPlaces ? "Fewer places" : `+${cities.length - 10} more`}
          </button>
        )}
      </Group>
      <Group title="How long?">
        {durations.map((d) => (
          <Chip key={d.id} active={f.duration === d.id} count={d.n} onClick={() => toggle("duration", d.id)}>
            {d.label}
          </Chip>
        ))}
      </Group>
      <Group title="When can you start?">
        {months.length ? (
          months.map(([m, n]) => (
            <Chip key={m} active={f.start === m} count={n} onClick={() => toggle("start", m)}>
              {monthKeyLabel(m)}
            </Chip>
          ))
        ) : (
          <p className="text-sm text-grey">Start dates are listed on each opportunity.</p>
        )}
      </Group>
      {sdgs.length > 0 && (
        <Group title="Which Global Goal?">
          {sdgs.map(({ g, n }) => (
            <Chip key={g} active={f.sdg === g} count={n} color={SDG_COLORS[g]} onClick={() => toggle("sdg", g)}>
              SDG {g} · {sdgName(g)}
            </Chip>
          ))}
        </Group>
      )}
    </div>
  );

  return (
    <div className="on-light">
      {/* Toolbar */}
      <div className="sticky top-[4.25rem] z-30 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="frame flex flex-col gap-3 py-3 md:py-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 lg:max-w-md lg:flex-1">
            <label className="relative flex-1">
              <span className="sr-only">Search opportunities</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-grey" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={f.q}
                onChange={(e) => set({ q: e.target.value })}
                placeholder="Search a city, project or skill…"
                className="w-full rounded-full bg-mist py-3 pl-12 pr-4 font-bold text-navy outline-none ring-2 ring-transparent transition placeholder:font-normal placeholder:text-grey focus:bg-white focus:ring-blue-ink md:py-3.5"
              />
            </label>
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="chip h-12 shrink-0 bg-navy !px-4 text-white md:hidden"
              aria-haspopup="dialog"
            >
              Filters{activeCount ? ` · ${activeCount}` : ""}
            </button>
          </div>
          <div className="no-scrollbar -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0">
            <ProgramPills value={f.program} onChange={(v) => set({ program: v })} counts={programCounts} className="!flex-nowrap" />
          </div>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="frame hidden border-b border-line bg-white py-7 md:block">{filterPanel}</div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-navy/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-[71] max-h-[85svh] overflow-y-auto rounded-t-[1.75rem] bg-white px-5 pb-6 pt-3"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />
              <div className="mb-5 flex items-center justify-between">
                <p className="display text-3xl">Filters</p>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="font-bold text-blue-ink">
                    Clear all
                  </button>
                )}
              </div>
              <div className="[&_.no-scrollbar]:flex-wrap">{filterPanel}</div>
              <button type="button" onClick={() => setSheet(false)} className="btn btn-primary sticky bottom-0 mt-6 w-full !py-4">
                Show {results.length} {results.length === 1 ? "result" : "results"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Results */}
      <section aria-label="Results" className="frame bg-mist py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="display text-3xl md:text-4xl" aria-live="polite">
            {results.length} {results.length === 1 ? "opportunity" : "opportunities"}
            {f.city && cities.find((c) => c.slug === f.city) ? ` in ${cities.find((c) => c.slug === f.city)!.name}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {unavailableCount > 0 && (
              <label className="flex cursor-pointer items-center gap-2 font-bold">
                <input
                  type="checkbox"
                  checked={f.includeUnavailable}
                  onChange={(e) => set({ includeUnavailable: e.target.checked })}
                  className="h-5 w-5 accent-[#0560c8]"
                />
                Show full & closed ({unavailableCount})
              </label>
            )}
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="chip bg-white text-blue-ink ring-2 ring-inset ring-line hover:ring-blue-ink">
                Clear filters ✕
              </button>
            )}
            <div role="group" aria-label="View" className="flex rounded-full bg-white p-1 ring-2 ring-inset ring-line">
              {(["cards", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-4 py-1.5 font-display font-bold capitalize transition-colors ${view === v ? "bg-navy text-white" : "text-navy"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-[1.75rem] bg-white p-8 text-center md:p-14">
            <p className="hand text-3xl text-blue-ink">hmm…</p>
            <p className="display mt-2 text-4xl">Nothing matches all of that.</p>
            <p className="mx-auto mt-3 max-w-md text-grey">Try removing a filter or searching for a city or a word like “teaching”.</p>
            <button type="button" onClick={() => setF({ ...EMPTY_FILTERS })} className="btn btn-primary mt-6">
              Show everything
            </button>
          </div>
        ) : view === "map" ? (
          <div className="mt-8 grid gap-8 rounded-[1.75rem] bg-white p-5 md:p-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PolandMap
                base={mapBase}
                points={mapPoints}
                selected={f.city}
                onSelect={(id) => {
                  set({ city: id });
                  setView("cards");
                }}
                title="Map of matching opportunities"
              />
            </div>
            <div className="lg:col-span-4">
              <p className="font-bold text-grey">Tap a place to see its opportunities.</p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
                {mapPoints
                  .sort((a, b) => b.count - a.count)
                  .map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => { set({ city: p.id }); setView("cards"); }} className="chip bg-mist hover:bg-blue-soft">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                        {p.label} <span className="text-grey">{p.count}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <motion.ul layout className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((o) => (
                <motion.li
                  key={o.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <OpportunityCard o={o} hole="#f5f5f5" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-grey">
          {PROGRAMS.map((p) => (
            <span key={p} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" /> {p === "igv" ? "Volunteer" : p === "igta" ? "Intern" : "Teach"}
            </span>
          ))}
          <span>· Applications are made on aiesec.org.</span>
        </p>
      </section>
    </div>
  );
}
