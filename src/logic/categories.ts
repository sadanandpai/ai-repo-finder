import type { Category, CategoryId } from './types.ts';

export const CATEGORIES: Category[] = [
  {
    id: 'coding',
    name: 'Coding tools',
    slug: 'coding-tools',
    object: 'a codebase',
    blurb: 'Index, pack, review, skill, or IDE — the object is the repo.',
  },
  {
    id: 'agent',
    name: 'Agent tools',
    slug: 'agent-tools',
    object: 'the agent runtime',
    blurb: 'SDKs, harnesses, MCP, browser, fleets, protocols.',
  },
  {
    id: 'knowledge',
    name: 'Knowledge hubs',
    slug: 'knowledge-hubs',
    object: 'memory and docs',
    blurb: 'Persistent memory, wikis, catalogs, knowledge graphs.',
  },
];

export function categoryById(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
