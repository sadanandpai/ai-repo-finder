import { Search } from 'lucide-react';
import { useParams } from 'react-router';
import {
  CATEGORIES,
  SORT_IDS,
  SORT_OPTIONS,
  categoryById,
  useExploreRepos,
  type SortId,
} from '../../logic/index.ts';
import { CategoryTab } from '../components/CategoryTab.tsx';
import { Input } from '../components/Input.tsx';
import { RepoList } from '../components/RepoList.tsx';
import { SelectField } from '../components/SelectField.tsx';
import { StatusMessage } from '../components/StatusMessage.tsx';

function isSortId(value: string): value is SortId {
  return (SORT_IDS as readonly string[]).includes(value);
}

export function ExplorePage() {
  const { categorySlug } = useParams();
  const explore = useExploreRepos(categorySlug);

  const languageOptions = [
    { value: 'all', label: 'All' },
    ...explore.languages.map((language) => ({
      value: language,
      label: language,
    })),
  ];

  const noun = explore.repos.length === 1 ? 'repo' : 'repos';
  const filtered =
    explore.repos.length !== explore.totalInScope
      ? ` of ${explore.totalInScope}`
      : '';

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-medium tracking-tight">Explore repos</h1>
        {explore.status === 'ready' && !explore.unknownCategory ? (
          <p className="text-sm text-muted">
            {explore.repos.length}
            {filtered} {noun}
          </p>
        ) : null}
      </div>

      <nav aria-label="Categories" className="flex flex-wrap gap-2">
        <CategoryTab to="/explore" end>
          All
        </CategoryTab>
        {CATEGORIES.map((category) => (
          <CategoryTab key={category.slug} to={`/explore/${category.slug}`}>
            {category.name}
          </CategoryTab>
        ))}
      </nav>

      {explore.unknownCategory ? (
        <StatusMessage
          title="Unknown category"
          body="Pick All, Coding tools, Agent tools, or Knowledge hubs."
        />
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <Input
                value={explore.query}
                onChange={(event) => explore.setQuery(event.target.value)}
                placeholder="Search name, owner, summary…"
                aria-label="Filter repos"
                className="pl-9"
              />
            </label>
            <SelectField
              prefix="Language"
              aria-label="Filter by language"
              value={explore.language}
              onValueChange={explore.setLanguage}
              options={languageOptions}
            />
            <SelectField
              prefix="Sort"
              aria-label="Sort repos"
              value={explore.sort}
              onValueChange={(value) => {
                if (isSortId(value)) explore.setSort(value);
              }}
              options={SORT_OPTIONS}
            />
          </div>

          {explore.status === 'loading' ? (
            <StatusMessage title="Loading repos…" />
          ) : null}
          {explore.status === 'error' ? (
            <StatusMessage
              title="Could not load repos"
              body={explore.error ?? undefined}
            />
          ) : null}
          {explore.status === 'ready' && explore.repos.length === 0 ? (
            <StatusMessage
              title="No matching repos"
              body="Try another search, language, or category."
            />
          ) : null}
          {explore.status === 'ready' && explore.repos.length > 0 ? (
            <RepoList
              meta={
                explore.category
                  ? explore.category.blurb
                  : 'Coding tools, agent runtimes, and knowledge hubs.'
              }
              repos={explore.repos}
              categoryName={(id) => categoryById(id).name}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
