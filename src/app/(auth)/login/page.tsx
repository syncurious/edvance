import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'School Admin sign in',
  description: 'Sign in to your school administration workspace.',
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
      eyebrow="School administration"
      title="Sign in to your school"
      description="Use your School Admin account to continue."
    >
      <LoginForm nextPath={nextPath} />
    </AuthPage>
  );
}
