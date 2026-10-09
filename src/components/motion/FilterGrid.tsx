"use client";

import { AnimatePresence, LazyMotion, m } from "motion/react";
import { useId, useState, type ReactNode, type Ref } from "react";
import { bentoGrid } from "@/components/bento/BentoGrid";
import { bentoSpan } from "@/components/bento/BentoTile";
import { tileColor } from "@/components/ui/variants";
import { popIn, staggerParent, tileExit, viewport } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

// Layout animation needs the full feature set; load it only where a FilterGrid is used.
const loadDomMax = () => import("@/lib/motion/features").then((mod) => mod.default);

const tileVariants = { ...popIn, ...tileExit };

type Span = "1x1" | "2x1" | "1x2" | "2x2";

export interface FilterGridItem {
  id: string;
  /** Which filter group this item belongs to (e.g. the event category). */
  group: string;
  /** Rendered when the item is the first (featured, 2x2) cell. */
  featured: ReactNode;
  /** Rendered in a regular 1x1 cell. */
  compact: ReactNode;
}

export interface FilterGridFixed {
  id: string;
  size: Span;
  node: ReactNode;
}

export interface FilterGridProps {
  /** Names the filter buttons, e.g. "Filter events". */
  label: string;
  /** `groups` omitted = show everything ("All"). */
  filters: { value: string; label: string; groups?: string[] }[];
  items: FilterGridItem[];
  /** How many items a filter shows: the first is featured (2x2), the rest 1x1. */
  limit: number;
  /** Tiles that never filter out (calendar, CTA…); they reflow around the items. */
  fixed: FilterGridFixed[];
  /** Shown in place of the items when a filter matches nothing. */
  empty: ReactNode;
  /** Plural noun for the live announcement: "Showing 2 events". */
  noun: string;
  className?: string;
}

/**
 * Bento grid with filter buttons. Server components render every tile; this island only picks
 * which ones show and animates the reflow (shared `layout` + AnimatePresence). Tiles pop in with
 * a stagger the first time the grid scrolls into view. Mobile: one column, featured first.
 */
export function FilterGrid({
  label,
  filters,
  items,
  limit,
  fixed,
  empty,
  noun,
  className,
}: FilterGridProps) {
  const [active, setActive] = useState(filters[0]?.value);
  const statusId = useId();
  const groups = filters.find((filter) => filter.value === active)?.groups;
  const visible = items.filter((item) => !groups || groups.includes(item.group)).slice(0, limit);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const pressed = filter.value === active;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={pressed}
              aria-describedby={statusId}
              onClick={() => setActive(filter.value)}
              className={cn(
                "press brutal rounded-brutal-sm px-3 py-1.5 font-mono text-xs font-semibold tracking-widest uppercase focus-ring",
                pressed ? "bg-ink text-surface" : tileColor({ color: "paper" }),
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      <p id={statusId} role="status" className="sr-only">
        Showing {visible.length} {noun}
      </p>

      <LazyMotion features={loadDomMax}>
        <m.ul
          className={bentoGrid({ columns: 4 })}
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={viewport.stagger}
        >
          <AnimatePresence mode="popLayout">
            {visible.length === 0 && (
              <Cell key="empty" span="2x2">
                {empty}
              </Cell>
            )}
            {visible.map((item, index) => (
              <Cell key={item.id} span={index === 0 ? "2x2" : "1x1"}>
                {index === 0 ? item.featured : item.compact}
              </Cell>
            ))}
            {fixed.map((tile) => (
              <Cell key={tile.id} span={tile.size}>
                {tile.node}
              </Cell>
            ))}
          </AnimatePresence>
        </m.ul>
      </LazyMotion>
    </div>
  );
}

// `ref` is forwarded so AnimatePresence's popLayout can measure exiting cells.
function Cell({
  span,
  children,
  ref,
}: {
  span: Span;
  children: ReactNode;
  ref?: Ref<HTMLLIElement>;
}) {
  return (
    <m.li
      ref={ref}
      layout
      data-reveal=""
      variants={tileVariants}
      exit="exit"
      className={bentoSpan({ size: span })}
    >
      {children}
    </m.li>
  );
}
