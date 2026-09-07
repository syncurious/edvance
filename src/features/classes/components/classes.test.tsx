import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it } from 'vitest';
import { ClassDetails } from '@/features/classes/components/class-details';
import { ClassesList } from '@/features/classes/components/classes-list';
import { MockClassService } from '@/features/classes/services/class-service';
import { makeStore } from '@/store';

afterEach(cleanup);

describe('class hierarchy', () => {
  it('groups sections beneath their grade and supports search', async () => {
    render(
      <Provider store={makeStore()}>
        <ClassesList service={new MockClassService(0)} />
      </Provider>,
    );
    expect((await screen.findAllByText('Grade 5')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Section A').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText('Search classes'), {
      target: { value: 'N-501' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByText('Grade 10')).toBeVisible();
    expect(screen.queryByText('Section B')).not.toBeInTheDocument();
  });

  it('shows class ownership, subjects, and the roster state', async () => {
    render(
      <ClassDetails
        classId="grade-5-a-north"
        service={new MockClassService(0)}
      />,
    );
    expect(
      await screen.findByRole('heading', { name: 'Grade 5 · Section A' }),
    ).toBeVisible();
    expect(screen.getByText('Ayesha Siddiqui')).toBeVisible();
    expect(screen.getByText('Subjects')).toBeVisible();
    expect(screen.getByText('Student roster')).toBeVisible();
  });
});
