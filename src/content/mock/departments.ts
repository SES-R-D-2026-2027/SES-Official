import type { Department } from "@/types/content";
import { base } from "./_base";

// Real departments of the 2026-2027 term. memberIds/headId point at src/content/mock/team.ts.
// TODO(content): the descriptions and responsibilities are short placeholders; replace them with
// the society's own wording.

const department = (
  id: string,
  slug: string,
  name: string,
  shortDescription: string,
  color: Department["color"],
  memberIds: string[],
  order: number,
): Department => ({
  ...base(id, slug),
  name,
  shortDescription,
  description: "Placeholder description — TODO.",
  responsibilities: ["Placeholder responsibility — TODO"],
  headId: memberIds[0],
  memberIds,
  color,
  order,
});

export const departments: Department[] = [
  department(
    "dep-info",
    "info-coordination",
    "Info & Coordination",
    "Keeps every team in sync and the information flowing.",
    "sky",
    ["tm-ashar"],
    1,
  ),
  department(
    "dep-ops",
    "operations",
    "Operations",
    "Runs the day-to-day work behind every event and project.",
    "yellow",
    ["tm-hamza-ahmed", "tm-mohsin-khan"],
    2,
  ),
  department(
    "dep-security",
    "security",
    "Security",
    "Looks after safety and order at society events.",
    "coral",
    ["tm-sana-idrees"],
    3,
  ),
  department(
    "dep-dev",
    "work-development",
    "Work & Development",
    "Builds the society's software, including this website.",
    "mint",
    ["tm-ermish", "tm-sanaullah"],
    4,
  ),
  department(
    "dep-media",
    "media-graphics",
    "Media & Graphics",
    "Designs the posters, photos and videos you see from SES.",
    "lilac",
    ["tm-abiha-jibran", "tm-faiq"],
    5,
  ),
  department(
    "dep-pr",
    "pr-marketing",
    "PR & Marketing",
    "Spreads the word about SES on campus and online.",
    "blue",
    ["tm-ishmal-najeeb", "tm-rizwan-saeed"],
    6,
  ),
  department(
    "dep-finance",
    "finance-sponsorship",
    "Finance & Sponsorship",
    "Manages the budget and works with sponsors.",
    "yellow",
    ["tm-nofal-zaman"],
    7,
  ),
  department(
    "dep-events",
    "event-planning",
    "Event Planning",
    "Plans workshops, talks and hackathons from idea to day-of.",
    "sky",
    ["tm-usman-azhar"],
    8,
  ),
  department(
    "dep-logistics",
    "logistics-decor",
    "Logistics & Decor",
    "Handles venues, supplies and making every space look the part.",
    "mint",
    ["tm-saliha-noor"],
    9,
  ),
];
