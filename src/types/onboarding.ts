export interface RegistrationRequest {
  id: string;
  email: string;
  full_name: string;
  requested_role: 'student' | 'guide' | 'coordinator' | 'ethics_committee' | 'examiner';
  department?: string;
  specialization?: string;
  phone?: string;
  student_id?: string;
  employee_id?: string;
  max_students?: number;
  reason_for_request: string;
  supporting_documents?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_comments?: string;
  additional_info_requested?: string;
  applicant_response?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  action_type: 'registration_submitted' | 'registration_approved' | 'registration_rejected' | 
              'info_requested' | 'login_attempt' | 'login_success' | 'login_failed' | 
              'account_created' | 'role_assigned' | 'account_disabled';
  user_id?: string;
  admin_id?: string;
  target_email?: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface OnboardingStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  info_requested: number;
  recent_activity: AuditLog[];
}