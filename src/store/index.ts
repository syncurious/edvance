import { configureStore } from '@reduxjs/toolkit';

import appReducer from '@/store/slices/app-slice';
import authReducer from '@/store/slices/auth-slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
