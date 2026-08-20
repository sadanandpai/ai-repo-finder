import { Search } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function SearchButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-line bg-card text-sm text-ink transition-colors hover:border-muted sm:w-auto sm:px-3"
    >
      <Search size={14} strokeWidth={2} aria-hidden />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden font-mono text-[11px] text-muted sm:inline">⌘K</kbd>
    </button>
  );
}
