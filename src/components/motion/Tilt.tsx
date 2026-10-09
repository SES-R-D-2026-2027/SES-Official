import type { ReactNode } from "react";
import { tilt, type Tilt as TiltDirection } from "@/components/ui/variants";
import { cn } from "@/lib/utils";

export interface TiltProps {
  /** Resting direction; the angle is the --ses-tilt token. */
  direction?: Exclude<TiltDirection, "none">;
  className?: string;
  children: ReactNode;
}

/**
 * Resting tilt that straightens on hover and on keyboard focus inside.
 * Pure CSS (`straighten` utility), so it stays a Server Component; reduced motion snaps instantly.
 */
export function Tilt({ direction = "left", className, children }: TiltProps) {
  return <div className={cn(tilt({ tilt: direction }), "straighten", className)}>{children}</div>;
}
