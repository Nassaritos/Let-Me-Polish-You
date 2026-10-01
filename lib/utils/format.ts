/** Deterministic (UTC) formatting so server and client render identical text. */

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLongFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : dateFmt.format(d);
}

export function formatMonth(iso?: string, long = false): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : (long ? monthLongFmt : monthFmt).format(d);
}

/** "2026-03" from an ISO date */
export function monthKey(iso?: string): string | undefined {
  return iso ? iso.slice(0, 7) : undefined;
}

export function monthKeyLabel(key: string): string {
  return formatMonth(`${key}-01T00:00:00Z`) ?? key;
}

export function formatDuration(d?: { min?: number; max?: number; label?: string }, compact = false): string | undefined {
  if (!d) return undefined;
  const { min, max } = d;
  const weeks = (n: number) => (compact ? `${n} wks` : `${n} ${n === 1 ? "week" : "weeks"}`);
  if (min !== undefined && max !== undefined) return min === max ? weeks(min) : `${min}–${max} ${compact ? "wks" : "weeks"}`;
  if (min !== undefined) return `From ${weeks(min)}`;
  if (max !== undefined) return `Up to ${weeks(max)}`;
  if (d.label) return d.label.replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return undefined;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-GB").format(n);
}

export function formatSalary(s?: { amount: number; currency?: string; period?: string }): string | undefined {
  if (!s) return undefined;
  const amount = formatNumber(s.amount);
  const p = s.period?.toLowerCase().replace(/^per\s+/, "").replace(/ly$/, "").trim();
  const period = p ? ` / ${p === "annual" ? "year" : p === "dai" ? "day" : p}` : "";
  return `${amount}${s.currency ? ` ${s.currency}` : ""}${period}`;
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return formatDate(iso) ?? "";
}
