import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { BEAT, FPS, MUSIC, T } from "./theme";
import { Grade, Grain, Vignette } from "./components";
import { Hook, Montage, Poland } from "./scenes/Opening";
import { Choose, Programs, PROGRAMS_LEAD } from "./scenes/Programs";
import { Cta, Flow, Proof } from "./scenes/Proof";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Scenes whose entrance should land ON their downbeat start a few frames early (overlapping the previous scene). */
const LEAD = { poland: 6, programs: PROGRAMS_LEAD } as const;

const S = (name: keyof typeof T & string, lead = 0) => {
  const t = T[name] as { from: number; dur: number };
  return { from: t.from - lead, durationInFrames: t.dur + lead };
};

/** SFX — subtle accents on top of the song, landing 2 frames before the visual. */
const SFX: { at: number; file: string; vol: number }[] = [
  { at: T.poland.from + 3, file: "brush.wav", vol: 0.24 },
  ...[0, 1, 2, 3].map((i) => ({ at: T.montage.from + Math.round(i * 1.5 * BEAT) - 2, file: "flick.wav", vol: 0.21 })),
  ...[0, 1, 2].map((i) => ({ at: T.programs.from + i * 3 * BEAT - 5, file: "whoosh.wav", vol: 0.15 })),
  { at: T.choose.from + BEAT, file: "brush.wav", vol: 0.17 },
  ...[0, 1, 2].map((i) => ({ at: T.projects.from + i * BEAT - 3, file: "flick.wav", vol: 0.21 })),
  { at: T.projects.from + 3 * BEAT + 12, file: "brush.wav", vol: 0.17 },
  { at: T.flow.from - 4, file: "whoosh.wav", vol: 0.14 },
  ...[36, 82, 106].map((f) => ({ at: T.flow.from + f - 1, file: "tap.wav", vol: 0.24 })),
];

export const LaunchVideo: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => (
  <AbsoluteFill style={{ background: "#151515" }}>
    <Sequence {...S("hook")}><Hook /></Sequence>
    <Sequence {...S("montage")}><Montage /></Sequence>
    <Sequence {...S("poland", LEAD.poland)}><Poland /></Sequence>
    <Sequence {...S("programs", LEAD.programs)}><Programs /></Sequence>
    <Sequence {...S("choose")}><Choose /></Sequence>
    <Sequence {...S("projects")}><Proof /></Sequence>
    <Sequence {...S("flow")}><Flow /></Sequence>
    <Sequence {...S("cta")}><Cta /></Sequence>

    {/* finishing stack: grade → grain → vignette */}
    <Grade />
    <Grain />
    <Vignette />

    {/* soundtrack: "Cow Boy Fest" by Dorine Levy (CC BY 3.0), cut so its drop lands on POLAND. */}
    {withMusic && (
      <Audio
        src={staticFile(MUSIC.file)}
        trimBefore={Math.round(MUSIC.startSec * FPS)}
        volume={(f) =>
          interpolate(f, [0, 3], [0, 0.72], clamp) * interpolate(f, [T.total - 40, T.total], [1, 0], { ...clamp, easing: (x) => x * x })
        }
      />
    )}
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={45}>
        <Audio src={staticFile(`audio/${s.file}`)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
