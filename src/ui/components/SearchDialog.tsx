import { Command } from 'cmdk';
import type { RepoHit } from '../../logic/index.ts';

type Props = {
  open: boolean;
  query: string;
  results: RepoHit[];
  categoryName: (categoryId: RepoHit['category']) => string;
  onOpenChange: (open: boolean) => void;
  onQueryChange: (query: string) => void;
};

export function SearchDialog({
  open,
  query,
  results,
  categoryName,
  onOpenChange,
  onQueryChange,
}: Props) {
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      shouldFilter={false}
      label="Search repos"
      overlayClassName="fixed inset-0 z-40 bg-bg/70"
      contentClassName="fixed z-50 top-[16vh] left-1/2 w-[min(640px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-card"
    >
      <Command.Input
        value={query}
        onValueChange={onQueryChange}
        placeholder="Search saved GitHub repos…"
        className="w-full border-0 border-b border-line bg-transparent px-4 py-4 text-ink outline-none"
      />
      <Command.List className="max-h-[360px] overflow-auto p-2">
        <Command.Empty className="px-3 py-6 text-muted">
          No matching repos.
        </Command.Empty>
        {results.map((repo) => (
          <Command.Item
            key={repo.slug}
            value={repo.slug}
            onSelect={() => {
              window.open(repo.url, '_blank', 'noopener,noreferrer');
              onOpenChange(false);
            }}
            className="group flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 data-[selected=true]:bg-on data-[selected=true]:text-on-ink"
          >
            <img
              src={repo.avatarUrl}
              alt=""
              width={28}
              height={28}
              className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-line object-cover"
            />
            <span className="grid min-w-0 gap-0.5">
              <span className="truncate text-[13px] font-semibold">{repo.name}</span>
              <span className="text-xs text-muted group-data-[selected=true]:text-on-ink/75">
                {repo.owner} · {categoryName(repo.category)} · {repo.language}
              </span>
              <span className="line-clamp-1 text-xs text-muted group-data-[selected=true]:text-on-ink/75">
                {repo.summary}
              </span>
            </span>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
