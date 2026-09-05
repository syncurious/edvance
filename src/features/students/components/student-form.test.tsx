import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StudentFormPage } from '@/features/students/components/student-form';
import { MockStudentService } from '@/features/students/services';
import { makeStore } from '@/store';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

beforeEach(() => {
  push.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});

afterEach(cleanup);

function renderForm() {
  return render(
    <Provider store={makeStore()}>
      <StudentFormPage service={new MockStudentService([], 0)} />
    </Provider>,
  );
}

describe('StudentFormPage', () => {
  it('shows accessible validation for an incomplete record', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create student' }));

    expect(await screen.findByText('Enter the first name.')).toBeVisible();
    expect(screen.getByText('Enter the last name.')).toBeVisible();
    expect(screen.getByText('Enter an admission ID.')).toBeVisible();
    expect(screen.getByText('Enter a valid date of birth.')).toBeVisible();
    expect(
      screen.getByText('Enter the parent or guardian name.'),
    ).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('guards dirty form cancellation behind confirmation', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'Anaya' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Discard unsaved changes?')).toBeVisible();
    expect(push).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByText('Discard unsaved changes?')).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });
});
