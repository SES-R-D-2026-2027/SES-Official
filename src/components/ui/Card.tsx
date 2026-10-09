import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tileColor, tilt, type TileColorProps, type TiltProps } from "./variants";

const cardVariants = cva("relative brutal", {
  variants: {
    padding: {
      sm: "p-4",
      md: "p-5 md:p-6",
      lg: "p-6 md:p-7",
    },
    shadow: {
      md: "",
      lg: "shadow-brutal-lg",
    },
  },
  defaultVariants: { padding: "md", shadow: "md" },
});

type CardElement = "div" | "article" | "li" | "section" | "figure";

export type CardProps = Omit<ComponentProps<"div">, "color"> &
  TileColorProps &
  TiltProps &
  VariantProps<typeof cardVariants> & {
    as?: CardElement;
    /** Decorative corner sticker (e.g. <Sticker>), pinned top-right. */
    sticker?: ReactNode;
    /** Tilted cards straighten on hover / focus inside. */
    straighten?: boolean;
  };

/** The standard bordered box. Colors come from the tile palette. */
export function Card({
  as: Tag = "div",
  color,
  tilt: tiltValue,
  padding,
  shadow,
  sticker,
  straighten = true,
  className,
  children,
  ...rest
}: CardProps) {
  const tilted = tiltValue && tiltValue !== "none";
  // All allowed tags accept div props; typing them as "div" keeps the spread simple.
  const Element = Tag as "div";
  return (
    <Element
      className={cn(
        cardVariants({ padding, shadow }),
        tileColor({ color }),
        tilt({ tilt: tiltValue }),
        tilted && straighten && "straighten",
        className,
      )}
      {...rest}
    >
      {sticker && <div className="absolute -top-3 right-4 z-10">{sticker}</div>}
      {children}
    </Element>
  );
}
