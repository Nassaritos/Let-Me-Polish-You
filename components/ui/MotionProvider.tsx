"use client";

import { MotionConfig } from "motion/react";

/** Honour the user's reduced-motion preference for every Motion animation. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
