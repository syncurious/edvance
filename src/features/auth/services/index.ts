import type { AuthService } from '@/features/auth/services/auth-service';
import { mockAuthService } from '@/features/auth/services/mock-auth-service';

// Replace this implementation with an HTTP-backed AuthService when the API is ready.
export const authService: AuthService = mockAuthService;

export type { AuthService } from '@/features/auth/services/auth-service';
