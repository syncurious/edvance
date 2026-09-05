import type {
  Student,
  StudentFormValues,
  StudentListQuery,
  StudentListResult,
} from '@/features/students/types';

export interface StudentService {
  list(query: StudentListQuery): Promise<StudentListResult>;
  get(id: string): Promise<Student>;
  create(values: StudentFormValues): Promise<Student>;
  update(id: string, values: StudentFormValues): Promise<Student>;
}
