import type { CampusId } from '@/features/dashboard/types';
import type { TeacherSubject } from '@/features/teachers/types';

export interface ClassSection {
  id: string;
  gradeName: string;
  gradeLevel: number;
  section: string;
  campusId: Exclude<CampusId, 'all'>;
  campusName: string;
  room: string;
  classTeacherId: string;
  classTeacherName: string;
  studentCount: number;
  capacity: number;
  subjects: TeacherSubject[];
}

export interface ClassListQuery {
  campusId: CampusId;
  search: string;
}

export interface ClassService {
  list(query: ClassListQuery): Promise<ClassSection[]>;
  get(id: string): Promise<ClassSection>;
}
