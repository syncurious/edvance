import type { AuthService } from '@/features/auth/services/auth-service';
import { httpAuthService } from '@/features/auth/services/http-auth-service';

export const authService: AuthService = httpAuthService;

export type { AuthService } from '@/features/auth/services/auth-service';
