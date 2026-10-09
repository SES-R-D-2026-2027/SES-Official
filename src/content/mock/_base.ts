import type { Base } from "@/types/content";

// Shared bookkeeping fields for mock records, so each mock file only lists real content.
const stamp = "2026-09-01T00:00:00.000Z";

export function base(id: string, slug: string): Base {
  return { id, slug, status: "published", createdAt: stamp, updatedAt: stamp };
}
