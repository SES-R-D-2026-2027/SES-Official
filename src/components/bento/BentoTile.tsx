import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ReactNode } from "react";
import { StaggerItem } from "@/components/motion/Stagger";
import { ExternalLinkHint, externalLinkProps } from "@/components/ui/ExternalLinkHint";
import { tileColor, tilt, type TileColorProps, type TiltProps } from "@/components/ui/variants";
import { cn } from "@/lib/utils";

// Grid spans apply from md (mobile is always one column).
// Exported so client grids (filterable bento) can size their own animated cells.
export const bentoSpan = cva("flex", {
  variants: {
    size: {
      "1x1": "",
      "2x1": "md:col-span-2",
      "1x2": "md:row-span-2",
      "2x2": "md:col-span-2 md:row-span-2",
    },
  },
  defaultVariants: { size: "1x1" },
});

export type BentoTileProps = VariantProps<typeof bentoSpan> &
  TileColorProps &
  TiltProps & {
    /** Makes the whole tile a link (with hover lift + press). Don't put other links inside. */
    href?: string;
    /** Opens `href` in a new tab with the external-link hint. */
    external?: boolean;
    /** Decorative corner sticker, e.g. <Sticker>NEW</Sticker>. */
    sticker?: ReactNode;
    /** Match the parent BentoGrid: "li" when the grid is a "ul". */
    as?: "div" | "li";
    /** Take part in the grid's stagger reveal. */
    animate?: boolean;
    className?: string;
    /** Classes for the grid cell itself, e.g. explicit `lg:col-start-*` placement. */
    cellClassName?: string;
    children: ReactNode;
  };

/** One bento cell. Size 1x1 / 2x1 / 1x2 / 2x2, a tile color, optional tilt and link. */
export function BentoTile({
  size,
  color,
  tilt: tiltValue,
  href,
  external,
  sticker,
  as = "div",
  animate = true,
  className,
  cellClassName,
  children,
}: BentoTileProps) {
  const tilted = tiltValue && tiltValue !== "none";
  const box = cn(
    "relative flex w-full flex-col gap-3 brutal p-5 md:p-6",
    tileColor({ color }),
    tilt({ tilt: tiltValue }),
    href
      ? cn("press no-underline focus-ring", tilted && "hover:rotate-0 focus-visible:rotate-0")
      : tilted && "straighten",
    className,
  );

  const content = (
    <>
      {sticker && <div className="absolute -top-3 right-4 z-10">{sticker}</div>}
      {children}
    </>
  );

  let inner: ReactNode;
  if (href && external) {
    inner = (
      <a href={href} className={box} {...externalLinkProps}>
        {content}
        <ExternalLinkHint className="absolute right-4 bottom-4" />
      </a>
    );
  } else if (href) {
    inner = (
      <Link href={href} className={box}>
        {content}
      </Link>
    );
  } else {
    inner = <div className={box}>{content}</div>;
  }

  if (animate) {
    return (
      <StaggerItem as={as} className={cn(bentoSpan({ size }), cellClassName)}>
        {inner}
      </StaggerItem>
    );
  }
  const Tag = as;
  return <Tag className={cn(bentoSpan({ size }), cellClassName)}>{inner}</Tag>;
}
