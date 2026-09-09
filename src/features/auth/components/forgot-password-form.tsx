'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/auth/schemas';
import { authService } from '@/features/auth/services';

export function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setSuccessMessage('');
    try {
      const result = await authService.requestPasswordReset(values);
      setSuccessMessage(result.message);
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof Error ? error.message : 'Request failed. Try again.',
      });
    }
  }

  if (successMessage) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl border border-success/70 bg-success/45 p-5">
          <span className="grid size-11 place-items-center rounded-xl bg-success text-success-foreground">
            <MailCheck aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {successMessage}
          </p>
        </div>
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft aria-hidden="true" /> Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to send instructions</AlertTitle>
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="recovery-email">Email address</Label>
        <Input
          id="recovery-email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={
            errors.email ? 'recovery-email-error' : 'recovery-email-help'
          }
          {...register('email')}
        />
        {errors.email ? (
          <p
            id="recovery-email-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.email.message}
          </p>
        ) : (
          <p
            id="recovery-email-help"
            className="text-xs leading-5 text-muted-foreground"
          >
            We’ll send reset instructions if an account matches this address.
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Spinner /> Sending instructions…
          </>
        ) : (
          'Send reset instructions'
        )}
      </Button>
      <Button
        render={<Link href="/login" />}
        nativeButton={false}
        variant="ghost"
        className="w-full"
      >
        <ArrowLeft aria-hidden="true" /> Back to sign in
      </Button>
    </form>
  );
}
