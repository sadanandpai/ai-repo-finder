import { useMemo, useState } from 'react';
import { categoryBySlug } from '../categories.ts';
import {
  filterRepos,
  languagesIn,
  sortRepos,
  type SortId,
} from '../explore.ts';
import type { Category, LoadStatus, Repo } from '../types.ts';
import { useAllRepos } from './useAllRepos.ts';

export function useExploreRepos(categorySlug: string | undefined): {
  category: Category | undefined;
  unknownCategory: boolean;
  repos: Repo[];
  totalInScope: number;
  languages: string[];
  query: string;
  setQuery: (query: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  sort: SortId;
  setSort: (sort: SortId) => void;
  status: LoadStatus;
  error: string | null;
} {
  const { repos: all, status, error } = useAllRepos(true);
  const category = categorySlug ? categoryBySlug(categorySlug) : undefined;
  const unknownCategory = Boolean(categorySlug) && !category;

  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState<SortId>('stars-desc');

  const inScope = useMemo(() => {
    if (!category) return all;
    return all.filter((repo) => repo.category === category.id);
  }, [all, category]);

  const languages = useMemo(() => languagesIn(inScope), [inScope]);
  const resolvedLanguage =
    language === 'all' || languages.includes(language) ? language : 'all';

  const repos = useMemo(
    () => sortRepos(filterRepos(inScope, query, resolvedLanguage), sort),
    [inScope, query, resolvedLanguage, sort],
  );

  return {
    category,
    unknownCategory,
    repos,
    totalInScope: inScope.length,
    languages,
    query,
    setQuery,
    language: resolvedLanguage,
    setLanguage,
    sort,
    setSort,
    status,
    error,
  };
}
