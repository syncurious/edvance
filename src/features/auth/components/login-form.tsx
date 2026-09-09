'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { saveAuthSession } from '@/features/auth/auth-storage';
import { type LoginFormValues, loginSchema } from '@/features/auth/schemas';
import { authService } from '@/features/auth/services';
import { DEMO_ACCOUNTS } from '@/features/auth/services/mock-auth-service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
  selectAuth,
} from '@/store/slices/auth-slice';

function safeDestination(nextPath: string | undefined, adminRole: string) {
  const roleRoot = `/${adminRole}`;
  return nextPath?.startsWith(`${roleRoot}/`)
    ? nextPath
    : `${roleRoot}/dashboard`;
}

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectAuth);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });
  const rememberMe = watch('rememberMe');

  async function onSubmit(values: LoginFormValues) {
    dispatch(authRequestStarted());
    try {
      const session = await authService.login(values);
      saveAuthSession(session, values.rememberMe);
      dispatch(
        authRequestSucceeded({ session, rememberMe: values.rememberMe }),
      );
      router.replace(safeDestination(nextPath, session.user.role));
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

      <label
        htmlFor="remember-me"
        className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg text-sm font-medium"
      >
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) =>
            setValue('rememberMe', checked, { shouldDirty: true })
          }
        />
        Keep me signed in on this device
      </label>

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

      <div className="rounded-xl border border-border bg-muted/45 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />{' '}
          Demo access
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              className="rounded-lg border border-border bg-card px-3 py-2.5 text-left text-xs transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              onClick={() => {
                setValue('email', account.email, { shouldValidate: true });
                setValue('password', account.password, {
                  shouldValidate: true,
                });
              }}
            >
              <span className="block font-bold capitalize">
                {account.session.user.role.replace('-', ' ')}
              </span>
              <span className="mt-0.5 block truncate text-muted-foreground">
                {account.email}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Password for both accounts:{' '}
          <code className="font-bold text-foreground">Demo123!</code>
        </p>
      </div>
    </form>
  );
}
