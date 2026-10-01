import { POLAND_PATH, VOIVODESHIP_PATHS } from "@/lib/map/poland-shape";

const TONES = {
  light: { fill: "#eef3fb", stroke: "rgba(10,31,68,0.14)", outline: "#0a1f44" },
  dark: { fill: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.18)", outline: "rgba(255,255,255,0.9)" },
} as const;

/** Static Poland geometry (Natural Earth), rendered on the server. */
export function PolandMapBase({ tone = "light" }: { tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <g aria-hidden="true">
      <path d={POLAND_PATH} fill={t.fill} stroke="none" />
      {VOIVODESHIP_PATHS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={t.stroke} strokeWidth={1.2} strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={POLAND_PATH} fill="none" stroke={t.outline} strokeWidth={2.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </g>
  );
}
