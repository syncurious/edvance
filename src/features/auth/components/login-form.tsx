'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { type LoginFormValues, loginSchema } from '@/features/auth/schemas';
import { toAuthSession } from '@/features/auth/supabase-session';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
  selectAuth,
} from '@/store/slices/auth-slice';

function safeDestination(nextPath: string | undefined) {
  return nextPath?.startsWith('/') && !nextPath.startsWith('//')
    ? nextPath
    : '/super-admin/dashboard';
}

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectAuth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    dispatch(authRequestStarted());
    try {
      const { data, error } =
        await getSupabaseBrowserClient().auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      if (error || !data.session) {
        throw new Error('Email or password is incorrect. Please try again.');
      }
      dispatch(authRequestSucceeded(toAuthSession(data.session)));
      router.replace(safeDestination(nextPath));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign in failed. Try again.';
      dispatch(authRequestFailed(message));
      setError('root.server', { message });
    }
  }

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p
            id="login-email-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="login-password">Password</Label>
          <Link
            href="/forgot-password"
            className="rounded text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={
            errors.password ? 'login-password-error' : undefined
          }
          {...register('password')}
        />
        {errors.password ? (
          <p
            id="login-password-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Spinner /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
