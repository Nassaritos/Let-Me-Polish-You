import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Caps, ColorBg, Entrance, PaperBg, Screen, Script, Swoosh, Tap, useLayout } from "../components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* 12–17.5s REAL PROJECTS → REAL DATES → ALL OVER POLAND                */
/* ------------------------------------------------------------------ */
// Live captures (public/site/manifest.json). Card PNGs are 4x element shots.
const CARDS = [
  { src: "site/d-card-igv.png", w: 1720, h: 1032, rot: -3, y: 0 },
  { src: "site/d-card-igta.png", w: 1720, h: 1132, rot: 2.5, y: 300 },
  { src: "site/d-card-igte.png", w: 1720, h: 1132, rot: -1.5, y: 610 },
] as const;
// "STARTS · Nov 2026" in the Global Classroom card, as a fraction of the card image.
const DATE = { cx: 0.555, cy: 0.71, rw: 0.15, rh: 0.085 };

const DATES_AT = 3 * BEAT;
const MAP_AT = 6 * BEAT;
const LINES = [
  { at: 0, text: "REAL PROJECTS." },
  { at: DATES_AT, text: "REAL DATES." },
  { at: MAP_AT, text: "ALL OVER POLAND." },
];

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, u } = useLayout();

  const cardW = 880 * u;
  const stackTop = 560 * u;
  const cardX = (width - cardW) / 2;

  // phase 2: push into the date on card 1
  const push = interpolate(frame, [DATES_AT, DATES_AT + 16], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const c1h = cardW * (CARDS[0].h / CARDS[0].w);
  const focusX = cardX + DATE.cx * cardW;
  const focusY = stackTop + DATE.cy * c1h;
  const zoom = interpolate(push, [0, 1], [1, 2.35]);
  const toCenterX = interpolate(push, [0, 1], [0, width / 2 - focusX]);
  const toCenterY = interpolate(push, [0, 1], [0, height * 0.52 - focusY]);

  // phase 3: map rises, cards leave
  const mapIn = spring({ frame: frame - MAP_AT + 4, fps, config: theme.spring.smooth });
  const cardsOut = interpolate(frame, [MAP_AT - 6, MAP_AT + 4], [0, 1], { ...clamp, easing: theme.ease.in });

  const circle = interpolate(frame, [DATES_AT + 14, DATES_AT + 28], [0, 1], { ...clamp, easing: theme.ease.out });
  const activeLine = LINES.filter((l) => frame >= l.at).pop()!;

  return (
    <AbsoluteFill>
      <PaperBg />

      {/* card stack */}
      <AbsoluteFill
        style={{
          transformOrigin: `${focusX}px ${focusY}px`,
          transform: `translate(${toCenterX}px, ${toCenterY}px) scale(${zoom}) translateY(${cardsOut * -300 * u}px)`,
          opacity: 1 - cardsOut,
        }}
      >
        {CARDS.map((c, i) => {
          const p = spring({ frame: frame + 3 - i * BEAT, fps, config: theme.spring.bouncy });
          if (frame < i * BEAT - 4) return null;
          const h = cardW * (c.h / c.w);
          // other cards step back while we push into card 1
          const fade = i === 0 ? 1 : 1 - push;
          const float = Math.sin((frame + i * 20) / 24) * 3 * u;
          return (
            <div
              key={c.src}
              style={{
                position: "absolute",
                left: cardX,
                top: stackTop + c.y * u + float,
                width: cardW,
                height: h,
                opacity: Math.min(1, p * 2) * fade,
                transform: `translateY(${interpolate(p, [0, 1], [500 * u, 0])}px) rotate(${interpolate(p, [0, 1], [i % 2 ? 12 : -12, c.rot * (1 - push)])}deg) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                zIndex: i === 0 ? 3 : 2 - i,
                filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.22))",
              }}
            >
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%" }} />
              {i === 0 && (
                <svg style={{ position: "absolute", left: (DATE.cx - DATE.rw) * cardW, top: (DATE.cy - DATE.rh) * h, width: DATE.rw * 2 * cardW, height: DATE.rh * 2 * h, overflow: "visible" }} viewBox="0 0 200 100" preserveAspectRatio="none">
                  <path
                    d="M30 60 C 20 20, 120 5, 180 30 C 210 50, 170 92, 100 94 C 40 96, 5 75, 22 45 C 30 32, 50 22, 70 18"
                    fill="none"
                    stroke={theme.colors.red}
                    strokeWidth={5}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - circle}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* white veil behind the headline while we're zoomed into the card */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 26%, rgba(255,255,255,0) 40%)",
          opacity: push * (1 - cardsOut),
        }}
      />

      {/* live map */}
      <AbsoluteFill style={{ background: theme.colors.ink, opacity: Math.min(1, mapIn * 1.6) }}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 220 * u, transform: `translateY(${interpolate(mapIn, [0, 1], [height * 0.35, 0])}px)` }}>
          <Img
            src={staticFile("site/d-map-only.png")}
            style={{ width: 1000 * u, transform: `scale(${interpolate(frame, [MAP_AT, MAP_AT + 3 * BEAT], [1.0, 1.1], { ...clamp, easing: theme.ease.inOut })})` }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* headline (changes on beats) */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 * u }}>
        {LINES.map((l) => {
          if (l !== activeLine) return null;
          const p = spring({ frame: frame - l.at + 3, fps, config: theme.spring.slam });
          const onDark = l.at >= MAP_AT;
          const pill = l.at === DATES_AT; // over the zoomed card: solid pill for legibility
          return (
            <div key={l.text} style={{ position: "relative", textAlign: "center", opacity: Math.min(1, p * 2), transform: `translateY(${interpolate(p, [0, 1], [40 * u, 0])}px) scale(${interpolate(p, [0, 1], [1.12, 1])})` }}>
              <Caps
                size={108 * u}
                color={onDark || pill ? theme.colors.paper : theme.colors.ink}
                style={{ position: "relative", zIndex: 1, background: pill ? theme.colors.red : "transparent", padding: pill ? `${14 * u}px ${30 * u}px` : 0, borderRadius: 18 * u, boxShadow: pill ? "0 20px 40px -20px rgba(0,0,0,0.5)" : "none" }}
              >
                {l.text}
              </Caps>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 17.5–21s The real mobile site: home → experience → project → apply  */
/* ------------------------------------------------------------------ */
// Mobile captures are 390×844 css @3x. Positions below are css px on the page.
const CSS_W = 390;
const CSS_H = 844;
const STRIP_H = 7173 / 3; // css height of m-home-strip.png
const HOME_SCROLL_TO = 1270; // css y — "Choose your experience" heading + Global Volunteer card in view
const TAP_HOME = { x: 175, y: 1880 }; // the Global Volunteer card
const TAP_PROJECT = { x: 200, y: 300 }; // first project card on /global-volunteer
const TAP_APPLY = { x: 195, y: 805 }; // "Apply on aiesec.org" sticky button
const HEADER = 72; // css height of the site's fixed mobile header

// Flow timeline (frames) — 7 beats = 126 frames
const F = { scroll: [5, 32], tapA: 36, bIn: 40, bScroll: [56, 70], tapB: 82, cIn: 87, tapC: 106, exit: [116, 126] } as const;
const STEPS = [
  { at: 0, label: "FIND YOUR EXPERIENCE" },
  { at: F.bIn, label: "PICK A PROJECT" },
  { at: F.cIn, label: "APPLY." },
];

export const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();
  const sw = 640 * u;
  const k = sw / CSS_W;
  const sh = CSS_H * k;
  const left = (width - sw) / 2;
  const top = 430 * u;

  const enter = spring({ frame, fps, config: theme.spring.smooth });

  // step A — home page scroll
  const scrollA = interpolate(frame, [...F.scroll], [0, HOME_SCROLL_TO], { ...clamp, easing: theme.ease.inOut });
  // step B — /global-volunteer top → projects (vertical page move)
  const bIn = spring({ frame: frame - F.bIn + 2, fps, config: theme.spring.snappy });
  const bScroll = interpolate(frame, [...F.bScroll], [0, 1], { ...clamp, easing: theme.ease.inOut });
  // step C — opportunity page
  const cIn = spring({ frame: frame - F.cIn + 2, fps, config: theme.spring.snappy });

  const tapA = { x: left + TAP_HOME.x * k, y: top + (TAP_HOME.y - HOME_SCROLL_TO) * k };
  const tapB = { x: left + TAP_PROJECT.x * k, y: top + TAP_PROJECT.y * k };
  const tapC = { x: left + TAP_APPLY.x * k, y: top + TAP_APPLY.y * k };

  const active = STEPS.filter((s) => frame >= s.at).pop()!;
  const exit = interpolate(frame, [...F.exit], [0, 1], { ...clamp, easing: theme.ease.in });

  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.red} />
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.06})` }}>
        {/* caption */}
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 * u }}>
          {STEPS.map((s) => {
            if (s !== active) return null;
            const p = spring({ frame: frame - s.at + 3, fps, config: theme.spring.slam });
            return (
              <div key={s.label} style={{ opacity: Math.min(1, p * 2), transform: `translateY(${interpolate(p, [0, 1], [30 * u, 0])}px)` }}>
                <Caps size={70 * u} color={theme.colors.paper} style={{ textAlign: "center", maxWidth: 900 * u }}>
                  {s.label}
                </Caps>
              </div>
            );
          })}
        </AbsoluteFill>

        <div style={{ position: "absolute", left, top, transform: `translateY(${interpolate(enter, [0, 1], [900 * u, 0])}px) rotate(${interpolate(enter, [0, 1], [-6, 0])}deg)` }}>
          {/* A: home */}
          <Screen src="site/m-home-strip.png" width={sw} height={sh} imgHeight={STRIP_H * k} offsetY={scrollA * k} radius={52 * u} />
          {/* B: global volunteer page, scale-through from the tapped card */}
          {frame >= F.bIn - 2 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: `${TAP_HOME.x * k}px ${(TAP_HOME.y - HOME_SCROLL_TO) * k}px`,
                transform: `scale(${interpolate(bIn, [0, 1], [0.2, 1])})`,
                opacity: Math.min(1, bIn * 2),
              }}
            >
              <div style={{ width: sw, height: sh, borderRadius: 52 * u, overflow: "hidden", position: "relative", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.6)" }}>
                {/* page content scrolls; the site's fixed header stays pinned (one header, like the real site) */}
                <div style={{ position: "absolute", left: 0, top: -bScroll * (sh - HEADER * k), width: sw }}>
                  <Img src={staticFile("site/m-gv-top.png")} style={{ width: sw, height: sh, display: "block" }} />
                  <div style={{ width: sw, height: sh - HEADER * k, overflow: "hidden", position: "relative" }}>
                    <Img src={staticFile("site/m-gv-projects.png")} style={{ position: "absolute", top: -HEADER * k, width: sw, height: sh }} />
                  </div>
                </div>
                <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: HEADER * k, overflow: "hidden" }}>
                  <Img src={staticFile("site/m-gv-top.png")} style={{ width: sw, height: sh }} />
                </div>
              </div>
            </div>
          )}
          {/* C: opportunity detail */}
          {frame >= F.cIn - 2 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: `${TAP_PROJECT.x * k}px ${TAP_PROJECT.y * k}px`,
                transform: `scale(${interpolate(cIn, [0, 1], [0.2, 1])})`,
                opacity: Math.min(1, cIn * 2),
              }}
            >
              <Screen src="site/m-detail.png" width={sw} height={sh} radius={52 * u} />
            </div>
          )}
        </div>
        <Tap at={F.tapA} x={tapA.x} y={tapA.y} />
        <Tap at={F.tapB} x={tapB.x} y={tapB.y} />
        <Tap at={F.tapC} x={tapC.x} y={tapC.y} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 21–24s CTA                                                          */
