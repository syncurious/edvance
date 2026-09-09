import { StatusBadge } from '@/components/shared/status-badge';
import type { ExamStatus, ResultStatus } from '@/features/exams/types';

export const examStatusLabels: Record<ExamStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  published: 'Published',
};
export const resultStatusLabels: Record<ResultStatus, string> = {
  pass: 'Pass',
  fail: 'Fail',
  absent: 'Absent',
  incomplete: 'Incomplete',
};

const examTones = {
  draft: 'neutral',
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  published: 'success',
} as const;
const resultTones = {
  pass: 'success',
  fail: 'error',
  absent: 'warning',
  incomplete: 'neutral',
} as const;

export function ExamStatusBadge({ status }: { status: ExamStatus }) {
  return (
    <StatusBadge status={examTones[status]}>
      {examStatusLabels[status]}
    </StatusBadge>
  );
}

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return (
    <StatusBadge status={resultTones[status]}>
      {resultStatusLabels[status]}
    </StatusBadge>
  );
}
