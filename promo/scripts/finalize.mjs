#!/usr/bin/env node
/**
 * Final delivery pass: Remotion's JPEG frame pipeline produces full-range
 * yuvj420p. Social platforms expect limited-range yuv420p + fast start.
 *   node scripts/finalize.mjs output/let-me-polish-you-launch.mp4
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const input = process.argv[2] ?? "output/let-me-polish-you-launch.mp4";
const tmp = input.replace(/\.mp4$/, ".tmp.mp4");
execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-y", "-i", input,
  "-vf", "scale=in_range=full:out_range=tv,format=yuv420p",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-level", "4.2",
  "-c:a", "copy", "-movflags", "+faststart", tmp], { stdio: "inherit" });
fs.renameSync(tmp, input);
console.log("finalized", input);
