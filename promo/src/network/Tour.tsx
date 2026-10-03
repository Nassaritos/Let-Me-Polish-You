import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Caps, ColorBg, Entrance, PaperBg, Screen, Script, Tap, useLayout } from "../components";
import { Slam, s as pl } from "./Intro";
import manifest from "../../public/site/manifest.json";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** One caption at a time; each slams in on its own cue. */
const Cues: React.FC<{ cues: { at: number; text: React.ReactNode }[]; size: number; color?: string; top: number }> = ({ cues, size, color = theme.colors.ink, top }) => {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const active = cues.filter((c) => frame >= c.at - 3).pop();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      {active && (
        <Slam key={active.at} at={active.at}>
          <Caps size={size} color={color} style={{ textAlign: "center", maxWidth: 960 * u }}>
            {active.text}
          </Caps>
        </Slam>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Search: real explorer → real filter sheet, each filter on a beat    */
/* ------------------------------------------------------------------ */
const FILTER_LABEL: Record<string, string> = {
  "Where?": "Where?",
  "How long?": "How long?",
  "When can you start?": "When?",
  "Which Global Goal?": "Which goal?",
};

export const SEARCH_FILTERS_AT = 4.5 * BEAT;
export const SEARCH_FILTER_STEP = 1.5 * BEAT;

export const Search: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();

  // desktop explorer (beats 0–2)
  const dw = 980 * u;
  const dh = dw * (1800 / 2880);
  const dIn = spring({ frame: frame + 3, fps, config: theme.spring.smooth });
  const dOut = interpolate(frame, [3 * BEAT - 6, 3 * BEAT + 4], [0, 1], { ...clamp, easing: theme.ease.in });

  // phone filter sheet (beats 2–7)
  const sw = 560 * u;
  const k = sw / 390;
  const sh = 844 * k;
  const left = (width - sw) / 2;
  const top = 540 * u;
  const pIn = spring({ frame: frame - 3 * BEAT + 4, fps, config: theme.spring.smooth });

  const filters = manifest.shots.filters;
  

  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 * u }}>
        <Slam at={0}>
          <Caps size={84 * u} style={{ textAlign: "center" }}>
            Find the right
            <br />
            project for
          </Caps>
        </Slam>
        <Slam at={1.5 * BEAT} style={{ marginTop: 6 * u }}>
          <Caps size={84 * u} color={theme.colors.red} style={{ textAlign: "center" }}>
            every EP.
          </Caps>
        </Slam>
      </AbsoluteFill>

      {/* desktop explorer */}
      {dOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: (width - dw) / 2,
            top: 640 * u,
            width: dw,
            height: dh,
            borderRadius: 22 * u,
            overflow: "hidden",
            boxShadow: "0 50px 100px -30px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.06)",
            opacity: Math.min(1, dIn * 1.5) * (1 - dOut),
            transform: `translateY(${interpolate(dIn, [0, 1], [300 * u, 0]) - dOut * 120 * u}px) scale(${interpolate(frame, [0, 3 * BEAT], [1, 1.05], { ...clamp, easing: theme.ease.inOut }) * (1 - dOut * 0.08)})`,
          }}
        >
          <Img src={staticFile("site/d-explore.png")} style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      {/* phone: the real filter sheet */}
      {frame >= 3 * BEAT - 6 && (
        <div style={{ position: "absolute", left, top, transform: `translateY(${interpolate(pIn, [0, 1], [900 * u, 0])}px) rotate(${interpolate(pIn, [0, 1], [5, 0])}deg)` }}>
          <Screen src="site/m-filters.png" width={sw} height={sh} radius={48 * u} />
          {filters.map((f, i) => {
            const at = SEARCH_FILTERS_AT + i * SEARCH_FILTER_STEP;
            const p = spring({ frame: frame - at + 3, fps, config: theme.spring.snappy });
            if (frame < at - 3) return null;
            const current = i === filters.length - 1 || frame < at + SEARCH_FILTER_STEP - 3;
            const pad = 8;
            // the sheet's chips run past the right edge: keep the outline inside the phone
            const x = (f.x - pad) * k;
            const w = Math.min(f.w + 2 * pad, 390 - f.x + pad - 6) * k;
            return (
              <React.Fragment key={f.label}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: (f.y - pad) * k,
                    width: w,
                    height: (f.h + 2 * pad) * k,
                    border: `${5 * u}px solid ${theme.colors.red}`,
                    borderRadius: 18 * u,
                    opacity: Math.min(1, p * 2) * (current ? 1 : 0.35),
                    transform: `scale(${interpolate(p, [0, 1], [1.08, 1])})`,
                  }}
                />
                {current && (
                  <div
                    style={{
                      position: "absolute",
                      right: -150 * u,
                      top: (f.y - pad) * k - 34 * u,
                      background: theme.colors.red,
                      color: theme.colors.paper,
                      borderRadius: 14 * u,
                      padding: `${10 * u}px ${22 * u}px`,
                      boxShadow: "0 16px 30px -14px rgba(0,0,0,0.5)",
                      opacity: Math.min(1, p * 2),
                      transform: `rotate(-4deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Caps size={46 * u} color={theme.colors.paper}>
                      {FILTER_LABEL[f.label ?? ""] ?? f.label}
                    </Caps>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Map: the real live map + its place card                             */
/* ------------------------------------------------------------------ */
export const MAP_CARD_AT = 2 * BEAT;

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();
  const mIn = spring({ frame: frame + 3, fps, config: theme.spring.smooth });
  const cIn = spring({ frame: frame - MAP_CARD_AT, fps, config: theme.spring.bouncy });
  const mw = 1000 * u;
  const out = interpolate(frame, [6 * BEAT - 8, 6 * BEAT], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.ink} />
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 * u }}>
          <Slam at={0}>
            <Caps size={96 * u} color={theme.colors.paper} style={{ textAlign: "center" }}>
              Every place
              <br />
              on one map.
            </Caps>
          </Slam>
        </AbsoluteFill>
        <Img
          src={staticFile("site/d-map-only.png")}
          style={{
            position: "absolute",
            left: (width - mw) / 2,
            top: 560 * u,
            width: mw,
            opacity: Math.min(1, mIn * 1.5),
            transform: `translateY(${interpolate(mIn, [0, 1], [260 * u, 0])}px) scale(${interpolate(frame, [0, 6 * BEAT], [1, 1.07], { ...clamp, easing: theme.ease.inOut })})`,
          }}
        />
        {frame >= MAP_CARD_AT - 2 && (
          <div
            style={{
              position: "absolute",
              left: width / 2 - 150 * u,
              top: 1240 * u,
              width: 560 * u,
              borderRadius: 18 * u,
              overflow: "hidden",
              boxShadow: "0 40px 80px -24px rgba(0,0,0,0.7)",
              opacity: Math.min(1, cIn * 2),
              transform: `translateY(${interpolate(cIn, [0, 1], [80 * u, 0]) + Math.sin(frame / 16) * 4 * u}px) rotate(${interpolate(cIn, [0, 1], [8, 2])}deg) scale(${interpolate(cIn, [0, 1], [0.8, 1])})`,
            }}
          >
            <Img src={staticFile("site/d-map-card.png")} style={{ width: "100%", display: "block" }} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Page: a real opportunity page, scrolled section by section          */
/* ------------------------------------------------------------------ */
const CSS_W = 390;
const CSS_H = 844;
const HEADER = 72; // css height of the site's fixed mobile header
const APPLY_BAR = 78; // css height of the fixed "Apply on aiesec.org" bar
const sections = manifest.shots.detailFull.sections as Record<string, number>;
const near = (y: number | null | undefined) => Math.max(0, (y ?? 0) - HEADER - 24);
// [arrive frame, css scroll position, caption]
export const PAGE_STOPS: { at: number; y: number; text: string }[] = [
  { at: 0, y: 0, text: "Dates & spots" },
  { at: 3 * BEAT, y: near(manifest.shots.detailFull.sdg) - 70, text: "SDG impact" },
  { at: 5.5 * BEAT, y: near(sections["What you'll do"]), text: "Week-by-week plan" },
  { at: 8 * BEAT, y: near(sections["What you bring"]), text: "Requirements" },
  { at: 10.5 * BEAT, y: near(sections["What's included"]), text: "What's included" },
];
export const PAGE_TAP = 13 * BEAT;
const MOVE = 16; // frames per scroll move (arrives on the cue)

export const Page: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();
  const sw = 600 * u;
  const k = sw / CSS_W;
  const sh = CSS_H * k;
  const left = (width - sw) / 2;
  const top = 470 * u;
  const enter = spring({ frame: frame + 3, fps, config: theme.spring.smooth });

  let y = 0;
  for (let i = 1; i < PAGE_STOPS.length; i++) {
    const s = PAGE_STOPS[i];
    const prev = PAGE_STOPS[i - 1].y;
    y = frame < s.at - MOVE ? y : interpolate(frame, [s.at - MOVE, s.at], [prev, s.y], { ...clamp, easing: theme.ease.inOut });
  }
  const bar = spring({ frame: frame - PAGE_TAP + 8, fps, config: theme.spring.bouncy });
  const out = interpolate(frame, [15 * BEAT - 8, 15 * BEAT], [0, 1], { ...clamp, easing: theme.ease.in });
  const fullH = manifest.shots.detailFull.cssHeight * k;

  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.red} />
      <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.05})` }}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 * u }}>
          <Entrance delay={-3} y={20 * u} config={theme.spring.snappy}>
            <Script size={78 * u} color={theme.colors.paper}>
              every opportunity gets a page
            </Script>
          </Entrance>
        </AbsoluteFill>
        <Cues
          top={300 * u}
          size={76 * u}
          color={theme.colors.paper}
          cues={[
            ...PAGE_STOPS.map((s) => ({ at: s.at, text: s.text })),
            { at: PAGE_TAP - 4, text: <>One tap to aiesec.org</> },
          ]}
        />
        <div style={{ position: "absolute", left, top, transform: `translateY(${interpolate(enter, [0, 1], [900 * u, 0])}px) rotate(${interpolate(enter, [0, 1], [-5, 0])}deg)` }}>
          <div style={{ width: sw, height: sh, borderRadius: 52 * u, overflow: "hidden", position: "relative", background: theme.colors.paper, boxShadow: "0 50px 100px -30px rgba(0,0,0,0.6)" }}>
            {/* scrolling page body (captured with the fixed header/bar hidden) */}
            <Img src={staticFile("site/m-detail-full.png")} style={{ position: "absolute", left: 0, top: -y * k, width: sw, height: fullH }} />
            {/* the real fixed header and apply bar, pinned like on the site */}
            <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: HEADER * k, overflow: "hidden" }}>
              <Img src={staticFile("site/m-detail.png")} style={{ width: sw, height: sh }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: sw,
                height: APPLY_BAR * k,
                overflow: "hidden",
                transformOrigin: "50% 50%",
                transform: `scale(${1 + Math.sin(Math.min(1, bar) * Math.PI) * 0.06})`,
              }}
            >
              <Img src={staticFile("site/m-detail.png")} style={{ position: "absolute", left: 0, top: -(CSS_H - APPLY_BAR) * k, width: sw, height: sh }} />
            </div>
          </div>
          <Tap at={PAGE_TAP} x={sw / 2} y={sh - (APPLY_BAR / 2) * k} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Content: Life in Poland grid → What's AIESEC? steps                 */
/* ------------------------------------------------------------------ */
// d-about-steps.png is one row of 4 cards; crop them into a 2×2 grid.
const STEPS_IMG = { w: 2656, h: 454, cards: [0, 672, 1344, 2016], cardW: 640 };
export const CONTENT_SWAP = 6 * BEAT;

const Chip: React.FC<{ at: number; children: React.ReactNode; color?: string }> = ({ at, children, color = theme.colors.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const p = spring({ frame: frame - at + 3, fps, config: theme.spring.bouncy });
  if (frame < at - 3) return null;
  return (
    <div
      style={{
        background: color,
        borderRadius: 999,
        padding: `${16 * u}px ${30 * u}px`,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${interpolate(p, [0, 1], [30 * u, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        boxShadow: "0 12px 24px -14px rgba(0,0,0,0.5)",
      }}
    >
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 38 * u, color: theme.colors.paper, textTransform: "uppercase", letterSpacing: "0.01em" }}>{children}</span>
    </div>
  );
};

export const Content: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();

  const gw = 960 * u;
  const gh = gw * (2674 / 2880);
  const gIn = spring({ frame: frame + 3, fps, config: theme.spring.smooth });
  const gOut = interpolate(frame, [CONTENT_SWAP - 6, CONTENT_SWAP + 4], [0, 1], { ...clamp, easing: theme.ease.in });
  const drift = interpolate(frame, [0, CONTENT_SWAP], [0, -60 * u], { ...clamp, easing: theme.ease.inOut });

  const cw = 450 * u;
  const ck = cw / STEPS_IMG.cardW;
  const ch = STEPS_IMG.h * ck;
  const gap = 24 * u;

  return (
    <AbsoluteFill>
      <PaperBg tint={frame >= CONTENT_SWAP ? theme.colors.blue : theme.colors.red} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 * u }}>
        <Slam at={0}>
          <Caps size={88 * u} style={{ textAlign: "center" }}>
            Content your
            <br />
            EP{pl} will love.
          </Caps>
        </Slam>
      </AbsoluteFill>

      {/* Life in Poland */}
      {gOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: (width - gw) / 2,
            top: 500 * u,
            width: gw,
            height: 880 * u,
            overflow: "hidden",
            borderRadius: 24 * u,
            opacity: Math.min(1, gIn * 1.5) * (1 - gOut),
            transform: `translateY(${interpolate(gIn, [0, 1], [300 * u, 0]) - gOut * 100 * u}px)`,
            maskImage: "linear-gradient(180deg, #000 85%, transparent)",
          }}
        >
          <Img src={staticFile("site/d-poland-grid.png")} style={{ width: gw, height: gh, transform: `translateY(${drift}px)` }} />
        </div>
      )}

      {/* What's AIESEC? — how it works */}
      {frame >= CONTENT_SWAP - 4 &&
        STEPS_IMG.cards.map((x0, i) => {
          const at = CONTENT_SWAP + i * 7;
          const p = spring({ frame: frame - at + 3, fps, config: theme.spring.snappy });
          const col = i % 2;
          const row = Math.floor(i / 2);
          const float = Math.sin((frame + i * 11) / 18) * 3 * u;
          return (
            <div
              key={x0}
              style={{
                position: "absolute",
                left: width / 2 - cw - gap / 2 + col * (cw + gap),
                top: 600 * u + row * (ch + gap) + float,
                width: cw,
                height: ch,
                borderRadius: 20 * u,
                overflow: "hidden",
                boxShadow: `0 30px 60px -28px ${theme.colors.blue}8C, 0 0 0 1px rgba(0,0,0,0.05)`,
                opacity: Math.min(1, p * 2),
                transform: `translateY(${interpolate(p, [0, 1], [120 * u, 0])}px) rotate(${interpolate(p, [0, 1], [col ? 4 : -4, 0])}deg)`,
              }}
            >
              <Img src={staticFile("site/d-about-steps.png")} style={{ position: "absolute", left: -x0 * ck, top: 0, width: STEPS_IMG.w * ck, height: ch }} />
            </div>
          );
        })}

      {/* what's on the site */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 400 * u }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 * u, maxWidth: 940 * u }}>
          <Chip at={1.5 * BEAT}>Life in Poland</Chip>
          <Chip at={3 * BEAT} color={theme.colors.red}>Polish 101</Chip>
          <Chip at={CONTENT_SWAP + 1.5 * BEAT} color={theme.colors.blue}>What&apos;s AIESEC?</Chip>
          <Chip at={CONTENT_SWAP + 3 * BEAT}>How it works</Chip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* LCs: the active host LCs (names from the live site) with their logos */
