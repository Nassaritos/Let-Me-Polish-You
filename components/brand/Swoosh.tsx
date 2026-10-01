"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The red brush stroke from the logo. Place it inside a relatively positioned
 * word; it sweeps through the letters once when scrolled into view.
 */
export function Swoosh({ className = "", color = "#fc3a3a", delay = 0.15 }: { className?: string; color?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
      initial={reduce ? { clipPath: "inset(0 0 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <path
        d="M2 33 C 60 27, 130 11, 220 9 C 292 7, 352 10, 398 3 C 362 22, 302 27, 232 29 C 152 31, 82 39, 2 33 Z"
        fill={color}
      />
    </motion.svg>
  );
}

/** A heavy word with the swoosh cutting through it — the logo's "POLISH" treatment. */
export function SwooshWord({ children, className = "", color }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <span className={`relative isolate inline-block ${className}`}>
      <Swoosh color={color} className="-z-10 left-[-4%] top-[44%] h-[0.44em] w-[108%]" />
      <span className="relative">{children}</span>
    </span>
  );
}
