import type { Repo } from './types.ts';

export const SORT_IDS = [
  'stars-desc',
  'name-asc',
  'name-desc',
  'language',
  'category',
] as const;
export type SortId = (typeof SORT_IDS)[number];

export const SORT_OPTIONS: { value: SortId; label: string }[] = [
  { value: 'stars-desc', label: 'Stars' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'language', label: 'Language' },
  { value: 'category', label: 'Category' },
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
    case 'language':
      return copy.sort(
        (a, b) => a.language.localeCompare(b.language) || byName(a, b),
      );
    case 'category':
      return copy.sort(
        (a, b) => a.category.localeCompare(b.category) || byName(a, b),
      );
  }
}
