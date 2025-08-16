import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in a real app, this would come from your API
  const dashboardStats = {
    total_topics: 247,
    active_topics: 156,
    completed_topics: 91,
    pending_approvals: 23,
    overdue_milestones: 8,
    publications: 45,
  };

  const recentActivities = [
    {
      id: '1',
      type: 'topic' as const,
      title: 'New topic submitted',
      description: 'Machine Learning in Healthcare Diagnostics',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe',
      status: 'pending',
    },
    {
      id: '2',
      type: 'approval' as const,
      title: 'Guide assignment approved',
      description: 'Dr. Smith assigned to Sarah Wilson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: 'Dr. Johnson',
      status: 'approved',
    },
    {
      id: '3',
      type: 'publication' as const,
      title: 'Publication submitted',
      description: 'Journal article submitted to Nature AI',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user: 'Alice Brown',
      status: 'under_review',
    },
    {
      id: '4',
      type: 'milestone' as const,
      title: 'Progress milestone completed',
      description: 'Literature review completed by Mike Chen',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: 'Mike Chen',
      status: 'completed',
    },
  ];

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // In a real app, this would navigate to the appropriate page or open a modal
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.full_name}
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your {user?.role === 'student' ? 'research' : 'team'} today.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={dashboardStats} userRole={user?.role || 'student'} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Quick Actions - Takes up 1 column */}
        <div>
          <QuickActions userRole={user?.role || 'student'} onActionClick={handleQuickAction} />
        </div>
      </div>

      {/* Additional Role-specific Content */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-2 bg-green-200 rounded-full mb-2">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Server Uptime</p>
              <p className="font-semibold text-green-600">99.5%</p>
            </div>
            <div className="text-center">
              <div className="h-2 bg-blue-200 rounded-full mb-2">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="font-semibold text-blue-600">78%</p>
            </div>
            <div className="text-center">
              <div className="h-2 bg-yellow-200 rounded-full mb-2">
                <div className="h-full bg-yellow-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="font-semibold text-yellow-600">234/360</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};