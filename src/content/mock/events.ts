import type { Event } from "@/types/content";
import { base } from "./_base";

// TODO(content): placeholder events. Titles follow the approved mock-up; venues, links and
// details are not real. Times are UTC instants; the site shows them in campus time (PKT). Registration links are EXTERNAL only (O-02).
// Edge cases covered: no cover image, no registration link, online-only, venue TBA, very long
// title, no badge, past events with and without photos.

const photo = (color: string, alt: string) => ({
  url: `/images/placeholder/photo-${color}.svg`,
  alt,
  width: 800,
  height: 600,
});

export const events: Event[] = [
  /* ───────── upcoming ───────── */
  {
    ...base("ev-hack-26", "fall-hackathon-2026"),
    title: "Annual Fall Hackathon: Distributed Systems",
    summary:
      "36 hours of building resilient backends, peer-to-peer apps and high-throughput stream pipelines with your team.",
    description: "Placeholder description — TODO.",
    category: "hackathon",
    startsAt: "2026-11-08T04:00:00.000Z",
    endsAt: "2026-11-09T16:00:00.000Z",
    venue: "Main Hall & Engineering Commons — TODO",
    isOnline: false,
    registrationUrl: "https://example.com/register/fall-hackathon", // TODO(content)
    registrationLabel: "Free admission · Food provided",
    badge: "Open registration",
    coverImage: photo("yellow", "Placeholder photo for the fall hackathon"),
    gallery: [],
    isFeatured: true,
    color: "yellow",
  },
  {
    ...base("ev-rust-compilers", "building-compilers-in-rust"),
    title: "Workshop: Building Compilers in Rust",
    summary: "A hands-on, two-part session on AST generation, type checking and LLVM IR.",
    description: "Placeholder description — TODO.",
    category: "workshop",
    startsAt: "2026-11-13T08:30:00.000Z",
    endsAt: "2026-11-13T11:30:00.000Z",
    venue: "Lab 402, CS Building — TODO",
    isOnline: false,
    registrationUrl: "https://example.com/register/rust-compilers", // TODO(content)
    registrationLabel: "Prerequisite: basic Rust syntax",
    badge: "Limited seats",
    coverImage: photo("lilac", "Placeholder photo for the compilers workshop"),
    gallery: [],
    isFeatured: false,
    color: "lilac",
  },
  {
    ...base("ev-systems-keynote", "engineering-at-scale-keynote"),
    title: "Engineering at Scale: Systems Keynote",
    summary: "Alumni talk about real-world distributed consistency and career paths in systems.",
    description: "Placeholder description — TODO.",
    category: "talk",
    startsAt: "2026-11-23T09:00:00.000Z",
    venue: "Auditorium B — TODO",
    isOnline: true,
    onlineUrl: "https://example.com/livestream", // TODO(content)
    // no registrationUrl: walk-in talk + livestream
    registrationLabel: "Livestream on Discord",
    badge: "Keynote talk",
    gallery: [],
    isFeatured: false,
    color: "coral",
  },
  {
    ...base("ev-event-sourcing", "event-sourcing-workshop"),
    title:
      "Workshop: An Unreasonably Long Title About Type-Safe Event Sourcing Pipelines for Campus Projects — TODO",
    summary: "Placeholder summary for a workshop with a very long title — TODO.",
    description: "Placeholder description — TODO.",
    category: "workshop",
    startsAt: "2026-12-04T05:00:00.000Z",
    venue: "Lab 402, CS Building — TODO",
    isOnline: false,
    registrationUrl: "https://example.com/register/event-sourcing", // TODO(content)
    // no cover image, no badge
    gallery: [],
    isFeatured: false,
    color: "mint",
  },
  {
    ...base("ev-oss-talk", "open-source-maintainers-talk"),
    title: "Talk: Life as an Open-Source Maintainer — TODO",
    summary: "Placeholder summary — TODO.",
    description: "Placeholder description — TODO.",
    category: "talk",
    startsAt: "2027-01-15T10:00:00.000Z",
    // venue TBA
    isOnline: true,
    onlineUrl: "https://example.com/livestream", // TODO(content)
    gallery: [],
    isFeatured: false,
    color: "sky",
  },
  {
    ...base("ev-code-sprint", "winter-code-sprint"),
    title: "Winter Code Sprint — TODO",
    summary: "Placeholder summary for a team coding competition — TODO.",
    description: "Placeholder description — TODO.",
    category: "competition",
    startsAt: "2027-02-06T04:00:00.000Z",
    venue: "Engineering Commons — TODO",
    isOnline: false,
    registrationUrl: "https://example.com/register/code-sprint", // TODO(content)
    gallery: [],
    isFeatured: false,
    color: "yellow",
  },

  /* ───────── past ───────── */
  {
    ...base("ev-welcome-26", "welcome-back-meetup-2026"),
    title: "Welcome Back Meetup",
    summary: "Pizza, project pitches and new-member onboarding.",
    description: "Placeholder description — TODO.",
    category: "meetup",
    startsAt: "2026-10-03T11:00:00.000Z",
    venue: "Engineering Commons — TODO",
    isOnline: false,
    coverImage: photo("mint", "Placeholder photo from the welcome back meetup"),
    gallery: [
      photo("sky", "Placeholder photo of project pitches"),
      photo("coral", "Placeholder photo of the pizza table"),
    ],
    isFeatured: false,
    color: "mint",
  },
  {
    ...base("ev-git-workshop", "git-for-humans-workshop"),
    title: "Workshop: Git for Humans",
    summary: "Branches, rebases and recovering from the scary stuff.",
    description: "Placeholder description — TODO.",
    category: "workshop",
    startsAt: "2026-09-26T08:00:00.000Z",
    venue: "Lab 402, CS Building — TODO",
    isOnline: false,
    coverImage: photo("lilac", "Placeholder photo from the git workshop"),
    gallery: [],
    isFeatured: false,
    color: "lilac",
  },
  {
    ...base("ev-intro-talk", "intro-to-systems-talk"),
    title: "Talk: Intro to Systems Programming",
    summary: "Placeholder summary — TODO.",
    description: "Placeholder description — TODO.",
    category: "talk",
    startsAt: "2026-09-12T10:00:00.000Z",
    isOnline: true,
    // past event with no photos
    gallery: [],
    isFeatured: false,
    color: "sky",
  },
];
