import { cacheLife } from "next/cache";

/**
 * "Now" for upcoming/past splits. With Cache Components a bare `new Date()` during prerender is a
 * build error, so the timestamp is cached and refreshed hourly; pages stay static-fast.
 */
export async function getNow(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return Date.now();
}
