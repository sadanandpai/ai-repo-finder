import { ArrowRight, BadgeCheck, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router';
import { CATEGORIES, categoryById, pickRepoOfTheDay, useAllRepos } from '../../logic/index.ts';
import { Button } from '../components/Button.tsx';
import { CategoryGrid } from '../components/CategoryGrid.tsx';
import { RepoCard } from '../components/RepoCard.tsx';
import { StatusMessage } from '../components/StatusMessage.tsx';

const WHY = [
  {
    title: 'Curated, not noisy',
    body: 'Hand-picked GitHub repos — not another endless dump.',
    Icon: BadgeCheck,
  },
  {
    title: 'Four clear buckets',
    body: 'Coding is the repo. Agent is the runtime. Frameworks are how you build. Skills are behavior packs.',
    Icon: Layers,
  },
  {
    title: 'Built for agents',
    body: 'Index, harness, MCP, memory, skills. The stack around the model.',
    Icon: Cpu,
  },
] as const;

export function HomePage() {
  const { repos, status, error } = useAllRepos(true);
  const counts = Object.fromEntries(
    CATEGORIES.map((category) => [
      category.slug,
      repos.filter((repo) => repo.category === category.id).length,
    ])
  );
  const featured = pickRepoOfTheDay(repos);

  return (
    <div className="grid gap-16">
      <section className="grid justify-items-center gap-5 py-8 text-center">
        <p className="text-xs tracking-[0.12em] text-accent uppercase">Curated GitHub catalog</p>
        <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-balance md:text-5xl">
          Repos that make coding agents useful.
        </h1>
        <p className="max-w-xl text-muted text-pretty">
          Coding, Agent, Frameworks, and Skills — picked for people who ship with agents.
        </p>
        <Button asChild size="lg">
          <Link to="/explore">
            Explore repos
            <ArrowRight size={18} aria-hidden />
          </Link>
        </Button>
      </section>

      <section className="grid justify-items-center gap-4 text-center">
        {status === 'loading' ? <StatusMessage title="Loading repos…" /> : null}
        {status === 'error' ? (
          <StatusMessage title="Could not load repos" body={error ?? undefined} />
        ) : null}
        {status === 'ready' && featured ? (
          <div className="grid w-full max-w-xl gap-3 text-left">
            <p className="text-xs font-medium tracking-[0.12em] text-accent text-center uppercase">
              Repo of the day
            </p>
            <RepoCard repo={featured} categoryName={categoryById(featured.category).name} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xs font-medium tracking-[0.12em] text-muted uppercase">
          Why it exists
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {WHY.map(({ title, body, Icon }) => (
            <article key={title} className="grid gap-3 rounded-lg border border-line bg-card p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-on/15 text-accent">
                <Icon size={16} aria-hidden />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xs font-medium tracking-[0.12em] text-muted uppercase">
          Browse categories
        </h2>
        <CategoryGrid categories={CATEGORIES} counts={counts} />
      </section>
    </div>
  );
}
