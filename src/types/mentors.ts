import type { TileColor } from "./content";

export interface MentorLink {
  email?: string;
  linkedin?: string;
  github?: string;
}

export interface MainMentor {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string;
  photo?: string;
  tagline?: string;
  comment: string;
  links?: MentorLink;
}

export interface MinorMentor {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string;
  photo?: string | null;
  bio: string;
  links?: MentorLink;
}
