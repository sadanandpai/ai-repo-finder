import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-line bg-card px-3 text-sm text-ink placeholder:text-muted outline-none transition-colors focus-visible:border-on',
        className,
      )}
      {...props}
    />
  );
}
