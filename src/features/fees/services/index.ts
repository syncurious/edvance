import type { FeeService } from '@/features/fees/services/fee-service';
import { MockFeeService } from '@/features/fees/services/mock-fee-service';

// Replace with a client that calls relative Next.js /api/fees routes when NestJS integration starts.
export const feeService: FeeService = new MockFeeService();

export type { FeeService } from '@/features/fees/services/fee-service';
export {
  FeeNotFoundError,
  MockFeeService,
  PaymentValidationError,
} from '@/features/fees/services/mock-fee-service';
