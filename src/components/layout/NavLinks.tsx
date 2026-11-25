"use client";

import Link from "next/link";
import { CalendarDays, FolderKanban, Info, LibraryBig, Microscope, Users, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navIcons = {
  "/about": Info,
  "/events": CalendarDays,
  "/projects": FolderKanban,
  "/mentors": GraduationCap,
  "/team": Users,
  "/research": Microscope,
  "/resources": LibraryBig,
} as const;

const linkClasses =
  "rounded-brutal-sm px-3 py-1.5 text-sm font-medium text-ink no-underline transition-colors hover:bg-highlight focus-ring aria-[current=page]:bg-highlight aria-[current=page]:border-brutal";

/** Desktop nav links. Server fallback (in Header's Suspense) renders the same list unmarked. */
export function NavList({ pathname }: { pathname?: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {siteConfig.nav.map((link) => {
        const active =
          pathname === link.href ||
          pathname?.startsWith(`${link.href}/`) ||
          (link.href === "/team" && pathname?.startsWith("/departments/"));
        const Icon = navIcons[link.href as keyof typeof navIcons];
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(linkClasses)}
            >
              {Icon && <Icon aria-hidden="true" className="mr-1.5 inline size-4 align-[-3px]" />}
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Marks the current section with aria-current="page". */
export function NavLinks() {
  return <NavList pathname={usePathname()} />;
}
