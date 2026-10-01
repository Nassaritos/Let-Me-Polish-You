#!/usr/bin/env node
/**
 * Smoke test against live GIS: counts open opportunities hosted by AIESEC in
 * Poland per programme and reports how complete key fields are.
 *   npm run gis:check
 */
const ENDPOINT = process.env.GIS_ENDPOINT || "https://gis-api.aiesec.org/graphql";
const TOKEN = process.env.GIS_TOKEN?.trim();
if (!TOKEN) {
  console.error("GIS_TOKEN is not set. Add it to .env.local first.");
  process.exit(1);
}
const PROGRAMMES = { 7: "iGV", 8: "iGTa", 9: "iGTe" };

async function page(programme, n) {
  const query = `{ opportunities(filters: { committee: 1564, programmes: [${programme}], status: "open" }, per_page: 100, page: ${n}) {
    paging { total_items total_pages }
    data { id title status location lat lng available_openings applications_close_date earliest_start_date latest_end_date
      host_lc { name } sdg_info { sdg_target { goal_index } } logistics_info { accommodation_covered food_covered } } } }`;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: TOKEN },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join(" | "));
  return body.data.opportunities;
}

for (const [id, code] of Object.entries(PROGRAMMES)) {
  const first = await page(id, 1);
  const all = [...first.data];
  for (let p = 2; p <= (first.paging?.total_pages ?? 1); p++) all.push(...(await page(id, p)).data);
  const pct = (fn) => `${Math.round((100 * all.filter(fn).length) / Math.max(1, all.length))}%`;
  const withOpenings = all.filter((o) => (o.available_openings ?? 0) > 0).length;
  console.log(
    `${code}: ${all.length} open (${withOpenings} with openings > 0) | coords ${pct((o) => o.lat && o.lng)} | sdg ${pct(
      (o) => o.sdg_info?.sdg_target?.goal_index,
    )} | logistics ${pct((o) => o.logistics_info)} | close date ${pct((o) => o.applications_close_date)}`,
  );
  const places = [...new Set(all.map((o) => o.location || o.host_lc?.name).filter(Boolean))].slice(0, 12);
  if (places.length) console.log(`   places: ${places.join(" · ")}`);
}
