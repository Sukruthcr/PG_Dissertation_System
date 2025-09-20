import { RegistrationRequest, AuditLog, OnboardingStats } from '../types/onboarding';
import { DatabaseUser } from '../types/auth';
import { User } from '../types';

// Generate unique ID for requests and logs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Hash password for new users (same as auth system)
const hashPassword = async (password: string, email: string): Promise<string> => {
  const SALT_KEY = 'PG_DISSERTATION_SYSTEM_2024_SECURE_SALT';
  const encoder = new TextEncoder();
  const saltedPassword = password + SALT_KEY + email.toLowerCase();
  const data = encoder.encode(saltedPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate secure temporary password
const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Get registration requests from storage
export const getRegistrationRequests = (): RegistrationRequest[] => {
  try {
    const stored = localStorage.getItem('pg_registration_requests');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading registration requests:', error);
    return [];
  }
};

// Save registration requests to storage
const saveRegistrationRequests = (requests: RegistrationRequest[]): void => {
  localStorage.setItem('pg_registration_requests', JSON.stringify(requests));
};

// Get audit logs from storage
export const getAuditLogs = (): AuditLog[] => {
  try {
    const stored = localStorage.getItem('pg_audit_logs');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading audit logs:', error);
    return [];
  }
};

// Save audit logs to storage
const saveAuditLogs = (logs: AuditLog[]): void => {
  localStorage.setItem('pg_audit_logs', JSON.stringify(logs));
};

// Add audit log entry
export const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>): void => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog); // Add to beginning for recent-first order
  
  // Keep only last 1000 logs to prevent storage bloat
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  saveAuditLogs(logs);
};

// Submit registration request
export const submitRegistrationRequest = async (requestData: Omit<RegistrationRequest, 'id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>): Promise<RegistrationRequest> => {
  const requests = getRegistrationRequests();
  
  // Check if email already exists in requests or users
  const existingRequest = requests.find(r => r.email.toLowerCase() === requestData.email.toLowerCase());
  if (existingRequest) {
    throw new Error('A registration request with this email already exists');
  }
  
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('pg_dissertation_users') || '[]');
  const existingUser = existingUsers.find((u: any) => u.email.toLowerCase() === requestData.email.toLowerCase());
  if (existingUser) {
    throw new Error('A user with this email already exists');
  }
  
  const newRequest: RegistrationRequest = {
    ...requestData,
    id: generateId(),
    status: 'pending',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  requests.push(newRequest);
  saveRegistrationRequests(requests);
  
  // Add audit log
  addAuditLog({
    action_type: 'registration_submitted',
    target_email: newRequest.email,
    details: `Registration request submitted for ${newRequest.requested_role} role`,
    metadata: {
      full_name: newRequest.full_name,
      department: newRequest.department,
      requested_role: newRequest.requested_role,
    },
  });
  
  return newRequest;
};

