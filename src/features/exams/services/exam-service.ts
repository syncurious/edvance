import type {
  Exam,
  ExamFormValues,
  ExamListQuery,
  ExamSummary,
  SaveStudentMarksInput,
  StudentResult,
} from '@/features/exams/types';

export interface ExamService {
  list(query: ExamListQuery): Promise<Exam[]>;
  get(id: string): Promise<Exam>;
  create(values: ExamFormValues): Promise<Exam>;
  getResults(examId: string): Promise<StudentResult[]>;
  getStudentResult(examId: string, studentId: string): Promise<StudentResult>;
  saveMarks(
    examId: string,
    rows: SaveStudentMarksInput[],
  ): Promise<StudentResult[]>;
  getSummary(examId: string): Promise<ExamSummary>;
}
