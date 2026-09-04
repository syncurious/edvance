export type UserRole = 'super-admin' | 'school-admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetSubmission {
  token: string;
  password: string;
}

export interface AuthResultMessage {
  message: string;
}
