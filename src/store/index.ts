import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/store/api/base-api';
import appReducer from '@/store/slices/app-slice';
import authReducer from '@/store/slices/auth-slice';
import workspaceReducer from '@/store/slices/workspace-slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      workspace: workspaceReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
