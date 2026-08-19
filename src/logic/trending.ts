import type { Repo } from './types.ts';

/** Same repo for the whole UTC day. Order is slug-stable so load order cannot drift. */
export function pickRepoOfTheDay(repos: Repo[], date = new Date()): Repo | undefined {
  if (repos.length === 0) return undefined;
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const sorted = [...repos].sort((a, b) => a.slug.localeCompare(b.slug));
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return sorted[(hash >>> 0) % sorted.length];
}
