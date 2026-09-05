import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { StudentProfile } from '@/features/students/components/student-profile';
import { MockStudentService } from '@/features/students/services';
import { studentMocks } from '@/mocks/students';

afterEach(cleanup);

describe('StudentProfile', () => {
  it('loads a reusable profile and exposes every required tab', async () => {
    render(
      <StudentProfile
        studentId="std-ayesha-khan"
        service={new MockStudentService(studentMocks, 0)}
      />,
    );

    expect(
      await screen.findByRole('heading', { name: 'Ayesha Khan' }),
    ).toBeVisible();
    for (const tab of [
      'Overview',
      'Parents',
      'Academic',
      'Attendance',
      'Fees',
      'Exams',
      'Documents',
    ]) {
      expect(screen.getByRole('tab', { name: tab })).toBeVisible();
    }

    fireEvent.click(screen.getByRole('tab', { name: 'Parents' }));
    expect(screen.getByText('Primary family contact')).toBeVisible();
    fireEvent.click(screen.getByRole('tab', { name: 'Exams' }));
    expect(screen.getByText('Mathematics')).toBeVisible();
  });

  it('offers retry and a safe return when the profile is missing', async () => {
    render(
      <StudentProfile
        studentId="missing"
        service={new MockStudentService(studentMocks, 0)}
      />,
    );

    expect(await screen.findByText('Student unavailable')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Back to students' }),
    ).toHaveAttribute('href', '/school-admin/students');
  });
});
