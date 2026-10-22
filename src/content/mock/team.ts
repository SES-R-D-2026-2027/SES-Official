import type { TeamMember } from "@/types/content";
import { base } from "./_base";

// Real roster of the 2026-2027 term. Nobody has a photo yet, so avatars show a silhouette.
// To add a photo: put a square image at public/images/team/<slug>.jpg (slug = the second
// argument below, e.g. "maryam-farooq") and pass `photo("<slug>", "<name>")` as the last argument.

/** Photo stored at public/images/team/<slug>.jpg. */
export const photo = (slug: string, name: string): TeamMember["photo"] => ({
  url: `/images/team/${slug}.jpg`,
  alt: `Portrait of ${name}`,
});

let order = 0;

const member = (
  slug: string,
  name: string,
  position: string,
  role: TeamMember["role"],
  departmentId?: string,
  memberPhoto?: TeamMember["photo"],
): TeamMember => ({
  ...base(`tm-${slug}`, slug),
  name,
  position,
  role,
  departmentId,
  photo: memberPhoto,
  links: [],
  order: ++order,
});

export const team: TeamMember[] = [
  // Officers
  member("maryam-farooq", "Maryam Farooq", "President", "leadership"),
  member("fizza-fatima", "Fizza Fatima", "Vice President Internal", "leadership"),
  member("salman-ahmed", "Salman Ahmed", "Vice President External", "leadership"),

  // Department leads and co-leads
  member("ashar", "Ashar", "Lead", "head", "dep-info"),
  member("hamza-ahmed", "Hamza Ahmed", "Lead", "head", "dep-ops"),
  member("mohsin-khan", "Mohsin Khan", "Co-Lead", "head", "dep-ops"),
  member("sana-idrees", "Sana Idrees", "Lead", "head", "dep-security"),
  member("ermish", "Ermish", "Lead", "head", "dep-dev"),
  member("sanaullah", "Sanaullah", "Co-Lead", "head", "dep-dev"),
  member("abiha-jibran", "Abiha Jibran", "Lead", "head", "dep-media"),
  member("faiq", "Faiq", "Co-Lead", "head", "dep-media"),
  member("ishmal-najeeb", "Ishmal Najeeb", "Lead", "head", "dep-pr"),
  member("rizwan-saeed", "Rizwan Saeed", "Co-Lead", "head", "dep-pr"),
  member("nofal-zaman", "Nofal Zaman", "Lead", "head", "dep-finance"),
  member("usman-azhar", "Usman Azhar", "Lead", "head", "dep-events"),
  member("saliha-noor", "Saliha Noor", "Lead", "head", "dep-logistics"),
];
