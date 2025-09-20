import { DatabaseUser, LoginCredentials, AuthToken, AuthError, SessionData } from '../types/auth';
import { User } from '../types';

// Secure password hashing using Web Crypto API (SHA-256 with salt)
const SALT_KEY = 'PG_DISSERTATION_SYSTEM_2024_SECURE_SALT';

const hashPassword = async (password: string, email: string): Promise<string> => {
  const encoder = new TextEncoder();
  // Use email as additional salt for uniqueness
  const saltedPassword = password + SALT_KEY + email.toLowerCase();
  const data = encoder.encode(saltedPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against stored hash
const verifyPassword = async (password: string, email: string, storedHash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password, email);
  return inputHash === storedHash;
};

// Generate cryptographically secure session token
const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate unique session ID
const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Role-based permissions mapping
const getRolePermissions = (role: string): string[] => {
  const permissions = {
    admin: [
      'user_management', 'create_users', 'delete_users', 'modify_users',
      'view_all_topics', 'approve_topics', 'reject_topics',
      'assign_guides', 'reassign_guides',
      'view_all_progress', 'system_settings',
      'generate_reports', 'export_data',
      'manage_roles', 'view_analytics'
    ],
    coordinator: [
      'view_all_topics', 'approve_topics', 'reject_topics',
      'assign_guides', 'reassign_guides',
      'view_student_progress', 'monitor_deadlines',
      'generate_reports', 'export_data',
      'manage_assignments'
    ],
    guide: [
      'view_assigned_students', 'view_student_topics',
      'provide_feedback', 'grade_milestones',
      'track_student_progress', 'approve_milestones',
      'view_publications', 'mentor_students'
    ],
    student: [
      'submit_topic', 'edit_own_topic', 'view_own_progress',
      'upload_documents', 'view_feedback',
      'submit_milestones', 'add_publications',
      'contact_guide'
    ],
    ethics_committee: [
      'review_ethics_submissions', 'approve_ethics',
      'reject_ethics', 'request_ethics_changes',
      'view_flagged_topics', 'provide_ethics_feedback'
    ],
    examiner: [
      'view_assigned_dissertations', 'evaluate_dissertations',
      'provide_examination_feedback', 'grade_dissertations',
      'view_final_submissions'
    ]
  };
  
  return permissions[role as keyof typeof permissions] || [];
};

// Initialize secure database with hashed passwords
const initializeSecureDatabase = async (): Promise<DatabaseUser[]> => {
  const users = [
    {
      id: 'admin_001',
      email: 'admin@university.edu',
      password: 'SecureAdmin123!',
      role: 'admin',
      full_name: 'System Administrator',
      department: 'IT Department',
      employee_id: 'EMP001',
      isActive: true,
      created_by: 'system'
    },
    {
      id: 'coord_001',
      email: 'coordinator@university.edu',
      password: 'CoordPass456!',
      role: 'coordinator',
      full_name: 'Dr. Robert Johnson',
      department: 'Computer Science',
      employee_id: 'EMP002',
      isActive: true,
      created_by: 'admin_001'
    },
    {
      id: 'guide_001',
      email: 'guide@university.edu',
      password: 'GuideSecure789!',
      role: 'guide',
      full_name: 'Dr. Jane Smith',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      employee_id: 'EMP003',
      max_students: 8,
      current_students: 5,
      isActive: true,
      created_by: 'coord_001'
    },
    {
      id: 'student_001',
      email: 'student@university.edu',
      password: 'StudentPass123!',
      role: 'student',
      full_name: 'John Doe',
      department: 'Computer Science',
      specialization: 'Machine Learning',
      student_id: 'CS2024001',
      isActive: true,
      created_by: 'coord_001'
    },
    {
      id: 'ethics_001',
      email: 'ethics@university.edu',
      password: 'EthicsSecure456!',
      role: 'ethics_committee',
      full_name: 'Dr. Sarah Wilson',
      department: 'Ethics Committee',
      employee_id: 'EMP004',
      isActive: true,
      created_by: 'admin_001'
    },
    {
      id: 'examiner_001',
      email: 'examiner@university.edu',
      password: 'ExaminerPass789!',
      role: 'examiner',
      full_name: 'Dr. Michael Brown',
      department: 'Computer Science',
      employee_id: 'EMP005',
      isActive: true,
      created_by: 'coord_001'
    },
  ];

  // Hash all passwords securely
  const hashedUsers: DatabaseUser[] = [];
  for (const user of users) {
    const passwordHash = await hashPassword(user.password, user.email);
    hashedUsers.push({
      ...user,
      passwordHash,
      phone: '+1-555-0123',
      failed_login_attempts: 0,
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
    databaseUsers = await initializeSecureDatabase();
  }
  return databaseUsers;
};

// Check if account is locked due to failed attempts
const isAccountLocked = (user: DatabaseUser): boolean => {
  if (!user.account_locked_until) return false;
  return new Date(user.account_locked_until) > new Date();
};

// Lock account after failed attempts
const lockAccount = async (userId: string): Promise<void> => {
  const users = await getDatabaseUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].failed_login_attempts = (users[userIndex].failed_login_attempts || 0) + 1;
    
    // Lock account for 30 minutes after 5 failed attempts
    if (users[userIndex].failed_login_attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 30);
      users[userIndex].account_locked_until = lockUntil.toISOString();
    }
  }
};

