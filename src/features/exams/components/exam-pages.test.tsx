import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExamDetail } from '@/features/exams/components/exam-detail';
import { ExamForm } from '@/features/exams/components/exam-form';
import { ExamsList } from '@/features/exams/components/exams-list';
import { StudentResultView } from '@/features/exams/components/student-result';
import { MockExamService } from '@/features/exams/services';
import type { ExamService } from '@/features/exams/services';
import { makeStore } from '@/store';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
beforeEach(() => {
  push.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});
afterEach(cleanup);

function renderPage(node: React.ReactNode) {
  return render(<Provider store={makeStore()}>{node}</Provider>);
}

describe('exam management pages', () => {
  it('lists exams with schedule, status, and actions', async () => {
    renderPage(<ExamsList service={new MockExamService(0)} />);
    expect(await screen.findByText('Exam schedule')).toBeVisible();
    expect(screen.getByText('Autumn Midterm Examination')).toBeVisible();
    expect(screen.getAllByText('In progress')[0]).toBeVisible();
    expect(screen.getByRole('button', { name: /Create exam/ })).toBeVisible();
  });

  it('validates and creates an exam', async () => {
    renderPage(<ExamForm service={new MockExamService(0)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Create exam' }));
    expect(await screen.findByText('Enter an exam name.')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Exam name'), {
      target: { value: 'Winter Midterm Assessment' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create exam' }));
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        expect.stringMatching(/^\/school-admin\/exams\/exam-/),
      ),
    );
  });

  it('supports subject setup, guarded marks entry, and result tables', async () => {
    renderPage(
      <ExamDetail
        examId="midterm-grade-5-a"
        service={new MockExamService(0)}
      />,
    );
    expect((await screen.findAllByText('Subject setup'))[0]).toBeVisible();
    fireEvent.click(screen.getByRole('tab', { name: 'Marks entry' }));
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '101' } });
    expect(screen.getByText('Invalid marks')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save marks' })).toBeDisabled();
    fireEvent.change(inputs[0], { target: { value: '88' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save marks' }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Marks saved' }),
      ).toBeDisabled(),
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Results' }));
    expect(screen.getByText('Class results')).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Grade' })).toBeVisible();
  });

  it('renders a complete individual student result', async () => {
    const service = new MockExamService(0);
    const [result] = await service.getResults('midterm-grade-5-a');
    renderPage(
      <StudentResultView
        examId="midterm-grade-5-a"
        studentId={result.student.id}
        service={service}
      />,
    );
    expect(await screen.findByText('Subject performance')).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Result summary' }),
    ).toBeVisible();
    expect(
      screen.getByRole('columnheader', { name: 'Pass marks' }),
    ).toBeVisible();
  });

  it('shows a recoverable exam loading failure', async () => {
    const failing = {
      list: vi.fn().mockRejectedValue(new Error('offline')),
      get: vi.fn(),
      create: vi.fn(),
      getResults: vi.fn(),
      getStudentResult: vi.fn(),
      saveMarks: vi.fn(),
      getSummary: vi.fn(),
    } satisfies ExamService;
    renderPage(<ExamsList service={failing} />);
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
