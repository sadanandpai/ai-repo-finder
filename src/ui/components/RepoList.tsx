import type { CategoryId, Repo } from '../../logic/index.ts';
import { RepoCard } from './RepoCard.tsx';

type Props = {
  repos: Repo[];
  meta: string;
  categoryName: (id: CategoryId) => string;
};

export function RepoList({ repos, meta, categoryName }: Props) {
  return (
    <section className="grid gap-3">
      <p className="text-xs text-muted">{meta}</p>
      <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {repos.map((repo) => (
          <li key={repo.slug}>
            <RepoCard repo={repo} categoryName={categoryName(repo.category)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
