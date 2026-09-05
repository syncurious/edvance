import type { CampusId } from '@/features/dashboard/types';

export const studentStatuses = [
  'active',
  'inactive',
  'graduated',
  'withdrawn',
] as const;
export const studentGenders = ['female', 'male', 'other'] as const;
export const studentClasses = [
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
] as const;
export const studentSections = ['A', 'B', 'C'] as const;

export type StudentStatus = (typeof studentStatuses)[number];
export type StudentGender = (typeof studentGenders)[number];
export type StudentClass = (typeof studentClasses)[number];
export type StudentSection = (typeof studentSections)[number];
export type StudentSortKey =
  | 'name'
  | 'admissionId'
  | 'className'
  | 'admissionDate';

export interface StudentParent {
  name: string;
  relationship: string;
  email: string;
  phone: string;
  occupation: string;
}

export interface StudentAttendanceSummary {
  percentage: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export interface StudentFeeSummary {
  total: number;
  paid: number;
  pending: number;
  status: 'paid' | 'partial' | 'overdue';
}

export interface StudentExamResult {
  subject: string;
  score: number;
  total: number;
  grade: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  admissionId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: StudentGender;
  campusId: Exclude<CampusId, 'all'>;
  campusName: string;
  className: StudentClass;
  section: StudentSection;
  rollNumber: string;
  status: StudentStatus;
  admissionDate: string;
  address: string;
  bloodGroup: string;
  house: string;
  previousSchool: string;
  parent: StudentParent;
  attendance: StudentAttendanceSummary;
  fees: StudentFeeSummary;
  examResults: StudentExamResult[];
  documents: StudentDocument[];
}

export interface StudentFormValues {
  admissionId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: StudentGender;
  campusId: Exclude<CampusId, 'all'>;
  className: StudentClass;
  section: StudentSection;
  rollNumber: string;
  status: StudentStatus;
  admissionDate: string;
  address: string;
  bloodGroup: string;
  house: string;
  previousSchool: string;
  parentName: string;
  parentRelationship: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation: string;
}

export interface StudentListQuery {
  search: string;
  campusId: CampusId;
  className: StudentClass | 'all';
  section: StudentSection | 'all';
  status: StudentStatus | 'all';
  sortBy: StudentSortKey;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface StudentListResult {
  students: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
