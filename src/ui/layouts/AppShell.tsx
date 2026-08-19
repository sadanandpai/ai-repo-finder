import { Outlet } from 'react-router';
import {
  categoryById,
  useRepoSearch,
  useSearchOpen,
} from '../../logic/index.ts';
import { SearchDialog } from '../components/SearchDialog.tsx';
import { SiteHeader } from './SiteHeader.tsx';

export function AppShell() {
  const { open, setOpen } = useSearchOpen();
  const search = useRepoSearch(open);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-8 pb-24">
      <SiteHeader onSearchClick={() => setOpen(true)} />
      <Outlet />
      <footer className="mt-20 text-xs text-muted">
        AI Repo Finder · curated catalog
      </footer>
      <SearchDialog
        open={open}
        query={search.query}
        results={search.results}
        categoryName={(id) => categoryById(id).name}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) search.setQuery('');
        }}
        onQueryChange={search.setQuery}
      />
    </div>
  );
}
