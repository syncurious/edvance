export const schoolPlans = ['Starter', 'Professional', 'Enterprise'] as const;
export const schoolStatuses = [
  'active',
  'trial',
  'past-due',
  'suspended',
] as const;

export type SchoolPlan = (typeof schoolPlans)[number];
export type SchoolStatus = (typeof schoolStatuses)[number];
export type SchoolSortKey = 'name' | 'students' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface School {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  campuses: number;
  students: number;
  plan: SchoolPlan;
  status: SchoolStatus;
  createdAt: string;
}

export interface SchoolFormValues {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  plan: SchoolPlan;
  status: SchoolStatus;
}

export interface SchoolListQuery {
  search: string;
  status: SchoolStatus | 'all';
  plan: SchoolPlan | 'all';
  sortBy: SchoolSortKey;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

export interface SchoolListResult {
  schools: School[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
