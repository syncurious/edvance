import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { schoolAdminConfig } from '@/constants/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

afterEach(cleanup);

describe('AdminSidebar', () => {
  it('dismisses icon labels when expanded and when the route changes', async () => {
    vi.mocked(usePathname).mockReturnValue('/school-admin/dashboard');
    const { rerender } = render(
      <AdminSidebar config={schoolAdminConfig} collapsed />,
    );
    fireEvent.focus(
      screen.getByRole('link', { name: 'Students', exact: true }),
    );
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Students');

    rerender(<AdminSidebar config={schoolAdminConfig} />);
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    );
    rerender(<AdminSidebar config={schoolAdminConfig} collapsed />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.focus(
      screen.getByRole('link', { name: 'Students', exact: true }),
    );
    await screen.findByRole('tooltip');
    vi.mocked(usePathname).mockReturnValue('/school-admin/students');
    rerender(<AdminSidebar config={schoolAdminConfig} collapsed />);
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    );
  });

  it('expands a collapsed navigation group with the same shared trigger', () => {
    vi.mocked(usePathname).mockReturnValue('/school-admin/dashboard');
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <AdminSidebar
        config={schoolAdminConfig}
        collapsed
        onCollapsedChange={onCollapsedChange}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Attendance', exact: true }),
    );
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    rerender(
      <AdminSidebar
        config={schoolAdminConfig}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Attendance', exact: true }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

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
