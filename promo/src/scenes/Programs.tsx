import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Caps, ColorBg, Entrance, KenBurns, PaperBg, Swoosh, useLayout } from "../components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** One beat-block per experience (3 beats each). Names + promises are the site's own. */
const PROGRAMS = [
  { word: "GIVE.", name: "Global Volunteer", promise: "Make an impact.", color: theme.colors.gv, logo: "brand/gv-white.png", photo: "photos/thank-you-hug.jpg", pos: "50% 35%", from: "bottom" },
  { word: "GROW.", name: "Global Talent", promise: "Build your career.", color: theme.colors.gta, logo: "brand/gta-white.png", photo: "photos/warsaw-skyline-vistula.jpg", pos: "50% 50%", from: "top" },
  { word: "TEACH.", name: "Global Teacher", promise: "Change a classroom.", color: theme.colors.gte, logo: "brand/gte-white.png", photo: "photos/teaching-characters.jpg", pos: "50% 30%", from: "bottom" },
] as const;
const BLOCK = 3 * BEAT; // 45 frames

const Block: React.FC<{ p: (typeof PROGRAMS)[number]; local: number }> = ({ p, local }) => {
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  // colour wipe in 8 frames (direction alternates — the rhythm of three)
  const wipe = interpolate(local, [-6, 3], [100, 0], { ...clamp, easing: theme.ease.out });
  const clip = p.from === "bottom" ? `inset(${wipe}% 0 0 0)` : `inset(0 0 ${wipe}% 0)`;
  const win = spring({ frame: local + 4, fps, config: theme.spring.smooth });
  const word = spring({ frame: local + 1, fps, config: theme.spring.slam });
  const breathe = Math.sin(local / 14) * 4 * u;

  return (
    <AbsoluteFill style={{ clipPath: clip }}>
      <ColorBg color={p.color} />
      {/* product logo (official AIESEC mark) */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 * u }}>
        <Entrance delay={4} y={-20 * u} config={theme.spring.snappy}>
          <Img src={staticFile(p.logo)} style={{ height: 92 * u }} />
        </Entrance>
      </AbsoluteFill>
      {/* photo window */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 860 * u,
            height: 760 * u,
            borderRadius: 36 * u,
            overflow: "hidden",
            marginTop: -40 * u,
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45)",
            clipPath: `inset(${interpolate(win, [0, 1], [50, 0])}% ${interpolate(win, [0, 1], [8, 0])}% round ${36 * u}px)`,
            transform: `translateY(${breathe}px)`,
          }}
        >
          <KenBurns src={p.photo} dur={BLOCK} from={1.12} to={1.02} pan={14} position={p.pos} />
        </div>
      </AbsoluteFill>
      {/* the word overlaps the photo's bottom edge */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 330 * u }}>
        <div style={{ transform: `scale(${interpolate(word, [0, 1], [1.45, 1])})`, opacity: Math.min(1, word * 2), textAlign: "center" }}>
          <Caps size={250 * u} color={theme.colors.ink}>
            {p.word}
          </Caps>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52 * u, color: theme.colors.ink, marginTop: 14 * u }}>
            {p.name} · {p.promise}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Programs is rendered with a LEAD so each colour wipe lands on its beat. */
export const PROGRAMS_LEAD = 6;

export const Programs: React.FC = () => {
  const frame = useCurrentFrame() - PROGRAMS_LEAD;
  return (
    <AbsoluteFill>
      {PROGRAMS.map((p, i) => {
        const local = frame - i * BLOCK;
        if (local < -PROGRAMS_LEAD) return null;
        // keep the previous block underneath until the next wipe has covered it
        if (local > BLOCK + 10) return null;
        return <Block key={p.word} p={p} local={local} />;
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* "Which one is yours?" — the three colours collapse into the real    */
/* coloured tops of the site's "Choose your experience" cards.         */
/* ------------------------------------------------------------------ */
// d-chooser.png = 2880×1348 px (1440 css @2x). Card x-ranges measured from the capture.
const CHOOSER = { w: 2880, h: 1348, cardH: 1300, cards: [[128, 952], [1028, 1852], [1928, 2756]] as const };
// The three real cards, cropped from the capture and fanned like a hand of cards.
const FAN = [
  { dx: -330, dy: 46, rot: -9, z: 1 },
  { dx: 0, dy: 0, rot: 0, z: 3 },
  { dx: 330, dy: 46, rot: 9, z: 2 },
] as const;

export const Choose: React.FC<{ lines?: [string, string] }> = ({ lines = ["Which one", "is yours?"] }) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useLayout();

  const cw = 420 * u;
  const k = cw / (CHOOSER.cards[0][1] - CHOOSER.cards[0][0]);
  const ch = CHOOSER.cardH * k;
  const cx = width / 2;
  const cy = height * 0.57;

  const collapse = interpolate(frame, [0, 0.85 * BEAT], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const reveal = interpolate(frame, [0.7 * BEAT, 1.1 * BEAT], [0, 1], { ...clamp, easing: theme.ease.out });
  const colors = [theme.colors.gv, theme.colors.gta, theme.colors.gte];

  return (
    <AbsoluteFill>
      <PaperBg />
      {CHOOSER.cards.map(([x0], i) => {
        const f = FAN[i];
        const breathe = Math.sin((frame + i * 9) / 16) * 5 * u;
        const left = interpolate(collapse, [0, 1], [(width / 3) * i, cx + f.dx * u - cw / 2]);
        const top = interpolate(collapse, [0, 1], [0, cy + f.dy * u - ch / 2]) + breathe * reveal;
        const w = interpolate(collapse, [0, 1], [width / 3 + 1, cw]);
        const h = interpolate(collapse, [0, 1], [height, ch]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: w,
              height: h,
              zIndex: f.z,
              transform: `rotate(${interpolate(collapse, [0, 1], [0, f.rot])}deg)`,
              borderRadius: interpolate(collapse, [0, 1], [0, 16 * u]),
              overflow: "hidden",
              boxShadow: `0 ${30 * u}px ${60 * u}px -${24 * u}px rgba(0,0,0,${0.45 * reveal})`,
            }}
          >
            <Img
              src={staticFile("site/d-chooser.png")}
              style={{ position: "absolute", left: -x0 * k, top: 0, width: CHOOSER.w * k, height: CHOOSER.h * k, opacity: reveal }}
            />
            <AbsoluteFill style={{ background: colors[i], opacity: 1 - reveal }} />
          </div>
        );
      })}
      {/* headline */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 * u }}>
        <Entrance delay={0.55 * BEAT} y={40 * u} config={theme.spring.snappy} style={{ textAlign: "center" }}>
          <Caps size={112 * u}>{lines[0]}</Caps>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Swoosh delay={BEAT + 2} style={{ left: "-5%", top: "48%", width: "110%", height: "0.42em", fontSize: 112 * u }} />
            <Caps size={112 * u} style={{ position: "relative" }}>
              {lines[1]}
            </Caps>
          </div>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
