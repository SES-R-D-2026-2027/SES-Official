import { team as mockTeam } from "@/content/mock/team";
import type { TeamMember } from "@/types/content";
import { fromSource } from "./source";

export async function getTeam(): Promise<TeamMember[]> {
  const all = await fromSource<TeamMember[]>({
    mock: () => mockTeam,
    api: "/api/public/team",
    tags: ["team"],
  });
  return [...all].sort((a, b) => a.order - b.order);
}

/** Members whose ids appear in `ids`, in team order. */
export async function getMembersByIds(ids: string[]): Promise<TeamMember[]> {
  const wanted = new Set(ids);
  return (await getTeam()).filter((member) => wanted.has(member.id));
}
