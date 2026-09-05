import type { UserService } from '@/features/users/services/user-service';
import type {
  PlatformUser,
  PlatformUserStatus,
  UserListQuery,
  UserListResult,
} from '@/features/users/types';
import { platformUserMocks } from '@/mocks/users';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class MockUserService implements UserService {
  private users: PlatformUser[];

  constructor(
    users: PlatformUser[] = platformUserMocks,
    private readonly latency = 250,
  ) {
    this.users = structuredClone(users);
  }

  private async pause() {
    if (this.latency > 0) await wait(this.latency);
  }

  async list(query: UserListQuery): Promise<UserListResult> {
    await this.pause();
    const search = query.search.trim().toLocaleLowerCase();
    const schools = [...new Set(this.users.map((user) => user.school))].sort();
    const users = this.users
      .filter((user) =>
        search
          ? [user.name, user.email, user.school].some((value) =>
              value.toLocaleLowerCase().includes(search),
            )
          : true,
      )
      .filter((user) =>
        query.role === 'all' ? true : user.role === query.role,
      )
      .filter((user) =>
        query.school === 'all' ? true : user.school === query.school,
      )
      .filter((user) =>
        query.status === 'all' ? true : user.status === query.status,
      )
      .sort((left, right) => left.name.localeCompare(right.name));

    const totalPages = Math.max(1, Math.ceil(users.length / query.pageSize));
    const page = Math.min(Math.max(query.page, 1), totalPages);
    const start = (page - 1) * query.pageSize;
    return structuredClone({
      users: users.slice(start, start + query.pageSize),
      schools,
      total: users.length,
      page,
      pageSize: query.pageSize,
      totalPages,
    });
  }

  async setStatus(id: string, status: PlatformUserStatus) {
    await this.pause();
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error('This user could not be found.');
    user.status = status;
    return structuredClone(user);
  }

  async sendPasswordReset(id: string) {
    await this.pause();
    if (!this.users.some((user) => user.id === id)) {
      throw new Error('This user could not be found.');
    }
  }
}
