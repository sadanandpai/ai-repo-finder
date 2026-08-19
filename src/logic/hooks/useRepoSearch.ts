import { useMemo, useState } from 'react';
import { createRepoIndex, searchRepos } from '../search.ts';
import type { LoadStatus, RepoHit } from '../types.ts';
import { useAllRepos } from './useAllRepos.ts';

export function useRepoSearch(enabled: boolean): {
  query: string;
  setQuery: (query: string) => void;
  results: RepoHit[];
  status: LoadStatus;
} {
  const { repos, status } = useAllRepos(enabled);
  const [query, setQuery] = useState('');

  const index = useMemo(
    () => (repos.length > 0 ? createRepoIndex(repos) : null),
    [repos],
  );

  const results = useMemo(() => {
    if (!index) return [];
    return searchRepos(index, query, repos);
  }, [index, query, repos]);

  return { query, setQuery, results, status };
}
