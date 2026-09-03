import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Environment = 'mock' | 'api';

interface AppState {
  environment: Environment;
  platformName: string;
}

const initialState: AppState = {
  environment: 'mock',
  platformName: 'Edvance',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setEnvironment(state, action: PayloadAction<Environment>) {
      state.environment = action.payload;
    },
  },
});

export const { setEnvironment } = appSlice.actions;
export default appSlice.reducer;
