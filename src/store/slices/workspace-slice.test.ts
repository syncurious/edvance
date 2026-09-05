import { describe, expect, it } from 'vitest';

import workspaceReducer, {
  campusSelected,
  initialWorkspaceState,
  schoolSelected,
} from '@/store/slices/workspace-slice';

describe('workspaceSlice', () => {
  it('stores the selected campus in shared state', () => {
    const state = workspaceReducer(
      initialWorkspaceState,
      campusSelected('central'),
    );

    expect(state.selectedCampusId).toBe('central');
  });

  it('returns to all campuses when the school changes', () => {
    const state = workspaceReducer(
      { ...initialWorkspaceState, selectedCampusId: 'south' },
      schoolSelected('another-school'),
    );

    expect(state).toEqual({
      selectedSchoolId: 'another-school',
      selectedCampusId: 'all',
    });
  });
});
