import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { BEAT, FPS, MUSIC, TN } from "./theme";
import { Grade, Grain, Vignette } from "./components";
import { Choose } from "./scenes/Programs";
import { LIVE_LEAD, Live, Open, What } from "./network/Intro";
import {
  ASK_STEPS,
  Ask,
  CONTENT_SWAP,
  Content,
  End,
  LCS_START,
  LCS_STEP,
  Lcs,
  MAP_CARD_AT,
  MapScene,
  PAGE_STOPS,
  PAGE_TAP,
  Page,
  SEARCH_FILTERS_AT,
  SEARCH_FILTER_STEP,
  Search,
} from "./network/Tour";
import manifest from "../public/site/manifest.json";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const S = (name: Exclude<keyof typeof TN, "total">, lead = 0) => ({ from: TN[name].from - lead, durationInFrames: TN[name].dur + lead });

/** Internal network launch (storyboard-network.md): for AIESECers in other entities. */
const SFX: { at: number; file: string; vol: number }[] = [
  ...[3, 4, 5].map((b) => ({ at: TN.open.from + b * BEAT - 2, file: "tick.wav", vol: 0.3 })),
  { at: TN.live.from + 1, file: "brush.wav", vol: 0.24 },
  { at: TN.live.from + BEAT - 2, file: "tap.wav", vol: 0.28 },
  { at: TN.what.from - 4, file: "whoosh.wav", vol: 0.14 },
  { at: TN.search.from + 3 * BEAT - 6, file: "whoosh.wav", vol: 0.14 },
  ...manifest.shots.filters.map((_, i) => ({ at: TN.search.from + SEARCH_FILTERS_AT + i * SEARCH_FILTER_STEP - 2, file: "flick.wav", vol: 0.2 })),
  { at: TN.products.from + BEAT, file: "brush.wav", vol: 0.17 },
  { at: TN.map.from + MAP_CARD_AT - 2, file: "flick.wav", vol: 0.2 },
  ...PAGE_STOPS.slice(1).map((s) => ({ at: TN.page.from + s.at - 16, file: "whoosh.wav", vol: 0.1 })),
  { at: TN.page.from + PAGE_TAP - 1, file: "tap.wav", vol: 0.26 },
  ...[1.5, 3].map((b) => ({ at: TN.content.from + b * BEAT - 2, file: "flick.wav", vol: 0.18 })),
  ...[1.5, 3].map((b) => ({ at: TN.content.from + CONTENT_SWAP + b * BEAT - 2, file: "flick.wav", vol: 0.18 })),
  ...manifest.lcNames.map((_, i) => ({ at: TN.lcs.from + LCS_START + i * LCS_STEP - 2, file: "tick.wav", vol: 0.16 })),
  ...ASK_STEPS.map((at) => ({ at: TN.ask.from + at - 2, file: "tick.wav", vol: 0.24 })),
  { at: TN.end.from - 2, file: "hit.wav", vol: 0.22 },
];

export const NetworkVideo: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => (
  <AbsoluteFill style={{ background: "#151515" }}>
    <Sequence {...S("open")}><Open /></Sequence>
    <Sequence {...S("live", LIVE_LEAD)}><Live /></Sequence>
    <Sequence {...S("what")}><What /></Sequence>
    <Sequence {...S("search")}><Search /></Sequence>
    <Sequence {...S("products")}><Choose lines={["3 products.", "3 pages."]} /></Sequence>
    <Sequence {...S("map")}><MapScene /></Sequence>
    <Sequence {...S("page")}><Page /></Sequence>
    <Sequence {...S("content")}><Content /></Sequence>
    <Sequence {...S("lcs")}><Lcs /></Sequence>
    <Sequence {...S("ask")}><Ask /></Sequence>
    <Sequence {...S("end")}><End /></Sequence>

    <Grade />
    <Grain />
    <Vignette />

    {/* "Cow Boy Fest" by Dorine Levy (CC BY 3.0) — the drop lands on NOW LIVE (beat 6) */}
    {withMusic && (
      <Audio
        src={staticFile(MUSIC.file)}
        trimBefore={Math.round(MUSIC.startSec * FPS)}
        volume={(f) => interpolate(f, [0, 3], [0, 0.72], clamp) * interpolate(f, [TN.total - 50, TN.total], [1, 0], { ...clamp, easing: (x) => x * x })}
      />
    )}
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(s.at))} durationInFrames={45}>
        <Audio src={staticFile(`audio/${s.file}`)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
