import type { TeamMember } from "@/types/content";
import { base } from "./_base";

// TODO(content): placeholder people. Names are deliberately not real-sounding; photos are omitted
// so avatars fall back to initials (one member has a placeholder photo to exercise that path).

const member = (
  n: number,
  name: string,
  position: string,
  role: TeamMember["role"],
  departmentId?: string,
  photo?: TeamMember["photo"],
): TeamMember => ({
  ...base(`tm-${n}`, `member-${n}`),
  name,
  position,
  role,
  departmentId,
  photo,
  links: [],
  order: n,
});

export const team: TeamMember[] = [
  member(1, "Alpha Member", "President — TODO", "leadership", "dep-dist"),
  member(2, "Beta Member", "Vice President — TODO", "leadership", "dep-dist", {
    url: "/images/placeholder/photo-mint.svg",
    alt: "Placeholder portrait",
  }),
  member(3, "Gamma Member", "Head of Compilers — TODO", "head", "dep-compilers"),
  member(4, "Delta Member", "Head of OS — TODO", "head", "dep-os"),
  member(5, "Epsilon Member", "Head of Hardware — TODO", "head", "dep-hw"),
  member(6, "Zeta Member", "Head of Infrastructure — TODO", "head", "dep-infra"),
  member(7, "Eta Member", "Head of ML — TODO", "head", "dep-ml"),
  member(8, "Theta Member", "Member — TODO", "member", "dep-compilers"),
  member(9, "Iota Member", "Member — TODO", "member", "dep-infra"),
  member(10, "Kappa Member", "Member — TODO", "member"),
];
