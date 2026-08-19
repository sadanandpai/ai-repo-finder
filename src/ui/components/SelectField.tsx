import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn.ts';

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  prefix: string;
  'aria-label': string;
};

export function SelectField({
  value,
  onValueChange,
  options,
  prefix,
  'aria-label': ariaLabel,
}: Props) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={ariaLabel}
        className="inline-flex h-10 min-w-[11rem] cursor-pointer items-center justify-between gap-2 rounded-md border border-line bg-card px-3 text-sm text-ink outline-none transition-colors hover:border-muted focus-visible:border-on"
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-muted">{prefix}</span>
          <span className="text-muted">·</span>
          <Select.Value className="truncate" />
        </span>
        <Select.Icon>
          <ChevronDown size={14} className="text-muted" aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-line bg-card"
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-4 rounded-sm px-2 py-1.5 text-sm text-ink outline-none',
                  'data-[highlighted]:bg-on data-[highlighted]:text-on-ink',
                )}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} aria-hidden />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