// Reset failed login attempts on successful login
const resetFailedAttempts = async (userId: string): Promise<void> => {
  const users = await getDatabaseUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].failed_login_attempts = 0;
    users[userIndex].account_locked_until = undefined;
    users[userIndex].last_login = new Date().toISOString();
  }
};

// Main authentication function
export const authenticateUser = async (credentials: LoginCredentials): Promise<{ user: User; token: AuthToken; permissions: string[] } | AuthError> => {
  try {
    // Add audit log for login attempt
    const { addAuditLog } = await import('./onboarding');
    addAuditLog({
      action_type: 'login_attempt',
      target_email: credentials.email,
      details: `Login attempt for ${credentials.role} role`,
      metadata: {
        attempted_role: credentials.role,
        timestamp: new Date().toISOString(),
      },
    });

    // Simulate network delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Input validation
    if (!credentials.email || !credentials.password || !credentials.role) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'All fields are required. Please enter email, password, and select your role.'
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Please enter a valid email address.'
      };
    }

    const users = await getDatabaseUsers();
    
    // Find user by email (case-insensitive)
    const dbUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!dbUser) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your email and password.'
      };
    }

    // Check if account is locked
    if (isAccountLocked(dbUser)) {
      return {
        type: 'ACCOUNT_LOCKED',
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
      };
    }

    // Check if account is active
    if (!dbUser.isActive) {
      return {
        type: 'ACCOUNT_DISABLED',
        message: 'Your account has been disabled. Please contact the system administrator.'
      };
    }

    // Verify password using secure hashing
    const isPasswordValid = await verifyPassword(credentials.password, credentials.email, dbUser.passwordHash);
    if (!isPasswordValid) {
      await lockAccount(dbUser.id);
      // Add failed login audit log
      addAuditLog({
        action_type: 'login_failed',
        target_email: credentials.email,
        details: `Failed login attempt - invalid password`,
        metadata: {
          attempted_role: credentials.role,
          reason: 'invalid_password',
        },
      });
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your email and password.'
      };
    }

    // Critical: Verify role matches (prevent role spoofing)
    if (dbUser.role !== credentials.role) {
      await lockAccount(dbUser.id);
      // Add role spoofing audit log
      addAuditLog({
        action_type: 'login_failed',
        user_id: dbUser.id,
        target_email: credentials.email,
        details: `Role spoofing attempt - user tried to access ${credentials.role} but assigned ${dbUser.role}`,
        metadata: {
          assigned_role: dbUser.role,
          attempted_role: credentials.role,
          reason: 'role_spoofing',
        },
      });
      return {
        type: 'ROLE_MISMATCH',
        message: `Access denied. Your account is not authorized for the ${credentials.role.replace('_', ' ')} role. Please select the correct role or contact your administrator.`
      };
    }

    // Reset failed login attempts on successful authentication
    await resetFailedAttempts(dbUser.id);

    // Add successful login audit log
    addAuditLog({
      action_type: 'login_success',
      user_id: dbUser.id,
      target_email: dbUser.email,
      details: `Successful login as ${dbUser.role}`,
      metadata: {
        role: dbUser.role,
        full_name: dbUser.full_name,
        session_start: new Date().toISOString(),
      },
    });

    // Generate secure session token
    const token: AuthToken = {
      token: generateSecureToken(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      userId: dbUser.id,
      role: dbUser.role,
      sessionId: generateSessionId(),
    };

    // Get role-based permissions
    const permissions = getRolePermissions(dbUser.role);

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

    return { user, token, permissions };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      type: 'NETWORK_ERROR',
      message: 'Authentication service temporarily unavailable. Please try again.'
    };
  }
};

// Validate session token
export const validateToken = (token: AuthToken): boolean => {
  if (!token || !token.token || !token.expiresAt) return false;
  return token.expiresAt > Date.now();
};

// Refresh session token
export const refreshToken = (currentToken: AuthToken): AuthToken => {
  return {
    ...currentToken,
    token: generateSecureToken(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    sessionId: generateSessionId(),
  };
};

// Check if user has specific permission
export const hasPermission = (userRole: string, permission: string): boolean => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission);
};

// Secure logout with session cleanup
export const logout = (): void => {
  // Clear all authentication data
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('session_data');
  localStorage.removeItem('user_permissions');
  
  // Clear any cached data
  sessionStorage.clear();
};

// Get current session data
export const getSessionData = (): SessionData | null => {
  try {
    const sessionData = localStorage.getItem('session_data');
    if (!sessionData) return null;
    
    const parsed = JSON.parse(sessionData);
    if (!validateToken(parsed.token)) {
      logout();
      return null;
    }
    
    return parsed;
  } catch (error) {
    logout();
    return null;
  }
};

// Save session data securely
export const saveSessionData = (sessionData: SessionData): void => {
  localStorage.setItem('session_data', JSON.stringify(sessionData));
  localStorage.setItem('auth_token', JSON.stringify(sessionData.token));
  localStorage.setItem('user', JSON.stringify(sessionData.user));
  localStorage.setItem('user_permissions', JSON.stringify(sessionData.permissions));
};