/* ------------------------------------------------------------------ */
const slug = (name: string) =>
  name
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const LCS_START = BEAT;
export const LCS_STEP = 7;

export const Lcs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();
  const names = manifest.lcNames;
  const cols = 3;
  const cellW = 330 * u;
  const cellH = 190 * u;
  const gridW = cols * cellW;
  const START = LCS_START;
  const STEP = LCS_STEP;

  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 * u }}>
        <Slam at={0}>
          <Caps size={104 * u} style={{ textAlign: "center" }}>
            {names.length} host LC{pl}.
          </Caps>
        </Slam>
        <Slam at={START + names.length * STEP} style={{ marginTop: 10 * u }}>
          <Caps size={104 * u} color={theme.colors.red} style={{ textAlign: "center" }}>
            One team.
          </Caps>
        </Slam>
      </AbsoluteFill>
      {names.map((n, i) => {
        const at = START + i * STEP;
        const p = spring({ frame: frame - at + 2, fps, config: theme.spring.bouncy });
        if (frame < at - 2) return null;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const bob = Math.sin((frame + i * 7) / 15) * 4 * u;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: (width - gridW) / 2 + col * cellW,
              top: 560 * u + row * (cellH + 50 * u) + bob,
              width: cellW,
              height: cellH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.min(1, p * 2),
              transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${interpolate(p, [0, 1], [i % 2 ? 10 : -10, 0])}deg)`,
            }}
          >
            <Img src={staticFile(`lcs/${slug(n)}.png`)} style={{ width: cellW - 20 * u, height: cellH, objectFit: "contain" }} />
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 330 * u }}>
        <Entrance delay={START + names.length * STEP + BEAT} y={20 * u} config={theme.spring.snappy}>
          <Script size={74 * u}>each with its own city guide</Script>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Ask: how other entities use it                                      */
/* ------------------------------------------------------------------ */
// A real filtered link: the explorer reads ?sdg= (see lib/filters.ts).
const FILTERED_LINK = "let-me-polish-you.vercel.app/opportunities?sdg=4";

export const ASK_STEPS = [2 * BEAT, 5 * BEAT, 8 * BEAT];

export const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const steps: { at: number; title: React.ReactNode; detail?: React.ReactNode }[] = [
    { at: ASK_STEPS[0], title: <>Share it with your EP{pl}</> },
    {
      at: ASK_STEPS[1],
      title: "Send a filtered link",
      detail: (
        <div style={{ display: "inline-block", marginTop: 16 * u, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.18)", borderRadius: 14 * u, padding: `${12 * u}px ${20 * u}px` }}>
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30 * u, color: theme.colors.paper }}>{FILTERED_LINK}</span>
        </div>
      ),
    },
    { at: ASK_STEPS[2], title: "They apply on aiesec.org.", detail: <Script size={100 * u} style={{ marginTop: 10 * u }}>we match.</Script> },
  ];
  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.ink} />
      <AbsoluteFill style={{ padding: `0 ${90 * u}px ${120 * u}px`, gap: 80 * u, justifyContent: "center" }}>
        <Slam at={0}>
          <Script size={90 * u}>so, how do you use it?</Script>
        </Slam>
        {steps.map((s, i) => {
          const p = spring({ frame: frame - s.at + 3, fps, config: theme.spring.snappy });
          if (frame < s.at - 3) return <div key={i} style={{ height: 110 * u }} />;
          return (
            <div key={i} style={{ display: "flex", gap: 36 * u, alignItems: "flex-start", opacity: Math.min(1, p * 2), transform: `translateX(${interpolate(p, [0, 1], [-70 * u, 0])}px)` }}>
              <div
                style={{
                  flex: "none",
                  width: 110 * u,
                  height: 110 * u,
                  borderRadius: "50%",
                  background: theme.colors.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
                }}
              >
                <Caps size={64 * u} color={theme.colors.paper} style={{ letterSpacing: 0 }}>
                  {i + 1}
                </Caps>
              </div>
              <div style={{ paddingTop: 14 * u }}>
                <Caps size={70 * u} color={theme.colors.paper} style={{ lineHeight: 1 }}>
                  {s.title}
                </Caps>
                {s.detail}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* End card                                                            */
/* ------------------------------------------------------------------ */
export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const logo = spring({ frame: frame + 3, fps, config: theme.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 20) * 0.012;
  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.red} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 * u, paddingBottom: 60 * u }}>
        <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1]) * breathe}) rotate(${interpolate(logo, [0, 1], [-8, 0])}deg)`, opacity: Math.min(1, logo * 2) }}>
          <Img src={staticFile("brand/lmpy-white.png")} style={{ width: 580 * u }} />
        </div>
        <Entrance delay={BEAT} y={30 * u} config={theme.spring.snappy}>
          <Caps size={140 * u} color={theme.colors.paper}>
            Let&apos;s match.
          </Caps>
        </Entrance>
        <Entrance delay={2 * BEAT} y={30 * u} config={theme.spring.snappy}>
          <div style={{ background: theme.colors.paper, borderRadius: 18 * u, padding: `${22 * u}px ${36 * u}px`, boxShadow: "0 8px 0 rgba(0,0,0,0.18)" }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: 46 * u, color: theme.colors.ink, letterSpacing: "-0.01em" }}>let-me-polish-you.vercel.app</span>
          </div>
        </Entrance>
        <Entrance delay={2.5 * BEAT} y={20 * u} config={theme.spring.snappy} style={{ display: "flex", alignItems: "center", gap: 16 * u, marginTop: 20 * u }}>
          <Img src={staticFile("brand/aiesec-white.png")} style={{ height: 48 * u }} />
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 900, fontSize: 38 * u, color: theme.colors.paper }}>in Poland</span>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
