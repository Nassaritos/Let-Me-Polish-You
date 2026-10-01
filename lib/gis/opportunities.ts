import "server-only";
import { cache } from "react";
import { PROGRAMS, PROGRAM_INFO, type Program } from "../programs";
import type { CitySummary, GisResult, Opportunity, OpportunitySummary } from "../types";
import { GisError, gisRequest } from "./client";
import { GIS_MAX_PAGES, GIS_PAGE_SIZE, POLAND_COMMITTEE_ID } from "./config";
import { committeeIds, normalizeOpportunity, toSummary } from "./normalize";
import {
  applyBlocked,
  blockedFilterKeys,
  learnFromErrors,
  renderLiteral,
  renderSelection,
  resolveSchema,
  type Literal,
  type ResolvedSchema,
  type Selection,
} from "./queries";
import { unwrap } from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ------------------------------------------------------------------------ */
/* Query execution with self-healing                                         */
/* ------------------------------------------------------------------------ */

async function run<T>(
  schema: ResolvedSchema,
  rootField: string,
  dataField: string | null,
  build: (selection: Selection) => string,
): Promise<{ data: T; servedAt: string; errors: { message: string }[] }> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const selection = applyBlocked(schema.selection);
    const res = await gisRequest<T>(build(selection));
    const rootPresent = res.data && (res.data as Record<string, unknown>)[rootField] !== undefined;
    if (rootPresent && !res.errors.some((e) => /doesn't exist|not accepted|undefined/i.test(e.message))) {
      return { data: res.data as T, servedAt: res.servedAt, errors: res.errors };
    }
    if (res.errors.length && learnFromErrors(res.errors, rootField, dataField, schema.selection)) continue;
    if (rootPresent) return { data: res.data as T, servedAt: res.servedAt, errors: res.errors };
    throw new GisError("graphql", res.errors.map((e) => e.message).join(" | ") || "Empty GIS response");
  }
  throw new GisError("graphql", "GIS query could not be reconciled with the schema");
}

/* ------------------------------------------------------------------------ */
/* Filters                                                                   */
/* ------------------------------------------------------------------------ */

const COMMITTEE_KEYS = ["committee", "host_committee", "committee_id", "home_committee"];
const PROGRAMME_KEYS = ["programmes", "programme", "programme_ids"];

function listFilters(schema: ResolvedSchema, program: Program | null): Record<string, Literal> | null {
  const fields = schema.list.filterFields;
  const accepts = (k: string) => !blockedFilterKeys.has(k) && (!fields || fields.has(k));
  const asType = (k: string, value: number): Literal => {
    const t = fields?.get(k);
    return t && unwrap(t).isList ? [value] : value;
  };

  const out: Record<string, Literal> = {};
  const committeeKey = COMMITTEE_KEYS.find(accepts);
  // Without a committee filter we would download the whole world. Refuse.
  if (!committeeKey) return null;
  out[committeeKey] = asType(committeeKey, POLAND_COMMITTEE_ID);

  if (program) {
    const key = PROGRAMME_KEYS.find(accepts);
    if (key) out[key] = asType(key, PROGRAM_INFO[program].gisId);
  }

  if (accepts("status")) {
    const t = fields?.get("status");
    const u = t ? unwrap(t) : null;
    if (u?.kind === "ENUM") {
      const open = schema.enums.get(u.name)?.find((v) => v.toLowerCase() === "open");
      if (open) out.status = { enum: open };
    } else {
      out.status = "open";
    }
  }
  return out;
}

/* ------------------------------------------------------------------------ */
/* List                                                                      */
/* ------------------------------------------------------------------------ */

async function fetchListPage(schema: ResolvedSchema, program: Program | null, page: number) {
  const { list } = schema;
  const filters = listFilters(schema, program);
  if (!filters) throw new GisError("graphql", "GIS schema exposes no committee filter");

  const args: string[] = [];
  if (list.filterArg) args.push(`${list.filterArg}: ${renderLiteral(filters)}`);
  if (list.perPageArg) args.push(`${list.perPageArg}: ${GIS_PAGE_SIZE}`);
  if (list.pageArg) args.push(`${list.pageArg}: ${page}`);
  const argStr = args.length ? `(${args.join(", ")})` : "";

  const result = await run<Record<string, any>>(schema, list.field, list.dataField, (sel) => {
    const body = renderSelection(sel);
    const inner = list.dataField
      ? `${list.hasPaging ? "paging { total_items total_pages current_page } " : ""}${list.dataField} { ${body} }`
      : body;
    return `query PolandOpportunities { ${list.field}${argStr} { ${inner} } }`;
  });

  const root = result.data[list.field];
  const items: any[] = list.dataField ? (root?.[list.dataField] ?? []) : Array.isArray(root) ? root : [];
  const totalPages = Number(root?.paging?.total_pages) || 1;
  return { items, totalPages, servedAt: result.servedAt };
}

