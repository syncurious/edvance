import { describe, expect, it } from 'vitest';

import { MockUserService } from '@/features/users/services';
import type { UserListQuery } from '@/features/users/types';
import { platformUserMocks } from '@/mocks/users';

const query: UserListQuery = {
  search: '',
  role: 'all',
  school: 'all',
  status: 'all',
  page: 1,
  pageSize: 8,
};

describe('MockUserService', () => {
  it('combines search, role, school, and status filters', async () => {
    const service = new MockUserService(platformUserMocks, 0);
    const result = await service.list({
      ...query,
      search: 'crescent',
      role: 'teacher',
      status: 'active',
    });
    expect(result.users).toHaveLength(1);
    expect(result.users[0].name).toBe('Nadia Ahmed');
    expect(result.schools).toContain('Crescent Academy');
  });

  it('updates status and supports password-reset actions', async () => {
    const service = new MockUserService(platformUserMocks, 0);
    await expect(service.sendPasswordReset('usr-007')).resolves.toBeUndefined();
    expect((await service.setStatus('usr-007', 'active')).status).toBe(
      'active',
    );
    expect((await service.list({ ...query, status: 'active' })).users).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'usr-007' })]),
    );
  });
});
