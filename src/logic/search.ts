import MiniSearch from 'minisearch';
import type { Repo, RepoHit } from './types.ts';

type RepoDoc = Repo & { id: string };

export function createRepoIndex(repos: Repo[]): MiniSearch<RepoDoc> {
  const index = new MiniSearch<RepoDoc>({
    fields: ['slug', 'name', 'owner', 'summary', 'language'],
    storeFields: ['slug'],
    searchOptions: {
      boost: { slug: 3, name: 3, owner: 2, summary: 2, language: 1 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  index.addAll(repos.map((repo) => ({ ...repo, id: repo.slug })));
  return index;
}

export function searchRepos(
  index: MiniSearch<RepoDoc>,
  query: string,
  all: Repo[],
): RepoHit[] {
  const q = query.trim();
  if (!q) return all.map((repo) => ({ ...repo, score: 0 }));

  const bySlug = new Map(all.map((repo) => [repo.slug, repo]));
  return index.search(q).flatMap((hit) => {
    const repo = bySlug.get(String(hit.slug));
    return repo ? [{ ...repo, score: hit.score }] : [];
  });
}
