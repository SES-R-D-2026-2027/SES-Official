import { departments as mockDepartments } from "@/content/mock/departments";
import type { Department } from "@/types/content";
import { fromSource } from "./source";

/** In display order. */
export async function getDepartments(): Promise<Department[]> {
  const all = await fromSource<Department[]>({
    mock: () => mockDepartments,
    api: "/api/public/departments",
    tags: ["departments"],
  });
  return [...all].sort((a, b) => a.order - b.order);
}
