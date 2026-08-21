export type CategoryFile = {
  id: string;
  repos: ListedRepo[];
};

export type ListedRepo = {
  slug: string;
  url: string;
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

export type GitHubRepo = {
  slug: string;
  url: string;
  description: string;
  language: string;
  owner: string;
  name: string;
  avatarUrl: string;
  stars: number;
  forks: number;
  issues: number;
  updatedAt: string;
};

export type GitHubRepoPayload = {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  name: string;
  owner: { login: string; avatar_url: string };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
};
