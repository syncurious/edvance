import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CampusId } from '@/features/dashboard/types';
import type { RootState } from '@/store';

export interface WorkspaceState {
  selectedSchoolId: string;
  selectedCampusId: CampusId;
}

export const initialWorkspaceState: WorkspaceState = {
  selectedSchoolId: 'crescent-academy',
  selectedCampusId: 'all',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: initialWorkspaceState,
  reducers: {
    schoolSelected(state, action: PayloadAction<string>) {
      state.selectedSchoolId = action.payload;
      state.selectedCampusId = 'all';
    },
    campusSelected(state, action: PayloadAction<CampusId>) {
      state.selectedCampusId = action.payload;
    },
  },
});

export const { campusSelected, schoolSelected } = workspaceSlice.actions;

export const selectSelectedSchoolId = (state: RootState) =>
  state.workspace.selectedSchoolId;
export const selectSelectedCampusId = (state: RootState) =>
  state.workspace.selectedCampusId;

export default workspaceSlice.reducer;
