import { CircleAlert, GitFork, Star } from 'lucide-react';
import { useState } from 'react';
import {
  formatCount,
  formatUpdatedAt,
  type Repo,
} from '../../logic/index.ts';
import { Badge } from './Badge.tsx';

type Props = {
  repo: Repo;
  categoryName: string;
};

export function RepoCard({ repo, categoryName }: Props) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <a
      className="flex h-full flex-col gap-3 rounded-xl border border-line bg-card p-4 transition-colors hover:border-muted"
      href={repo.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="flex items-start gap-3">
        {avatarFailed ? (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-line text-sm font-medium text-ink"
            aria-hidden
          >
            {repo.owner.slice(0, 1).toUpperCase()}
          </span>
        ) : (
          <img
            src={repo.avatarUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full bg-line object-cover"
            onError={() => setAvatarFailed(true)}
          />
        )}
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">{repo.name}</span>
          <span className="block truncate text-sm text-muted">{repo.owner}</span>
        </span>
      </span>

      <span className="line-clamp-2 min-h-[2.5rem] text-sm text-muted">
        {repo.summary}
      </span>

      <span className="flex flex-wrap gap-1.5">
        <Badge>{repo.language}</Badge>
        <Badge>{categoryName}</Badge>
      </span>

      <span className="mt-auto flex items-center gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <Star size={14} aria-hidden />
          {formatCount(repo.stars)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork size={14} aria-hidden />
          {formatCount(repo.forks)}
        </span>
        <span className="inline-flex items-center gap-1">
          <CircleAlert size={14} aria-hidden />
          {formatCount(repo.issues)}
        </span>
      </span>

      <span className="border-t border-line pt-3 text-xs text-muted">
        {formatUpdatedAt(repo.updatedAt)}
      </span>
    </a>
  );
}
