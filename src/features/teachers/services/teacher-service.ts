import type {
  Teacher,
  TeacherFormValues,
  TeacherListQuery,
  TeacherListResult,
} from '@/features/teachers/types';

export interface TeacherService {
  list(query: TeacherListQuery): Promise<TeacherListResult>;
  get(id: string): Promise<Teacher>;
  create(values: TeacherFormValues): Promise<Teacher>;
  update(id: string, values: TeacherFormValues): Promise<Teacher>;
}
