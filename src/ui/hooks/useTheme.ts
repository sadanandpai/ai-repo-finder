import { useEffect, useState } from 'react';
import {
  applyTheme,
  persistTheme,
  storedTheme,
  themeFromDocument,
  THEME_STORAGE_KEY,
  type Theme,
} from '../theme.ts';

export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
} {
  const [theme, setThemeState] = useState<Theme>(themeFromDocument);

  useEffect(() => {
    document.documentElement.classList.add('theme-ready');
  }, []);

  const setTheme = (next: Theme) => {
    persistTheme(next);
    applyTheme(next);
    setThemeState(next);
  };

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = event.newValue === 'light' || event.newValue === 'dark'
        ? event.newValue
        : null;
      if (!next) return;
      applyTheme(next);
      setThemeState(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (storedTheme()) return;
      const next: Theme = media.matches ? 'dark' : 'light';
      applyTheme(next);
      setThemeState(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  };
}