async function fetchProgram(schema: ResolvedSchema, program: Program | null) {
  const first = await fetchListPage(schema, program, 1);
  const pages = Math.min(first.totalPages, GIS_MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => fetchListPage(schema, program, i + 2)),
  );
  const all = [first, ...rest];
  return {
    items: all.flatMap((p) => p.items),
    servedAt: all.map((p) => p.servedAt).sort()[0],
  };
}

let lastGood: { at: number; data: Opportunity[]; fetchedAt: string } | null = null;
const LAST_GOOD_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function failure<T>(err: unknown): GisResult<T> {
  if (err instanceof GisError && err.kind === "unconfigured") return { ok: false, reason: "unconfigured" };
  return { ok: false, reason: "unavailable" };
}

/**
 * Every currently open opportunity hosted by AIESEC in Poland across iGV,
 * iGTa and iGTe. One cached GIS request per programme (per page); filtering,
 * search and counting happen on the normalized result.
 */
// Concurrent renders in one server process share a single in-flight load.
let inflight: { at: number; promise: Promise<GisResult<Opportunity[]>> } | null = null;
const INFLIGHT_MS = 5_000;

export const getPolandOpportunities = cache((): Promise<GisResult<Opportunity[]>> => {
  if (inflight && Date.now() - inflight.at < INFLIGHT_MS) return inflight.promise;
  const promise = loadPolandOpportunities();
  inflight = { at: Date.now(), promise };
  return promise;
});

async function loadPolandOpportunities(): Promise<GisResult<Opportunity[]>> {
  try {
    const schema = await resolveSchema();
    const canFilterProgram = PROGRAMME_KEYS.some(
      (k) => !blockedFilterKeys.has(k) && (!schema.list.filterFields || schema.list.filterFields.has(k)),
    );
    const groups = canFilterProgram
      ? await Promise.all(PROGRAMS.map(async (p) => ({ program: p as Program | null, ...(await fetchProgram(schema, p)) })))
      : [{ program: null, ...(await fetchProgram(schema, null)) }];

    const now = Date.now();
    const seen = new Set<string>();
    const out: Opportunity[] = [];
    for (const g of groups) {
      for (const raw of g.items) {
        const o = normalizeOpportunity(raw, { program: g.program ?? undefined, now });
        if (!o || seen.has(o.id)) continue;
        // Never surface drafts or removed records, even if the API returns them.
        if (o.status && /draft|removed|deleted|un_?publish/.test(o.status)) continue;
        seen.add(o.id);
        out.push(o);
      }
    }
    out.sort(compareOpportunities);
    const fetchedAt = groups.map((g) => g.servedAt).sort()[0] ?? new Date().toISOString();
    lastGood = { at: Date.now(), data: out, fetchedAt };
    return { ok: true, data: out, fetchedAt };
  } catch (err) {
    if (lastGood && Date.now() - lastGood.at < LAST_GOOD_MAX_AGE_MS && !(err instanceof GisError && err.kind === "unconfigured")) {
      return { ok: true, data: lastGood.data, fetchedAt: lastGood.fetchedAt, stale: true };
    }
    return failure(err);
  }
}

/** Open first, then soonest application deadline, then most openings. */
export function compareOpportunities(a: Opportunity, b: Opportunity): number {
  const rank = { open: 0, full: 1, closed: 2 } as const;
  if (rank[a.availability] !== rank[b.availability]) return rank[a.availability] - rank[b.availability];
  const as = a.dates?.earliestStart ?? "9999";
  const bs = b.dates?.earliestStart ?? "9999";
  if (as !== bs) return as.localeCompare(bs);
  return (b.openings ?? 0) - (a.openings ?? 0);
}

/* ------------------------------------------------------------------------ */
/* Single opportunity                                                        */
/* ------------------------------------------------------------------------ */

