// Mirrors docs/API-CONTRACT.md — contract version 1.0 (2026-10-09).
// Change the contract first (master lives in ses-api), then this file, then the mocks.

/* ───────── Shared pieces ───────── */

export type Status = "draft" | "published" | "archived";

/** Optional accent color per item; maps to the bg-tile-* utilities. */
export type TileColor = "yellow" | "mint" | "lilac" | "coral" | "sky" | "blue" | "paper";

export interface Media {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Link {
  label: string;
  url: string;
}

export interface Base {
  id: string;
  slug: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

/* ───────── Content types ───────── */

/** FR-03 */
export interface Department extends Base {
  name: string;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  headId?: string;
  memberIds: string[];
  color?: TileColor;
  icon?: string;
  order: number;
}

/** FR-04 */
export interface TeamMember extends Base {
  name: string;
  position: string;
  departmentId?: string;
  role: "leadership" | "head" | "member" | "advisor";
  photo?: Media;
  bio?: string;
  links: Link[];
  funFact?: string;
  order: number;
}

export type EventCategory = "workshop" | "talk" | "hackathon" | "competition" | "meetup" | "other";

/** FR-05 */
export interface Event extends Base {
  title: string;
  summary: string;
  description: string;
  category: EventCategory;
  startsAt: string;
  endsAt?: string;
  venue?: string;
  isOnline: boolean;
  onlineUrl?: string;
  /** EXTERNAL link only (O-02). */
  registrationUrl?: string;
  /** e.g. "Free admission · Food provided" */
  registrationLabel?: string;
  /** Sticker text: "LIMITED SEATS", "OPEN REGISTRATION" */
  badge?: string;
  coverImage?: Media;
  gallery: Media[];
  isFeatured: boolean;
  color?: TileColor;
}

/** Derived on read by the data getters, not stored. */
export type EventTimeline = "upcoming" | "past";

export type ProjectStatus = "idea" | "in-progress" | "shipped" | "maintained";

/** FR-06 */
export interface Project extends Base {
  name: string;
  tagline: string;
  description: string;
  projectStatus: ProjectStatus;
  technologies: string[];
  techAreaIds: string[];
  contributorIds: string[];
  departmentId?: string;
  initiativeId?: string;
  repoUrl?: string;
  liveUrl?: string;
  docsUrl?: string;
  stars?: number;
  coverImage?: Media;
  gallery: Media[];
  isFeatured: boolean;
  lookingForContributors: boolean;
  color?: TileColor;
}

export interface Publication {
  title: string;
  authors: string[];
  year: number;
  url?: string;
  file?: Media;
}

/** FR-07 */
export interface ResearchInitiative extends Base {
  title: string;
  summary: string;
  description: string;
  memberIds: string[];
  projectIds: string[];
  publications: Publication[];
}

/** FR-08 */
export interface TechArea extends Base {
  name: string;
  description: string;
  icon?: string;
  color?: TileColor;
  order: number;
}

/** FR-09 */
export interface Resource extends Base {
  title: string;
  description: string;
  categoryId: string;
  type: "file" | "link" | "video" | "doc";
  url?: string;
  file?: { url: string; name: string; sizeBytes: number; mime: string };
  techAreaIds: string[];
}

export interface ResourceCategory extends Base {
  name: string;
  order: number;
}

export type AnnouncementCategory = "news" | "research" | "partnership" | "community" | "notice";

/** FR-10 */
export interface Announcement extends Base {
  title: string;
  summary: string;
  /** Markdown */
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  isPinned: boolean;
}

/** Homepage stats row (admin-editable). */
export interface SiteStats {
  items: {
    value: number;
    suffix?: string;
    label: string;
    description: string;
    note?: string;
    color: TileColor;
  }[];
}

/** GET /api/public/home */
export interface HomeData {
  featuredEvents: Event[];
  featuredProjects: Project[];
  latestAnnouncements: Announcement[];
  stats: SiteStats;
}

/* ───────── FR-11 submissions (write-only from the public site) ───────── */

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface JoinSubmission {
  name: string;
  email: string;
  rollNumber?: string;
  batch?: string;
  interests: string[];
  experience?: string;
  message?: string;
}

/* ───────── API envelope ───────── */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: { pagination?: Pagination } & Record<string, unknown>;
}

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown };
}
