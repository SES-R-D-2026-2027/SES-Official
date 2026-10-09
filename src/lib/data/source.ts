import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api/client";

// The single mock ⇄ API switch. Getters in lib/data/* call fromSource() and never care which
// source is active. Server-only: never import this from a "use client" file.

export type DataSource = "mock" | "api";

export function getDataSource(): DataSource {
  return process.env.DATA_SOURCE === "api" ? "api" : "mock";
}

interface FromSourceOptions<T> {
  /** Returns the typed mock data (from src/content/mock). */
  mock: () => T | Promise<T>;
  /** ses-api path, e.g. "/api/public/events?timeline=upcoming". */
  api: string;
  /** Cache tags so admin edits can revalidate later, e.g. ["events"]. */
  tags: string[];
}

export async function fromSource<T>({ mock, api, tags }: FromSourceOptions<T>): Promise<T> {
  if (getDataSource() === "mock") return mock();
  return fetchPublic<T>(api, tags);
}

/**
 * Cached ses-api read. With Cache Components on (next.config.ts), caching is opt-in via
 * "use cache"; this replaces the older `fetch(url, { next: { revalidate, tags } })` pattern.
 * revalidate: 300 keeps the old 5-minute revalidation from CLAUDE.md.
 */
async function fetchPublic<T>(path: string, tags: string[]): Promise<T> {
  "use cache";
  cacheLife({ revalidate: 300 });
  cacheTag(...tags);
  const { data } = await apiFetch<T>(path);
  if (data === undefined || data === null) {
    throw new Error(`ses-api returned empty data for ${path}`);
  }
  return data;
}
