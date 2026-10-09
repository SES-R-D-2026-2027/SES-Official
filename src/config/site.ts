import type { TileColor } from "@/types/content";

// Site-wide settings: name, nav, footer, socials, contact.
// TODO(content): replace placeholder URLs, email and address with the society's real details.

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  color: TileColor;
  links: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "discord" | "instagram" | "linkedin";
}

export const siteConfig = {
  name: "Software Engineering Society",
  shortName: "SES",
  tagline: "Software, built together by students.",
  description:
    "The student-run Software Engineering Society at FAST-NUCES: events, open-source projects, research and resources built by students.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  version: "v0.1", // small version tag next to the logo
  theme: "neo",
  timeZone: "Asia/Karachi", // event dates/times are shown in campus time
  headerNote: "student run!", // handwritten note next to the logo

  footerBar: {
    motto: "SES // runs on open source & student obsession",
    status: "Status: all nodes operational",
  },

  nav: [
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "Resources", href: "/resources" },
  ] satisfies NavLink[],

  cta: { label: "Join now", href: "/join" } satisfies NavLink,

  footer: [
    {
      title: "Explore",
      color: "yellow",
      links: [
        { label: "Events", href: "/events" },
        { label: "Projects", href: "/projects" },
        { label: "Departments", href: "/departments" },
        { label: "Team", href: "/team" },
      ],
    },
    {
      title: "Learn",
      color: "mint",
      links: [
        { label: "Resources", href: "/resources" },
        { label: "Research", href: "/research" },
        { label: "Technology", href: "/technology" },
        { label: "Announcements", href: "/announcements" },
      ],
    },
    {
      title: "Connect",
      color: "lilac",
      links: [
        { label: "Join SES", href: "/join" },
        { label: "Contact", href: "/contact" },
        { label: "About", href: "/about" },
      ],
    },
  ] satisfies FooterColumn[],

  socials: [
    { label: "GitHub", href: "https://github.com/", icon: "github" }, // TODO(content)
    { label: "Discord", href: "https://discord.com/", icon: "discord" }, // TODO(content)
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" }, // TODO(content)
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" }, // TODO(content)
  ] satisfies SocialLink[],

  contact: {
    email: "ses@example.com", // TODO(content)
    address: "Campus address — TODO", // TODO(content)
  },
} as const;
