import type { Media, TileColor } from "@/types/content";

// Homepage copy. Voice and examples come from the Campus Pulse preview
// (https://campus-pulse--alibhhaaiii.replit.app/); layout follows docs/DESIGN.md / see.png.
// TODO(content): replace demo concepts, dates and stats with official SES details.

export interface LabPhoto {
  image?: Media;
  /** Handwritten caption, max ~6 words. */
  caption: string;
}

export const homeCopy = {
  hero: {
    tag: "University tech, with people in it",
    titleLead: "Build cool",
    titleHighlight: "things.",
    titleRest: "Meet great people.",
    intro:
      "SES is where students come together to build projects, learn new tech, make events happen and occasionally debate tabs vs. spaces.",
    joinLabel: "Join the community",
    seeLabel: "See what's happening",
    seeHref: "#events",
    note: "new here? perfect.",
    mapSticker: "System map v2",
    estSticker: "Est. campus lab",
    vibeNote: "yep, that's the vibe",
    floats: [
      { title: "Make a thing", note: "ideas welcome · skills optional", color: "yellow" },
      { title: "Projects in progress", note: "always room for one more", color: "mint" },
      { title: "Game night energy", note: "coding not required", color: "coral" },
    ] as { title: string; note: string; color: TileColor }[],
  },
  labLife: {
    tag: "The people part",
    title: "Yes, we touch grass.",
    body: "SES isn't only workshops and laptops. Some of the best ideas start over pizza, on a trip, or after someone says “one more game.”",
    note: "come for the tech, stay for the people",
    activities: ["Game nights", "Pizza evenings", "Trips & meetups", "Movie nights", "Freshers things"],
    photos: [
      {
        image: {
          url: "/images/IMG-20251129-WA0065.jpg",
          alt: "Students coding in the computer lab during the Web Dev Hackathon",
        },
        caption: "Hackathon in full swing",
      },
      {
        image: {
          url: "/images/IMG-20251129-WA0186.jpg",
          alt: "Students presenting project demos to mentors and peers in the lab",
        },
        caption: "Pitching our projects",
      },
      {
        image: {
          url: "/images/IMG-20251129-WA0244.jpg",
          alt: "Group photo of hackathon participants and winners holding shields and certificates",
        },
        caption: "Winners & the squad :)",
      },
      {
        image: {
          url: "/images/IMG_5931.JPG",
          alt: "SES jamming session with acoustic guitars and students singing on stage",
        },
        caption: "Jamming night vibes",
      },
    ] satisfies LabPhoto[],
  },
  events: {
    tag: "The campus calendar, but fun",
    note: "free pizza at all talks!",
    title: "What's going on?",
    description:
      "Workshops, competitions, meetups, game nights and whatever we decide to organize next.",
    suggest: {
      title: "Got an idea?",
      body: "Good ideas welcome. So are snack recommendations.",
      href: "/contact",
    },
  },
  projects: {
    tags: ["Ideas don't build themselves", "Always a first commit"],
    title: "Things we're building",
    description:
      "Small experiments, ambitious side quests and projects that got real.",
  },
  team: {
    tag: "Friendly faces, real people",
    title: "Meet the humans behind SES.",
    description:
      "Developers, designers, organizers, problem-solvers and professional deadline negotiators.",
    joinLabel: "Could be you",
  },
  tech: {
    tag: "A playground, not a checklist",
    title: "What are we playing with?",
    description:
      "From your first “hello world” to something you never thought you could make. Pick a topic and get a tiny taste of what it could mean.",
    note: "Tap a bubble. Follow the curiosity.",
    items: [
      { name: "React", blurb: "Interfaces you can poke. Start with a button, end up with a whole app." },
      { name: "Next.js", blurb: "The site you're on. Pages, APIs and shipping something people can actually open." },
      { name: "Python", blurb: "Scripts, data, a little chaos. The Swiss army knife of campus projects." },
      { name: "AI / ML", blurb: "Bring a half-formed idea. Leave with something running. No AI experience required." },
      { name: "Docker", blurb: "It works on my machine — and, after this, on yours too." },
      { name: "Node.js", blurb: "JavaScript on the server. APIs, bots, and the glue between ideas." },
      { name: "TypeScript", blurb: "JavaScript with a seatbelt. Fewer 3 AM “why is this undefined” moments." },
      { name: "DevOps", blurb: "Deploys, pipelines and the dark art of not breaking production on a Friday." },
      { name: "Flutter", blurb: "One codebase, a phone in your pocket. Tiny apps with big opinions." },
      { name: "Figma", blurb: "Before the code: stickers, screens and “what if the button was yellow?”" },
    ],
  },
  announcements: {
    tag: "Pinned with good intentions",
    title: "The SES board",
    description: "Announcements, useful nudges and notes from the society.",
  },
  marquee: [
    "Build",
    "Learn",
    "Create",
    "Compete",
    "Connect",
    "Have fun",
    "Find your people",
  ],
  join: {
    sticker: "Your next side quest",
    tag: "Come as you are",
    title: "Got an idea? Let's build it.",
    body: "Meet students who love creating, experimenting and learning together. No experience required. Curiosity helps.",
    joinLabel: "Join SES",
    discordLabel: "Explore our Discord",
    note: "bring a half-formed idea",
  },
} as const;
