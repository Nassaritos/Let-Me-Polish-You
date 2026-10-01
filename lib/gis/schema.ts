import "server-only";
import { gisRequest } from "./client";
import { GIS_SCHEMA_REVALIDATE_SECONDS } from "./config";

/**
 * Lightweight, targeted GraphQL introspection. Instead of downloading the
 * whole GIS schema (several MB), we ask only for the types we select from.
 * Results are cached for a day. If introspection is disabled or fails, callers
 * fall back to their default selection plus error-driven pruning.
 */

export interface TypeRef {
  kind: string;
  name: string | null;
  ofType: TypeRef | null;
}

export interface FieldInfo {
  name: string;
  type: TypeRef;
  args?: { name: string; type: TypeRef }[];
}

export interface TypeInfo {
  name: string;
  kind: string;
  fields: FieldInfo[] | null;
  inputFields: FieldInfo[] | null;
  enumValues: { name: string }[] | null;
}

const TYPE_REF = "kind name ofType { kind name ofType { kind name ofType { kind name } } }";
const TYPE_BODY = `name kind
  fields { name type { ${TYPE_REF} } args { name type { ${TYPE_REF} } } }
  inputFields { name type { ${TYPE_REF} } }
  enumValues { name }`;

export function unwrap(ref: TypeRef): { name: string; kind: string; isList: boolean } {
  let isList = false;
  let cur: TypeRef | null = ref;
  while (cur && (cur.kind === "NON_NULL" || cur.kind === "LIST")) {
    if (cur.kind === "LIST") isList = true;
    cur = cur.ofType;
  }
  return { name: cur?.name ?? "", kind: cur?.kind ?? "SCALAR", isList };
}

export function isLeafKind(kind: string) {
  return kind === "SCALAR" || kind === "ENUM";
}

export async function introspectRootFields(): Promise<FieldInfo[] | null> {
  try {
    const res = await gisRequest<{ __schema: { queryType: { fields: FieldInfo[] } } }>(
      `query { __schema { queryType { fields { name type { ${TYPE_REF} } args { name type { ${TYPE_REF} } } } } } }`,
      { revalidate: GIS_SCHEMA_REVALIDATE_SECONDS },
    );
    return res.data?.__schema?.queryType?.fields ?? null;
  } catch {
    return null;
  }
}

/** Fetch several named types in a single aliased request. */
export async function introspectTypes(names: string[]): Promise<Map<string, TypeInfo>> {
  const out = new Map<string, TypeInfo>();
  const unique = [...new Set(names.filter((n) => /^[_A-Za-z][_0-9A-Za-z]*$/.test(n)))].sort();
  if (!unique.length) return out;
  try {
    const body = unique.map((n, i) => `t${i}: __type(name: "${n}") { ${TYPE_BODY} }`).join("\n");
    const res = await gisRequest<Record<string, TypeInfo | null>>(`query { ${body} }`, {
      revalidate: GIS_SCHEMA_REVALIDATE_SECONDS,
    });
    for (const t of Object.values(res.data ?? {})) if (t?.name) out.set(t.name, t);
  } catch {
    // Introspection unavailable — caller falls back to defaults.
  }
  return out;
}
