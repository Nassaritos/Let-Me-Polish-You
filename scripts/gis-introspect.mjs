#!/usr/bin/env node
/**
 * Prints the parts of the live GIS schema this site relies on, so the
 * selection in lib/gis/queries.ts can be checked against reality.
 *   npm run gis:introspect
 * Reads GIS_TOKEN from .env.local. Never prints the token.
 */
const ENDPOINT = process.env.GIS_ENDPOINT || "https://gis-api.aiesec.org/graphql";
const TOKEN = process.env.GIS_TOKEN?.trim();
if (!TOKEN) {
  console.error("GIS_TOKEN is not set. Add it to .env.local first.");
  process.exit(1);
}

const REF = "kind name ofType { kind name ofType { kind name ofType { kind name } } }";
const show = (t) => (t.kind === "NON_NULL" ? `${show(t.ofType)}!` : t.kind === "LIST" ? `[${show(t.ofType)}]` : t.name);
const base = (t) => (t.ofType ? base(t.ofType) : t);

async function q(query) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: TOKEN },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.errors?.length) console.warn("GraphQL errors:", body.errors.map((e) => e.message).join(" | "));
  return body.data;
}

const type = async (name) =>
  (await q(`{ __type(name: "${name}") { name kind fields { name type { ${REF} } args { name type { ${REF} } } } inputFields { name type { ${REF} } } enumValues { name } } }`)).__type;

const roots = (await q(`{ __schema { queryType { fields { name type { ${REF} } args { name type { ${REF} } } } } } }`)).__schema.queryType.fields;
const interesting = roots.filter((f) => /opportunit/i.test(f.name));
console.log("\n== Query fields mentioning 'opportunity'");
for (const f of interesting) console.log(`  ${f.name}(${(f.args ?? []).map((a) => `${a.name}: ${show(a.type)}`).join(", ")}): ${show(f.type)}`);

const list = interesting.find((f) => f.name === "opportunities") ?? interesting[0];
if (list) {
  const filter = list.args.find((a) => /filter/.test(a.name));
  if (filter) {
    const ft = await type(base(filter.type).name);
    console.log(`\n== ${ft.name} (filter input)`);
    for (const f of ft.inputFields ?? []) console.log(`  ${f.name}: ${show(f.type)}`);
  }
  const lt = await type(base(list.type).name);
  const data = lt?.fields?.find((f) => f.name === "data");
  const oppName = data ? base(data.type).name : base(list.type).name;
  const ot = await type(oppName);
  console.log(`\n== ${ot.name} fields (${ot.fields.length})`);
  for (const f of ot.fields) console.log(`  ${f.name}: ${show(f.type)}`);
}
