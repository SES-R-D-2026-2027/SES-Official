import { cva, type VariantProps } from "class-variance-authority";
import type { TileColor } from "@/types/content";

/**
 * The one place a `color` prop becomes classes. Every tile-colored primitive
 * (Card, BentoTile, Tag, Sticker, StatTile, Avatar…) reuses this map.
 * Text on tiles is always ink (DESIGN.md §8: ink passes 4.5:1 on every tile color).
 */
export const tileColor = cva("text-ink", {
  variants: {
    color: {
      yellow: "bg-tile-yellow",
      mint: "bg-tile-mint",
      lilac: "bg-tile-lilac",
      coral: "bg-tile-coral",
      sky: "bg-tile-sky",
      blue: "bg-tile-blue",
      paper: "bg-tile-paper",
    } satisfies Record<TileColor, string>,
  },
  defaultVariants: { color: "paper" },
});

/** Resting tilt from the --ses-tilt token (themes can set it to 0). */
export const tilt = cva("", {
  variants: {
    tilt: {
      none: "",
      left: "tilt-l",
      right: "tilt-r",
    },
  },
  defaultVariants: { tilt: "none" },
});

export type TileColorProps = VariantProps<typeof tileColor>;
export type TiltProps = VariantProps<typeof tilt>;
export type Tilt = NonNullable<TiltProps["tilt"]>;

/** Every tile color, in display order (styleguide, demos). */
export const tileColors: TileColor[] = ["yellow", "mint", "lilac", "coral", "sky", "blue", "paper"];
