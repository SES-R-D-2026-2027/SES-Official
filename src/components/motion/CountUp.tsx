"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion/tokens";

export interface CountUpProps {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts from `from` to `to` once, when visible.
 * The server HTML (and no-JS / reduced-motion visitors) get the final number.
 * An invisible copy of the final value reserves the width, so counting never shifts layout,
 * and screen readers only hear the final value.
 */
export function CountUp({ to, from = 0, prefix = "", suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (value: number) => `${prefix}${Math.round(value)}${suffix}`;
  const final = format(to);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;
    if (!inView) {
      node.textContent = format(from);
      return;
    }
    const controls = animate(from, to, {
      duration: duration.count,
      ease: ease.soft,
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
    // `format` only depends on prefix/suffix, listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, from, to, prefix, suffix]);

  return (
    <span className={className}>
      <span className="relative inline-block tabular-nums">
        <span className="invisible">{final}</span>
        <span ref={ref} aria-hidden="true" className="absolute inset-0">
          {final}
        </span>
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
