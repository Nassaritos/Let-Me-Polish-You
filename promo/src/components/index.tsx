import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------- layout -------------------------------- */
/**
 * All sizes are authored for 1080-wide vertical. `u` scales them for the
 * square/landscape variants (short side = 1080 in every format).
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const u = Math.min(width, height) / 1080;
  return { width, height, u, portrait: height > width, landscape: width > height };
};

/* ------------------------------ finishing ------------------------------ */
/** Unifying grade: a whisper of brand red in soft-light + gentle top/bottom falloff. */
export const Grade: React.FC<{ strength?: number }> = ({ strength = 0.05 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.red, mixBlendMode: "soft-light", opacity: strength }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.06), transparent 20%, transparent 80%, rgba(0,0,0,0.08))" }} />
  </AbsoluteFill>
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,${strength}) 100%)` }} />
);

/** Paper background with two slow, soft brand-tinted blobs (never a flat fill). */
export const PaperBg: React.FC<{ tint?: string; base?: string }> = ({ tint = theme.colors.red, base = theme.colors.paper }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -520, left: -380 + d1, filter: "blur(60px)", background: `radial-gradient(circle, ${tint}14, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -420, right: -300 - d2, filter: "blur(70px)", background: `radial-gradient(circle, ${tint}10, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

/** Solid brand colour field with a subtle moving sheen. */
export const ColorBg: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const x = 30 + Math.sin(frame / 40) * 15;
  return <AbsoluteFill style={{ background: `radial-gradient(120% 80% at ${x}% 20%, rgba(255,255,255,0.16), transparent 60%), ${color}` }} />;
};

/* -------------------------------- media -------------------------------- */
/** Ken Burns for every still: slow scale + pan over the clip's own duration. */
export const KenBurns: React.FC<{
  src: string;
  dur: number;
  from?: number;
  to?: number;
  pan?: number;
  position?: string;
  style?: React.CSSProperties;
}> = ({ src, dur, from = 1, to = 1.1, pan = -24, position = "50% 50%", style }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [from, to], { ...clamp, easing: theme.ease.inOut });
  const x = interpolate(frame, [0, dur], [0, pan], { ...clamp, easing: theme.ease.inOut });
  return (
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${scale}) translateX(${x}px)`, ...style }}
    />
  );
};

/* ------------------------------- motion -------------------------------- */
export const Entrance: React.FC<{
  delay?: number;
  y?: number;
  scaleFrom?: number;
  config?: (typeof theme.spring)[keyof typeof theme.spring];
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 40, scaleFrom = 0.94, config = theme.spring.smooth, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });
  return (
    <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`, ...style }}>
      {children}
    </div>
  );
};

/** Word-by-word reveal; px gap (never em) next to big type. */
export const WordReveal: React.FC<{ text: string; delay?: number; per?: number; gap?: number; style?: React.CSSProperties; wordStyle?: (i: number) => React.CSSProperties }> = ({
  text,
  delay = 0,
  per = 3,
  gap = 18,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: gap, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) rotate(${interpolate(p, [0, 1], [4, 0])}deg)`,
              ...wordStyle?.(i),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/** Faster exit than entrance (~10 frames). Wrap a scene's content. */
export const Exit: React.FC<{ at: number; len?: number; y?: number; children: React.ReactNode }> = ({ at, len = 10, y = -60, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${p * y}px)` }}>{children}</AbsoluteFill>;
};

/* ------------------------------- brand --------------------------------- */
/** The logo's red brush stroke, drawn left → right behind a word. */
export const Swoosh: React.FC<{ delay?: number; color?: string; style?: React.CSSProperties; len?: number }> = ({ delay = 0, color = theme.colors.red, style, len = 9 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + len], [0, 100], { ...clamp, easing: theme.ease.out });
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" style={{ position: "absolute", clipPath: `inset(0 ${100 - p}% 0 0)`, ...style }}>
      <path d="M2 33 C 60 27, 130 11, 220 9 C 292 7, 352 10, 398 3 C 362 22, 302 27, 232 29 C 152 31, 82 39, 2 33 Z" fill={color} />
    </svg>
  );
};

/** The site's white "label-box" polaroid with a handwritten caption. */
export const Polaroid: React.FC<{ src: string; caption?: string; width: number; ratio?: number; dur: number; position?: string; zoom?: number }> = ({
  src,
  caption,
  width,
  ratio = 0.8,
  dur,
  position,
  zoom = 1.12,
}) => {
  const { u } = useLayout();
  return (
    <div style={{ width, background: theme.colors.paper, borderRadius: 14 * u, padding: 16 * u, paddingBottom: caption ? 8 * u : 16 * u, boxShadow: "0 30px 60px -24px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.06)" }}>
      <div style={{ width: "100%", height: width * ratio, overflow: "hidden", borderRadius: 6 * u, background: theme.colors.mist }}>
        <KenBurns src={src} dur={dur} to={zoom} pan={-18} position={position} />
      </div>
      {caption && (
        <div style={{ fontFamily: theme.fonts.script, fontSize: 64 * u, color: theme.colors.ink, textAlign: "center", lineHeight: 1.1, marginTop: 4 * u }}>{caption}</div>
      )}
    </div>
  );
};

/** A real screenshot shown as a floating phone screen (no device chrome, no address bar). */
export const Screen: React.FC<{ src: string; width: number; height: number; offsetY?: number; imgHeight?: number; radius?: number; style?: React.CSSProperties }> = ({
  src,
  width,
  height,
  offsetY = 0,
  imgHeight,
  radius = 48,
  style,
}) => (
  <div style={{ width, height, borderRadius: radius, overflow: "hidden", background: theme.colors.paper, boxShadow: "0 50px 100px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.06)", position: "relative", ...style }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -offsetY, width, height: imgHeight }} />
  </div>
);

/** Finger-tap ripple. */
export const Tap: React.FC<{ at: number; x: number; y: number; color?: string }> = ({ at, x, y, color = theme.colors.ink }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -4 || t > 18) return null;
  const press = interpolate(t, [-4, 0, 6], [0.6, 1, 0.85], clamp);
  const ring = interpolate(t, [0, 16], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      <div style={{ position: "absolute", width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: "50%", background: color, opacity: interpolate(t, [-4, 0, 12], [0, 0.35, 0], clamp), transform: `scale(${press})` }} />
      <div style={{ position: "absolute", width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: "50%", border: `5px solid ${color}`, opacity: 1 - ring, transform: `scale(${1 + ring * 1.4})` }} />
    </div>
  );
};

/** Big heavy caps line in the logo's "POLISH" voice. */
export const Caps: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = theme.colors.ink, style }) => (
  <div style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color, ...style }}>
    {children}
  </div>
);

export const Script: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = theme.colors.red, style }) => (
  <div style={{ fontFamily: theme.fonts.script, fontSize: size, lineHeight: 1, color, ...style }}>{children}</div>
);
