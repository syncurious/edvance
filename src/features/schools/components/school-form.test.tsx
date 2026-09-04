import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SchoolFormPage } from '@/features/schools/components/school-form';
import { MockSchoolService } from '@/features/schools/services';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

beforeEach(() => {
  push.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});

afterEach(cleanup);

describe('SchoolFormPage', () => {
  it('shows accessible field validation for an empty submission', async () => {
    render(<SchoolFormPage service={new MockSchoolService([], 0)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Create school' }));

    expect(await screen.findByText('Enter the school name.')).toBeVisible();
    expect(screen.getByText('Enter a school code.')).toBeVisible();
    expect(screen.getByText('Enter the school email.')).toBeVisible();
    expect(screen.getByText('Enter a valid phone number.')).toBeVisible();
    expect(screen.getByText('Enter the school address.')).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('creates a school through the service and routes to its detail', async () => {
    const service = new MockSchoolService([], 0);
    render(<SchoolFormPage service={service} />);

    fireEvent.change(screen.getByLabelText('School name'), {
      target: { value: 'Atlas Community School' },
    });
    fireEvent.change(screen.getByLabelText('School code'), {
      target: { value: 'acs-201' },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'admin@atlas.edu.pk' },
    });
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '+92 51 555 0101' },
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '10 Constitution Avenue, Islamabad' },
    });
    fireEvent.change(screen.getByLabelText('Subscription plan'), {
      target: { value: 'Professional' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create school' }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        expect.stringMatching(/^\/super-admin\/schools\/acs-201-/),
      ),
    );
    expect(
      (
        await service.list({
          search: '',
          status: 'all',
          plan: 'all',
          sortBy: 'name',
          sortDirection: 'asc',
          page: 1,
          pageSize: 8,
        })
      ).total,
    ).toBe(1);
  });
});
