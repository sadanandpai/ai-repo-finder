import type { CategoryFile, GitHubRepo, GitHubRepoPayload, ListedRepo } from './types.ts';

const API = 'https://api.github.com';

const SEARCH_GAP_MS = 2500;

export function requireToken(): string {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) {
    throw new Error('Set GITHUB_TOKEN (or GH_TOKEN) for GitHub API calls.');
  }
  return token;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function githubJson<T>(pathOrUrl: string, token: string): Promise<T> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${API}${pathOrUrl}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ai-repo-finder',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429 || (res.status === 403 && body.toLowerCase().includes('rate limit'))) {
      console.error(`rate limited: ${url}`);
      process.exit(1);
    }
    throw new Error(`GitHub API ${res.status} ${url}: ${body.slice(0, 240)}`);
  }
  return (await res.json()) as T;
}

function fromPayload(item: GitHubRepoPayload): GitHubRepo {
  return {
    slug: item.full_name,
    url: item.html_url,
    description: item.description ?? '',
    language: item.language ?? '',
    owner: item.owner.login,
    name: item.name,
    avatarUrl: item.owner.avatar_url,
    stars: item.stargazers_count,
    forks: item.forks_count,
    issues: item.open_issues_count,
    updatedAt: item.updated_at,
  };
}

const AI_TOPICS = [
  'ai',
  'llm',
  'generative-ai',
  'artificial-intelligence',
  'machine-learning',
  'ai-agents',
  'agentic-ai',
  'mcp',
  'rag',
] as const;

function utcDateDaysAgo(days: number, now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function searchRepos(token: string, q: string): Promise<GitHubRepo[]> {
  const data = await githubJson<{ items: GitHubRepoPayload[] }>(
    `/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=asc&per_page=10`,
    token
  );
  console.log(`search ${q} -> ${data.items.length}`);
  return data.items.map(fromPayload);
}

async function searchTopics(token: string, extra: string): Promise<GitHubRepo[]> {
  const lists: GitHubRepo[][] = [];
  for (const [i, topic] of AI_TOPICS.entries()) {
    if (i > 0) await sleep(SEARCH_GAP_MS);
    lists.push(await searchRepos(token, `topic:${topic} ${extra}`));
  }
  return lists.flat();
}

export async function collectRepos(token: string): Promise<GitHubRepo[]> {
  const week = utcDateDaysAgo(7);
  const month = utcDateDaysAgo(30);
  const year = utcDateDaysAgo(365);
  const twoYears = utcDateDaysAgo(730);

  const extras = [
    `created:>${week} stars:>1000 archived:false`,
    `created:>${month} stars:>5000 archived:false`,
    `created:>${year} stars:>10000 archived:false`,
    `created:>${twoYears} stars:>25000 archived:false`,
  ];
  const lists: GitHubRepo[][] = [];
  for (const [i, extra] of extras.entries()) {
    if (i > 0) await sleep(SEARCH_GAP_MS);
    lists.push(await searchTopics(token, extra));
  }
  return uniqueBySlug(lists.flat());
}

function uniqueBySlug(repos: GitHubRepo[]): GitHubRepo[] {
  const seen = new Set<string>();
  const out: GitHubRepo[] = [];
  for (const repo of repos) {
    const key = repo.slug.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(repo);
  }
  return out;
}

export function existingSlugs(catalog: { data: CategoryFile }[]): Set<string> {
  const slugs = new Set<string>();
  for (const { data } of catalog) {
    for (const repo of data.repos) {
      slugs.add(repo.slug.toLowerCase());
    }
  }
  return slugs;
}

async function fetchRepo(token: string, owner: string, name: string): Promise<GitHubRepo | null> {
  try {
    const payload = await githubJson<GitHubRepoPayload>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
      token
    );
    return fromPayload(payload);
  } catch (err) {
    console.warn(`skip ${owner}/${name}: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

function applyGitHub(repo: ListedRepo, gh: GitHubRepo): ListedRepo {
  return {
    slug: repo.slug,
    url: repo.url,
    summary: repo.summary,
    language: gh.language || repo.language,
    owner: repo.owner,
    name: repo.name,
    avatarUrl: gh.avatarUrl || repo.avatarUrl,
    stars: gh.stars,
    forks: gh.forks,
    issues: gh.issues,
    updatedAt: gh.updatedAt,
  };
}

export async function updateCatalog(
  catalog: { file: string; data: CategoryFile }[],
  token: string
): Promise<void> {
  for (const entry of catalog) {
    const next: ListedRepo[] = [];
    for (const repo of entry.data.repos) {
      const gh = await fetchRepo(token, repo.owner, repo.name);
      next.push(gh ? applyGitHub(repo, gh) : repo);
    }
    entry.data.repos = next;
  }
}
