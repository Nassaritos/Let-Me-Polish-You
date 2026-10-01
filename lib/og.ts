import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** The campaign logo as a data URL for next/og images. */
export async function logoDataUrl(tone: "ink" | "white" = "ink"): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public/brand", tone === "ink" ? "lmpy-ink.png" : "lmpy-white.png"));
  return `data:image/png;base64,${buf.toString("base64")}`;
}
