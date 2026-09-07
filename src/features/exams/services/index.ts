import type { ExamService } from '@/features/exams/services/exam-service';
import { MockExamService } from '@/features/exams/services/mock-exam-service';

// Replace with a client that calls relative Next.js /api/exams routes when NestJS integration starts.
export const examService: ExamService = new MockExamService();

export type { ExamService } from '@/features/exams/services/exam-service';
export {
  ExamNotFoundError,
  MarksValidationError,
  MockExamService,
} from '@/features/exams/services/mock-exam-service';
