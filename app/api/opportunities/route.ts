import { NextResponse } from "next/server";
import { getOpportunitySummaries } from "@/lib/gis/opportunities";

export const revalidate = 300;

/**
 * Public, normalized feed of live AIESEC in Poland opportunities.
 * Contains no credentials; data is served from the server-side GIS cache.
 */
export async function GET() {
  const result = await getOpportunitySummaries();
  if (!result.ok) {
    return NextResponse.json({ error: "Opportunities are temporarily unavailable." }, { status: 503 });
  }
  return NextResponse.json(
    { fetchedAt: result.fetchedAt, count: result.data.length, opportunities: result.data.map((o) => ({ ...o, search: undefined })) },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
