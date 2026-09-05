import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it } from 'vitest';

import { StudentsList } from '@/features/students/components/students-list';
import { MockStudentService } from '@/features/students/services';
import { studentMocks } from '@/mocks/students';
import { makeStore } from '@/store';

afterEach(cleanup);

function renderList() {
  return render(
    <Provider store={makeStore()}>
      <StudentsList service={new MockStudentService(studentMocks, 0)} />
    </Provider>,
  );
}

describe('StudentsList', () => {
  it('renders every required column and paginates the directory', async () => {
    renderList();
    expect(await screen.findByText('Ayesha Khan')).toBeVisible();

    for (const column of [
      'Student',
      'ID',
      'Class',
      'Section',
      'Parent',
      'Phone',
      'Campus',
      'Status',
      'Actions',
    ]) {
      expect(screen.getByRole('columnheader', { name: column })).toBeVisible();
    }
    expect(screen.getByText('Page 1 of 2')).toBeVisible();
  });

  it('combines search and filters and can clear an empty result', async () => {
    renderList();
    await screen.findByText('Ayesha Khan');

    fireEvent.change(screen.getByRole('textbox', { name: 'Search students' }), {
      target: { value: 'Hamza' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search students' }));
    expect(await screen.findByText('Hamza Ali')).toBeVisible();

    fireEvent.change(screen.getByLabelText('Class'), {
      target: { value: 'Grade 10' },
    });
    expect(await screen.findByText('No matching students')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(screen.getByText('Ayesha Khan')).toBeVisible());
  });
});
