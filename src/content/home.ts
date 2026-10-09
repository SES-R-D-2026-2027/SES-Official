import type { Media } from "@/types/content";

// Homepage copy that is site text, not CMS content (events, projects, etc. come from lib/data).
// TODO(content): review wording with the society; lab photos are placeholders.

export interface LabPhoto {
  image?: Media;
  /** Handwritten caption, max ~6 words. */
  caption: string;
}

export const homeCopy = {
  hero: {
    tag: "Student-run engineering collective",
    titleLead: "Software, built together by",
    titleHighlight: "students.",
    intro:
      "Students build real-world software, compilers, distributed systems and more. An interconnected engineering collective running production tools and peer-reviewed software across campus.",
    joinLabel: "Join SES",
    note: "start here! no experience needed",
    mapSticker: "System map v2",
    estSticker: "Est. campus lab",
  },
  labLife: {
    tag: "Life in the lab",
    title: "Built at 3 AM. Tested on production.",
    body: "No corporate fluff. Just laptops covered in stickers, whiteboard debates over consensus algorithms, and shipping real software with your friends.",
    note: "our lab door is always open",
    photos: [
      {
        image: {
          url: "/images/placeholder/photo-sky.svg",
          alt: "Placeholder: students at a hackathon table",
        },
        caption: "Hackathon, 3am, still debugging",
      },
      {
        image: {
          url: "/images/placeholder/photo-lilac.svg",
          alt: "Placeholder: whiteboard full of diagrams",
        },
        caption: "Whiteboard debate on consensus :)",
      },
      { caption: "Demo day, it actually worked" }, // no photo yet
    ] satisfies LabPhoto[],
  },
  events: {
    tag: "Semester schedule",
    note: "free pizza at all talks!",
    title: "Upcoming events",
    description: "Hands-on workshops, campus hackathons and technical deep-dives hosted regularly.",
    suggest: {
      title: "Got an idea?",
      body: "Suggest a talk or workshop you want to see.",
      href: "/contact",
    },
  },
  projects: {
    tags: ["Shipped code", "100% open source"],
    title: "Featured projects",
    description:
      "Open-source software, student tools and technical prototypes built and maintained by society members.",
  },
  announcements: {
    tag: "Dispatches",
    note: "read our newest preprint",
    title: "Latest announcements",
    description: "Club updates, research highlights and community notices.",
  },
  join: {
    sticker: "Now accepting",
    tag: "Get involved today",
    title: "Come build with us.",
    body: "Whether you're writing your first line of code or compiling custom kernels, there's a team, a mentorship group and a project ready for you.",
    joinLabel: "Join SES",
    discordLabel: "Explore our Discord",
    note: "we don't bite!",
  },
} as const;
