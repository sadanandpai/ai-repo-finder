import { CATEGORIES } from './categories.ts';
import { categoryDataUrl } from './dataUrl.ts';
import type { CategoryFile, Repo } from './types.ts';

const cache = new Map<string, Promise<Repo[]>>();

export function loadCategoryRepos(slug: string): Promise<Repo[]> {
  const hit = cache.get(slug);
  if (hit) return hit;

  const request = fetch(categoryDataUrl(slug)).then(async (res) => {
    if (!res.ok) {
      throw new Error(`Failed to load ${slug} (${res.status})`);
    }
    const file = (await res.json()) as CategoryFile;
    return file.repos.map((repo) => ({ ...repo, category: file.id }));
  });

  cache.set(slug, request);
  request.catch(() => {
    cache.delete(slug);
  });
  return request;
}

export function loadAllRepos(): Promise<Repo[]> {
  return Promise.all(CATEGORIES.map((c) => loadCategoryRepos(c.slug))).then(
    (groups) => groups.flat(),
  );
}
