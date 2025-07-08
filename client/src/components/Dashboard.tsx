import React from 'react';
import { BarChart3, Users, Target, DollarSign, TrendingUp, Phone, Mail, Calendar, Plus, MessageSquare, Video, FileText, Clock, Activity, CheckSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature, openAITool } = useNavigation();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();

  // Calculate metrics
  const totalContacts = Object.keys(contacts).length;
  const activeDeals = Object.values(deals).filter(deal => 
    deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
  ).length;
  const totalRevenue = Object.values(deals)
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);
  const pendingTasks = Object.values(tasks).filter(task => !task.completed).length;

  const kpiCards = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-50'
    },
    {
      title: 'Active Deals',
      value: activeDeals,
      change: '+5%',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-50'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+18%',
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-500',
      bgColor: isDark ? 'bg-purple-500/20' : 'bg-purple-50'
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      change: '-8%',
      icon: CheckSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-50'
    }
  ];

  const quickActions = [
    {
      title: 'Add Contact',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigateToFeature('customer-lead-management')
    },
    {
      title: 'Schedule Meeting',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      action: () => openAITool('meeting-agenda')
    },
    {
      title: 'Send Email',
      icon: Mail,
      color: 'from-purple-500 to-indigo-500',
      action: () => openAITool('email-composer')
    },
    {
      title: 'Make Call',
      icon: Phone,
      color: 'from-orange-500 to-red-500',
      action: () => openAITool('phone-system')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'contact',
      message: 'New contact added: Sarah Johnson',
      time: '5 minutes ago',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'deal',
      message: 'Deal moved to negotiation: TechCorp Partnership',
      time: '15 minutes ago',
      icon: Target,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'email',
      message: 'Email sent to 15 prospects',
      time: '1 hour ago',
      icon: Mail,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'task',
      message: 'Follow-up call completed',
      time: '2 hours ago',
      icon: Phone,
      color: 'text-orange-500'
    }
  ];

  const performanceMetrics = [
    { label: 'Lead Conversion Rate', value: '24%', progress: 75 },
    { label: 'Email Open Rate', value: '45%', progress: 60 },
    { label: 'Call Success Rate', value: '68%', progress: 85 },
    { label: 'Deal Closure Rate', value: '32%', progress: 55 }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Smart<span className="text-green-400">CRM</span> Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Your comprehensive business command center
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => (
            <div
              key={index}
              className={`
                ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
                backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
                rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300
                transform hover:scale-105
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-r ${card.color}
                `}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${card.change.startsWith('+') 
                    ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20' 
                    : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20'
                  }
                `}>
                  {card.change}
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`
          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
          backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
          rounded-2xl p-6 shadow-xl
        `}>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`
                  p-4 rounded-xl border ${isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'} 
                  transition-all duration-300 transform hover:scale-105
                  ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                  group
                `}
              >
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                  bg-gradient-to-r ${action.color}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {action.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity */}
          <div className={`
            ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
            backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
            rounded-2xl p-6 shadow-xl
          `}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isDark ? 'bg-white/10' : 'bg-gray-100'}
                  `}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activity.message}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className={`
            ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
            backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
            rounded-2xl p-6 shadow-xl
          `}>
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Performance Metrics
            </h2>
            <div className="space-y-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {metric.label}
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Pipeline Preview */}
        <div className={`
          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
          backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
          rounded-2xl p-6 shadow-xl
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sales Pipeline Overview
            </h2>
            <button
              onClick={() => navigateToFeature('sales-pipeline-deal-analytics')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                hover:from-blue-600 hover:to-indigo-600 transition-all duration-300
                transform hover:scale-105
              `}
            >
              View Full Pipeline
            </button>
          </div>
          <div className="text-center py-8">
            <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Pipeline analytics and charts will be displayed here
            </p>
          </div>
        </div>

        {/* Connected Apps Preview */}
        <div className={`
          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} 
          backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
          rounded-2xl p-6 shadow-xl
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connected Applications
            </h2>
            <button
              onClick={() => navigateToFeature('integrations-system')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                bg-gradient-to-r from-purple-500 to-indigo-500 text-white
                hover:from-purple-600 hover:to-indigo-600 transition-all duration-300
                transform hover:scale-105
              `}
            >
              View All Apps
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'FunnelCraft AI', color: 'from-purple-500 to-pink-500' },
              { name: 'SmartCRM Closer', color: 'from-blue-500 to-cyan-500' },
              { name: 'ContentAI', color: 'from-green-500 to-emerald-500' },
              { name: 'White-Label Platform', color: 'from-orange-500 to-red-500' }
            ].map((app, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} 
                  text-center transition-all duration-300 hover:scale-105
                  ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                `}
              >
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                  bg-gradient-to-r ${app.color}
                `}>
                  <span className="text-white text-lg font-bold">
                    {app.name.charAt(0)}
                  </span>
                </div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {app.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;