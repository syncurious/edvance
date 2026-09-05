import type { Metadata } from 'next';

import { UsersList } from '@/features/users/components/users-list';

export const metadata: Metadata = { title: 'Users' };

export default function SuperAdminUsersPage() {
  return <UsersList />;
}
