import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** One logo element whose raster artwork changes with the active theme. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex shrink-0 items-center rounded-full focus-ring", className)}
    >
      <span aria-hidden="true" className="ses-logo-theme size-11 sm:size-12" />
    </Link>
  );
}
