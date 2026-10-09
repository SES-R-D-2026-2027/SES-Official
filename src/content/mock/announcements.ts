import type { Announcement } from "@/types/content";
import { base } from "./_base";

// TODO(content): placeholder announcements. Edge cases: one pinned, one very long title,
// every category the homepage colors.

export const announcements: Announcement[] = [
  {
    ...base("an-research-bench", "llm-refactoring-benchmark"),
    title: "SES Research Group Publishes an LLM-Assisted Code Refactoring Benchmark — TODO",
    summary: "Placeholder: our student paper on automated type inference was accepted.",
    body: "Placeholder body — TODO.",
    category: "research",
    publishedAt: "2026-10-06T09:00:00.000Z",
    isPinned: false,
  },
  {
    ...base("an-hackathon-open", "fall-hackathon-registration-open"),
    title: "Fall Hackathon Registration & Problem Statements Revealed",
    summary: "Tracks include low-latency streaming, distributed storage and accessibility tooling.",
    body: "Placeholder body — TODO.",
    category: "community",
    publishedAt: "2026-10-01T09:00:00.000Z",
    isPinned: true,
  },
  {
    ...base("an-mentorship", "mentorship-program-launch"),
    title: "Mentorship Program Launch for Winter 2027 — TODO",
    summary: "Placeholder: pairing junior members with senior mentors on open infra projects.",
    body: "Placeholder body — TODO.",
    category: "partnership",
    publishedAt: "2026-09-21T09:00:00.000Z",
    isPinned: false,
  },
  {
    ...base("an-lab-hours", "lab-hours-update"),
    title:
      "Notice: Lab Hours Are Changing for the Mid-Term Weeks, Including a Very Long Title to Test Wrapping — TODO",
    summary: "Placeholder: new lab hours during mid-terms.",
    body: "Placeholder body — TODO.",
    category: "notice",
    publishedAt: "2026-09-14T09:00:00.000Z",
    isPinned: false,
  },
];
