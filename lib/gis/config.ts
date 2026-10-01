import "server-only";

/** AIESEC GIS GraphQL endpoint. */
export const GIS_ENDPOINT = process.env.GIS_ENDPOINT || "https://gis-api.aiesec.org/graphql";

/** AIESEC in Poland (member committee). */
export const POLAND_COMMITTEE_ID = 1564;

/**
 * How long (seconds) a GIS response may be served from the Next.js data cache
 * before it is refreshed in the background. Set GIS_REVALIDATE_SECONDS=0 to
 * fetch fresh data on every request — no other code changes are needed.
 */
export const GIS_REVALIDATE_SECONDS = (() => {
  const raw = process.env.GIS_REVALIDATE_SECONDS;
  if (raw === undefined || raw === "") return 300;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 300;
})();

/** Schema shape changes rarely; introspection results are cached for a day. */
export const GIS_SCHEMA_REVALIDATE_SECONDS = 60 * 60 * 24;

/** Cache tag for on-demand invalidation via /api/revalidate. */
export const GIS_CACHE_TAG = "gis";

export const GIS_PAGE_SIZE = 100;
/** Safety cap on pagination so a misbehaving API cannot loop forever. */
export const GIS_MAX_PAGES = 20;
export const GIS_TIMEOUT_MS = 30_000;
/** One retry (with a short backoff) for timeouts, network errors and 5xx. */
export const GIS_RETRIES = 1;

export function getGisToken(): string | undefined {
  const token = process.env.GIS_TOKEN?.trim();
  return token ? token : undefined;
}
