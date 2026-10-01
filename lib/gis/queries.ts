import "server-only";
import { introspectRootFields, introspectTypes, isLeafKind, unwrap, type TypeInfo, type TypeRef } from "./schema";

/**
 * The fields we would like from an opportunity. This is a wish list, not an
 * assumption: before querying, it is intersected with the live GIS schema, and
 * anything GIS rejects at runtime is dropped and the query retried.
 */
export type Selection = { [field: string]: true | Selection };

const SKILL_LIKE: Selection = { id: true, constant_name: true, option: true, level: true };

export const OPPORTUNITY_SELECTION: Selection = {
  id: true,
  title: true,
  description: true,
  project_description: true,
  project_name: true,
  status: true,
  location: true,
  lat: true,
  lng: true,
  created_at: true,
  updated_at: true,
  date_opened: true,
  applications_close_date: true,
  earliest_start_date: true,
  latest_end_date: true,
  duration: true,
  available_openings: true,
  openings: true,
  applicants_count: true,
  city: { id: true, name: true, lat: true, lng: true },
  opportunity_duration_type: { id: true, duration_type: true, duration_min: true, duration_max: true },
  programme: { id: true, short_name: true, short_name_display: true },
  programmes: { id: true, short_name: true, short_name_display: true },
  host_lc: { id: true, name: true, full_name: true, parent: { id: true, name: true } },
  home_mc: { id: true, name: true },
  organisation: { id: true, name: true },
  branch: { id: true, name: true, company: { id: true, name: true } },
  project: { id: true, title: true },
  sub_product: { id: true, name: true },
  sdg_info: {
    id: true,
    sdg_target: { id: true, goal_index: true, target_index: true, target: true, description: true },
  },
  logistics_info: {
    accommodation_covered: true,
    accommodation_provided: true,
    food_covered: true,
    food_provided: true,
    no_of_meals: true,
    transportation_covered: true,
    transportation_provided: true,
    computer_provided: true,
  },
  specifics_info: {
    salary: true,
    salary_periodicity: true,
    salary_currency: { id: true, alphabetic_code: true },
  },
  role_info: { city: true, learning_points: true, learning_points_list: true },
  languages: SKILL_LIKE,
  skills: SKILL_LIKE,
  backgrounds: SKILL_LIKE,
  skills_developments: SKILL_LIKE,
  weekly_activities: { id: true, week: true, activity: true },
  available_slots: {
    id: true,
    start_date: true,
    end_date: true,
    openings: true,
    available_openings: true,
    applications_close_date: true,
    status: true,
  },
};

/* ------------------------------------------------------------------------ */
/* Schema resolution                                                         */
/* ------------------------------------------------------------------------ */

export interface ResolvedSchema {
  list: {
    field: string;
    hasPaging: boolean;
    dataField: string | null;
    pageArg: string | null;
    perPageArg: string | null;
    filterArg: string | null;
    /** Accepted filter keys → their GraphQL type, when known */
    filterFields: Map<string, TypeRef> | null;
  };
  single: { field: string; idArg: string } | null;
  /** The live Opportunity selection after pruning against the schema. */
  selection: Selection;
  enums: Map<string, string[]>;
  introspected: boolean;
}

const DEFAULT_SCHEMA: ResolvedSchema = {
  list: {
    field: "opportunities",
    hasPaging: true,
    dataField: "data",
    pageArg: "page",
    perPageArg: "per_page",
    filterArg: "filters",
    filterFields: null,
  },
  single: { field: "opportunity", idArg: "id" },
  selection: OPPORTUNITY_SELECTION,
  enums: new Map(),
  introspected: false,
};

const LIST_CANDIDATES = ["opportunities", "allOpportunity", "opportunitySearch"];
const SINGLE_CANDIDATES = ["opportunity", "getOpportunity"];

