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
import { useTopics } from './hooks/useTopics';
import { Topic } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { topics, addTopic, updateTopic, getTopicsByStudent } = useTopics();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Get topics based on user role
  const getTopicsForUser = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'student':
        // Students see only their own topics
        return getTopicsByStudent(user.student_id || user.id);
      case 'guide':
        // Guides see topics assigned to them
        return topics.filter(topic => topic.guide_id === user.id || topic.co_guide_id === user.id);
      case 'admin':
      case 'coordinator':
      case 'ethics_committee':
      case 'examiner':
        // Admin and coordinators see all topics
        return topics;
      default:
        return topics;
    }
  };

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
    try {
      if (editingTopic) {
        // Update existing topic
        updateTopic(editingTopic.id, topicData);
        alert('Topic updated successfully!');
      } else {
        // Add new topic
        const newTopic = addTopic({
          ...topicData,
          student_id: user?.student_id || user?.id || 'current_student',
        });
        alert(`Topic "${newTopic.title}" submitted successfully! It will appear in your topic list.`);
      }
      setShowTopicForm(false);
      setEditingTopic(null);
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error saving topic. Please try again.');
    }
  };

  const handleExportTopics = () => {
    const userTopics = getTopicsForUser();
    exportTopicsToCSV(userTopics);
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
              topics={getTopicsForUser()}
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