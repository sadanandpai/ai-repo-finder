import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

type Props = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-line px-1.5 py-0.5 text-xs text-muted',
        className,
      )}
      {...props}
    />
  );
}