export const getOpportunityById = cache(async (id: string): Promise<GisResult<Opportunity | null>> => {
  if (!/^\d{1,12}$/.test(id)) return { ok: true, data: null, fetchedAt: new Date().toISOString() };
  try {
    const schema = await resolveSchema();
    const listResult = await getPolandOpportunities();
    const fromList = listResult.ok ? listResult.data.find((o) => o.id === id) : undefined;

    if (!schema.single) {
      if (!listResult.ok) return listResult;
      return { ok: true, data: fromList ?? null, fetchedAt: listResult.fetchedAt };
    }

    const { field, idArg } = schema.single;
    let result: Awaited<ReturnType<typeof run<Record<string, any>>>>;
    try {
      result = await run<Record<string, any>>(
        schema,
        field,
        null,
        (sel) => `query Opportunity { ${field}(${idArg}: ${id}) { ${renderSelection(sel)} } }`,
      );
    } catch (err) {
      if (err instanceof GisError && /not.?found|couldn't find|does not exist|no record/i.test(err.message)) {
        return { ok: true, data: null, fetchedAt: new Date().toISOString() };
      }
      throw err;
    }

    const raw = result.data[field];
    if (!raw) return { ok: true, data: null, fetchedAt: result.servedAt };

    // Only show opportunities hosted by AIESEC in Poland.
    const committees = committeeIds(raw);
    if (!fromList && committees.length && !committees.includes(POLAND_COMMITTEE_ID)) {
      return { ok: true, data: null, fetchedAt: result.servedAt };
    }

    const opp = normalizeOpportunity(raw, { program: fromList?.program });
    return { ok: true, data: opp, fetchedAt: result.servedAt };
  } catch (err) {
    return failure(err);
  }
});

/* ------------------------------------------------------------------------ */
/* Derived views                                                             */
/* ------------------------------------------------------------------------ */

export async function getOpportunitySummaries(): Promise<GisResult<OpportunitySummary[]>> {
  const res = await getPolandOpportunities();
  if (!res.ok) return res;
  return { ...res, data: res.data.map(toSummary) };
}

export function summarizeCities(opps: Pick<Opportunity, "city" | "citySlug" | "program" | "availability" | "openings" | "coordinates" | "coordinatesApproximate">[]): CitySummary[] {
  const map = new Map<string, CitySummary & { _lat: number; _lng: number; _n: number }>();
  for (const o of opps) {
    if (!o.city || !o.citySlug) continue;
    let c = map.get(o.citySlug);
    if (!c) {
      c = {
        slug: o.citySlug,
        name: o.city,
        total: 0,
        available: 0,
        openings: 0,
        byProgram: { igv: 0, igta: 0, igte: 0 },
        _lat: 0,
        _lng: 0,
        _n: 0,
      };
      map.set(o.citySlug, c);
    }
    c.total++;
    if (o.availability === "open") {
      c.available++;
      c.byProgram[o.program]++;
      c.openings += o.openings ?? 0;
    }
    if (o.coordinates) {
      c._lat += o.coordinates.lat;
      c._lng += o.coordinates.lng;
      c._n++;
    }
  }
  return [...map.values()]
    .map(({ _lat, _lng, _n, ...c }) => ({ ...c, coordinates: _n ? { lat: _lat / _n, lng: _lng / _n } : undefined }))
    .sort((a, b) => b.available - a.available || b.total - a.total || a.name.localeCompare(b.name));
}

export async function getCities(): Promise<GisResult<CitySummary[]>> {
  const res = await getPolandOpportunities();
  if (!res.ok) return res;
  return { ...res, data: summarizeCities(res.data) };
}

export interface Stats {
  available: number;
  openings: number;
  openingsKnown: boolean;
  cities: number;
  byProgram: Record<Program, { available: number; openings: number }>;
}

export function computeStats(opps: Opportunity[] | OpportunitySummary[]): Stats {
  const byProgram: Stats["byProgram"] = {
    igv: { available: 0, openings: 0 },
    igta: { available: 0, openings: 0 },
    igte: { available: 0, openings: 0 },
  };
  const cities = new Set<string>();
  let available = 0;
  let openings = 0;
  let openingsKnown = false;
  for (const o of opps) {
    if (o.availability !== "open") continue;
    available++;
    byProgram[o.program].available++;
    if (o.openings !== undefined) {
      openingsKnown = true;
      openings += o.openings;
      byProgram[o.program].openings += o.openings;
    }
    if (o.citySlug) cities.add(o.citySlug);
  }
  return { available, openings, openingsKnown, cities: cities.size, byProgram };
}
