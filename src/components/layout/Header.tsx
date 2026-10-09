import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HandNote } from "@/components/ui/HandNote";
import { Tag } from "@/components/ui/Tag";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks, NavList } from "./NavLinks";

/** Sticky top bar: logo + version + note · nav (lg+) · Join now + menu button. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg border-b-brutal">
      <Container className="flex h-16 items-center gap-3">
        <div className="flex items-center gap-2.5">
          <Logo />
          <Tag color="lilac" className="hidden sm:inline-flex">
            {siteConfig.version}
          </Tag>
          <HandNote className="hidden text-lg md:inline-flex">{siteConfig.headerNote}</HandNote>
        </div>

        <nav aria-label="Main" className="mx-auto hidden lg:block">
          {/* usePathname may suspend on routes with unknown params; the fallback is the same list */}
          <Suspense fallback={<NavList />}>
            <NavLinks />
          </Suspense>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Button href={siteConfig.cta.href} arrow size="sm" className="hidden sm:inline-flex">
            {siteConfig.cta.label}
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
