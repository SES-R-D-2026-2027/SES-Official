import type { Announcement } from "@/types/content";
import { base } from "./_base";

// TODO(content): Campus Pulse demo posts — ready to replace with official notices.

export const announcements: Announcement[] = [
  {
    ...base("an-hackathon-open", "hackathon-registrations-open"),
    title: "Hackathon registrations are officially open.",
    summary: "Form your team, bring your ideas, and build real projects. Open to all students.",
    body: "Registrations are officially open for our semester hackathon. Whether you're building your first project or scaling a full-stack system, team up and create something real.",
    category: "community",
    publishedAt: "2026-10-01T09:00:00.000Z",
    isPinned: true,
  },
  {
    ...base("an-workshop-series", "workshop-series-launch"),
    title: "We're launching a new workshop series.",
    summary: "Hands-on sessions covering web development, cloud tooling, and open-source.",
    body: "Join us for weekly workshops designed to take you from foundational programming concepts to shipping live software on production.",
    category: "news",
    publishedAt: "2026-09-21T09:00:00.000Z",
    isPinned: false,
  },
  {
    ...base("an-bring-an-idea", "bring-a-project-idea"),
    title: "Got a project idea? Bring it to the table.",
    summary: "Any time. Always welcome. Good ideas — and snack recommendations.",
    body: "Have an idea you want to work on? Drop by our lab sessions to pitch concepts, find teammates, and get mentorship from senior builders.",
    category: "community",
    publishedAt: "2026-09-14T09:00:00.000Z",
    isPinned: false,
  },
];
