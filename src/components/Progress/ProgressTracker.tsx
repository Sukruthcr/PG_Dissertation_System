import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, Upload, Download, MessageSquare } from 'lucide-react';
import { ProgressMilestone, Document } from '../../types';

interface ProgressTrackerProps {
  topicId: string;
  userRole: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ topicId, userRole }) => {
  // Mock milestones data
  const [milestones] = useState<ProgressMilestone[]>([
    {
      id: '1',
      topic_id: topicId,
      title: 'Literature Review',
      description: 'Complete comprehensive literature review and submit initial findings',
      due_date: '2024-03-15T23:59:59Z',
      completion_date: '2024-03-10T14:30:00Z',
      status: 'completed',
      documents: [
        {
          id: 'doc1',
          name: 'Literature_Review_v1.pdf',
          type: 'application/pdf',
          size: 2048576,
          url: '#',
          uploaded_by: 'student_1',
          uploaded_at: '2024-03-10T14:30:00Z',
        }
      ],
      feedback: 'Excellent work! The literature review is comprehensive and well-structured.',
      grade: 85,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-03-10T14:30:00Z',
    },
    {
      id: '2',
      topic_id: topicId,
      title: 'Research Methodology',
      description: 'Develop and submit detailed research methodology including data collection methods',
      due_date: '2024-04-15T23:59:59Z',
      completion_date: '2024-04-12T16:45:00Z',
      status: 'completed',
      documents: [
        {
          id: 'doc2',
          name: 'Research_Methodology.pdf',
          type: 'application/pdf',
          size: 1536000,
          url: '#',
          uploaded_by: 'student_1',
          uploaded_at: '2024-04-12T16:45:00Z',
        }
      ],
      feedback: 'Good methodology design. Consider adding more details about data validation.',
      grade: 78,
      created_at: '2024-02-01T10:00:00Z',
      updated_at: '2024-04-12T16:45:00Z',
    },
    {
      id: '3',
      topic_id: topicId,
      title: 'Data Collection',
      description: 'Collect primary and secondary data according to the approved methodology',
      due_date: '2024-06-15T23:59:59Z',
      status: 'in_progress',
      documents: [
        {
          id: 'doc3',
          name: 'Data_Collection_Progress.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 512000,
          url: '#',
          uploaded_by: 'student_1',
          uploaded_at: '2024-05-20T10:15:00Z',
        }
      ],
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-05-20T10:15:00Z',
    },
    {
      id: '4',
      topic_id: topicId,
      title: 'Data Analysis',
      description: 'Analyze collected data and generate preliminary results',
      due_date: '2024-08-15T23:59:59Z',
      status: 'pending',
      documents: [],
      created_at: '2024-04-01T10:00:00Z',
      updated_at: '2024-04-01T10:00:00Z',
    },
    {
      id: '5',
      topic_id: topicId,
      title: 'Draft Dissertation',
      description: 'Submit complete draft of dissertation for review',
      due_date: '2024-10-15T23:59:59Z',
      status: 'pending',
      documents: [],
      created_at: '2024-05-01T10:00:00Z',
      updated_at: '2024-05-01T10:00:00Z',
    },
    {
      id: '6',
      topic_id: topicId,
      title: 'Final Submission',
      description: 'Submit final dissertation with all corrections incorporated',
      due_date: '2024-12-15T23:59:59Z',
      status: 'pending',
      documents: [],
      created_at: '2024-06-01T10:00:00Z',
      updated_at: '2024-06-01T10:00:00Z',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (milestoneId: string) => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx';
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        alert(`Files selected for milestone ${milestoneId}: ${fileNames}\n\nIn a real application, these would be uploaded to the server.`);
      }
    };
    
    input.click();
  };

  const handleDownloadDocument = (document: Document) => {
    // Simulate download
    alert(`Downloading: ${document.name}\n\nIn a real application, this would download the actual file from the server.`);
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
          <span className="text-sm text-gray-600">
            {completedCount} of {milestones.length} milestones completed
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">{milestones.filter(m => m.status === 'completed').length}</p>
            <p className="text-sm text-green-700">Completed</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-600">{milestones.filter(m => m.status === 'in_progress').length}</p>
            <p className="text-sm text-blue-700">In Progress</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-600">{milestones.filter(m => m.status === 'pending').length}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-600">{milestones.filter(m => m.status === 'overdue').length}</p>
            <p className="text-sm text-red-700">Overdue</p>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Research Milestones</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const StatusIcon = getStatusIcon(milestone.status);
              const isLast = index === milestones.length - 1;
              
              return (
                <div key={milestone.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Status Icon */}
                    <div className={`p-2 rounded-full ${getStatusColor(milestone.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {formatDate(milestone.due_date)}
                            </div>
                            {milestone.completion_date && (
                              <div className="text-sm text-green-600">
                                Completed: {formatDate(milestone.completion_date)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Documents */}
                        {milestone.documents.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                            <div className="space-y-2">
                              {milestone.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{doc.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {formatFileSize(doc.size)} • Uploaded {formatDate(doc.uploaded_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDownloadDocument(doc)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Feedback and Grade */}
                        {milestone.feedback && (
                          <div className="mb-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start">
                                <MessageSquare className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-900">Guide Feedback</p>
                                  <p className="text-sm text-blue-800 mt-1">{milestone.feedback}</p>
                                  {milestone.grade && (
                                    <p className="text-sm font-medium text-blue-900 mt-2">
                                      Grade: {milestone.grade}/100
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </span>
                          
                          {userRole === 'student' && milestone.status !== 'completed' && (
                            <button
                              onClick={() => handleFileUpload(milestone.id)}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};