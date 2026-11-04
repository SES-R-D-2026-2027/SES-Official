import { mainMentors, minorMentors } from "@/content/mock/mentors";
import type { MainMentor, MinorMentor } from "@/types/mentors";

export async function getMentors(): Promise<{ main: MainMentor[]; minor: MinorMentor[] }> {
  return { main: mainMentors, minor: minorMentors };
}
