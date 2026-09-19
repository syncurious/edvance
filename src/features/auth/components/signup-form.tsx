'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { type SignupFormValues, signupSchema } from '@/features/auth/schemas';
import { toAuthSession } from '@/features/auth/supabase-session';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  authHydrated,
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
  selectAuth,
} from '@/store/slices/auth-slice';

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectAuth);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: SignupFormValues) {
    dispatch(authRequestStarted());
    try {
      const { data, error } = await getSupabaseBrowserClient().auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) throw new Error(error.message);

      if (data.session) {
        dispatch(authRequestSucceeded(toAuthSession(data.session)));
        router.replace('/super-admin/dashboard');
        return;
      }

      dispatch(authHydrated(null));
      setSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign up failed. Try again.';
      dispatch(authRequestFailed(message));
      setError('root.server', { message });
    }
  }

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to create account</AlertTitle>
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}

      {success ? (
        <Alert>
          <CheckCircle2 aria-hidden="true" />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            Confirm your email address to finish creating your account.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email address</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p
            id="signup-email-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={
            errors.password ? 'signup-password-error' : undefined
          }
          {...register('password')}
        />
        {errors.password ? (
          <p
            id="signup-password-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="signup-confirm-password">Confirm password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={
            errors.confirmPassword ? 'signup-confirm-password-error' : undefined
          }
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p
            id="signup-confirm-password-error"
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
        disabled={loading || success}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Spinner /> Creating account…
          </>
        ) : success ? (
          'Account created'
        ) : (
          <>
            Create account <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
