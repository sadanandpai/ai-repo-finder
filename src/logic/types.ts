export const CATEGORY_IDS = ['coding', 'agent', 'knowledge'] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  name: string;
  slug: string;
  /** What the tool operates on. One object per category. */
  object: string;
  blurb: string;
};

export type Repo = {
  slug: string;
  url: string;
  category: CategoryId;
  summary: string;
  language: string;
  owner: string;
  name: string;
  avatarUrl: string;
  stars: number;
  forks: number;
  issues: number;
  updatedAt: string;
};

export type RepoHit = Repo & {
  score: number;
};

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/** On-disk JSON for one category (`public/data/<slug>.json`). */
export type CategoryFile = {
  id: CategoryId;
  repos: Omit<Repo, 'category'>[];
};
