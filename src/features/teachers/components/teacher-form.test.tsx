import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TeacherFormPage } from '@/features/teachers/components/teacher-form';
import { MockTeacherService } from '@/features/teachers/services';
import { makeStore } from '@/store';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
beforeEach(() => {
  push.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});
afterEach(cleanup);
const renderForm = () =>
  render(
    <Provider store={makeStore()}>
      <TeacherFormPage service={new MockTeacherService([], 0)} />
    </Provider>,
  );

describe('TeacherFormPage', () => {
  it('validates identity, contact, and credential fields', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create teacher' }));
    expect(await screen.findByText('Enter the first name.')).toBeVisible();
    expect(screen.getByText('Enter an employee ID.')).toBeVisible();
    expect(screen.getByText('Enter a valid work email.')).toBeVisible();
    expect(screen.getByText('Enter the qualification.')).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it('adds assignment rows and guards dirty cancellation', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Add assignment' }));
    expect(screen.getByLabelText('Assignment 2 subject')).toBeVisible();
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'Anam' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByText('Discard unsaved changes?')).toBeVisible();
  });
});
