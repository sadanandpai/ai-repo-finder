import { Search } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function SearchButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-line bg-card px-3 text-sm text-ink transition-colors hover:border-muted"
    >
      <Search size={14} strokeWidth={2} aria-hidden />
      <span>Search</span>
      <kbd className="hidden font-mono text-[11px] text-muted sm:inline">⌘K</kbd>
    </button>
  );
}
