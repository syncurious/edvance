import type { Session } from '@supabase/supabase-js';

import type { AuthSession } from '@/features/auth/types';

export function toAuthSession(session: Session): AuthSession {
  return {
    user: {
      id: session.user.id,
      name:
        typeof session.user.user_metadata.full_name === 'string'
          ? session.user.user_metadata.full_name
          : (session.user.email ?? 'Administrator'),
      email: session.user.email ?? '',
    },
  };
}
