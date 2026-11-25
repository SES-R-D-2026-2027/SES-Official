import type { TileColor } from "@/types/content";

// Site-wide settings: name, nav, footer, socials, contact.
// TODO(content): GitHub URL still needs confirming; share image is not provided yet.

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
  tagline: "Build cool things. Meet great people.",
  description:
    "The Software Engineering Society at FAST-NUCES Islamabad promotes technical learning, innovation, and collaboration through workshops, events, and projects. It provides students with opportunities to develop their skills, explore new ideas, and contribute to a thriving software engineering community.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  version: "v0.1", // small version tag next to the logo
  theme: "neo",
  timeZone: "Asia/Karachi", // event dates/times are shown in campus time
  headerNote: "student run!", // handwritten note next to the logo

  nav: [
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "Mentors", href: "/mentors" },
    { label: "Team", href: "/team" },
    { label: "Research", href: "/research" },
    { label: "Resources", href: "/resources" },
  ] satisfies NavLink[],

  cta: { label: "Join now", href: "/join" } satisfies NavLink,

  footer: [
    {
      title: "Explore",
      color: "yellow",
      links: [
        { label: "About", href: "/about" },
        { label: "Events", href: "/events" },
        { label: "Research", href: "/research" },
        { label: "Resources", href: "/resources" },
      ],
    },
    {
      title: "Learn",
      color: "mint",
      links: [
        { label: "Projects", href: "/projects" },
        { label: "Mentors", href: "/mentors" },
      ],
    },
    {
      title: "Connect",
      color: "lilac",
      links: [
        { label: "Team", href: "/team" },
        { label: "Join us", href: "/join" },
      ],
    },
  ] satisfies FooterColumn[],

  socials: [
    { label: "GitHub", href: "https://github.com/SES-R-D-2026-2027", icon: "github" }, // TODO(content)
    { label: "Instagram", href: "https://www.instagram.com/ses.isb/", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/nuses/", icon: "linkedin" },
  ] satisfies SocialLink[],

  contact: {
    email: "ses.isb@nu.edu.pk",
    address: "FAST NUCES, Islamabad",
  },
} as const;
