import { team as mockTeam } from "@/content/mock/team";
import type { Department, TeamMember } from "@/types/content";
import { getDepartments } from "./departments";
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

export interface DepartmentWithTeam {
  department: Department;
  /** Lead first, then co-leads and other members, in team order. */
  members: TeamMember[];
}

/** Everything the /team page shows: officers, then each department with its people. */
export async function getTeamOverview(): Promise<{
  officers: TeamMember[];
  departments: DepartmentWithTeam[];
}> {
  const [team, departments] = await Promise.all([getTeam(), getDepartments()]);
  return {
    officers: team.filter((member) => member.role === "leadership"),
    departments: departments.map((department) => ({
      department,
      members: team
        .filter((member) => member.departmentId === department.id)
        .sort((a, b) => Number(b.id === department.headId) - Number(a.id === department.headId)),
    })),
  };
}
