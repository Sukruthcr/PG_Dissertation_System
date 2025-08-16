import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, FileText, User } from 'lucide-react';
import { Approval, Topic } from '../../types';

interface ApprovalWorkflowProps {
  userRole: string;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ userRole }) => {
  const [approvals] = useState<Approval[]>([
    {
      id: '1',
      entity_type: 'topic',
      entity_id: '1',
      approver_id: 'coord_1',
      status: 'pending',
      comments: '',
      created_at: '2024-02-20T10:00:00Z',
    },
    {
      id: '2',
      entity_type: 'topic',
      entity_id: '2',
      approver_id: 'ethics_1',
      status: 'approved',
      comments: 'Ethics approval granted. Please ensure data privacy protocols are followed.',
      approved_at: '2024-02-18T14:30:00Z',
      created_at: '2024-02-15T10:00:00Z',
    },
    {
      id: '3',
      entity_type: 'assignment',
      entity_id: '1',
      approver_id: 'coord_1',
      status: 'requires_changes',
      comments: 'Guide workload needs to be redistributed before approval.',
      created_at: '2024-02-10T10:00:00Z',
    },
  ]);

  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const pendingApprovals = approvals.filter(a => a.status === 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'requires_changes':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleApprove = (approvalId: string) => {
    console.log('Approving:', approvalId, 'with comment:', comment);
    // In real app, this would update the approval status
    setSelectedApproval(null);
    setComment('');
  };

  const handleReject = (approvalId: string) => {
    console.log('Rejecting:', approvalId, 'with comment:', comment);
    // In real app, this would update the approval status
    setSelectedApproval(null);
    setComment('');
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
        <h2 className="text-2xl font-bold text-gray-900">Approval Workflow</h2>
        <p className="text-gray-600 mt-1">Review and approve pending requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
          <p className="text-sm text-gray-600">Pending Approvals</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approvals.filter(a => a.status === 'approved').length}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{approvals.filter(a => a.status === 'rejected').length}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{approvals.filter(a => a.status === 'requires_changes').length}</p>
          <p className="text-sm text-gray-600">Needs Changes</p>
        </div>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approval Requests</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {approvals.map((approval) => {
            const StatusIcon = getStatusIcon(approval.status);
            
            return (
              <div key={approval.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(approval.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {approval.entity_type} Approval
                        </span>
                        <span className="text-sm text-gray-500">
                          #{approval.entity_id}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        Submitted on {formatDate(approval.created_at)}
                      </p>
                      
                      {approval.comments && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">Comments</p>
                              <p className="text-sm text-blue-800 mt-1">{approval.comments}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {approval.status === 'pending' && (userRole === 'coordinator' || userRole === 'ethics_committee' || userRole === 'admin') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedApproval(approval.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {approvals.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approvals found</h3>
            <p className="text-gray-600">All requests have been processed</p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Review Approval</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any comments or feedback..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedApproval)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedApproval)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};