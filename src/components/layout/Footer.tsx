import { MessageCircle } from "lucide-react";
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

function SocialMark({ brand }: { brand: SocialLink["icon"] }) {
  if (brand === "github") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z" />
      </svg>
    );
  }
  if (brand === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
      </svg>
    );
  }
  if (brand === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.4 9.5H7v11H3.4v-11Zm5.8 0h3.4V11h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.32 2.4 4.32 5.52v5.83h-3.55v-5.17c0-1.23-.02-2.82-1.72-2.82-1.73 0-2 1.35-2 2.73v5.26H9.2v-11Z" />
      </svg>
    );
  }
  if (brand === "discord") {
    return <MessageCircle aria-hidden="true" className="size-5" />;
  }
  return null;
}

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
                    <SocialMark brand={social.icon} />
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
    </footer>
  );
}
