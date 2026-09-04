import { MockSchoolService } from '@/features/schools/services/mock-school-service';

export type { SchoolService } from '@/features/schools/services/school-service';
export {
  MockSchoolService,
  SchoolConflictError,
  SchoolNotFoundError,
} from '@/features/schools/services/mock-school-service';

// Replace this instance with a NestJS-backed implementation during API integration.
export const schoolService = new MockSchoolService();
