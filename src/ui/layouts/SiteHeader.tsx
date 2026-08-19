import { Github } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { ThemeToggle } from '../components/ThemeToggle.tsx';
import { SearchButton } from '../components/SearchButton.tsx';
import { cn } from '../lib/cn.ts';

const REPO_URL = 'https://github.com/sadanandpai/ai-repo-finder';

type Props = {
  onSearchClick: () => void;
};

export function SiteHeader({ onSearchClick }: Props) {
  return (
    <header className="mb-10 flex items-center justify-between gap-4">
      <Link
        to="/"
        className="text-[13px] tracking-[0.08em] text-muted uppercase hover:text-ink"
      >
        AI Repo Finder
      </Link>
      <div className="flex items-center gap-4">
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            cn(
              'text-sm transition-colors',
              isActive ? 'text-accent' : 'text-muted hover:text-ink',
            )
          }
        >
          Explore
        </NavLink>
        <div className="flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            title="GitHub repository"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-line bg-card text-ink transition-colors hover:border-muted"
          >
            <Github size={16} strokeWidth={2} aria-hidden />
          </a>
          <ThemeToggle />
          <SearchButton onClick={onSearchClick} />
        </div>
      </div>
    </header>
  );
}
