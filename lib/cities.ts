/**
 * City normalization. GIS spells places in many ways ("Warszawa", "Warsaw",
 * "Warszawa UW", "ul. X, 00-950 Warszawa, Poland"). This dictionary maps known
 * spellings to one display name and gives an approximate centre for map
 * placement when an opportunity has no coordinates.
 *
 * This is reference geography, NOT a list of where opportunities exist: which
 * cities appear on the site is decided entirely by live GIS data, and unknown
 * cities pass through with their own name.
 */

interface CityRef {
  name: string;
  aliases: string[];
  center: { lat: number; lng: number };
}

const CITY_REFERENCE: CityRef[] = [
  { name: "Warsaw", aliases: ["warszawa", "warsaw", "varsovie", "warschau"], center: { lat: 52.2297, lng: 21.0122 } },
  { name: "Kraków", aliases: ["krakow", "cracow", "krakau"], center: { lat: 50.0647, lng: 19.945 } },
  { name: "Łódź", aliases: ["lodz"], center: { lat: 51.7592, lng: 19.456 } },
  { name: "Wrocław", aliases: ["wroclaw", "breslau"], center: { lat: 51.1079, lng: 17.0385 } },
  { name: "Poznań", aliases: ["poznan", "posen"], center: { lat: 52.4064, lng: 16.9252 } },
  { name: "Gdańsk", aliases: ["gdansk", "danzig"], center: { lat: 54.352, lng: 18.6466 } },
  { name: "Gdynia", aliases: ["gdynia"], center: { lat: 54.5189, lng: 18.5305 } },
  { name: "Sopot", aliases: ["sopot"], center: { lat: 54.4416, lng: 18.5601 } },
  { name: "Szczecin", aliases: ["szczecin", "stettin"], center: { lat: 53.4285, lng: 14.5528 } },
  { name: "Bydgoszcz", aliases: ["bydgoszcz"], center: { lat: 53.1235, lng: 18.0084 } },
  { name: "Toruń", aliases: ["torun"], center: { lat: 53.0138, lng: 18.5984 } },
  { name: "Lublin", aliases: ["lublin"], center: { lat: 51.2465, lng: 22.5684 } },
  { name: "Białystok", aliases: ["bialystok"], center: { lat: 53.1325, lng: 23.1688 } },
  { name: "Katowice", aliases: ["katowice", "kattowitz"], center: { lat: 50.2649, lng: 19.0238 } },
  { name: "Gliwice", aliases: ["gliwice"], center: { lat: 50.2945, lng: 18.6714 } },
  { name: "Sosnowiec", aliases: ["sosnowiec"], center: { lat: 50.2863, lng: 19.104 } },
  { name: "Bielsko-Biała", aliases: ["bielsko-biala", "bielsko biala"], center: { lat: 49.8224, lng: 19.0584 } },
  { name: "Częstochowa", aliases: ["czestochowa"], center: { lat: 50.8118, lng: 19.1203 } },
  { name: "Rzeszów", aliases: ["rzeszow"], center: { lat: 50.0412, lng: 21.9991 } },
  { name: "Kielce", aliases: ["kielce"], center: { lat: 50.8661, lng: 20.6286 } },
  { name: "Olsztyn", aliases: ["olsztyn"], center: { lat: 53.7784, lng: 20.4801 } },
  { name: "Opole", aliases: ["opole"], center: { lat: 50.6751, lng: 17.9213 } },
  { name: "Radom", aliases: ["radom"], center: { lat: 51.4027, lng: 21.1471 } },
  { name: "Zielona Góra", aliases: ["zielona gora"], center: { lat: 51.9356, lng: 15.5062 } },
  { name: "Gorzów Wielkopolski", aliases: ["gorzow wielkopolski", "gorzow"], center: { lat: 52.7368, lng: 15.2288 } },
  { name: "Zakopane", aliases: ["zakopane"], center: { lat: 49.2992, lng: 19.9496 } },
  { name: "Płock", aliases: ["plock"], center: { lat: 52.5463, lng: 19.7065 } },
  { name: "Elbląg", aliases: ["elblag"], center: { lat: 54.1561, lng: 19.4045 } },
  { name: "Koszalin", aliases: ["koszalin"], center: { lat: 54.1943, lng: 16.1715 } },
  { name: "Tarnów", aliases: ["tarnow"], center: { lat: 50.0121, lng: 20.9858 } },
];

