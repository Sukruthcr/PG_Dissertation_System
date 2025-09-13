import { DatabaseUser, LoginCredentials, AuthToken, AuthError } from '../types/auth';
import { User } from '../types';

// Simple hash function for demo purposes (in production, use bcrypt or similar)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_key_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against hash
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
};

// Generate secure token
const generateToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Mock database with hashed passwords
const initializeDatabase = async (): Promise<DatabaseUser[]> => {
  const users = [
    {
      id: 'admin_001',
      email: 'admin@university.edu',
      password: 'demo123',
      role: 'admin',
      full_name: 'System Administrator',
      department: 'IT Department',
      employee_id: 'EMP001',
      isActive: true,
    },
    {
      id: 'coord_001',
      email: 'coordinator@university.edu',
      password: 'demo123',
      role: 'coordinator',
      full_name: 'Dr. Robert Johnson',
      department: 'Computer Science',
      employee_id: 'EMP002',
      isActive: true,
    },
    {
      id: 'guide_001',
      email: 'guide@university.edu',
      password: 'demo123',
      role: 'guide',
      full_name: 'Dr. Jane Smith',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      employee_id: 'EMP003',
      max_students: 8,
      current_students: 5,
      isActive: true,
    },
    {
      id: 'student_001',
      email: 'student@university.edu',
      password: 'demo123',
      role: 'student',
      full_name: 'John Doe',
      department: 'Computer Science',
      specialization: 'Machine Learning',
      student_id: 'CS2024001',
      isActive: true,
    },
    {
      id: 'ethics_001',
      email: 'ethics@university.edu',
      password: 'demo123',
      role: 'ethics_committee',
      full_name: 'Dr. Sarah Wilson',
      department: 'Ethics Committee',
      employee_id: 'EMP004',
      isActive: true,
    },
    {
      id: 'examiner_001',
      email: 'examiner@university.edu',
      password: 'demo123',
      role: 'examiner',
      full_name: 'Dr. Michael Brown',
      department: 'Computer Science',
      employee_id: 'EMP005',
      isActive: true,
    },
  ];

  // Hash all passwords
  const hashedUsers: DatabaseUser[] = [];
  for (const user of users) {
    const passwordHash = await hashPassword(user.password);
    hashedUsers.push({
      ...user,
      passwordHash,
      phone: '+1-555-0123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as DatabaseUser);
  }

  return hashedUsers;
};

// Get database users (simulate database call)
let databaseUsers: DatabaseUser[] | null = null;

const getDatabaseUsers = async (): Promise<DatabaseUser[]> => {
  if (!databaseUsers) {
    databaseUsers = await initializeDatabase();
  }
  return databaseUsers;
};

// Authenticate user
export const authenticateUser = async (credentials: LoginCredentials): Promise<{ user: User; token: AuthToken } | AuthError> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = await getDatabaseUsers();
    
    // Find user by email
    const dbUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!dbUser) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password. Please check your credentials and try again.'
      };
    }

    // Check if account is active
    if (!dbUser.isActive) {
      return {
        type: 'ACCOUNT_DISABLED',
        message: 'Your account has been disabled. Please contact the administrator.'
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, dbUser.passwordHash);
    if (!isPasswordValid) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password. Please check your credentials and try again.'
      };
    }

    // Verify role matches
    if (dbUser.role !== credentials.role) {
      return {
        type: 'ROLE_MISMATCH',
        message: `Access denied. Your account is not authorized for the ${credentials.role.replace('_', ' ')} role.`
      };
    }

    // Generate secure token
    const token: AuthToken = {
      token: generateToken(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      userId: dbUser.id,
      role: dbUser.role,
    };

    // Convert database user to application user
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      full_name: dbUser.full_name,
      role: dbUser.role as any,
      department: dbUser.department,
      specialization: dbUser.specialization,
      phone: dbUser.phone,
      employee_id: dbUser.employee_id,
      student_id: dbUser.student_id,
      max_students: dbUser.max_students,
      current_students: dbUser.current_students,
      profile_image: dbUser.profile_image,
      created_at: dbUser.created_at,
      updated_at: dbUser.updated_at,
    };

    return { user, token };

  } catch (error) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error occurred. Please check your connection and try again.'
    };
  }
};

// Validate token
export const validateToken = (token: AuthToken): boolean => {
  return token.expiresAt > Date.now();
};

// Refresh token
export const refreshToken = (currentToken: AuthToken): AuthToken => {
  return {
    ...currentToken,
    token: generateToken(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
};

// Logout (invalidate token)
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};