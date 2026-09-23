import { AdminLayout } from '@/components/layout/admin-layout';
import { RoleGuard } from '@/features/auth/components/role-guard';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <AdminLayout adminRole="super-admin">{children}</AdminLayout>
    </RoleGuard>
  );
}
