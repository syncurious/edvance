import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Edvance administration workspace.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const parameters = await searchParams;
  const nextPath =
    typeof parameters.next === 'string' ? parameters.next : undefined;

  return (
    <AuthPage
      eyebrow="Welcome back"
      title="Sign in to Edvance"
      description="Use your administrator account to continue to your role-specific workspace."
    >
      <LoginForm nextPath={nextPath} />
    </AuthPage>
  );
}
