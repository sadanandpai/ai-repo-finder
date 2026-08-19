/** Static JSON URL. `base: './'` keeps this valid on GitHub Pages. */
export function categoryDataUrl(slug: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}data/${slug}.json`;
}
