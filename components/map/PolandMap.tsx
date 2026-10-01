"use client";

import { AnimatePresence, motion } from "motion/react";
import { MAP_HEIGHT, MAP_WIDTH, project } from "@/lib/map/projection";

export interface MapPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  count: number;
  /** Fill colour: product colour, or ink for places with several products */
  color?: string;
  description?: string;
  approximate?: boolean;
  /** Always show the label (otherwise only on hover/selection) */
  labelled?: boolean;
}

interface PolandMapProps {
  base: React.ReactNode;
  points: MapPoint[];
  selected?: string | null;
  highlighted?: string | null;
  onSelect?: (id: string) => void;
  onHighlight?: (id: string | null) => void;
  tone?: "light" | "dark";
  className?: string;
  title: string;
}

/** Poland with live opportunity locations. Every marker is a keyboard-accessible button. */
export function PolandMap({ base, points, selected, highlighted, onSelect, onHighlight, tone = "light", className = "", title }: PolandMapProps) {
  const max = Math.max(1, ...points.map((p) => p.count));
  const text = tone === "dark" ? "#ffffff" : "#151515";
  const halo = tone === "dark" ? "#151515" : "#ffffff";
  // Draw small markers last so they stay clickable on top of big ones.
  const ordered = [...points].sort((a, b) => b.count - a.count);

  return (
    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className={`h-auto w-full overflow-visible ${className}`} role="group" aria-label={title}>
      {base}
      <AnimatePresence>
        {ordered.map((p, i) => {
          const { x, y } = project(p.lat, p.lng);
          const active = selected === p.id || highlighted === p.id;
          const r = 8 + Math.sqrt(p.count / max) * 24;
          const interactive = Boolean(onSelect);
          const showLabel = p.labelled || active;
          return (
            <motion.g
              key={p.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: active ? 1.15 : 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: Math.min(0.6, 0.02 * i) }}
              style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? `${p.label}${p.description ? `: ${p.description}` : ""}` : undefined}
              aria-pressed={interactive ? selected === p.id : undefined}
              className={interactive ? "cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100" : undefined}
              onClick={() => onSelect?.(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(p.id);
                }
              }}
              onMouseEnter={() => onHighlight?.(p.id)}
              onMouseLeave={() => onHighlight?.(null)}
              onFocus={() => onHighlight?.(p.id)}
              onBlur={() => onHighlight?.(null)}
            >
              <circle cx={x} cy={y} r={Math.max(r, 20)} fill="transparent" />
              <circle
                className={`ring transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                cx={x}
                cy={y}
                r={r + 7}
                fill="none"
                stroke={tone === "dark" ? "#ffffff" : "#151515"}
                strokeWidth={4}
              />
              <circle cx={x} cy={y} r={r} fill={p.color ?? "#fc3a3a"} stroke={halo} strokeWidth={3} opacity={p.approximate ? 0.85 : 1} />
              {r > 15 && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={(p.color ?? "#fc3a3a") === "#151515" ? "#ffffff" : "#151515"}
                  style={{ font: `900 ${Math.max(14, r * 0.72)}px var(--font-montserrat)`, pointerEvents: "none" }}
                >
                  {p.count}
                </text>
              )}
              {showLabel && (
                <text
                  x={x + r + 9}
                  y={y}
                  dominantBaseline="central"
                  fill={text}
                  style={{
                    font: `900 ${active ? 32 : 26}px var(--font-montserrat)`,
                    pointerEvents: "none",
                    paintOrder: "stroke",
                    stroke: halo,
                    strokeWidth: 7,
                    strokeLinejoin: "round",
                  }}
                >
                  {p.label}
                </text>
              )}
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
