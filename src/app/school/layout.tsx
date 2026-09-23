import { AdminLayout } from '@/components/layout/admin-layout';
import { RoleGuard } from '@/features/auth/components/role-guard';

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <AdminLayout adminRole="school-admin">{children}</AdminLayout>
    </RoleGuard>
  );
}
