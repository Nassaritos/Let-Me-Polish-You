import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Caps, ColorBg, Entrance, PaperBg, Polaroid, Script, Swoosh, WordReveal, useLayout } from "../components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* 0–2s HOOK: real Poland photos flicker on 8th notes under the line   */
/* ------------------------------------------------------------------ */
const FLICKER = [
  { src: "photos/krakow.jpg", pos: "45% 50%" },
  { src: "photos/juwenalia-concert.jpg", pos: "50% 60%" },
  { src: "photos/morskie-oko.jpg", pos: "40% 50%" },
  { src: "photos/warsaw.jpg", pos: "62% 50%" },
  { src: "photos/pierogi.jpg", pos: "50% 50%" },
  { src: "photos/gdansk.jpg", pos: "50% 50%" },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const idx = Math.min(FLICKER.length - 1, Math.floor(frame / BEAT));
  const shot = FLICKER[idx];
  // every cut lands with a tiny punch-in
  const local = frame - idx * BEAT;
  const punch = interpolate(local, [0, 10], [1.07, 1.0], { ...clamp, easing: theme.ease.out });

  // line 1 slides up and dims when line 2 lands on beat 3
  const lift = spring({ frame: frame - 3 * BEAT, fps, config: theme.spring.snappy });

  return (
    <AbsoluteFill style={{ background: theme.colors.ink }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <Img src={staticFile(shot.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.pos }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.65) 100%)" }} />

      <AbsoluteFill style={{ justifyContent: "center", padding: `0 ${80 * u}px`, gap: 40 * u }}>
        <div style={{ transform: `translateY(${interpolate(lift, [0, 1], [0, -30 * u])}px)`, opacity: interpolate(lift, [0, 1], [1, 0.75]) }}>
          <WordReveal
            text="you said you wanted to go abroad."
            delay={-3}
            per={3}
            gap={20 * u}
            style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92 * u, lineHeight: 1.05, color: theme.colors.paper, letterSpacing: "-0.01em" }}
          />
        </div>
        <div style={{ minHeight: 330 * u }}>
          <Entrance delay={3 * BEAT - 2} y={30 * u} config={theme.spring.snappy}>
            <Script size={110 * u} color={theme.colors.paper}>so…</Script>
          </Entrance>
          <WordReveal
            text="WHERE ARE WE GOING?"
            delay={3 * BEAT + 3}
            per={4}
            gap={26 * u}
            style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 118 * u, lineHeight: 0.95, color: theme.colors.paper, letterSpacing: "-0.02em", marginTop: 6 * u }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2–3.5s POLAND. — red slams up on the drop, brush swoosh sweeps      */
/* ------------------------------------------------------------------ */
export const Poland: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  // Sequence starts LEAD frames early: the red panel rises during the lead and lands on the drop.
  const slam = spring({ frame, fps, config: theme.spring.slam });
  const word = spring({ frame: frame - 4, fps, config: theme.spring.slam });
  const breathe = 1 + Math.sin(frame / 18) * 0.008;

  return (
    <AbsoluteFill>
      {/* no background here: the hook photo stays visible above the rising panel */}
      <AbsoluteFill style={{ transform: `translateY(${interpolate(slam, [0, 1], [100, 0])}%)` }}>
        <ColorBg color={theme.colors.red} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", transform: `scale(${interpolate(word, [0, 1], [1.35, 1]) * breathe})`, opacity: Math.min(1, word * 2) }}>
            <Entrance delay={8} y={24 * u} config={theme.spring.snappy}>
              <Script size={96 * u} color={theme.colors.paper}>next stop:</Script>
            </Entrance>
            <div style={{ position: "relative", display: "inline-block", marginTop: 8 * u }}>
              <Swoosh delay={9} color={theme.colors.ink} len={12} style={{ left: "-6%", top: "50%", width: "112%", height: "0.46em", fontSize: 196 * u, zIndex: 0 }} />
              <Caps size={196 * u} color={theme.colors.paper} style={{ position: "relative", zIndex: 1 }}>
                Poland.
              </Caps>
            </div>
            <Entrance delay={20} y={20 * u} config={theme.spring.snappy} style={{ marginTop: 34 * u, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 * u }}>
              <Img src={staticFile("brand/aiesec-white.png")} style={{ height: 44 * u }} />
              <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40 * u, color: theme.colors.paper, letterSpacing: "0.04em", textTransform: "uppercase" }}>in Poland</span>
            </Entrance>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3.5–6s Montage: the site's polaroids pile up, one per beat          */
/* ------------------------------------------------------------------ */
const SHOTS = [
  { src: "photos/juwenalia-crowd.jpg", caption: "new friends", line: "MEET PEOPLE.", rot: -6, x: -40, y: -40, pos: "50% 40%" },
  { src: "photos/morskie-oko.jpg", caption: "weekends like this", line: "SEE THIS.", rot: 5, x: 50, y: 10, pos: "45% 50%" },
  { src: "photos/thank-you-card.jpg", caption: "real impact", line: "MAKE AN IMPACT.", rot: -3, x: -20, y: 40, pos: "50% 40%" },
  { src: "photos/pierogi.jpg", caption: "", line: "EAT PIEROGI.", rot: 7, x: 40, y: 60, pos: "50% 50%" },
] as const;

const STEP = 1.5 * BEAT; // 27 frames

export const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { u } = useLayout();
  const active = Math.min(SHOTS.length - 1, Math.floor(frame / STEP));
  // whole pile drifts and exits up on the last beat
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames + 6], [0, 1], { ...clamp, easing: theme.ease.in });

  return (
    <AbsoluteFill>
      <PaperBg />
      {/* headline swaps on every beat */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 * u }}>
        {SHOTS.map((s, i) => {
          if (i !== active) return null;
          const p = spring({ frame: frame - i * STEP + 3, fps, config: theme.spring.slam });
          return (
            <div key={s.line} style={{ position: "relative", transform: `translateY(${interpolate(p, [0, 1], [50 * u, 0])}px) scale(${interpolate(p, [0, 1], [1.12, 1])})`, opacity: Math.min(1, p * 2) }}>
              <Caps size={104 * u} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                {s.line}
              </Caps>
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 260 * u, transform: `translateY(${exit * -120 * u}px)` }}>
        {SHOTS.map((s, i) => {
          const p = spring({ frame: frame - i * STEP + 2, fps, config: theme.spring.bouncy });
          if (frame < i * STEP - 3) return null;
          const side = i % 2 ? 1 : -1;
          const settle = Math.sin((frame - i * STEP) / 26) * 1.2; // idle breathing
          return (
            <div
              key={s.src}
              style={{
                position: "absolute",
                transform: `translate(${interpolate(p, [0, 1], [side * 700 * u, s.x * u])}px, ${interpolate(p, [0, 1], [180 * u, s.y * u])}px) rotate(${interpolate(p, [0, 1], [side * 22, s.rot]) + settle}deg) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
              }}
            >
              <Polaroid src={s.src} caption={s.caption || undefined} width={720 * u} ratio={0.82} dur={6 * BEAT} position={s.pos} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
