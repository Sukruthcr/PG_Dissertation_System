import React, { useState } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TopicList } from './components/Topics/TopicList';
import { TopicDetailModal } from './components/Topics/TopicDetailModal';
import { TopicForm } from './components/Topics/TopicForm';
import { ProgressTracker } from './components/Progress/ProgressTracker';
import { PublicationManager } from './components/Publications/PublicationManager';
import { UserManagement } from './components/Users/UserManagement';
import { ApprovalWorkflow } from './components/Approvals/ApprovalWorkflow';
import { exportTopicsToCSV, generateTopicReport } from './utils/exportUtils';
import { useAuth } from './hooks/useAuth';
import { Topic } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Mock topics data
  const mockTopics: Topic[] = [
    {
      id: '1',
      title: 'Machine Learning Applications in Healthcare Diagnostics',
      description: 'This research explores the application of deep learning algorithms in medical image analysis for early disease detection, focusing on breast cancer screening using mammography data.',
      keywords: ['Machine Learning', 'Healthcare', 'Deep Learning', 'Medical Imaging', 'Cancer Detection'],
      domain: 'Computer Science',
      methodology: 'Experimental Research',
      objectives: 'To develop an AI system for accurate breast cancer detection',
      expected_outcomes: 'Improved diagnostic accuracy and reduced false positives',
      student_id: 'CS2024001',
      guide_id: 'guide_1',
      status: 'approved',
      submitted_at: '2024-01-15T10:00:00Z',
      approved_at: '2024-01-20T14:30:00Z',
      similarity_score: 15,
      ethics_approval_required: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      title: 'Sustainable Energy Management in Smart Cities',
      description: 'Investigation of renewable energy integration and optimization techniques for urban environments using IoT sensors and predictive analytics.',
      keywords: ['Smart Cities', 'Renewable Energy', 'IoT', 'Sustainability', 'Urban Planning'],
      domain: 'Environmental Engineering',
      methodology: 'Mixed Methods Research',
      objectives: 'To optimize energy consumption in urban areas',
      expected_outcomes: 'Reduced carbon footprint and improved energy efficiency',
      student_id: 'EE2024002',
      status: 'in_progress',
      submitted_at: '2024-02-01T09:15:00Z',
      similarity_score: 25,
      ethics_approval_required: false,
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-15T11:20:00Z',
    },
    {
      id: '3',
      title: 'Blockchain-based Supply Chain Management',
      description: 'Development of a decentralized system for tracking and verifying supply chain operations using blockchain technology to enhance transparency and reduce fraud.',
      keywords: ['Blockchain', 'Supply Chain', 'Transparency', 'Decentralization', 'Smart Contracts'],
      domain: 'Computer Science',
      methodology: 'Design Science Research',
      objectives: 'To create a transparent and secure supply chain system',
      expected_outcomes: 'Enhanced traceability and reduced supply chain fraud',
      student_id: 'CS2024003',
      status: 'under_review',
      submitted_at: '2024-02-10T16:45:00Z',
      similarity_score: 45,
      ethics_approval_required: false,
      created_at: '2024-02-10T16:45:00Z',
      updated_at: '2024-02-12T13:10:00Z',
    },
    {
      id: '4',
      title: 'Mental Health Assessment Using Natural Language Processing',
      description: 'Developing NLP models to analyze social media posts and identify early indicators of mental health issues for timely intervention.',
      keywords: ['NLP', 'Mental Health', 'Social Media Analysis', 'Psychology', 'AI Ethics'],
      domain: 'Psychology',
      methodology: 'Quantitative Research',
      objectives: 'To develop early detection systems for mental health issues',
      expected_outcomes: 'Better mental health support and early intervention',
      student_id: 'PSY2024001',
      status: 'submitted',
      submitted_at: '2024-02-20T11:30:00Z',
      similarity_score: 35,
      ethics_approval_required: true,
      created_at: '2024-02-20T11:30:00Z',
      updated_at: '2024-02-20T11:30:00Z',
    },
  ];

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleViewTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setShowTopicForm(true);
  };

  const handleCreateTopic = () => {
    setEditingTopic(null);
    setShowTopicForm(true);
  };

  const handleSaveTopic = (topicData: Partial<Topic>) => {
    console.log('Saving topic:', topicData);
    setShowTopicForm(false);
    setEditingTopic(null);
    // Show success message
    alert(editingTopic ? 'Topic updated successfully!' : 'Topic submitted successfully!');
  };

  const handleExportTopics = () => {
    exportTopicsToCSV(mockTopics);
  };

  const handleGenerateReport = (topic: Topic) => {
    generateTopicReport(topic);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'topics':
      case 'my-topic':
        return (
          <>
            <TopicList
              topics={mockTopics}
              userRole={user?.role || 'student'}
              onCreateTopic={handleCreateTopic}
              onViewTopic={handleViewTopic}
              onEditTopic={handleEditTopic}
              onExport={handleExportTopics}
            />
            
            {/* Topic Detail Modal */}
            {selectedTopic && (
              <TopicDetailModal
                topic={selectedTopic}
                isOpen={showTopicDetail}
                onClose={() => {
                  setShowTopicDetail(false);
                  setSelectedTopic(null);
                }}
                onEdit={() => {
                  setShowTopicDetail(false);
                  handleEditTopic(selectedTopic);
                }}
                userRole={user?.role || 'student'}
              />
            )}

            {/* Topic Form Modal */}
            <TopicForm
              topic={editingTopic || undefined}
              isOpen={showTopicForm}
              onClose={() => {
                setShowTopicForm(false);
                setEditingTopic(null);
              }}
              onSave={handleSaveTopic}
              isEditing={!!editingTopic}
            />
          </>
        );
      
      case 'users':
        return (
          <UserManagement 
            userRole={user?.role || 'student'} 
            onCreateUser={() => alert('Create user functionality would open here')}
            onEditUser={(user) => alert(`Edit user: ${user.full_name}`)}
            onDeleteUser={(user) => alert(`Delete user: ${user.full_name}`)}
          />
        );
      
      case 'assignments':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Guide Assignments</h2>
            <p className="text-gray-600">Guide assignment management interface will be implemented here.</p>
          </div>
        );
      
      case 'approvals':
        return (
          <ApprovalWorkflow 
            userRole={user?.role || 'student'}
            onApprove={(id, comment) => alert(`Approved: ${id} with comment: ${comment}`)}
            onReject={(id, comment) => alert(`Rejected: ${id} with comment: ${comment}`)}
          />
        );
      
      case 'progress':
        return (
          <ProgressTracker topicId="1" userRole={user?.role || 'student'} />
        );
      
      case 'publications':
        return (
          <PublicationManager 
            topicId="1" 
            userRole={user?.role || 'student'}
            onSavePublication={(data) => alert(`Publication saved: ${data.title}`)}
          />
        );
      
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 ml-64 p-8 mt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;