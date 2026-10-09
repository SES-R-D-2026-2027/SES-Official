import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type HighlightProps = ComponentProps<"div"> & { as?: "div" | "p" };

/** Paragraph in a pale-yellow bordered block (the hero intro). */
export function Highlight({ as: Tag = "p", className, ...rest }: HighlightProps) {
  return (
    <Tag
      className={cn(
        "rounded-brutal bg-highlight p-4 text-ink border-brutal md:p-5 md:text-lg",
        className,
      )}
      {...rest}
    />
  );
}
