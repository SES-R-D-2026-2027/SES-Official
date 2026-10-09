import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Stagger } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

/** Exported so client grids (filterable bento) share the exact same layout. */
export const bentoGrid = cva(
  "grid grid-cols-1 gap-5 md:grid-flow-row-dense md:auto-rows-(--ses-bento-row) md:grid-cols-2 md:gap-6",
  {
    variants: {
      columns: {
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
      },
    },
    defaultVariants: { columns: 4 },
  },
);

export type BentoGridProps = VariantProps<typeof bentoGrid> & {
  /** "ul" when the tiles are a list of items (events, projects); tiles then render as <li>. */
  as?: "div" | "ul";
  /** Pop the tiles in one after another when the grid scrolls into view. */
  animate?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Bento layout: 1 column on mobile (put the featured tile first in the DOM),
 * 2 on tablet, 3 or 4 on desktop. Tiles set their own span with `size`.
 */
export function BentoGrid({
  columns,
  as = "div",
  animate = true,
  className,
  children,
}: BentoGridProps) {
  const classes = cn(bentoGrid({ columns }), className);
  if (animate) {
    return (
      <Stagger as={as} className={classes}>
        {children}
      </Stagger>
    );
  }
  const Tag = as;
  return <Tag className={classes}>{children}</Tag>;
}
