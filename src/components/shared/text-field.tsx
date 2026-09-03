'use client';

import { useId } from 'react';
import { CircleCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'id'
> {
  id?: string;
  label: string;
  description?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  containerClassName?: string;
}

export function TextField({
  id,
  label,
  description,
  error,
  success,
  optional,
  containerClassName,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = error || success ? `${controlId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(' ');

  return (
    <div className={cn('grid gap-2', containerClassName)}>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={controlId}>{label}</Label>
        {optional ? (
          <span className="text-xs text-muted-foreground">Optional</span>
        ) : null}
      </div>
      {description ? (
        <p
          id={descriptionId}
          className="text-xs leading-5 text-muted-foreground"
        >
          {description}
        </p>
      ) : null}
      <Input
        id={controlId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        {...inputProps}
      />
      {error ? (
        <p
          id={messageId}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}
      {!error && success ? (
        <p
          id={messageId}
          className="flex items-center gap-1.5 text-xs font-medium text-success-foreground"
        >
          <CircleCheck aria-hidden="true" className="size-3.5" />
          {success}
        </p>
      ) : null}
    </div>
  );
}