/** Walk the wish list against the schema, loading nested types breadth-first. */
async function pruneSelection(rootType: string, wish: Selection, types: Map<string, TypeInfo>) {
  // Collect type names we still need, level by level (max depth 4).
  let frontier: { typeName: string; sel: Selection }[] = [{ typeName: rootType, sel: wish }];
  for (let depth = 0; depth < 4 && frontier.length; depth++) {
    const missing = frontier.map((f) => f.typeName).filter((n) => !types.has(n));
    if (missing.length) for (const [k, v] of await introspectTypes(missing)) types.set(k, v);
    const next: typeof frontier = [];
    for (const { typeName, sel } of frontier) {
      const t = types.get(typeName);
      if (!t?.fields) continue;
      for (const [key, sub] of Object.entries(sel)) {
        if (sub === true) continue;
        const f = t.fields.find((x) => x.name === key);
        if (!f) continue;
        const u = unwrap(f.type);
        if (!isLeafKind(u.kind)) next.push({ typeName: u.name, sel: sub });
      }
    }
    frontier = next;
  }

  const build = (typeName: string, sel: Selection): Selection | null => {
    const t = types.get(typeName);
    if (!t?.fields) return null;
    const out: Selection = {};
    for (const [key, sub] of Object.entries(sel)) {
      const f = t.fields.find((x) => x.name === key);
      if (!f) continue;
      // Skip fields that require arguments we do not provide.
      if (f.args?.some((a) => a.type.kind === "NON_NULL")) continue;
      const u = unwrap(f.type);
      if (isLeafKind(u.kind)) {
        out[key] = true; // scalars (incl. JSON) are selected directly
      } else if (sub !== true) {
        const child = build(u.name, sub);
        if (child && Object.keys(child).length) out[key] = child;
      }
    }
    return out;
  };

  return build(rootType, wish);
}

async function resolveSchemaUncached(): Promise<ResolvedSchema> {
  const roots = await introspectRootFields();
  if (!roots) return DEFAULT_SCHEMA;

  const listRoot = LIST_CANDIDATES.map((n) => roots.find((r) => r.name === n)).find(Boolean);
  const singleRoot = SINGLE_CANDIDATES.map((n) => roots.find((r) => r.name === n)).find(Boolean);
  if (!listRoot) return DEFAULT_SCHEMA;

  const listType = unwrap(listRoot.type);
  const argNames = new Set((listRoot.args ?? []).map((a) => a.name));
  const filterArgInfo = (listRoot.args ?? []).find((a) => a.name === "filters" || a.name === "filter");
  const filterTypeName = filterArgInfo ? unwrap(filterArgInfo.type).name : null;

  const types = await introspectTypes([listType.name, ...(filterTypeName ? [filterTypeName] : [])]);

  let opportunityType = listType.name;
  let dataField: string | null = null;
  let hasPaging = false;
  if (!listType.isList) {
    const lt = types.get(listType.name);
    const data = lt?.fields?.find((f) => f.name === "data" || f.name === "nodes" || f.name === "items");
    if (data) {
      dataField = data.name;
      opportunityType = unwrap(data.type).name;
      hasPaging = Boolean(lt?.fields?.some((f) => f.name === "paging"));
    }
  }

  const filterFields = new Map<string, TypeRef>();
  const ft = filterTypeName ? types.get(filterTypeName) : undefined;
  for (const f of ft?.inputFields ?? []) filterFields.set(f.name, f.type);

  // Enum values for filter inputs (e.g. status) so we can render literals correctly.
  const enumNames = [...filterFields.values()].map((t) => unwrap(t)).filter((u) => u.kind === "ENUM").map((u) => u.name);
  const enumTypes = await introspectTypes(enumNames);
  const enums = new Map<string, string[]>();
  for (const [name, t] of enumTypes) enums.set(name, (t.enumValues ?? []).map((v) => v.name));

  const selection = (await pruneSelection(opportunityType, OPPORTUNITY_SELECTION, types)) ?? OPPORTUNITY_SELECTION;

  const singleIdArg = singleRoot?.args?.find((a) => a.name === "id")?.name;

  return {
    list: {
      field: listRoot.name,
      hasPaging,
      dataField,
      pageArg: argNames.has("page") ? "page" : null,
      perPageArg: argNames.has("per_page") ? "per_page" : argNames.has("perPage") ? "perPage" : null,
      filterArg: filterArgInfo?.name ?? null,
      filterFields: ft ? filterFields : null,
    },
    single: singleRoot && singleIdArg ? { field: singleRoot.name, idArg: singleIdArg } : null,
    selection,
    enums,
    introspected: true,
  };
}

let schemaPromise: { at: number; promise: Promise<ResolvedSchema> } | null = null;
const SCHEMA_MEMO_MS = 60 * 60 * 1000;

