import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, AlertTriangle, Search, Filter, Eye, MessageSquare } from 'lucide-react';
import { 
  getRegistrationRequests, 
  getOnboardingStats, 
  approveRegistrationRequest, 
  rejectRegistrationRequest, 
  requestAdditionalInfo,
  getAuditLogs 
} from '../../utils/onboarding';
import { RegistrationRequest, OnboardingStats, AuditLog } from '../../types/onboarding';
import { useAuth } from '../../hooks/useAuth';

export const OnboardingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'info' | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRequests = getRegistrationRequests();
    const systemStats = getOnboardingStats();
    const logs = getAuditLogs();
    
    setRequests(allRequests);
    setStats(systemStats);
    setAuditLogs(logs);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesRole = roleFilter === 'all' || request.requested_role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAction = async () => {
    if (!selectedRequest || !actionType || !user) return;

    try {
      switch (actionType) {
        case 'approve':
          await approveRegistrationRequest(selectedRequest.id, user.id, actionComment);
          alert(`Registration approved for ${selectedRequest.full_name}. Account created successfully!`);
          break;
        case 'reject':
          rejectRegistrationRequest(selectedRequest.id, user.id, actionComment);
          alert(`Registration rejected for ${selectedRequest.full_name}.`);
          break;
        case 'info':
          requestAdditionalInfo(selectedRequest.id, user.id, actionComment);
          alert(`Additional information requested from ${selectedRequest.full_name}.`);
          break;
      }
      
      // Reload data and close modal
      loadData();
      setSelectedRequest(null);
      setActionType(null);
      setActionComment('');
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'An error occurred'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info_requested':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'info_requested':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Onboarding Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage registration requests and user approvals</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total_requests}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_requests}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.approved_requests}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejected_requests}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.info_requested}</p>
            <p className="text-sm text-gray-600">Info Requested</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="info_requested">Info Requested</option>
            </select>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="guide">Guide</option>
              <option value="coordinator">Coordinator</option>
              <option value="ethics_committee">Ethics Committee</option>
              <option value="examiner">Examiner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registration Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Registration Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.full_name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        {request.student_id && (
                          <div className="text-xs text-gray-400">Student ID: {request.student_id}</div>
                        )}
                        {request.employee_id && (
                          <div className="text-xs text-gray-400">Employee ID: {request.employee_id}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {request.requested_role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.department || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {request.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No registration requests match your current filters</p>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Registration Request Details</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{selectedRequest.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requested Role</label>
                  <p className="text-gray-900">{selectedRequest.requested_role.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-gray-900">{selectedRequest.department || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Request</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason_for_request}</p>
              </div>

              {selectedRequest.admin_comments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Comments</label>
                  <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedRequest.admin_comments}</p>
                </div>
              )}

              {actionType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {actionType === 'approve' ? 'Approval Comments' : 
                     actionType === 'reject' ? 'Rejection Reason' : 
                     'Information Requested'}
                  </label>
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={actionType === 'approve' ? 'Optional approval comments...' : 
                               actionType === 'reject' ? 'Please provide reason for rejection...' : 
                               'What additional information is needed?'}
                    required={actionType !== 'approve'}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                  setActionComment('');
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              
              {selectedRequest.status === 'pending' && !actionType && (
                <>
                  <button
                    onClick={() => setActionType('info')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => setActionType('reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setActionType('approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
              
              {actionType && (
                <button
                  onClick={handleAction}
                  disabled={actionType !== 'approve' && !actionComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirm {actionType === 'approve' ? 'Approval' : actionType === 'reject' ? 'Rejection' : 'Request'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};