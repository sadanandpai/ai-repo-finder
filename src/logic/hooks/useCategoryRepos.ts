import { useEffect, useState } from 'react';
import { categoryBySlug } from '../categories.ts';
import { loadCategoryRepos } from '../loadRepos.ts';
import type { Category, LoadStatus, Repo } from '../types.ts';

export function useCategoryRepos(slug: string | undefined): {
  category: Category | undefined;
  repos: Repo[];
  status: LoadStatus;
  error: string | null;
} {
  const category = slug ? categoryBySlug(slug) : undefined;
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    const requested = category.slug;
    let cancelled = false;

    loadCategoryRepos(requested)
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setError(null);
        setLoadedSlug(requested);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setRepos([]);
        setError(err instanceof Error ? err.message : 'Failed to load repos');
        setLoadedSlug(requested);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const status: LoadStatus = !category
    ? 'idle'
    : loadedSlug !== category.slug
      ? 'loading'
      : error
        ? 'error'
        : 'ready';

  return { category, repos, status, error };
}
