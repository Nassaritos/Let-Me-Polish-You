#!/usr/bin/env node
/**
 * Renders the site's share card (Open Graph / Twitter) from og/og.html.
 *   npm run og   →  ../app/opengraph-image.jpg + ../app/twitter-image.jpg
 * Uses only the site's own photos and brand files.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const html = new URL("../og/og.html", import.meta.url);
const app = fileURLToPath(new URL("../../app/", import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(html.href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const out = `${app}opengraph-image.jpg`;
await page.screenshot({ path: out, type: "jpeg", quality: 90 });
fs.copyFileSync(out, `${app}twitter-image.jpg`);
await browser.close();
console.log("wrote", out, `(${Math.round(fs.statSync(out).size / 1024)} KB)`);
