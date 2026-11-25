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
  /** Stable key for remembering the dropped position across reloads. */
  persistKey?: string;
  /** Optional fixed drag region, useful when the immediate parent is only the card itself. */
  dragBounds?: { top: number; right: number; bottom: number; left: number };
}

/**
 * Drag freely within the parent element's bounds and persist the dropped position.
 * Keyboard-nudged positions are persisted too; Esc / Home resets to the starting spot.
 */
export function Draggable({ children, className, label, disabled, persistKey, dragBounds }: DraggableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement ?? null;
    bounds.current = parent;
    if (!node || !parent || !persistKey) return;

    try {
      const saved = localStorage.getItem(`ses-drag:${persistKey}`);
      if (!saved) return;
      const position = JSON.parse(saved) as { x?: number; y?: number };
      const item = node.getBoundingClientRect();
      const area = parent.getBoundingClientRect();
      if (dragBounds) {
        x.set(clamp(Number(position.x) || 0, dragBounds.left, dragBounds.right));
        y.set(clamp(Number(position.y) || 0, dragBounds.top, dragBounds.bottom));
      } else {
        const minX = area.left - item.left;
        const maxX = area.right - item.right;
        const minY = area.top - item.top;
        const maxY = area.bottom - item.bottom;
        x.set(clamp(Number(position.x) || 0, minX, maxX));
        y.set(clamp(Number(position.y) || 0, minY, maxY));
      }
    } catch {
      // Ignore unavailable storage or malformed saved positions.
    }
  }, [persistKey, x, y, dragBounds]);

  function savePosition() {
    if (!persistKey) return;
    try {
      localStorage.setItem(`ses-drag:${persistKey}`, JSON.stringify({ x: x.get(), y: y.get() }));
    } catch {
      // Dragging still works when storage is unavailable.
    }
  }

  if (disabled) return <div className={className}>{children}</div>;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" || event.key === "Home") {
      event.preventDefault();
      animate(x, 0, spring.soft);
      animate(y, 0, spring.soft);
      if (persistKey) {
        try {
          localStorage.setItem(`ses-drag:${persistKey}`, JSON.stringify({ x: 0, y: 0 }));
        } catch {
          // Ignore unavailable storage.
        }
      }
      return;
    }
    const step = arrowKeys[event.key];
    const node = ref.current;
    const parent = bounds.current;
    if (!step || !node || !parent) return;
    event.preventDefault();
    const box = node.getBoundingClientRect();
    const area = parent.getBoundingClientRect();
    const nextX = x.get() + step[0] * distance.nudge;
    const nextY = y.get() + step[1] * distance.nudge;
    const dx = dragBounds
      ? clamp(nextX, dragBounds.left, dragBounds.right)
      : clamp(nextX, area.left - box.left + x.get(), area.right - box.right + x.get());
    const dy = dragBounds
      ? clamp(nextY, dragBounds.top, dragBounds.bottom)
      : clamp(nextY, area.top - box.top + y.get(), area.bottom - box.bottom + y.get());
    x.set(dx);
    y.set(dy);
    savePosition();
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
        dragConstraints={dragBounds ?? bounds}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={savePosition}
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