// Approve registration request
export const approveRegistrationRequest = async (requestId: string, adminId: string, adminComments?: string): Promise<User> => {
  const requests = getRegistrationRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Registration request not found');
  }
  
  const request = requests[requestIndex];
  
  // Generate temporary password
  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword, request.email);
  
  // Create new user account
  const newUser: DatabaseUser = {
    id: generateId(),
    email: request.email,
    passwordHash,
    role: request.requested_role,
    full_name: request.full_name,
    department: request.department,
    specialization: request.specialization,
    phone: request.phone,
    employee_id: request.employee_id,
    student_id: request.student_id,
    max_students: request.max_students,
    current_students: 0,
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: adminId,
  };
  
  // Add to users database
  const users = JSON.parse(localStorage.getItem('pg_dissertation_users') || '[]');
  users.push(newUser);
  localStorage.setItem('pg_dissertation_users', JSON.stringify(users));
  
  // Update request status
  requests[requestIndex] = {
    ...request,
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminId,
    admin_comments: adminComments,
    updated_at: new Date().toISOString(),
  };
  saveRegistrationRequests(requests);
  
  // Add audit logs
  addAuditLog({
    action_type: 'registration_approved',
    admin_id: adminId,
    target_email: request.email,
    details: `Registration approved and account created for ${request.full_name}`,
    metadata: {
      user_id: newUser.id,
      role: newUser.role,
      admin_comments: adminComments,
    },
  });
  
  addAuditLog({
    action_type: 'account_created',
    admin_id: adminId,
    user_id: newUser.id,
    target_email: newUser.email,
    details: `User account created with ${newUser.role} role`,
    metadata: {
      full_name: newUser.full_name,
      department: newUser.department,
      temporary_password: tempPassword, // In real app, this would be sent via secure email
    },
  });
  
  // Convert to User type for return
  const user: User = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role as any,
    department: newUser.department,
    specialization: newUser.specialization,
    phone: newUser.phone,
    employee_id: newUser.employee_id,
    student_id: newUser.student_id,
    max_students: newUser.max_students,
    current_students: newUser.current_students,
    created_at: newUser.created_at,
    updated_at: newUser.updated_at,
  };
  
  // In a real application, send email with temporary password
  console.log(`Temporary password for ${newUser.email}: ${tempPassword}`);
  
  return user;
};

// Reject registration request
export const rejectRegistrationRequest = (requestId: string, adminId: string, adminComments: string): RegistrationRequest => {
  const requests = getRegistrationRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Registration request not found');
  }
  
  const request = requests[requestIndex];
  
  requests[requestIndex] = {
    ...request,
    status: 'rejected',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminId,
    admin_comments: adminComments,
    updated_at: new Date().toISOString(),
  };
  saveRegistrationRequests(requests);
  
  // Add audit log
  addAuditLog({
    action_type: 'registration_rejected',
    admin_id: adminId,
    target_email: request.email,
    details: `Registration rejected for ${request.full_name}`,
    metadata: {
      requested_role: request.requested_role,
      admin_comments: adminComments,
    },
  });
  
  return requests[requestIndex];
};

// Request additional information
export const requestAdditionalInfo = (requestId: string, adminId: string, infoRequested: string): RegistrationRequest => {
  const requests = getRegistrationRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Registration request not found');
  }
  
  const request = requests[requestIndex];
  
  requests[requestIndex] = {
    ...request,
    status: 'info_requested',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminId,
    additional_info_requested: infoRequested,
    updated_at: new Date().toISOString(),
  };
  saveRegistrationRequests(requests);
  
  // Add audit log
  addAuditLog({
    action_type: 'info_requested',
    admin_id: adminId,
    target_email: request.email,
    details: `Additional information requested from ${request.full_name}`,
    metadata: {
      info_requested: infoRequested,
    },
  });
  
  return requests[requestIndex];
};

// Get onboarding statistics
export const getOnboardingStats = (): OnboardingStats => {
  const requests = getRegistrationRequests();
  const logs = getAuditLogs();
  
  return {
    total_requests: requests.length,
    pending_requests: requests.filter(r => r.status === 'pending').length,
    approved_requests: requests.filter(r => r.status === 'approved').length,
    rejected_requests: requests.filter(r => r.status === 'rejected').length,
    info_requested: requests.filter(r => r.status === 'info_requested').length,
    recent_activity: logs.slice(0, 10), // Last 10 activities
  };
};

// Validate registration data
export const validateRegistrationData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }
  
  if (!data.requested_role) {
    errors.push('Role selection is required');
  }
  
  if (!data.reason_for_request || data.reason_for_request.trim().length < 10) {
    errors.push('Reason for request must be at least 10 characters');
  }
  
  if (data.requested_role === 'student' && !data.student_id) {
    errors.push('Student ID is required for student role');
  }
  
  if ((data.requested_role === 'guide' || data.requested_role === 'coordinator') && !data.employee_id) {
    errors.push('Employee ID is required for faculty roles');
  }
  
  if (data.requested_role === 'guide' && (!data.max_students || data.max_students < 1)) {
    errors.push('Maximum students capacity is required for guide role');
  }
  
  return errors;
};