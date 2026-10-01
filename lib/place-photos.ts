import "server-only";
import { cityPhoto, PHOTOS, type Photo } from "./images";
import { slugify } from "./cities";

/**
 * A photo for every place on the map — including towns that only appear when
 * GIS gets a new project there. Order of preference:
 *  1. our curated photo (lib/images.ts),
 *  2. the town's own image on Wikidata (property P18 — always a freely
 *     licensed Wikimedia Commons file), shown with its credit,
 *  3. a clearly labelled illustrative photo of Poland.
 * Lookups are batched (one Wikidata query + one Commons query for all
 * places) and cached for 30 days.
 */

export interface PlacePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  position?: string;
  /** Shown under the photo when the image isn't one of our curated ones */
  credit?: { author: string; license: string; licenseUrl?: string; source: string };
  illustrative?: boolean;
}

const UA = "LetMePolishYou/1.0 (AIESEC in Poland campaign site; https://aiesec.pl)";
const CACHE: RequestInit = { next: { revalidate: 60 * 60 * 24 * 30, tags: ["place-photos"] } };
const MAX_DISTANCE_KM = 15;
const FREE_LICENSE = /^(cc0|cc[ -]by(-sa)?( \d(\.\d)?)?.*|public domain|pd.*)$/i;

function fromLocal(p: Photo): PlacePhoto {
  return { src: p.src.src, width: p.src.width, height: p.src.height, alt: p.alt, position: p.position };
}

const FALLBACK: PlacePhoto = { ...fromLocal(PHOTOS.masuria), illustrative: true };

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  return Math.hypot(a.lat - b.lat, (a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180)) * 111;
}

const strip = (html?: string) => (html ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function wikidataImages(places: { name: string; lat: number; lng: number }[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!places.length) return out;
  const values = places.flatMap((p) => [`${JSON.stringify(p.name)}@pl`, `${JSON.stringify(p.name)}@en`]).join(" ");
  const query = `SELECT ?name ?image ?coord WHERE {
    VALUES ?name { ${values} }
    ?item rdfs:label ?name ; wdt:P17 wd:Q36 ; wdt:P18 ?image ; wdt:P625 ?coord ; wdt:P31/wdt:P279* wd:Q486972 .
  }`;
  const res = await fetch(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": UA, Accept: "application/sparql-results+json" },
    signal: AbortSignal.timeout(20_000),
    ...CACHE,
  });
  if (!res.ok) return out;
  const rows: { name: { value: string }; image: { value: string }; coord: { value: string } }[] = (await res.json()).results?.bindings ?? [];
  const best = new Map<string, { file: string; d: number }>();
  for (const r of rows) {
    const place = places.find((p) => p.name === r.name.value);
    const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.coord.value);
    if (!place || !m) continue;
    const d = km(place, { lat: Number(m[2]), lng: Number(m[1]) });
    if (d > MAX_DISTANCE_KM) continue;
    const prev = best.get(place.name);
    if (!prev || d < prev.d) best.set(place.name, { file: decodeURIComponent(r.image.value.split("/").pop() ?? ""), d });
  }
  for (const [name, v] of best) out.set(name, v.file);
  return out;
}

async function commonsInfo(files: string[]): Promise<Map<string, PlacePhoto>> {
  const out = new Map<string, PlacePhoto>();
  for (let i = 0; i < files.length; i += 40) {
    const batch = files.slice(i, i + 40);
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=960&titles=" +
      encodeURIComponent(batch.map((f) => `File:${f}`).join("|"));
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20_000), ...CACHE });
    if (!res.ok) continue;
    const json = await res.json();
    const normalized: Record<string, string> = Object.fromEntries((json.query?.normalized ?? []).map((n: { from: string; to: string }) => [n.to, n.from]));
    for (const page of Object.values(json.query?.pages ?? {}) as { title: string; imageinfo?: Record<string, unknown>[] }[]) {
      const ii = page.imageinfo?.[0] as
        | { thumburl?: string; thumbwidth?: number; thumbheight?: number; descriptionurl?: string; extmetadata?: Record<string, { value?: string }> }
        | undefined;
      if (!ii?.thumburl) continue;
      const meta = ii.extmetadata ?? {};
      const license = strip(meta.LicenseShortName?.value);
      if (!FREE_LICENSE.test(license)) continue;
      const original = (normalized[page.title] ?? page.title).replace(/^File:/, "");
      out.set(original, {
        src: ii.thumburl.split("?")[0],
        width: ii.thumbwidth ?? 960,
        height: ii.thumbheight ?? 640,
        alt: strip(meta.ImageDescription?.value).slice(0, 140) || original.replace(/\.[a-z]+$/i, "").replace(/_/g, " "),
        credit: {
          author: strip(meta.Artist?.value).slice(0, 80) || "Wikimedia Commons contributor",
          license,
          licenseUrl: meta.LicenseUrl?.value,
          source: ii.descriptionurl ?? "https://commons.wikimedia.org",
        },
      });
    }
  }
  return out;
}

/** Photos for a set of places, keyed by place slug. Never throws. */
export async function getPlacePhotos(places: { name: string; slug?: string; coordinates?: { lat: number; lng: number } }[]): Promise<Record<string, PlacePhoto>> {
  const result: Record<string, PlacePhoto> = {};
  const lookup: { name: string; slug: string; lat: number; lng: number }[] = [];
  for (const p of places) {
    const slug = p.slug ?? slugify(p.name);
    const local = cityPhoto(slug);
    if (local) result[slug] = fromLocal(local);
    else if (p.coordinates) lookup.push({ name: p.name, slug, ...p.coordinates });
    else result[slug] = FALLBACK;
  }
  if (lookup.length) {
    try {
      const files = await wikidataImages(lookup);
      const infos = await commonsInfo([...new Set(files.values())]);
      for (const p of lookup) {
        const file = files.get(p.name);
        const info = file ? infos.get(file) : undefined;
        result[p.slug] = info ? { ...info, alt: `${p.name}, Poland — ${info.alt}` } : FALLBACK;
      }
    } catch {
      for (const p of lookup) result[p.slug] ??= FALLBACK;
    }
  }
  return result;
}

export async function getPlacePhoto(place: { name: string; slug?: string; coordinates?: { lat: number; lng: number } }): Promise<PlacePhoto> {
  const slug = place.slug ?? slugify(place.name);
  return (await getPlacePhotos([place]))[slug] ?? FALLBACK;
}
