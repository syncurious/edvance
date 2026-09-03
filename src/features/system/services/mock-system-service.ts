import type { SystemService } from '@/features/system/types';
import { mockSystemSummary } from '@/mocks/system';

export const mockSystemService: SystemService = {
  async getSummary() {
    return Promise.resolve(mockSystemSummary);
  },
};
