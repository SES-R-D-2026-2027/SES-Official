import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tileColor, type TileColorProps } from "./variants";

const stickerVariants = cva("pointer-events-none inline-flex select-none", {
  variants: {
    rotate: {
      "-6": "-rotate-6",
      "-3": "-rotate-3",
      "0": "",
      "3": "rotate-3",
      "6": "rotate-6",
    },
    shape: {
      tag: "items-center rounded-brutal-sm px-2.5 py-1 font-mono text-xs font-semibold tracking-widest whitespace-nowrap uppercase shadow-brutal border-brutal",
      hexagon: "",
    },
  },
  defaultVariants: { rotate: "-3", shape: "tag" },
});

export type StickerProps = TileColorProps &
  VariantProps<typeof stickerVariants> & {
    children?: ReactNode;
    className?: string;
  };

/**
 * Decorative, rotated label ("NEW", "LIMITED SEATS") or hexagon.
 * Always aria-hidden: never put information here that isn't also in the content.
 * Wrap in <Draggable> to make it draggable (behind the `draggableStickers` flag).
 */
export function Sticker({ color = "coral", rotate, shape, className, children }: StickerProps) {
  if (shape === "hexagon") {
    return (
      <span
        aria-hidden="true"
        className={cn(stickerVariants({ rotate, shape }), "size-16", className)}
      >
        <svg viewBox="0 0 64 64" className="size-full overflow-visible">
          {/* hard shadow, then the colored hexagon on top */}
          <polygon points="36,6 60,20 60,48 36,62 12,48 12,20" className="fill-ink" />
          <polygon
            points="32,2 56,16 56,44 32,58 8,44 8,16"
            className={cn("stroke-ink stroke-2", hexFill[color ?? "coral"])}
          />
          {children && (
            <text
              x="32"
              y="34"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink font-mono text-xs font-bold tracking-wider uppercase"
            >
              {children}
            </text>
          )}
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(stickerVariants({ rotate, shape }), tileColor({ color }), className)}
    >
      {children}
    </span>
  );
}

const hexFill = {
  yellow: "fill-tile-yellow",
  mint: "fill-tile-mint",
  lilac: "fill-tile-lilac",
  coral: "fill-tile-coral",
  sky: "fill-tile-sky",
  blue: "fill-tile-blue",
  paper: "fill-tile-paper",
} as const;
