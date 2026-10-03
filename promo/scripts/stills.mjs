// Review helper: node scripts/stills.mjs <CompId> <outDir> <frame> [frame…]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const [id, out, ...frames] = process.argv.slice(2);
const root = fileURLToPath(new URL("..", import.meta.url));
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const browserExecutable = process.env.BROWSER || null;
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: Number(f), output: path.join(out, `f${String(f).padStart(4, "0")}.png`), scale: Number(process.env.SCALE || 0.4), browserExecutable, overwrite: true });
  process.stdout.write(f + " ");
}
