import { announcements as mockAnnouncements } from "@/content/mock/announcements";
import type { Announcement } from "@/types/content";
import { fromSource } from "./source";

/** Newest first. */
export async function getLatestAnnouncements(limit?: number): Promise<Announcement[]> {
  const all = await fromSource<Announcement[]>({
    mock: () => mockAnnouncements,
    api: "/api/public/announcements",
    tags: ["announcements"],
  });
  const sorted = [...all].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}
