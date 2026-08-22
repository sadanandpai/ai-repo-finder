export const CATALOG_CATEGORY_IDS = ['coding', 'agent', 'frameworks', 'skills'] as const;

export type CatalogCategoryId = (typeof CATALOG_CATEGORY_IDS)[number];

export type JudgeCategory = CatalogCategoryId | 'none';

export type CategoryFile = {
  id: string;
  repos: ListedRepo[];
};

export type JudgeVerdict = {
  slug: string;
  category: JudgeCategory;
  confidence: number;
  summary: string;
  rationale: string;
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
  createdAt: string;
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
  createdAt: string;
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
  created_at: string;
  updated_at: string;
};
