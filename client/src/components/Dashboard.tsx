import React, { useState } from 'react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  TrendingUp, 
  AlertTriangle,
  Star,
  Plus,
  ArrowRight
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType;
  size: 'small' | 'medium' | 'large';
  category: 'analytics' | 'contacts' | 'tasks' | 'communication';
}

const KPICard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 text-${color}-600`} />
      <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
  </div>
);

const QuickAction: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  color: string;
}> = ({ title, description, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-left group"
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </div>
  </button>
);

const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, type: 'contact', message: 'New contact added: John Smith', time: '2 minutes ago' },
    { id: 2, type: 'deal', message: 'Deal "Enterprise Package" moved to negotiation', time: '15 minutes ago' },
    { id: 3, type: 'meeting', message: 'Meeting with Sarah Johnson completed', time: '1 hour ago' },
    { id: 4, type: 'email', message: 'Email campaign "Q1 Newsletter" sent to 2,547 contacts', time: '2 hours ago' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { layout } = useDashboardLayout();
  const { theme } = useTheme();

  const kpiData = [
    { title: 'Total Contacts', value: '2,547', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Deals', value: '89', change: '+5%', icon: BarChart3, color: 'green' },
    { title: 'Meetings Today', value: '7', change: '-2%', icon: Calendar, color: 'purple' },
    { title: 'Revenue This Month', value: '$125,890', change: '+18%', icon: TrendingUp, color: 'orange' },
  ];

  const quickActions = [
    { title: 'Add Contact', description: 'Create a new contact', icon: Plus, color: 'blue', action: () => {} },
    { title: 'Schedule Meeting', description: 'Book a new appointment', icon: Calendar, color: 'green', action: () => {} },
    { title: 'Send Email', description: 'Compose a new email', icon: Mail, color: 'purple', action: () => {} },
    { title: 'Make Call', description: 'Start a phone call', icon: Phone, color: 'orange', action: () => {} },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Smart CRM
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              color={kpi.color}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <QuickAction
                    key={index}
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    onClick={action.action}
                    color={action.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Pipeline Chart */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Pipeline</h3>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Pipeline visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Open Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">24.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24.5%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Deal Conversion Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">18.2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '18.2%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;