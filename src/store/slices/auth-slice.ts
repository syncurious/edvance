import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthSession } from '@/features/auth/types';
import type { RootState } from '@/store';

export interface AuthState {
  session: AuthSession | null;
  hydrated: boolean;
  loading: boolean;
  rememberMe: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  session: null,
  hydrated: false,
  loading: false,
  rememberMe: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    authHydrated(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
      state.hydrated = true;
      state.loading = false;
    },
    authRequestStarted(state) {
      state.loading = true;
      state.error = null;
    },
    authRequestSucceeded(
      state,
      action: PayloadAction<{ session: AuthSession; rememberMe: boolean }>,
    ) {
      state.session = action.payload.session;
      state.rememberMe = action.payload.rememberMe;
      state.hydrated = true;
      state.loading = false;
      state.error = null;
    },
    authRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    authErrorCleared(state) {
      state.error = null;
    },
    authSignedOut(state) {
      state.session = null;
      state.hydrated = true;
      state.loading = false;
      state.rememberMe = false;
      state.error = null;
    },
  },
});

export const {
  authHydrated,
  authRequestStarted,
  authRequestSucceeded,
  authRequestFailed,
  authErrorCleared,
  authSignedOut,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthSession = (state: RootState) => state.auth.session;
export const selectCurrentUser = (state: RootState) =>
  state.auth.session?.user ?? null;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.session);

export default authSlice.reducer;
