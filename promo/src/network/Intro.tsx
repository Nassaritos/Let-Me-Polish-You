import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, theme } from "../theme";
import { Caps, ColorBg, Entrance, PaperBg, Script, Swoosh, useLayout } from "../components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Keeps the lowercase plural in "LCs" / "EPs" inside uppercase type. */
export const s = <span style={{ textTransform: "none" }}>s</span>;

/** A headline that slams in (pre-rolled 3 frames so it is visible on its beat). */
export const Slam: React.FC<{ at?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at + 3, fps, config: theme.spring.slam });
  if (frame < at - 3) return null;
  return <div style={{ opacity: Math.min(1, p * 2), transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [1.1, 1])})`, ...style }}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/* 0–6 beats: "network, big news from AIESEC in Poland" → 3 · 2 · 1     */
/* ------------------------------------------------------------------ */
export const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const away = interpolate(frame, [3 * BEAT - 8, 3 * BEAT], [0, 1], { ...clamp, easing: theme.ease.in });

  return (
    <AbsoluteFill>
      <ColorBg color={theme.colors.ink} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - away, transform: `translateY(${-away * 80 * u}px)` }}>
        <Entrance delay={-3} y={30 * u} config={theme.spring.snappy}>
          <Script size={110 * u} color={theme.colors.paper} style={{ textAlign: "center" }}>
            network, big news from
          </Script>
        </Entrance>
        <Entrance delay={8} y={30 * u} config={theme.spring.snappy} style={{ display: "flex", alignItems: "center", gap: 24 * u, marginTop: 36 * u }}>
          <Img src={staticFile("brand/aiesec-white.png")} style={{ height: 78 * u }} />
          <Caps size={74 * u} color={theme.colors.paper}>
            in Poland
          </Caps>
        </Entrance>
      </AbsoluteFill>
      {/* countdown on beats 3, 4, 5 */}
      {["3", "2", "1"].map((n, i) => {
        const at = (3 + i) * BEAT;
        const local = frame - at;
        if (local < -3 || local > BEAT) return null;
        const p = spring({ frame: local + 3, fps, config: theme.spring.slam });
        const out = interpolate(local, [BEAT - 6, BEAT], [0, 1], { ...clamp, easing: theme.ease.in });
        return (
          <AbsoluteFill key={n} style={{ alignItems: "center", justifyContent: "center" }}>
            <Caps
              size={560 * u}
              color={i === 2 ? theme.colors.red : theme.colors.paper}
              style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `scale(${interpolate(p, [0, 1], [1.6, 1]) * (1 - out * 0.3)})`, letterSpacing: 0 }}
            >
              {n}
            </Caps>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6–10 beats: the drop — NOW LIVE (rendered with a 6-frame lead)      */
/* ------------------------------------------------------------------ */
export const LIVE_LEAD = 6;
export const Live: React.FC = () => {
  const raw = useCurrentFrame();
  const frame = raw - LIVE_LEAD;
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const slam = spring({ frame: raw, fps, config: theme.spring.slam });
  const logo = spring({ frame: frame + 2, fps, config: theme.spring.bouncy });
  const stamp = spring({ frame: frame - BEAT + 2, fps, config: { damping: 12, stiffness: 300, mass: 0.6 } });
  const breathe = 1 + Math.sin(frame / 18) * 0.01;

  return (
    <AbsoluteFill style={{ transform: `translateY(${interpolate(slam, [0, 1], [100, 0])}%)` }}>
      <ColorBg color={theme.colors.red} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 80 * u }}>
        <div style={{ position: "relative", transform: `scale(${interpolate(logo, [0, 1], [0.55, 1]) * breathe})`, opacity: Math.min(1, logo * 2) }}>
          <Img src={staticFile("brand/lmpy-white.png")} style={{ width: 640 * u }} />
          {/* NOW LIVE stamp */}
          <div
            style={{
              position: "absolute",
              right: -40 * u,
              bottom: -30 * u,
              background: theme.colors.paper,
              padding: `${16 * u}px ${30 * u}px`,
              borderRadius: 16 * u,
              boxShadow: "0 10px 0 rgba(0,0,0,0.2)",
              transform: `rotate(-8deg) scale(${frame < BEAT - 3 ? 0 : interpolate(stamp, [0, 1], [2.2, 1])})`,
              opacity: frame < BEAT - 3 ? 0 : Math.min(1, stamp * 3),
              display: "flex",
              alignItems: "center",
              gap: 14 * u,
            }}
          >
            <span style={{ width: 22 * u, height: 22 * u, borderRadius: "50%", background: theme.colors.red, display: "inline-block", opacity: 0.6 + 0.4 * Math.sin(frame / 4) }} />
            <Caps size={64 * u}>Now live</Caps>
          </div>
        </div>
        <Entrance delay={2 * BEAT} y={30 * u} config={theme.spring.snappy} style={{ marginTop: 80 * u }}>
          <Script size={100 * u} color={theme.colors.paper}>
            our new search tool
          </Script>
        </Entrance>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* What it is: real desktop homepage + "every Polish opportunity"      */
/* ------------------------------------------------------------------ */
export const What: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, u } = useLayout();
  const screen = spring({ frame: frame + 2, fps, config: theme.spring.smooth });
  const sw = 980 * u;
  const sh = sw * (1800 / 2880);
  const push = interpolate(frame, [0, 8 * BEAT], [1, 1.06], { ...clamp, easing: theme.ease.inOut });

  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 * u }}>
        <Slam at={0}>
          <Caps size={92 * u} style={{ textAlign: "center" }}>
            Every Polish
            <br />
            opportunity.
          </Caps>
        </Slam>
        <Slam at={2.5 * BEAT} style={{ marginTop: 14 * u, position: "relative" }}>
          <Swoosh delay={2.5 * BEAT + 6} style={{ left: "-4%", top: "48%", width: "108%", height: "0.42em", fontSize: 92 * u }} />
          <Caps size={92 * u} style={{ position: "relative", textAlign: "center" }}>
            One search tool.
          </Caps>
        </Slam>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (width - sw) / 2,
          top: 760 * u,
          width: sw,
          height: sh,
          borderRadius: 22 * u,
          overflow: "hidden",
          boxShadow: "0 50px 100px -30px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.06)",
          transform: `perspective(1600px) rotateX(${interpolate(screen, [0, 1], [24, 0])}deg) translateY(${interpolate(screen, [0, 1], [400 * u, 0])}px) scale(${push})`,
          opacity: Math.min(1, screen * 1.5),
        }}
      >
        <Img src={staticFile("site/d-home-hero.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 300 * u }}>
        <div style={{ display: "flex", gap: 34 * u, alignItems: "center" }}>
          {(["gv", "gta", "gte"] as const).map((p, i) => (
            <Entrance key={p} delay={4 * BEAT + i * 6} y={24 * u} config={theme.spring.snappy}>
              <Img src={staticFile(`brand/${p}-color.png`)} style={{ height: 66 * u }} />
            </Entrance>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
