import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { schoolAdminConfig } from '@/constants/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('AdminSidebar', () => {
  it('opens the active navigation group and marks the current route', () => {
    vi.mocked(usePathname).mockReturnValue('/school-admin/attendance/reports');

    render(<AdminSidebar config={schoolAdminConfig} />);

    expect(screen.getByRole('button', { name: 'Attendance' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(
      screen
        .getAllByRole('link', { name: 'Reports' })
        .find(
          (link) =>
            link.getAttribute('href') === '/school-admin/attendance/reports',
        ),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('offers an accessible control to restore a collapsed sidebar', () => {
    vi.mocked(usePathname).mockReturnValue('/school-admin/dashboard');
    const onCollapsedChange = vi.fn();

    render(
      <AdminSidebar
        config={schoolAdminConfig}
        collapsed
        onCollapsedChange={onCollapsedChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(onCollapsedChange).toHaveBeenCalledWith(false);
  });
});
