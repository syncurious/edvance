import { describe, expect, it } from 'vitest';

import { makeStore } from '@/store';
import { baseApi } from '@/store/api/base-api';

describe('baseApi', () => {
  it('registers one shared RTK Query cache in the application store', () => {
    const store = makeStore();

    expect(baseApi.reducerPath).toBe('api');
    expect(store.getState().api).toEqual(
      expect.objectContaining({
        queries: {},
        mutations: {},
      }),
    );

    store.dispatch(baseApi.util.resetApiState());
    expect(store.getState().api.queries).toEqual({});
  });
});
