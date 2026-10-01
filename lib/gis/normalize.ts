import "server-only";
import { aiesecOpportunityUrl, programFromGis, type Program } from "../programs";
import { cityCenter, inPoland, resolveCity, slugify } from "../cities";
import type { Availability, Logistics, LogisticsItem, Opportunity, OpportunitySummary, SkillLike, Slot, WeekPlan } from "../types";
import { reflow, toPlainText } from "../utils/text";

/*
 * Raw GIS → Opportunity. Rules learned from the live API (Oct 2026):
 * - iGV titles carry the duration: "Global Classroom [6 weeks]".
 * - Top-level dates are often null; real dates, openings and close dates live
 *   in `available_slots` (status "live" / "inactive").
 * - Logistics use snake_case strings: "covered" / "not_covered", "provided" / "not_provided".
 * - sdg_target.target_index is a number (4 + 8 → target "4.8"); `target` holds the UN text.
 * - host_lc is the AIESEC committee, not the project site — use `location` for the town.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any>;

const str = (v: unknown): string | undefined => {
  if (typeof v === "string") {
    const t = v.replace(/\s+/g, " ").trim();
    return t ? t : undefined;
  }
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return undefined;
};

const num = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const isoDate = (v: unknown): string | undefined => {
  const s = str(v);
  if (!s) return undefined;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00Z` : s);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

const obj = (v: unknown): Raw | undefined => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : undefined);
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);

/** End of the given day (UTC): a close date of "2026-10-01" is still open on Oct 1. */
const endOfDay = (iso: string) => new Date(iso).getTime() + 86_400_000 - 1;

const OPEN_SLOT = /^(live|open|active|published)$/;

/* ------------------------------------------------------------------------ */

function yesNo(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  const s = str(v)?.toLowerCase().replace(/[_-]+/g, " ");
  if (!s) return undefined;
  if (/\bnot\b|\bno\b|none|false/.test(s)) return false;
  if (/covered|provided|yes|true|included/.test(s)) return true;
  return undefined;
}

function logisticsItem(provided: unknown, covered: unknown): LogisticsItem | undefined {
  const item = { provided: yesNo(provided), covered: yesNo(covered) };
  return item.provided === undefined && item.covered === undefined ? undefined : item;
}

function skillList(v: unknown): SkillLike[] | undefined {
  const out: SkillLike[] = [];
  const seen = new Set<string>();
  for (const item of arr(v)) {
    const o = obj(item);
    const name = str(o?.constant_name) ?? str(o?.name) ?? str(item);
    // GIS mixes study levels into skills ("High School", "Bachelor" with no option) — skip those.
    if (!name || seen.has(name.toLowerCase()) || (o && o.option === null && o.level === 0)) continue;
    seen.add(name.toLowerCase());
    out.push({ name, option: str(o?.option)?.toLowerCase(), level: num(o?.level) });
  }
  return out.length ? out : undefined;
}

function learningPoints(roleInfo?: Raw): string[] | undefined {
  const list = arr(roleInfo?.learning_points_list).map((x) => toPlainText(x)).filter(Boolean);
  const source = reflow(list.length ? list.join("\n") : toPlainText(roleInfo?.learning_points));
  const paras = source
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 1);
  return paras.length ? paras : undefined;
}

function weeklyPlan(v: unknown): WeekPlan[] | undefined {
  const byWeek = new Map<number, string[]>();
  for (const item of arr(v)) {
    const o = obj(item);
    const text = str(o?.activity) ?? str(o?.title) ?? str(o?.description);
    if (!text) continue;
    const week = num(o?.week) ?? 1;
    const list = byWeek.get(week) ?? [];
    if (!list.includes(text)) list.push(text);
    byWeek.set(week, list);
  }
  const out = [...byWeek.entries()].sort((a, b) => a[0] - b[0]).map(([week, activities]) => ({ week, activities }));
  return out.length ? out : undefined;
}

/** "Global Classroom [6 weeks]" → { name: "Global Classroom", weeks: 6 } */
function splitTitle(title?: string): { name?: string; weeks?: number } {
  if (!title) return {};
  const m = /\s*[[(]\s*(\d{1,3})\s*weeks?\s*[\])]\s*$/i.exec(title);
  return m ? { name: title.slice(0, m.index).trim(), weeks: Number(m[1]) } : { name: title };
}

/* ------------------------------------------------------------------------ */

export function computeAvailability(
  o: { status?: string; openings?: number; applicationClose?: string; latestEnd?: string; slots?: Slot[] },
  now = Date.now(),
): Availability {
  const status = o.status?.toLowerCase();
  if (status && !/^(open|live|published)$/.test(status)) return "closed";
  if (o.latestEnd && endOfDay(o.latestEnd) < now) return "closed";

  if (o.slots?.length) {
    const live = o.slots.filter((s) => !s.status || OPEN_SLOT.test(s.status));
    const accepting = live.filter((s) => !s.closes || endOfDay(s.closes) >= now);
    if (!accepting.length) return "closed";
    if (accepting.every((s) => s.openings !== undefined && s.openings <= 0)) return "full";
    return "open";
  }

  if (o.applicationClose && endOfDay(o.applicationClose) < now) return "closed";
  if (o.openings !== undefined && o.openings <= 0) return "full";
  return "open";
}

