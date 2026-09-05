import { MockUserService } from '@/features/users/services/mock-user-service';

export type { UserService } from '@/features/users/services/user-service';
export { MockUserService } from '@/features/users/services/mock-user-service';

export const userService = new MockUserService();
