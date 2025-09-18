export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
  userId: string;
  role: string;
  sessionId: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  full_name: string;
  department?: string;
  specialization?: string;
  phone?: string;
  employee_id?: string;
  student_id?: string;
  max_students?: number;
  current_students?: number;
  profile_image?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string; // Admin who created this account
  last_login?: string;
  failed_login_attempts?: number;
  account_locked_until?: string;
}

export interface AuthError {
  type: 'INVALID_CREDENTIALS' | 'ROLE_MISMATCH' | 'ACCOUNT_DISABLED' | 'ACCOUNT_LOCKED' | 'NETWORK_ERROR';
  message: string;
}

export interface SessionData {
  token: AuthToken;
  user: DatabaseUser;
  permissions: string[];
  loginTime: string;
}