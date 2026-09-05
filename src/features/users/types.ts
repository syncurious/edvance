export const platformUserRoles = [
  'super-admin',
  'school-admin',
  'teacher',
  'accountant',
] as const;
export const platformUserStatuses = ['active', 'invited', 'suspended'] as const;

export type PlatformUserRole = (typeof platformUserRoles)[number];
export type PlatformUserStatus = (typeof platformUserStatuses)[number];

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: PlatformUserRole;
  school: string;
  status: PlatformUserStatus;
  lastLoginAt: string | null;
}

export interface UserListQuery {
  search: string;
  role: PlatformUserRole | 'all';
  school: string;
  status: PlatformUserStatus | 'all';
  page: number;
  pageSize: number;
}

export interface UserListResult {
  users: PlatformUser[];
  schools: string[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
