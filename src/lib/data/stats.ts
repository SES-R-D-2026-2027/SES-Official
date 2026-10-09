import { stats as mockStats } from "@/content/mock/stats";
import type { HomeData, SiteStats } from "@/types/content";
import { fromSource } from "./source";

/** Homepage stats row. The API serves it as part of /api/public/home. */
export async function getSiteStats(): Promise<SiteStats> {
  const home = await fromSource<Pick<HomeData, "stats">>({
    mock: () => ({ stats: mockStats }),
    api: "/api/public/home",
    tags: ["home"],
  });
  return home.stats;
}
