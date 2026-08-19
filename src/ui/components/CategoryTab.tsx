import { NavLink } from 'react-router';
import { cn } from '../lib/cn.ts';

type Props = {
  to: string;
  end?: boolean;
  children: string;
};

export function CategoryTab({ to, end, children }: Props) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-on text-on-ink'
            : 'border border-line bg-card text-ink hover:border-muted',
        )
      }
    >
      {children}
    </NavLink>
  );
}
