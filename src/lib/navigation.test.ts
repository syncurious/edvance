import { describe, expect, it } from 'vitest';

import { schoolAdminConfig } from '@/constants/navigation';
import { getBreadcrumbs, isNavigationItemActive } from '@/lib/navigation';

describe('navigation helpers', () => {
  it('matches direct and nested routes without matching a similarly named route', () => {
    expect(
      isNavigationItemActive(
        '/school-admin/students/42',
        '/school-admin/students',
      ),
    ).toBe(true);
    expect(
      isNavigationItemActive(
        '/school-admin/attendance/reports',
        '/school-admin/attendance',
        ['/school-admin/attendance/reports'],
      ),
    ).toBe(true);
    expect(
      isNavigationItemActive(
        '/school-admin/student-groups',
        '/school-admin/students',
      ),
    ).toBe(false);
  });

  it('uses configured labels and readable fallbacks for breadcrumbs', () => {
    expect(
      getBreadcrumbs(
        '/school-admin/attendance/reports',
        schoolAdminConfig.roleLabel,
        schoolAdminConfig.navigation,
      ),
    ).toEqual([
      { label: 'School Admin', href: '/school-admin/dashboard' },
      { label: 'Attendance', href: '/school-admin/attendance' },
      { label: 'Reports' },
    ]);

    expect(
      getBreadcrumbs(
        '/school-admin/custom-module',
        schoolAdminConfig.roleLabel,
        schoolAdminConfig.navigation,
      ).at(-1),
    ).toEqual({ label: 'Custom Module' });
  });
});
