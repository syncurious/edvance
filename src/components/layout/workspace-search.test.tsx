import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WorkspaceSearch } from '@/components/layout/workspace-search';
import { schoolAdminConfig, superAdminConfig } from '@/constants/navigation';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
  push.mockClear();
});

describe('WorkspaceSearch', () => {
  it('opens from the keyboard and navigates to a nested school page', async () => {
    render(<WorkspaceSearch config={schoolAdminConfig} />);
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(await screen.findByRole('dialog')).toBeVisible();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'invoices' },
    });
    fireEvent.click(await screen.findByRole('option', { name: /Invoices/ }));
    expect(push).toHaveBeenCalledWith('/school-admin/fees/invoices');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('limits destinations to the current role and explains empty searches', async () => {
    render(<WorkspaceSearch config={superAdminConfig} />);
    fireEvent.click(screen.getByRole('button', { name: 'Search pages' }));
    const search = await screen.findByRole('combobox');
    fireEvent.change(search, { target: { value: 'students' } });
    expect(
      await screen.findByText('No matching pages. Try another search.'),
    ).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Students' }),
    ).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'billing' } });
    expect(
      await screen.findByRole('option', { name: /Billing/ }),
    ).toBeVisible();
  });
});
