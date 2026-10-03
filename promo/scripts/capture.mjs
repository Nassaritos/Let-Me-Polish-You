#!/usr/bin/env node
/**
 * Captures the LIVE deployed website for the promo — no mock UI.
 *   npm run capture            (uses https://let-me-polish-you.vercel.app)
 *   SITE=https://… npm run capture
 * Writes PNGs to public/site/ plus public/site/manifest.json describing
 * exactly which live opportunities were captured and when.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const SITE = (process.env.SITE || "https://let-me-polish-you.vercel.app").replace(/\/$/, "");
const OUT = fileURLToPath(new URL("../public/site/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const manifest = { site: SITE, capturedAt: new Date().toISOString(), shots: {} };

async function settle(page) {
  // Trigger every scroll-reveal, then return to top and let animations finish.
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1600);
}

/* --- pick real, open opportunities (one per programme) from the live API --- */
const api = await (await fetch(`${SITE}/api/opportunities`)).json();
const open = api.opportunities.filter((o) => o.availability === "open");
const pick = (program) =>
  open
    .filter((o) => o.program === program)
    .sort((a, b) => Number(Boolean(b.earliestStart)) - Number(Boolean(a.earliestStart)) || (b.openings ?? 0) - (a.openings ?? 0))[0];
const picks = { igv: pick("igv"), igta: pick("igta"), igte: pick("igte") };
// Featured opportunity page: a GV project whose application deadline is still ≥ 3 weeks away.
const soon = Date.now() + 21 * 86_400_000;
const featured =
  open
    .filter((o) => o.program === "igv" && o.applicationClose && new Date(o.applicationClose).getTime() > soon && o.earliestStart)
    .sort((a, b) => (b.openings ?? 0) - (a.openings ?? 0))[0] ?? picks.igv;
manifest.featured = featured && { id: featured.id, title: featured.title, city: featured.city, applyBy: featured.applicationClose, start: featured.earliestStart };
manifest.liveCount = open.length;
manifest.places = new Set(open.map((o) => o.citySlug).filter(Boolean)).size;
manifest.byProgram = Object.fromEntries(["igv", "igta", "igte"].map((p) => [p, open.filter((o) => o.program === p).length]));
manifest.picks = Object.fromEntries(Object.entries(picks).map(([k, o]) => [k, o && { id: o.id, title: o.title, city: o.city, start: o.earliestStart, openings: o.openings }]));

/* ------------------------------- mobile -------------------------------- */
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const m = await mobile.newPage();

await m.goto(`${SITE}/`, { waitUntil: "networkidle" });
await settle(m);
await m.screenshot({ path: `${OUT}m-home-hero.png` });
// tall strip for an animated scroll: hero → "choose your experience"
const chooserTop = await m.evaluate(() => document.querySelector("#experiences")?.getBoundingClientRect().top + window.scrollY);
await m.screenshot({ path: `${OUT}m-home-strip.png`, fullPage: true, clip: { x: 0, y: 0, width: 390, height: Math.round(chooserTop + 1100) } });
manifest.shots.homeStrip = { chooserTop: Math.round(chooserTop) };

await m.goto(`${SITE}/global-volunteer`, { waitUntil: "networkidle" });
await settle(m);
await m.screenshot({ path: `${OUT}m-gv-top.png` });
await m.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
await m.evaluate(() => window.scrollBy(0, 330));
await m.waitForTimeout(1200);
await m.screenshot({ path: `${OUT}m-gv-projects.png` });

if (featured) {
  await m.goto(`${SITE}/opportunities/${featured.id}`, { waitUntil: "networkidle" });
  await settle(m);
  await m.screenshot({ path: `${OUT}m-detail.png` });
  // full page for a scroll; the fixed header + apply bar are pinned back on in the video
  await m.addStyleTag({ content: "header.fixed{visibility:hidden!important} div.fixed.bottom-0{display:none!important}" });
  await m.waitForTimeout(300);
  await m.screenshot({ path: `${OUT}m-detail-full.png`, fullPage: true });
  manifest.shots.detailFull = {
    cssHeight: await m.evaluate(() => document.documentElement.scrollHeight),
    // css y of each section heading, so the video can stop exactly on them
    sections: await m.evaluate(() =>
      Object.fromEntries([...document.querySelectorAll("h1, h2")].map((h) => [h.textContent.trim(), Math.round(h.getBoundingClientRect().top + window.scrollY)])),
    ),
    sdg: await m.evaluate(() => { const el = [...document.querySelectorAll("p")].find((p) => /Sustainable Development Goal/.test(p.textContent)); return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null; }),
  };
}

