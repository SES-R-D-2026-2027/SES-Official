import { Briefcase, Camera, Code, MessageCircle, type LucideIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { externalLinkProps } from "@/components/ui/ExternalLinkHint";
import { Tag } from "@/components/ui/Tag";
import { tileColor } from "@/components/ui/variants";
import { siteConfig, type SocialLink } from "@/config/site";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

// lucide-react no longer ships brand logos, so socials use generic icons.
const socialIcons: Record<SocialLink["icon"], LucideIcon> = {
  github: Code,
  discord: MessageCircle,
  instagram: Camera,
  linkedin: Briefcase,
};

const socialColors: TileColor[] = ["yellow", "mint", "lilac", "coral"];

/** Cached so the footer stays static under Cache Components; refreshes daily. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="bg-surface border-t-brutal">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display font-bold">{siteConfig.name}</span>
          </div>
          <p className="max-w-sm text-sm text-muted">{siteConfig.description}</p>
          <ul className="flex gap-3">
            {siteConfig.socials.map((social, index) => {
              const Icon = socialIcons[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...externalLinkProps}
                    className={cn(
                      "inline-flex size-10 press items-center justify-center brutal rounded-brutal-sm focus-ring",
                      tileColor({ color: socialColors[index % socialColors.length] }),
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    <span className="sr-only">{social.label} (opens in new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="text-sm text-muted">
            © <CurrentYear /> {siteConfig.name}, FAST-NUCES.
          </p>
        </div>

        {siteConfig.footer.map((column) => (
          <nav
            key={column.title}
            aria-labelledby={`footer-${column.title}`}
            className="flex flex-col gap-4"
          >
            <h2 id={`footer-${column.title}`} className="font-sans">
              <Tag color={column.color}>{column.title}</Tag>
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-brutal-sm text-sm font-medium text-ink underline-offset-4 focus-ring hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t-brutal">
        <Container className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs font-medium tracking-widest text-ink uppercase">
            {siteConfig.footerBar.motto}
          </p>
          <Tag color="yellow">{siteConfig.footerBar.status}</Tag>
        </Container>
      </div>
    </footer>
  );
}
