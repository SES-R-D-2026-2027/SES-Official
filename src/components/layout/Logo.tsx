import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Yellow "SES" chip linking home. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex press items-center brutal rounded-brutal-sm bg-accent px-2.5 py-1 font-display text-lg leading-none font-bold text-on-accent no-underline focus-ring",
        className,
      )}
    >
      {siteConfig.shortName}
      <span className="sr-only"> · {siteConfig.name} home</span>
    </Link>
  );
}
