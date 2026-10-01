import type { MetadataRoute } from "next";
import { getPolandOpportunities, summarizeCities } from "@/lib/gis/opportunities";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = ["", "/opportunities", "/global-volunteer", "/global-talent", "/global-teacher", "/poland", "/about", "/legal"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: p === "/opportunities" ? "hourly" : "weekly",
    priority: p === "" ? 1 : p === "/opportunities" ? 0.9 : 0.5,
  }));
  const res = await getPolandOpportunities();
  if (!res.ok) return base;
  const opps = res.data
    .filter((o) => o.availability === "open")
    .map((o) => ({ url: `${SITE.url}/opportunities/${o.id}`, lastModified: o.dates?.updated ? new Date(o.dates.updated) : now, changeFrequency: "daily" as const, priority: 0.7 }));
  const cities = summarizeCities(res.data).map((c) => ({ url: `${SITE.url}/cities/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 }));
  return [...base, ...opps, ...cities];
}
