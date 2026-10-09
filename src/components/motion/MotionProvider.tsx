"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps the app once (in layout.tsx).
 * - reducedMotion="user": transform animations are skipped when the OS asks for reduced motion.
 * - LazyMotion + `strict`: only the small `m.*` components are allowed, keeping the bundle light.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
