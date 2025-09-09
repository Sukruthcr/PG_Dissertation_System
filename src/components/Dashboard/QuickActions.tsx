import React from 'react';
import { Plus, FileText, Users, CheckSquare, Search } from 'lucide-react';

interface QuickActionsProps {
  userRole: string;
  onActionClick: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onActionClick }) => {
  const getActionsForRole = () => {
    switch (userRole) {
      case 'admin':
      case 'coordinator':
        return [
          { id: 'create-user', label: 'Add User', icon: Plus, color: 'blue', action: () => alert('Add User functionality would open here') },
          { id: 'review-topics', label: 'Review Topics', icon: FileText, color: 'green', action: () => alert('Review Topics functionality would open here') },
          { id: 'assign-guides', label: 'Assign Guides', icon: Users, color: 'purple', action: () => alert('Assign Guides functionality would open here') },
          { id: 'view-analytics', label: 'View Reports', icon: Search, color: 'orange', action: () => alert('Analytics/Reports functionality would open here') },
        ];
      
      case 'guide':
        return [
          { id: 'review-progress', label: 'Review Progress', icon: CheckSquare, color: 'blue', action: () => alert('Review Progress functionality would open here') },
          { id: 'provide-feedback', label: 'Give Feedback', icon: FileText, color: 'green', action: () => alert('Provide Feedback functionality would open here') },
          { id: 'view-students', label: 'My Students', icon: Users, color: 'purple', action: () => alert('My Students view would open here') },
        ];
      
      case 'student':
        return [
          { id: 'submit-topic', label: 'Submit Topic', icon: Plus, color: 'blue', action: () => alert('Submit Topic form would open here') },
          { id: 'upload-progress', label: 'Upload Progress', icon: FileText, color: 'green', action: () => alert('Upload Progress functionality would open here') },
          { id: 'contact-guide', label: 'Contact Guide', icon: Users, color: 'purple', action: () => alert('Contact Guide functionality would open here') },
        ];
      
      default:
        return [
          { id: 'review-pending', label: 'Review Pending', icon: CheckSquare, color: 'orange', action: () => alert('Review Pending items would open here') },
          { id: 'view-topics', label: 'View Topics', icon: FileText, color: 'blue', action: () => alert('View Topics would open here') },
        ];
    }
  };

  const actions = getActionsForRole();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => action.action ? action.action() : onActionClick(action.id)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${getColorClasses(action.color)}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};