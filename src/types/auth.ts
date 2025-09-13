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
}

export interface AuthError {
  type: 'INVALID_CREDENTIALS' | 'ROLE_MISMATCH' | 'ACCOUNT_DISABLED' | 'NETWORK_ERROR';
  message: string;
}