import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it } from 'vitest';
import { TeachersList } from '@/features/teachers/components/teachers-list';
import { MockTeacherService } from '@/features/teachers/services';
import { teacherMocks } from '@/mocks/teachers';
import { makeStore } from '@/store';

afterEach(cleanup);
const renderList = () =>
  render(
    <Provider store={makeStore()}>
      <TeachersList service={new MockTeacherService(teacherMocks, 0)} />
    </Provider>,
  );

describe('TeachersList', () => {
  it('shows the complete teacher directory pattern', async () => {
    renderList();
    expect(await screen.findByText('Ayesha Siddiqui')).toBeVisible();
    for (const column of [
      'Teacher',
      'Employee ID',
      'Subjects',
      'Classes',
      'Campus',
      'Phone',
      'Status',
      'Actions',
    ])
      expect(screen.getByRole('columnheader', { name: column })).toBeVisible();
    expect(screen.getByText(/showing 1–8 of 10 teachers/i)).toBeVisible();
  });

  it('searches and filters teaching assignments', async () => {
    renderList();
    await screen.findByText('Ayesha Siddiqui');
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Science' },
    });
    expect(await screen.findByText('Sana Javed')).toBeVisible();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search teachers' }), {
      target: { value: 'nobody' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search teachers' }));
    expect(await screen.findByText('No teachers found')).toBeVisible();
  });
});
