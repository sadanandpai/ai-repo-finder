import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.ts';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-line bg-card text-ink transition-colors hover:border-muted"
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={2} aria-hidden />
      ) : (
        <Moon size={16} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
