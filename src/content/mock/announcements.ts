import type { Announcement } from "@/types/content";

// No announcements yet (content doc, Oct 2026). Add official notices here as they come in:
// { ...base("an-<id>", "<slug>"), title, summary, body (Markdown), category, publishedAt, isPinned }
// with `import { base } from "./_base";`.

export const announcements: Announcement[] = [];
