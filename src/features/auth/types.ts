export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
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