export interface NormalizeContext {
  /** Programme known from the query filter, when fetched per-programme. */
  program?: Program;
  now?: number;
}

export function normalizeOpportunity(raw: Raw, ctx: NormalizeContext = {}): Opportunity | null {
  const id = str(raw.id);
  if (!id) return null;
  const now = ctx.now ?? Date.now();

  const programmeObj = obj(raw.programme) ?? obj(arr(raw.programmes)[0]);
  const program =
    ctx.program ??
    programFromGis({ id: programmeObj?.id, short: programmeObj?.short_name_display ?? programmeObj?.short_name });
  if (!program) return null;

  /* --- place --------------------------------------------------------- */
  const hostLcObj = obj(raw.host_lc);
  const cityObj = obj(raw.city);
  const location = str(raw.location);
  const city = resolveCity({
    cityName: str(cityObj?.name),
    roleCity: str(obj(raw.role_info)?.city),
    location,
    hostLc: str(hostLcObj?.name),
  });

  const pick = (lat: unknown, lng: unknown) => {
    const a = num(lat);
    const b = num(lng);
    const c = a !== undefined && b !== undefined ? { lat: a, lng: b } : undefined;
    return inPoland(c) ? c : undefined;
  };
  let coordinates = pick(raw.lat, raw.lng) ?? pick(cityObj?.lat, cityObj?.lng);
  let coordinatesApproximate = false;
  if (!coordinates && city) {
    coordinates = cityCenter(city);
    coordinatesApproximate = Boolean(coordinates);
  }

  /* --- slots → dates, openings, availability ------------------------- */
  const slots: Slot[] = arr(raw.available_slots)
    .map((s): Slot | null => {
      const o = obj(s);
      if (!o) return null;
      return {
        id: str(o.id),
        start: isoDate(o.start_date),
        end: isoDate(o.end_date),
        openings: num(o.available_openings) ?? num(o.openings),
        closes: isoDate(o.applications_close_date),
        status: str(o.status)?.toLowerCase(),
      };
    })
    .filter((s): s is Slot => Boolean(s && (s.start || s.end)))
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

  const acceptingSlots = slots.filter(
    (s) => (!s.status || OPEN_SLOT.test(s.status)) && (!s.closes || endOfDay(s.closes) >= now),
  );
  const shownSlots = acceptingSlots.length ? acceptingSlots : slots;

  let openings: number | undefined;
  if (slots.length) {
    openings = acceptingSlots.every((s) => s.openings !== undefined)
      ? acceptingSlots.reduce((sum, s) => sum + (s.openings ?? 0), 0)
      : undefined;
  } else {
    openings = num(raw.available_openings);
  }

  const minIso = (xs: (string | undefined)[]) => xs.filter(Boolean).sort()[0] as string | undefined;
  const maxIso = (xs: (string | undefined)[]) => xs.filter(Boolean).sort().at(-1) as string | undefined;

  const earliestStart = minIso(shownSlots.map((s) => s.start)) ?? isoDate(raw.earliest_start_date);
  const latestEnd = maxIso(slots.map((s) => s.end)) ?? isoDate(raw.latest_end_date);
  const upcomingCloses = acceptingSlots.map((s) => s.closes).filter((c): c is string => Boolean(c));
  const applicationClose = minIso(upcomingCloses) ?? isoDate(raw.applications_close_date);

  const status = str(raw.status)?.toLowerCase();

  /* --- duration ------------------------------------------------------ */
  const { name: cleanTitle, weeks: titleWeeks } = splitTitle(str(raw.title));
  const durationType = obj(raw.opportunity_duration_type);
  const slotWeeks = [
    ...new Set(
      shownSlots
        .filter((s) => s.start && s.end)
        .map((s) => Math.round((new Date(s.end!).getTime() - new Date(s.start!).getTime()) / (7 * 86_400_000))),
    ),
  ];
  const exactWeeks = titleWeeks ?? num(raw.duration) ?? (slotWeeks.length === 1 ? slotWeeks[0] : undefined);
  const typeLabel = str(durationType?.duration_type);
  const duration =
    exactWeeks !== undefined
      ? { min: exactWeeks, max: exactWeeks, label: typeLabel }
      : num(durationType?.duration_min) !== undefined || num(durationType?.duration_max) !== undefined
        ? { min: num(durationType?.duration_min), max: num(durationType?.duration_max), label: typeLabel }
        : typeLabel
          ? { label: typeLabel }
          : undefined;

  /* --- impact -------------------------------------------------------- */
  const sdgTarget = obj(obj(raw.sdg_info)?.sdg_target);
  const goal = num(sdgTarget?.goal_index);
  const targetIndex = num(sdgTarget?.target_index);
  const sdg =
    goal && goal >= 1 && goal <= 17
      ? {
          goal,
          target: targetIndex !== undefined ? `${goal}.${targetIndex}` : undefined,
          description: str(sdgTarget?.target) ?? str(sdgTarget?.description),
        }
      : undefined;

  /* --- logistics & pay ----------------------------------------------- */
  const li = obj(raw.logistics_info);
  const meals = num(li?.no_of_meals);
  const food = li ? logisticsItem(li.food_provided, li.food_covered) : undefined;
  const logistics: Logistics | undefined = li
    ? {
        accommodation: logisticsItem(li.accommodation_provided, li.accommodation_covered),
        food: food || (meals && meals > 0) ? { ...food, meals: meals && meals > 0 ? meals : undefined } : undefined,
        transportation: logisticsItem(li.transportation_provided, li.transportation_covered),
        computer: logisticsItem(li.computer_provided, undefined),
      }
    : undefined;

  const specifics = obj(raw.specifics_info);
  const salaryAmount = num(specifics?.salary);
  const salary =
    salaryAmount && salaryAmount > 0
      ? {
          amount: salaryAmount,
          currency: str(obj(specifics?.salary_currency)?.alphabetic_code),
          period: str(specifics?.salary_periodicity),
        }
      : undefined;

  /* --- people & text ------------------------------------------------- */
  const organisation =
    str(obj(raw.organisation)?.name) ?? str(obj(obj(raw.branch)?.company)?.name);
  const projectTitle = splitTitle(str(obj(raw.project)?.title) ?? str(raw.project_name) ?? str(obj(raw.sub_product)?.name)).name;
  const project = program === "igv" ? projectTitle ?? cleanTitle : projectTitle;

  const description = reflow(toPlainText(raw.description)) || undefined;
  const projectDescriptionRaw = reflow(toPlainText(raw.project_description)) || undefined;

  return {
    id,
    title: cleanTitle ?? project ?? "AIESEC opportunity",
    program,
    project,
    city,
    citySlug: city ? slugify(city) : undefined,
    location,
    coordinates,
    coordinatesApproximate,
    organisation,
    hostLc: str(hostLcObj?.full_name) ?? str(hostLcObj?.name)?.replace(/\s*\(closed\)/i, ""),
    description,
    projectDescription: projectDescriptionRaw && projectDescriptionRaw !== description ? projectDescriptionRaw : undefined,
    duration,
    openings,
    applicants: num(raw.applicants_count),
    status,
    availability: computeAvailability({ status, openings, applicationClose, latestEnd, slots }, now),
    dates: {
      opened: isoDate(raw.date_opened) ?? isoDate(raw.created_at),
      earliestStart,
      latestEnd,
      applicationClose,
      updated: isoDate(raw.updated_at),
    },
    sdg,
    logistics,
    salary,
    languages: skillList(raw.languages),
    skills: skillList(raw.skills),
    backgrounds: skillList(raw.backgrounds),
    learningPoints: learningPoints(obj(raw.role_info)),
    weeklyPlan: weeklyPlan(raw.weekly_activities),
    slots: slots.length ? slots : undefined,
    aiesecUrl: aiesecOpportunityUrl(program, id),
  };
}

