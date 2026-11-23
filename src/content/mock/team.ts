import type { TeamMember } from "@/types/content";
import { base } from "./_base";

// Real roster of the 2026-2027 term with photos.
// Photos are stored in public/images/team/ and public/team/.

export const photo = (filename: string, name: string): TeamMember["photo"] => ({
  url: `/images/team/${filename}`,
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
  // Officers & Leadership
  member(
    "maryam-farooq",
    "Maryam Farooq",
    "President",
    "leadership",
    undefined,
    photo("President_SES_Maryam.jpg", "Maryam Farooq"),
  ),
  member(
    "fizza-fatima",
    "Fizza Fatima",
    "Vice President Internal",
    "leadership",
    undefined,
    photo("VPinternal_SES_Fizza.jpg", "Fizza Fatima"),
  ),
  member(
    "salman-ahmed",
    "Salman Ahmed",
    "Vice President External",
    "leadership",
    undefined,
    photo("VPExternals_SES_Salman.jpg", "Salman Ahmed"),
  ),
  member(
    "arsal-temuri",
    "Arsal Temuri",
    "Advisor",
    "leadership",
    undefined,
    photo("Advisor_SES_ArsalTemuri.jpg", "Arsal Temuri"),
  ),

  // Department leads and co-leads
  member(
    "ashar",
    "Ashar Ahmed",
    "Lead",
    "head",
    "dep-info",
    photo("Lead_Info&Coord_AsharAhmed.jpg", "Ashar Ahmed"),
  ),
  member("hamza-ahmed", "Hamza Ahmed", "Lead", "head", "dep-ops"),
  member(
    "mohsin-khan",
    "Mohsin Khan",
    "Co-Lead",
    "head",
    "dep-ops",
    photo("Colead_Operations_Mohsin-Khan.jpg", "Mohsin Khan"),
  ),
  member(
    "sana-idrees",
    "Sana Idrees",
    "Lead",
    "head",
    "dep-security",
    photo("Lead_Security_SanaIdrees.jpg", "Sana Idrees"),
  ),
  member(
    "ermish",
    "Ermish Tabassum",
    "Lead",
    "head",
    "dep-dev",
    photo("Lead_WorkshopsandR&D_ErmishTabassum.jpg", "Ermish Tabassum"),
  ),
  member(
    "sanaullah",
    "Muhammad Sanaullah",
    "Co-Lead",
    "head",
    "dep-dev",
    photo("Colead_WorkshopandR&D_MuhammadSanaUllah.jpg", "Muhammad Sanaullah"),
  ),
  member(
    "abiha-jibran",
    "Abiha Jibran",
    "Lead",
    "head",
    "dep-media",
    photo("lead_Media&Graphics_AbihaJibbran.jpg", "Abiha Jibran"),
  ),
  member(
    "faiq",
    "Muhammad Faiq Haider",
    "Co-Lead",
    "head",
    "dep-media",
    photo("Colead_media&graphics_Muhammad_Faiq_Haider.jpg", "Muhammad Faiq Haider"),
  ),
  member(
    "ishmal-najeeb",
    "Ishmal Najeeb",
    "Lead",
    "head",
    "dep-pr",
    photo("lead_marketing_ishmalnajeeb.png", "Ishmal Najeeb"),
  ),
  member("rizwan-saeed", "Rizwan Saeed", "Co-Lead", "head", "dep-pr"),
  member("nofal-zaman", "Nofal Zaman", "Lead", "head", "dep-finance"),
  member(
    "usman-azhar",
    "Usman Azhar",
    "Lead",
    "head",
    "dep-events",
    photo("Lead_Events_Usman.jpg", "Usman Azhar"),
  ),
  member(
    "saliha-noor",
    "Saliha Noor",
    "Lead",
    "head",
    "dep-logistics",
    photo("Lead_Logistics_&_Decor_Saliha_Noor.jpg", "Saliha Noor"),
  ),
];
