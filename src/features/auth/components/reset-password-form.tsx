'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/features/auth/schemas';
import { authService } from '@/features/auth/services';

export function ResetPasswordForm({ token }: { token: string }) {
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setSuccessMessage('');
    try {
      const result = await authService.resetPassword({
        token,
        password: values.password,
      });
      setSuccessMessage(result.message);
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof Error
            ? error.message
            : 'Password reset failed. Try again.',
      });
    }
  }

  if (successMessage) {
    return (
      <div className="grid gap-6">
        <div className="rounded-2xl border border-success/70 bg-success/45 p-5">
          <span className="grid size-11 place-items-center rounded-xl bg-success text-success-foreground">
            <BadgeCheck aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">Password updated</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {successMessage}
          </p>
        </div>
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          size="lg"
          className="w-full"
        >
          Continue to sign in <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to reset password</AlertTitle>
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby="new-password-requirements"
          {...register('password')}
        />
        <p
          id="new-password-requirements"
          className={
            errors.password
              ? 'text-xs font-medium text-destructive'
              : 'text-xs text-muted-foreground'
          }
          role={errors.password ? 'alert' : undefined}
        >
          {errors.password?.message ??
            'Use 8+ characters with upper and lowercase letters and a number.'}
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={
            errors.confirmPassword ? 'confirm-password-error' : undefined
          }
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p
            id="confirm-password-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.confirmPassword.message}
          </p>
        ) : null}
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
            <Spinner /> Updating password…
          </>
        ) : (
          'Update password'
        )}
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Didn’t request this change?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Return to sign in
        </Link>
      </p>
    </form>
  );
}
