"use client";

import { motion, useReducedMotion } from "motion/react";

type Tag = "div" | "section" | "li" | "p" | "header" | "figure" | "h2";

/** One-time, subtle entrance as an element scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}
