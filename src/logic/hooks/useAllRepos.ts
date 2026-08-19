import { useEffect, useState } from 'react';
import { loadAllRepos } from '../loadRepos.ts';
import type { LoadStatus, Repo } from '../types.ts';

export function useAllRepos(enabled: boolean): {
  repos: Repo[];
  status: LoadStatus;
  error: string | null;
} {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    loadAllRepos()
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setError(null);
        setHasLoaded(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load repos');
        setHasLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const status: LoadStatus = !enabled
    ? 'idle'
    : !hasLoaded
      ? 'loading'
      : error
        ? 'error'
        : 'ready';

  return { repos, status, error };
}