/** Committee ids GIS reports for this opportunity (used to confirm it is hosted in Poland). */
export function committeeIds(raw: Raw): number[] {
  return [num(obj(raw.home_mc)?.id), num(obj(obj(raw.host_lc)?.parent)?.id)].filter(
    (x): x is number => x !== undefined,
  );
}

export function included(item?: LogisticsItem): boolean {
  return Boolean(item && (item.provided || item.covered));
}

export function toSummary(o: Opportunity): OpportunitySummary {
  const excerptSource = o.description ?? o.projectDescription ?? o.learningPoints?.[0];
  const excerpt = excerptSource ? excerptSource.split(/\n+/)[0].slice(0, 220) : undefined;
  const names = (l?: SkillLike[]) => (l ?? []).map((s) => s.name);
  return {
    id: o.id,
    title: o.title,
    program: o.program,
    project: o.project,
    city: o.city,
    citySlug: o.citySlug,
    coordinates: o.coordinates,
    organisation: o.organisation,
    excerpt,
    durationWeeks: o.duration,
    openings: o.openings,
    availability: o.availability,
    earliestStart: o.dates?.earliestStart,
    latestEnd: o.dates?.latestEnd,
    applicationClose: o.dates?.applicationClose,
    startMonths: [
      ...new Set(
        (o.slots?.length ? o.slots.map((s) => s.start) : [o.dates?.earliestStart]).filter(Boolean).map((d) => d!.slice(0, 7)),
      ),
    ],
    sdgGoal: o.sdg?.goal,
    logistics: o.logistics,
    salary: o.salary,
    languages: names(o.languages),
    skills: names(o.skills),
    backgrounds: names(o.backgrounds),
    search: [
      o.title,
      o.project,
      o.city,
      o.location,
      o.organisation,
      excerpt,
      o.sdg?.description,
      ...names(o.skills),
      ...names(o.backgrounds),
      ...names(o.languages),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l"),
  };
}
