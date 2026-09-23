import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Platform Admin sign in',
  description: 'Sign in to the Edvance platform administration workspace.',
};

export default function PlatformLoginPage() {
  return (
    <AuthPage
      eyebrow="Platform administration"
      title="Platform Admin sign in"
      description="Use your authorized Platform Admin account to continue."
    >
      <LoginForm audience="platform" />
    </AuthPage>
  );
}
