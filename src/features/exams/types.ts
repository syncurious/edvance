import type { CampusId } from '@/features/dashboard/types';
import type { StudentClass, StudentSection } from '@/features/students/types';

export const examStatuses = [
  'draft',
  'scheduled',
  'in_progress',
  'completed',
  'published',
] as const;
export const examTerms = ['Midterm', 'Final', 'Monthly assessment'] as const;

export type ExamStatus = (typeof examStatuses)[number];
export type ExamTerm = (typeof examTerms)[number];
export type ResultStatus = 'pass' | 'fail' | 'absent' | 'incomplete';

export interface ExamSubject {
  id: string;
  name: string;
  maxMarks: number;
  passMarks: number;
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  term: ExamTerm;
  academicYear: string;
  campusId: Exclude<CampusId, 'all'>;
  campusName: string;
  className: StudentClass;
  section: StudentSection;
  classSectionId: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  subjects: ExamSubject[];
}

export interface SubjectMark {
  subjectId: string;
  marks: number | null;
}

export interface ExamStudent {
  id: string;
  name: string;
  rollNumber: string;
}

export interface StudentResult {
  examId: string;
  student: ExamStudent;
  marks: SubjectMark[];
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: ResultStatus;
}

export interface ExamListQuery {
  campusId: CampusId;
  search?: string;
  status?: ExamStatus | 'all';
}

export interface ExamFormValues {
  name: string;
  term: ExamTerm;
  academicYear: string;
  campusId: Exclude<CampusId, 'all'>;
  classSectionId: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  subjects: Array<{
    name: string;
    maxMarks: number;
    passMarks: number;
    date: string;
  }>;
}

export interface SaveStudentMarksInput {
  studentId: string;
  marks: SubjectMark[];
}

export interface ExamSummary {
  students: number;
  subjects: number;
  averagePercentage: number;
  passRate: number;
}
