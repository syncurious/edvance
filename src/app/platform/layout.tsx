import { AdminLayout } from '@/components/layout/admin-layout';
import { RoleGuard } from '@/features/auth/components/role-guard';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard audience="platform">
      <AdminLayout adminRole="super-admin">{children}</AdminLayout>
    </RoleGuard>
  );
}
