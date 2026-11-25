import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** One theme-aware society seal; CSS ensures only the active artwork is rendered. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex shrink-0 items-center rounded-full focus-ring", className)}
    >
      <Image
        src="/brand/ses-logo-light.png"
        alt=""
        aria-hidden="true"
        width={52}
        height={52}
        priority
        className="ses-logo-light size-11 object-contain sm:size-12"
      />
      <Image
        src="/brand/ses-logo-dark.png"
        alt=""
        aria-hidden="true"
        width={52}
        height={52}
        priority
        className="ses-logo-dark size-11 object-contain sm:size-12"
      />
    </Link>
  );
}