export function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");
}

export function slugify(s: string): string {
  return stripDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function key(s: string) {
  return stripDiacritics(s).toLowerCase().replace(/\s+/g, " ").trim();
}

function matchReference(text: string): CityRef | undefined {
  const k = key(text);
  if (!k) return undefined;
  // Whole-token match: "warszawa uw" → Warsaw, but "lublinianka" must not → Lublin.
  return CITY_REFERENCE.find((c) =>
    [key(c.name), ...c.aliases].some((a) => k === a || k.startsWith(`${a} `) || k.endsWith(` ${a}`) || k.includes(` ${a} `)),
  );
}

/** "Poland" in the languages GIS users actually type it in. */
const NON_CITY = /^(poland|polska|polen|pologne|polonia|polónia|polonya|pl|rp|польша|польща|polsko|波兰|ポーランド|بولندا)$/iu;
/** Voivodeship / county words: "Śląskie", "woj. mazowieckie", "powiat …" */
const REGION = /(^|\s)(woj\.?|województwo|powiat|gmina)(\s|$)|(skie|ckie|dzkie)$/i;

function cleanToken(t: string): string {
  return t
    .replace(/\b\d{2}-\d{3}\b/g, "") // postal code
    .replace(/\b(ul|al|pl|os)\.\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeCity(t: string): boolean {
  return (
    /^[\p{L}][\p{L}\s.'-]{1,40}$/u.test(t) && !NON_CITY.test(t) && !REGION.test(stripDiacritics(t)) && t.split(" ").length <= 3
  );
}

/** Keep GIS casing unless it is SHOUTING or all lower-case. */
function displayCase(s: string) {
  if (s !== s.toUpperCase() && s !== s.toLowerCase()) return s;
  return s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());
}

/**
 * Pick the most plausible city/town for an opportunity.
 * Order: role city → the opportunity's own location → (only if nothing else)
 * the host committee's name, which is an AIESEC office, not the project site.
 * Returns undefined rather than guessing.
 */
export function resolveCity(sources: { cityName?: string; roleCity?: string; location?: string; hostLc?: string }): string | undefined {
  for (const direct of [sources.cityName, sources.roleCity]) {
    const t = direct && cleanToken(direct);
    if (t) return matchReference(t)?.name ?? (looksLikeCity(t) ? displayCase(t) : undefined);
  }

  const tokens = (sources.location ?? "")
    .split(/[,\n]/)
    .map(cleanToken)
    .filter(Boolean)
    .reverse(); // "street, 00-000 Town, Region, Country" → most specific place sits second from the end
  for (const t of tokens) {
    const ref = matchReference(t);
    if (ref) return ref.name;
    if (looksLikeCity(t)) return displayCase(t);
  }

  const lc = sources.hostLc && cleanToken(sources.hostLc.replace(/\(.*?\)/g, ""));
  return lc ? matchReference(lc)?.name : undefined;
}

export function cityCenter(name: string): { lat: number; lng: number } | undefined {
  return matchReference(name)?.center;
}

/** Rough bounding box of Poland, used to keep stray coordinates off the map. */
export const POLAND_BOUNDS = { minLat: 48.9, maxLat: 55.0, minLng: 14.0, maxLng: 24.2 };

export function inPoland(c?: { lat: number; lng: number }): boolean {
  return Boolean(
    c &&
      c.lat >= POLAND_BOUNDS.minLat &&
      c.lat <= POLAND_BOUNDS.maxLat &&
      c.lng >= POLAND_BOUNDS.minLng &&
      c.lng <= POLAND_BOUNDS.maxLng,
  );
}

const BIG_CITIES = ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok", "Katowice"];

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Nearest large city (straight-line distance) — a real, computed fact for small towns. */
export function nearestBigCity(c: { lat: number; lng: number }, exclude?: string): { name: string; km: number } | undefined {
  let best: { name: string; km: number } | undefined;
  for (const name of BIG_CITIES) {
    if (name === exclude) continue;
    const center = cityCenter(name);
    if (!center) continue;
    const km = haversineKm(c, center);
    if (!best || km < best.km) best = { name, km: Math.round(km) };
  }
  return best;
}
