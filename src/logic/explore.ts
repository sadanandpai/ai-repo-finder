import type { Repo } from './types.ts';

export const SORT_IDS = [
  'stars-desc',
  'created-desc',
  'name-asc',
  'name-desc',
] as const;
export type SortId = (typeof SORT_IDS)[number];

export const SORT_OPTIONS: { value: SortId; label: string }[] = [
  { value: 'stars-desc', label: 'Stars' },
  { value: 'created-desc', label: 'Latest' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

export function languagesIn(repos: Repo[]): string[] {
  return [...new Set(repos.map((repo) => repo.language))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterRepos(
  repos: Repo[],
  query: string,
  language: string,
): Repo[] {
  const q = query.trim().toLowerCase();
  return repos.filter((repo) => {
    if (language !== 'all' && repo.language !== language) return false;
    if (!q) return true;
    return (
      repo.slug.toLowerCase().includes(q) ||
      repo.name.toLowerCase().includes(q) ||
      repo.owner.toLowerCase().includes(q) ||
      repo.summary.toLowerCase().includes(q) ||
      repo.language.toLowerCase().includes(q)
    );
  });
}

export function sortRepos(repos: Repo[], sort: SortId): Repo[] {
  const copy = [...repos];
  const byName = (a: Repo, b: Repo) => a.name.localeCompare(b.name);
  switch (sort) {
    case 'stars-desc':
      return copy.sort((a, b) => b.stars - a.stars || byName(a, b));
    case 'name-asc':
      return copy.sort(byName);
    case 'name-desc':
      return copy.sort((a, b) => byName(b, a));
    case 'created-desc':
      return copy.sort((a, b) => {
        const tb = Date.parse(b.createdAt) || 0;
        const ta = Date.parse(a.createdAt) || 0;
        return tb - ta || byName(a, b);
      });
  }
}
