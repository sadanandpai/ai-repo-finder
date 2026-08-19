import { BookMarked, Bot, Code } from 'lucide-react';
import { NavLink } from 'react-router';
import type { Category, CategoryId } from '../../logic/index.ts';
import { cn } from '../lib/cn.ts';

type CategoryCard = Pick<Category, 'id' | 'slug' | 'name' | 'blurb'>;

type Props = {
  categories: CategoryCard[];
  counts: Record<string, number>;
};

const ICONS: Record<CategoryId, typeof Code> = {
  coding: Code,
  agent: Bot,
  knowledge: BookMarked,
};

export function CategoryGrid({ categories, counts }: Props) {
  return (
    <nav aria-label="Categories" className="grid gap-2 sm:grid-cols-3">
      {categories.map((category) => {
        const Icon = ICONS[category.id];
        const count = counts[category.slug];
        return (
          <NavLink
            key={category.slug}
            to={`/explore/${category.slug}`}
            className={cn(
              'flex flex-col items-start gap-3 rounded-lg border border-line bg-card p-4 text-left text-ink transition-colors',
              'hover:border-muted',
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-on/15 text-accent">
              <Icon size={16} aria-hidden />
            </span>
            <span className="grid gap-1">
              <span className="font-semibold">{category.name}</span>
              <span className="text-xs text-muted">
                {typeof count === 'number' ? `${count} repos` : '—'}
              </span>
              <span className="text-sm text-muted">{category.blurb}</span>
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