export function resolveSchema(): Promise<ResolvedSchema> {
  if (!schemaPromise || Date.now() - schemaPromise.at > SCHEMA_MEMO_MS) {
    const promise = resolveSchemaUncached().catch(() => DEFAULT_SCHEMA);
    schemaPromise = { at: Date.now(), promise };
  }
  return schemaPromise.promise;
}

/* ------------------------------------------------------------------------ */
/* Runtime pruning (safety net when introspection is unavailable)            */
/* ------------------------------------------------------------------------ */

/** Paths (relative to the opportunity) that GIS rejected at runtime. */
const blockedPaths = new Set<string>();
/** Filter keys GIS rejected at runtime. */
export const blockedFilterKeys = new Set<string>();

export function applyBlocked(sel: Selection, prefix = ""): Selection {
  const out: Selection = {};
  for (const [k, v] of Object.entries(sel)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (blockedPaths.has(path)) continue;
    if (v === true) out[k] = true;
    else {
      const child = applyBlocked(v, path);
      if (Object.keys(child).length) out[k] = child;
    }
  }
  return out;
}

/**
 * Learn from GraphQL validation errors. Returns true when something new was
 * blocked, meaning a retry is worthwhile.
 */
export function learnFromErrors(
  errors: { message: string; path?: (string | number)[]; extensions?: Record<string, unknown> }[],
  rootField: string,
  dataField: string | null,
  selection: Selection,
): boolean {
  let learned = false;
  for (const e of errors) {
    const msg = e.message ?? "";
    // graphql-ruby: "InputObject 'X' doesn't accept argument 'status'"
    // graphql-js:   'Field "status" is not defined by type "X".'
    const argName =
      (/InputObject|doesn't accept|not accepted/i.test(msg) && /argument '([_A-Za-z0-9]+)'/i.exec(msg)?.[1]) ||
      /Field "([_A-Za-z0-9]+)" is not defined by type/.exec(msg)?.[1];
    if (argName) {
      if (!blockedFilterKeys.has(argName)) {
        blockedFilterKeys.add(argName);
        learned = true;
      }
      continue;
    }

    // graphql-ruby: "Field 'foo' doesn't exist on type 'Opportunity'"
    // graphql-js:   'Cannot query field "foo" on type "Opportunity".'
    const fieldName =
      (typeof e.extensions?.fieldName === "string" && e.extensions.fieldName) ||
      /field '([_A-Za-z0-9]+)'/i.exec(msg)?.[1] ||
      /field "([_A-Za-z0-9]+)"/i.exec(msg)?.[1];
    if (!fieldName) continue;

    // Prefer an exact path when GIS supplies one.
    let rel: string[] | null = null;
    if (Array.isArray(e.path)) {
      const p = e.path.map(String);
      const i = p.indexOf(rootField);
      if (i >= 0) {
        rel = p.slice(i + 1);
        if (dataField && rel[0] === dataField) rel = rel.slice(1);
      }
    }
    if (rel && rel.length && rel[rel.length - 1] === fieldName) {
      const key = rel.join(".");
      if (!blockedPaths.has(key)) {
        blockedPaths.add(key);
        learned = true;
      }
      continue;
    }
    // Otherwise block every occurrence of that field name in our selection.
    const walk = (sel: Selection, prefix: string) => {
      for (const [k, v] of Object.entries(sel)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (k === fieldName && !blockedPaths.has(path) && k !== "id") {
          blockedPaths.add(path);
          learned = true;
        } else if (v !== true) walk(v, path);
      }
    };
    walk(selection, "");
  }
  return learned;
}

/* ------------------------------------------------------------------------ */
/* Query rendering                                                           */
/* ------------------------------------------------------------------------ */

export type Literal = string | number | boolean | { enum: string } | Literal[] | { [k: string]: Literal };

export function renderLiteral(v: Literal): string {
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "null";
  if (typeof v === "boolean") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(renderLiteral).join(", ")}]`;
  if ("enum" in v && typeof v.enum === "string" && Object.keys(v).length === 1) return v.enum;
  return `{ ${Object.entries(v)
    .map(([k, x]) => `${k}: ${renderLiteral(x as Literal)}`)
    .join(", ")} }`;
}

export function renderSelection(sel: Selection): string {
  return Object.entries(sel)
    .map(([k, v]) => (v === true ? k : `${k} { ${renderSelection(v)} }`))
    .join(" ");
}
