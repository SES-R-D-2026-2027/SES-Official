import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Centered page column: ~1200px max, 16px gutters on mobile, 24px from md. */
export function Container({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)} {...rest} />;
}
