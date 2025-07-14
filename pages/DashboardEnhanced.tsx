import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  DollarSign,
  Phone,
  Mail,
  MessageSquare,
  Target,
  Zap,
  Brain
} from 'lucide-react';

// Mock data for demonstration
const mockStats = {
  totalContacts: 1234,
  activeDeals: 56,
  pendingTasks: 23,
  monthlyRevenue: 125000,
  conversionRate: 12.5,
  avgDealSize: 8500
};

const mockRecentActivities = [
  { id: 1, type: 'deal', description: 'New deal created: Acme Corp', time: '2 min ago', value: '$15,000' },
  { id: 2, type: 'contact', description: 'Contact updated: John Smith', time: '15 min ago', value: null },
  { id: 3, type: 'task', description: 'Task completed: Follow up call', time: '1 hour ago', value: null },
  { id: 4, type: 'meeting', description: 'Meeting scheduled: Product demo', time: '2 hours ago', value: null },
];

const DashboardEnhanced: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              value
            )}
          </p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, label, onClick, color = 'blue' }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 bg-${color}-50 text-${color}-700 rounded-lg hover:bg-${color}-100 transition-colors`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your business.</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Brain className="h-4 w-4" />
                <span>AI Insights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={mockStats.totalContacts.toLocaleString()}
            icon={Users}
            trend={8.2}
            color="blue"
          />
          <StatCard
            title="Active Deals"
            value={mockStats.activeDeals}
            icon={Target}
            trend={15.3}
            color="green"
          />
          <StatCard
            title="Pending Tasks"
            value={mockStats.pendingTasks}
            icon={CheckCircle}
            trend={-5.1}
            color="yellow"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${(mockStats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            trend={22.8}
            color="emerald"
          />
          <StatCard
            title="Conversion Rate"
            value={`${mockStats.conversionRate}%`}
            icon={TrendingUp}
            trend={3.2}
            color="purple"
          />
          <StatCard
            title="Avg Deal Size"
            value={`$${(mockStats.avgDealSize / 1000).toFixed(1)}K`}
            icon={BarChart3}
            trend={7.5}
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <QuickAction
              icon={Users}
              label="Add Contact"
              onClick={() => console.log('Add contact')}
              color="blue"
            />
            <QuickAction
              icon={Target}
              label="Create Deal"
              onClick={() => console.log('Create deal')}
              color="green"
            />
            <QuickAction
              icon={Calendar}
              label="Schedule Meeting"
              onClick={() => console.log('Schedule meeting')}
              color="purple"
            />
            <QuickAction
              icon={Phone}
              label="Make Call"
              onClick={() => console.log('Make call')}
              color="orange"
            />
            <QuickAction
              icon={Mail}
              label="Send Email"
              onClick={() => console.log('Send email')}
              color="red"
            />
            <QuickAction
              icon={MessageSquare}
              label="Send SMS"
              onClick={() => console.log('Send SMS')}
              color="teal"
            />
            <QuickAction
              icon={Zap}
              label="AI Automation"
              onClick={() => console.log('AI automation')}
              color="yellow"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'deal' ? 'bg-green-100' :
                    activity.type === 'contact' ? 'bg-blue-100' :
                    activity.type === 'task' ? 'bg-yellow-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'deal' && <Target className="h-4 w-4 text-green-600" />}
                    {activity.type === 'contact' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'task' && <CheckCircle className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.value && (
                    <span className="text-sm font-semibold text-green-600">{activity.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🎯 Top Opportunity</h4>
                <p className="text-sm text-blue-800">
                  Deal "Enterprise Solution - TechCorp" has a 78% close probability. Consider priority follow-up.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📈 Trending Up</h4>
                <p className="text-sm text-green-800">
                  Your conversion rate increased by 15% this week. Great work on qualifying leads!
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Action Needed</h4>
                <p className="text-sm text-yellow-800">
                  3 deals haven't been updated in 7+ days. Time for a check-in?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400">Integration with Recharts in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEnhanced;
