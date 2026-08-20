import type { Category, CategoryId } from './types.ts';

export const CATEGORIES: Category[] = [
  {
    id: 'coding',
    name: 'Coding',
    slug: 'coding',
    object: 'a codebase',
    blurb: 'Index, pack, review, or IDE — the object is the repo.',
  },
  {
    id: 'agent',
    name: 'Agent',
    slug: 'agent',
    object: 'the agent runtime',
    blurb: 'Runtimes, MCP, browser, memory.',
  },
  {
    id: 'frameworks',
    name: 'Frameworks',
    slug: 'frameworks',
    object: 'how you build',
    blurb: 'SDKs, protocols, and frameworks for building agents and AI apps.',
  },
  {
    id: 'skills',
    name: 'Skills',
    slug: 'skills',
    object: "the agent's instructions",
    blurb: 'Installable agent behavior — SKILL.md, .agents, packs.',
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
