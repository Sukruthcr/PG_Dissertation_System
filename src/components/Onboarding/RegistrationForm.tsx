import React, { useState } from 'react';
import { UserPlus, Mail, User, Building, Phone, FileText, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { submitRegistrationRequest, validateRegistrationData } from '../../utils/onboarding';
import { RegistrationRequest } from '../../types/onboarding';

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    requested_role: '',
    department: '',
    specialization: '',
    phone: '',
    student_id: '',
    employee_id: '',
    max_students: '',
    reason_for_request: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<RegistrationRequest | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Validate form data
      const validationErrors = validateRegistrationData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Submit registration request
      const requestData = {
        ...formData,
        max_students: formData.max_students ? parseInt(formData.max_students) : undefined,
      };

      const newRequest = await submitRegistrationRequest(requestData);
      setSubmittedRequest(newRequest);
      setIsSubmitted(true);

    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An error occurred while submitting your request']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && submittedRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2"><strong>Request ID:</strong> {submittedRequest.id}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {submittedRequest.email}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Role:</strong> {submittedRequest.requested_role.replace('_', ' ').toUpperCase()}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="text-orange-600 font-medium">PENDING APPROVAL</span></p>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">Your registration request has been submitted and is awaiting admin approval.</p>
            <p>You will be notified via email once your request is reviewed.</p>
          </div>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSubmittedRequest(null);
              setFormData({
                email: '',
                full_name: '',
                requested_role: '',
                department: '',
                specialization: '',
                phone: '',
                student_id: '',
                employee_id: '',
                max_students: '',
                reason_for_request: '',
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">PG Dissertation System</h1>
          <p className="text-blue-100 text-center">Registration Request</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requested Role *
            </label>
            <select
              value={formData.requested_role}
              onChange={(e) => handleInputChange('requested_role', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select the role you're requesting</option>
              <option value="student">📚 Graduate Student</option>
              <option value="guide">🎓 Research Guide</option>
              <option value="coordinator">📋 Program Coordinator</option>
              <option value="ethics_committee">⚖️ Ethics Committee Member</option>
              <option value="examiner">🔍 External Examiner</option>
            </select>
          </div>

          {/* Department and Specialization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Machine Learning"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1-555-0123"
              />
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.requested_role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID *
              </label>
              <input
                type="text"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your student ID"
                required
              />
            </div>
          )}

          {(formData.requested_role === 'guide' || formData.requested_role === 'coordinator') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                value={formData.employee_id}
                onChange={(e) => handleInputChange('employee_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your employee ID"
                required
              />
            </div>
          )}

          {formData.requested_role === 'guide' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students Capacity *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.max_students}
                onChange={(e) => handleInputChange('max_students', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How many students can you guide?"
                required
              />
            </div>
          )}

          {/* Reason for Request */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Request *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <textarea
                value={formData.reason_for_request}
                onChange={(e) => handleInputChange('reason_for_request', e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please explain why you need access to this system and how you plan to use it..."
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Submit Registration Request
              </>
            )}
          </button>

          {/* Info Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">Registration Process</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Your request will be reviewed by system administrators</li>
                  <li>• You will receive an email notification once approved</li>
                  <li>• Approved users will receive login credentials via secure email</li>
                  <li>• Only approved users can access the system</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};