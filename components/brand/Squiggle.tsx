"use client";

import { motion, useReducedMotion } from "motion/react";

/** Hand-drawn underline that draws itself once when it scrolls into view. */
export function Squiggle({ className = "", color = "currentColor", delay = 0.2 }: { className?: string; color?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" className={className} aria-hidden="true">
      <motion.path
        d="M3 15 C 40 4, 70 22, 108 12 S 178 4, 214 14 S 270 20, 297 8"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
