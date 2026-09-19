import { describe, expect, it } from 'vitest';

import authReducer, {
  authHydrated,
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
  authSignedOut,
  initialAuthState,
} from '@/store/slices/auth-slice';

const session = {
  user: {
    id: 'user-1',
    name: 'Test Admin',
    email: 'admin@example.test',
  },
};

describe('auth slice', () => {
  it('tracks request, authenticated, failure, hydration, and sign-out states', () => {
    const loading = authReducer(initialAuthState, authRequestStarted());
    expect(loading.loading).toBe(true);

    const authenticated = authReducer(loading, authRequestSucceeded(session));
    expect(authenticated).toMatchObject({
      session,
      hydrated: true,
      loading: false,
      error: null,
    });

    const failed = authReducer(authenticated, authRequestFailed('Try again.'));
    expect(failed.error).toBe('Try again.');

    expect(
      authReducer(initialAuthState, authHydrated(session)).session,
    ).toEqual(session);
    expect(authReducer(authenticated, authSignedOut()).session).toBeNull();
  });
});
