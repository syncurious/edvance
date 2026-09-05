'use client';

import { MapPin } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function WorkspaceSelector({
  id,
  label,
  value,
  options,
  onValueChange,
  disabled = false,
  className,
}: {
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue) onValueChange(nextValue);
        }}
      >
        <SelectTrigger id={id} className="w-full min-w-40 bg-card">
          <MapPin aria-hidden="true" className="text-primary" />
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
