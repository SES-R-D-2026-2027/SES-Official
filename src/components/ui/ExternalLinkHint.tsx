import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon + screen-reader text for links that open in a new tab (CLAUDE.md component rules). */
export function ExternalLinkHint({ className }: { className?: string }) {
  return (
    <>
      <ArrowUpRight aria-hidden="true" className={cn("size-4 shrink-0", className)} />
      <span className="sr-only">(opens in new tab)</span>
    </>
  );
}

/** Props every external link gets. */
export const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;
