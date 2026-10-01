import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { GIS_CACHE_TAG } from "@/lib/gis/config";

/**
 * On-demand refresh: POST /api/revalidate with header
 * `Authorization: Bearer $REVALIDATE_SECRET` to drop cached GIS responses now.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(GIS_CACHE_TAG, "max");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
