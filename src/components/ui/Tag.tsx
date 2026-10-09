import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { tileColor, type TileColorProps } from "./variants";

export type TagProps = Omit<ComponentProps<"span">, "color"> & TileColorProps;

/** Small mono uppercase label in a bordered rectangle ("OPEN REGISTRATION"). */
export function Tag({ color = "yellow", className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-brutal-sm px-2 py-0.5 font-mono text-xs leading-5 font-medium tracking-widest whitespace-nowrap uppercase border-brutal",
        tileColor({ color }),
        className,
      )}
      {...rest}
    />
  );
}
