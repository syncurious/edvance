import type {
  PlatformUser,
  PlatformUserStatus,
  UserListQuery,
  UserListResult,
} from '@/features/users/types';

export interface UserService {
  list(query: UserListQuery): Promise<UserListResult>;
  setStatus(id: string, status: PlatformUserStatus): Promise<PlatformUser>;
  sendPasswordReset(id: string): Promise<void>;
}
