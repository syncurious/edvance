import type {
  School,
  SchoolFormValues,
  SchoolListQuery,
  SchoolListResult,
} from '@/features/schools/types';

export interface SchoolService {
  list(query: SchoolListQuery): Promise<SchoolListResult>;
  get(id: string): Promise<School>;
  create(values: SchoolFormValues): Promise<School>;
  update(id: string, values: SchoolFormValues): Promise<School>;
  delete(id: string): Promise<void>;
}
