import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { UsersList } from '@/features/users/components/users-list';
import { MockUserService } from '@/features/users/services';
import { platformUserMocks } from '@/mocks/users';

afterEach(cleanup);

describe('UsersList', () => {
  it('shows user identity, role, school, status, last login, and pagination', async () => {
    render(<UsersList service={new MockUserService(platformUserMocks, 0)} />);
    expect(await screen.findByText('Areeb Khan')).toBeVisible();
    for (const heading of [
      'User',
      'Role',
      'School',
      'Status',
      'Last login',
      'Actions',
    ]) {
      expect(screen.getByRole('columnheader', { name: heading })).toBeVisible();
    }
    expect(screen.getByText('Page 1 of 2')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Suspend Areeb Khan' }),
    ).toBeDisabled();
  });

  it('filters users by search, role, school, and status', async () => {
    render(<UsersList service={new MockUserService(platformUserMocks, 0)} />);
    await screen.findByText('Areeb Khan');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search users' }), {
      target: { value: 'Crescent' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search users' }));
    fireEvent.change(screen.getByLabelText('Role'), {
      target: { value: 'teacher' },
    });
    expect(await screen.findByText('Nadia Ahmed')).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByText('Sara Malik')).not.toBeInTheDocument(),
    );
  });

  it('confirms a contextual suspension before changing access', async () => {
    render(<UsersList service={new MockUserService(platformUserMocks, 0)} />);
    await screen.findByText('Bilal Siddiqui');
    fireEvent.click(
      screen.getByRole('button', { name: 'Suspend Bilal Siddiqui' }),
    );
    expect(screen.getByText('Suspend Bilal Siddiqui?')).toBeVisible();
    expect(screen.getByText(/lose access/i)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(
        screen.queryByText('Suspend Bilal Siddiqui?'),
      ).not.toBeInTheDocument(),
    );
  });
});
