import type { CampusId } from '@/features/dashboard/types';

export const teacherStatuses = ['active', 'on-leave', 'inactive'] as const;
export const employmentTypes = ['full-time', 'part-time', 'contract'] as const;
export const teacherSubjects = [
  'Mathematics',
  'English',
  'Science',
  'Computer Science',
  'Pakistan Studies',
  'Islamiyat',
] as const;

export type TeacherStatus = (typeof teacherStatuses)[number];
export type EmploymentType = (typeof employmentTypes)[number];
export type TeacherSubject = (typeof teacherSubjects)[number];

export interface TeacherAssignment {
  classSectionId: string;
  gradeName: string;
  section: string;
  subject: TeacherSubject;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  email: string;
  phone: string;
  campusId: Exclude<CampusId, 'all'>;
  campusName: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
  employmentType: EmploymentType;
  status: TeacherStatus;
  assignments: TeacherAssignment[];
}

export interface TeacherFormValues {
  employeeId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  email: string;
  phone: string;
  campusId: Exclude<CampusId, 'all'>;
  qualification: string;
  specialization: string;
  joiningDate: string;
  employmentType: EmploymentType;
  status: TeacherStatus;
  assignments: Array<Pick<TeacherAssignment, 'classSectionId' | 'subject'>>;
}

export interface TeacherListQuery {
  search: string;
  campusId: CampusId;
  subject: TeacherSubject | 'all';
  status: TeacherStatus | 'all';
  page: number;
  pageSize: number;
}

export interface TeacherListResult {
  teachers: Teacher[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
