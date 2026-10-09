"use client";

import { animate, LazyMotion, m, useMotionValue } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { distance, spring } from "@/lib/motion/tokens";

// Drag needs the full feature set; load it only when a Draggable is on the page.
const loadDomMax = () => import("@/lib/motion/features").then((mod) => mod.default);

const arrowKeys: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export interface DraggableProps {
  children: ReactNode;
  className?: string;
  /**
   * Accessible name. With a label the element is focusable and arrow keys nudge it
   * (Esc / Home resets). Without one it is pure decoration and hidden from assistive tech.
   */
  label?: string;
  /** Render static (e.g. `!features.draggableStickers`). */
  disabled?: boolean;
}

/**
 * Drag within the parent element's bounds; springs back to its spot on release.
 * Keyboard-nudged positions stay until Esc / Home.
 */
export function Draggable({ children, className, label, disabled }: DraggableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    bounds.current = ref.current?.parentElement ?? null;
  }, []);

  if (disabled) return <div className={className}>{children}</div>;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" || event.key === "Home") {
      event.preventDefault();
      animate(x, 0, spring.soft);
      animate(y, 0, spring.soft);
      return;
    }
    const step = arrowKeys[event.key];
    const node = ref.current;
    const parent = bounds.current;
    if (!step || !node || !parent) return;
    event.preventDefault();
    const box = node.getBoundingClientRect();
    const area = parent.getBoundingClientRect();
    const dx = clamp(step[0] * distance.nudge, area.left - box.left, area.right - box.right);
    const dy = clamp(step[1] * distance.nudge, area.top - box.top, area.bottom - box.bottom);
    x.set(x.get() + dx);
    y.set(y.get() + dy);
  }

  const a11yProps = label
    ? {
        tabIndex: 0,
        role: "group",
        "aria-roledescription": "draggable",
        "aria-label": `${label}. Use arrow keys to move, Escape to reset.`,
        onKeyDown,
      }
    : { "aria-hidden": true as const };

  return (
    <LazyMotion features={loadDomMax}>
      <m.div
        ref={ref}
        drag
        dragConstraints={bounds}
        dragElastic={0.2}
        dragSnapToOrigin
        dragTransition={{
          bounceStiffness: spring.soft.stiffness,
          bounceDamping: spring.soft.damping,
        }}
        style={{ x, y }}
        className={cn(
          "inline-block cursor-grab touch-none active:cursor-grabbing",
          label && "rounded-brutal focus-ring",
          className,
        )}
        {...a11yProps}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
