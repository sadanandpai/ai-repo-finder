import { format, formatDistanceStrict, isValid } from 'date-fns';

export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (!isValid(d)) return '';
  return format(d, 'dd-MMM-yy');
}

export function formatUpdatedAt(iso: string, now = new Date()): string {
  const then = new Date(iso);
  if (!isValid(then)) return 'Updated date unknown';
  return `Updated ${formatDistanceStrict(then, now, { addSuffix: true })}`;
}