/* ------------------------------------------------------------------ */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const logo = spring({ frame: frame + 3, fps, config: theme.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 20) * 0.012;

  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.red} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 * u, paddingBottom: 60 * u }}>
        <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1]) * breathe}) rotate(${interpolate(logo, [0, 1], [-8, 0])}deg)`, opacity: Math.min(1, logo * 2) }}>
          <Img src={staticFile("brand/lmpy-white.png")} style={{ width: 620 * u }} />
        </div>
        <Entrance delay={BEAT} y={30 * u} config={theme.spring.snappy} style={{ textAlign: "center" }}>
          <Script size={84 * u} color={theme.colors.paper}>find your experience</Script>
          <Caps size={92 * u} color={theme.colors.paper} style={{ marginTop: 4 * u }}>
            in Poland.
          </Caps>
        </Entrance>
        <Entrance delay={2 * BEAT} y={30 * u} config={theme.spring.snappy}>
          <div style={{ background: theme.colors.paper, borderRadius: 18 * u, padding: `${22 * u}px ${36 * u}px`, boxShadow: "0 8px 0 rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 16 * u }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 46 * u, color: theme.colors.ink, letterSpacing: "-0.01em" }}>let-me-polish-you.vercel.app</span>
          </div>
        </Entrance>
        <Entrance delay={2.5 * BEAT} y={20 * u} config={theme.spring.snappy} style={{ display: "flex", alignItems: "center", gap: 16 * u, marginTop: 20 * u }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34 * u, color: theme.colors.paper }}>Powered by</span>
          <Img src={staticFile("brand/aiesec-white.png")} style={{ height: 44 * u }} />
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 34 * u, color: theme.colors.paper }}>in Poland</span>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

