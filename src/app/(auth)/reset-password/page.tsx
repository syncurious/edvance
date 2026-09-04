import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Choose a new password',
  description: 'Choose a new password for your Edvance account.',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const parameters = await searchParams;
  const token = typeof parameters.token === 'string' ? parameters.token : '';

  return (
    <AuthPage
      eyebrow="Secure your account"
      title="Choose a new password"
      description="Create a strong password that you don’t use for another account."
    >
      <ResetPasswordForm token={token} />
    </AuthPage>
  );
}