// mobile explorer with the filter sheet open
await m.goto(`${SITE}/opportunities`, { waitUntil: "networkidle" });
await settle(m);
await m.getByRole("button", { name: /^Filters/ }).click();
await m.waitForTimeout(1200);
await m.screenshot({ path: `${OUT}m-filters.png` });
manifest.shots.filters = await m.evaluate(() =>
  [...document.querySelectorAll('[role="dialog"] fieldset')].map((f) => {
    const r = f.getBoundingClientRect();
    return { label: f.querySelector("legend")?.textContent?.trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  }),
);

/* ------------------------------- desktop ------------------------------- */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const d = await desktop.newPage();

await d.goto(`${SITE}/`, { waitUntil: "networkidle" });
await settle(d);
await d.screenshot({ path: `${OUT}d-home-hero.png` });
// The site's fixed header would otherwise be baked into element captures.
await d.addStyleTag({ content: "header.fixed{display:none!important}" });
await d.locator("#experiences ul").first().screenshot({ path: `${OUT}d-chooser.png` });
await d.locator("#places").scrollIntoViewIfNeeded();
await d.waitForTimeout(1500);
await d.locator("#places").screenshot({ path: `${OUT}d-map.png` });
{
  // the element capture includes the section's 2px bottom border — crop it off
  const box = await d.locator('#places svg[role="group"]').boundingBox();
  await d.screenshot({ path: `${OUT}d-map-only.png`, clip: { x: box.x, y: box.y, width: box.width, height: box.height - 3 } });
}
await d.locator("#places article").screenshot({ path: `${OUT}d-map-card.png` });
await d.locator("#teams ul").first().scrollIntoViewIfNeeded();
await d.waitForTimeout(1200);
await d.locator("#teams ul").first().screenshot({ path: `${OUT}d-teams.png` });
manifest.lcs = await d.locator("#teams ul > li").count();
// "AIESEC Warsaw SGH — taste of cebula. See Warsaw…" → "Warsaw SGH"
manifest.lcNames = await d.locator("#teams ul > li a").evaluateAll((as) => as.map((a) => (a.getAttribute("aria-label") || "").replace(/^AIESEC /, "").split(" — ")[0]));

await d.goto(`${SITE}/poland`, { waitUntil: "networkidle" });
await settle(d);
await d.addStyleTag({ content: "header.fixed{display:none!important}" });
await d.locator("#poland ul").first().screenshot({ path: `${OUT}d-poland-grid.png` });

await d.goto(`${SITE}/about`, { waitUntil: "networkidle" });
await settle(d);
await d.addStyleTag({ content: "header.fixed{display:none!important}" });
await d.locator("#how ol").first().screenshot({ path: `${OUT}d-about-steps.png` });

if (featured) {
  await d.goto(`${SITE}/opportunities/${featured.id}`, { waitUntil: "networkidle" });
  await settle(d);
  await d.addStyleTag({ content: "header.fixed{display:none!important}" });
  await d.locator("aside > div").first().screenshot({ path: `${OUT}d-detail-aside.png` });
}

await d.goto(`${SITE}/opportunities`, { waitUntil: "networkidle" });
await settle(d);
await d.screenshot({ path: `${OUT}d-explore.png` });
await d.locator("div.grid:has(> fieldset)").first().screenshot({ path: `${OUT}d-filters.png` });

await d.addStyleTag({ content: "header.fixed{display:none!important}" });
// Cards are shown large in the video: capture them at 4x density.
const sharp = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 });
const c = await sharp.newPage();
await c.goto(`${SITE}/opportunities`, { waitUntil: "networkidle" });
await settle(c);
for (const [program, o] of Object.entries(picks)) {
  if (!o) continue;
  const card = c.locator(`article:has(a[href="/opportunities/${o.id}"])`).first();
  await card.scrollIntoViewIfNeeded();
  await c.waitForTimeout(600);
  await card.screenshot({ path: `${OUT}d-card-${program}.png` });
}

fs.writeFileSync(`${OUT}manifest.json`, JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
await browser.close();
