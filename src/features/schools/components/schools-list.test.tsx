import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SchoolsList } from '@/features/schools/components/schools-list';
import { MockSchoolService } from '@/features/schools/services';
import { schoolMocks } from '@/mocks/schools';

afterEach(cleanup);

describe('SchoolsList', () => {
  it('renders required columns, records, and pagination', async () => {
    render(<SchoolsList service={new MockSchoolService(schoolMocks, 0)} />);

    expect(await screen.findByText('Future Minds School')).toBeVisible();
    for (const column of [
      'School',
      'Code',
      'Campus',
      'Students',
      'Plan',
      'Status',
      'Created',
      'Actions',
    ]) {
      expect(screen.getByRole('columnheader', { name: column })).toBeVisible();
    }
    expect(screen.getByText('Page 1 of 2')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('searches and filters without losing predictable table state', async () => {
    render(<SchoolsList service={new MockSchoolService(schoolMocks, 0)} />);
    await screen.findByText('Future Minds School');

    fireEvent.change(screen.getByRole('textbox', { name: 'Search schools' }), {
      target: { value: 'Crescent' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search schools' }));

    expect(await screen.findByText('Crescent Academy')).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByText('Future Minds School')).not.toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'suspended' },
    });
    expect(await screen.findByText('No matching schools')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByText('Future Minds School')).toBeVisible();
  });

  it('requires confirmation before deleting a school', async () => {
    render(<SchoolsList service={new MockSchoolService(schoolMocks, 0)} />);
    await screen.findByText('Future Minds School');

    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Future Minds School' }),
    );
    expect(screen.getByText('Delete Future Minds School?')).toBeVisible();
    expect(screen.getByText(/cannot be undone/i)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(
        screen.queryByText('Delete Future Minds School?'),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Future Minds School')).toBeVisible();
  });
});
