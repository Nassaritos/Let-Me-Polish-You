import "server-only";
import {
  GIS_RETRIES,
  GIS_CACHE_TAG,
  GIS_ENDPOINT,
  GIS_REVALIDATE_SECONDS,
  GIS_TIMEOUT_MS,
  getGisToken,
} from "./config";

/**
 * Minimal server-side GraphQL client for AIESEC GIS.
 *
 * - The token is read from process.env on the server only (this module
 *   imports "server-only", so bundling it into a Client Component fails the build).
 * - Responses are stored in the Next.js data cache for GIS_REVALIDATE_SECONDS
 *   and refreshed in the background. Only HTTP 200 responses are cached, so a
 *   GIS outage keeps serving the last good response where one exists.
 */

export type GisErrorKind = "unconfigured" | "unauthorized" | "network" | "http" | "graphql";

export class GisError extends Error {
  constructor(
    public readonly kind: GisErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "GisError";
  }
}

export interface GraphQLErrorShape {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface GisResponse<T> {
  data: T | null;
  errors: GraphQLErrorShape[];
  /** When GIS produced this response (the HTTP Date header survives caching). */
  servedAt: string;
}

interface RequestOptions {
  /** Seconds; 0 disables caching for this request. */
  revalidate?: number;
  tags?: string[];
}

// GIS has accepted the token both as an Authorization header and as an
// `access_token` query parameter. Prefer the header; fall back once if refused.
let authMode: "header" | "query" = "header";

function redact(text: string): string {
  const token = getGisToken();
  let out = text.replace(/access_token=[^&\s"]+/gi, "access_token=[redacted]");
  if (token) out = out.split(token).join("[redacted]");
  return out;
}

function log(kind: GisErrorKind, detail: string) {
  console.error(`[gis] ${kind}: ${redact(detail).slice(0, 500)}`);
}

async function send(query: string, token: string, mode: "header" | "query", opts: RequestOptions) {
  const revalidate = opts.revalidate ?? GIS_REVALIDATE_SECONDS;
  const url = mode === "query" ? `${GIS_ENDPOINT}?access_token=${encodeURIComponent(token)}` : GIS_ENDPOINT;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (mode === "header") headers.Authorization = token;

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(GIS_TIMEOUT_MS),
    ...(revalidate > 0
      ? { cache: "force-cache" as const, next: { revalidate, tags: [GIS_CACHE_TAG, ...(opts.tags ?? [])] } }
      : { cache: "no-store" as const }),
  });
}

async function sendWithRetry(query: string, token: string, mode: "header" | "query", opts: RequestOptions): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= GIS_RETRIES; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 800 * attempt));
    try {
      const res = await send(query, token, mode, opts);
      if (res.status < 500 || attempt === GIS_RETRIES) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export async function gisRequest<T>(query: string, opts: RequestOptions = {}): Promise<GisResponse<T>> {
  const token = getGisToken();
  if (!token) throw new GisError("unconfigured", "GIS_TOKEN is not set");

  let res: Response;
  try {
    res = await sendWithRetry(query, token, authMode, opts);
    if ((res.status === 401 || res.status === 402 || res.status === 403) && authMode === "header") {
      const retry = await send(query, token, "query", opts);
      if (retry.ok) authMode = "query";
      res = retry;
    }
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : "request failed";
    log("network", message);
    throw new GisError("network", "GIS request failed");
  }

  if (res.status === 401 || res.status === 402 || res.status === 403) {
    log("unauthorized", `HTTP ${res.status}`);
    throw new GisError("unauthorized", "GIS rejected the access token");
  }
  if (!res.ok) {
    log("http", `HTTP ${res.status}`);
    throw new GisError("http", `GIS responded with HTTP ${res.status}`);
  }

  let body: { data?: T | null; errors?: GraphQLErrorShape[] };
  try {
    body = await res.json();
  } catch {
    log("http", "invalid JSON body");
    throw new GisError("http", "GIS returned an unreadable response");
  }

  const errors = Array.isArray(body.errors) ? body.errors : [];
  if (errors.length && !body.data) {
    log("graphql", errors.map((e) => e.message).join(" | "));
  }
  const date = new Date(res.headers.get("date") ?? Date.now());
  const servedAt = (Number.isNaN(date.getTime()) ? new Date() : date).toISOString();
  return { data: body.data ?? null, errors, servedAt };
}
