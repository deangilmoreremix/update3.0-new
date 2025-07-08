import React from 'react';
import { BarChart3, Users, Target, DollarSign, TrendingUp, Phone, Mail, Calendar, Plus, MessageSquare, Video, FileText, Clock, Activity, CheckSquare, Brain, Zap, Lightbulb, Settings, Grid3X3, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import DashboardLayoutControls from './DashboardLayoutControls';
import AIInsightsPanel from './AIInsightsPanel';
import { SmartAIControls } from './ai/SmartAIControls';

// Executive Overview Section Component
const ExecutiveOverviewSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();
  
  const totalRevenue = Object.values(deals).reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = totalRevenue / Math.max(Object.keys(deals).length, 1);
  const pipelineValue = Object.values(deals).filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).reduce((sum, deal) => sum + deal.value, 0);
  
  return (
    <div id="executive-overview-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Executive Overview</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>High-level business metrics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Live Data</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'bg-gradient-to-r from-green-50 to-emerald-50'} border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>Pipeline Value</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${pipelineValue.toLocaleString()}</p>
            </div>
            <Target className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50'} border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Avg Deal Size</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${Math.round(avgDealSize).toLocaleString()}</p>
            </div>
            <BarChart3 className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' : 'bg-gradient-to-r from-orange-50 to-red-50'} border ${isDark ? 'border-orange-800' : 'border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>Active Contacts</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{Object.keys(contacts).length}</p>
            </div>
            <Users className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Cards Section Component
const KPICardsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  
  const kpis = [
    {
      title: 'Contacts',
      value: Object.keys(contacts).length,
      change: '+12%',
      positive: true,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Deals',
      value: Object.keys(deals).length,
      change: '+8%',
      positive: true,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Tasks Completed',
      value: Object.values(tasks).filter(t => t.completed).length,
      change: '+15%',
      positive: true,
      icon: CheckSquare,
      color: 'purple'
    },
    {
      title: 'Revenue MTD',
      value: `$${Object.values(deals).reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`,
      change: '+23%',
      positive: true,
      icon: DollarSign,
      color: 'emerald'
    }
  ];
  
  return (
    <div id="kpi-cards-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Performance Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
              <span className={`text-xs px-2 py-1 rounded-full ${kpi.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{kpi.value}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Section Component
const QuickActionsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature, openAITool } = useNavigation();
  
  const quickActions = [
    { title: 'Add Contact', icon: Plus, color: 'blue', action: () => navigateToFeature('customer-lead-management') },
    { title: 'Schedule Meeting', icon: Calendar, color: 'green', action: () => openAITool('meeting-agenda') },
    { title: 'Send Email', icon: Mail, color: 'purple', action: () => openAITool('email-composer') },
    { title: 'Make Call', icon: Phone, color: 'orange', action: () => openAITool('phone-system') }
  ];
  
  return (
    <div id="quick-actions-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button key={index} onClick={action.action} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-200 hover:shadow-lg`}>
            <action.icon className={`w-6 h-6 mx-auto mb-2 text-${action.color}-500`} />
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{action.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// AI Smart Features Hub Component
const AISmartFeaturesHub: React.FC = () => {
  const { isDark } = useTheme();
  const { openAITool } = useNavigation();
  
  const aiFeatures = [
    { title: 'Smart Email Composer', description: 'AI-powered email generation', icon: Mail, status: 'active', tool: 'email-composer' },
    { title: 'Lead Scoring', description: 'Intelligent prospect prioritization', icon: Brain, status: 'active', tool: 'business-analyzer' },
    { title: 'Pipeline Intelligence', description: 'Sales forecasting & insights', icon: BarChart3, status: 'processing', tool: 'sales-insights' },
    { title: 'Voice Analysis', description: 'Real-time call insights', icon: MessageSquare, status: 'active', tool: 'voice-analysis' }
  ];
  
  return (
    <div id="ai-smart-features-hub" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Smart Features Hub</h3>
        <Brain className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiFeatures.map((feature, index) => (
          <button key={index} onClick={() => openAITool(feature.tool)} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 text-left`}>
            <div className="flex items-center justify-between mb-2">
              <feature.icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
              <div className={`w-2 h-2 rounded-full ${feature.status === 'active' ? 'bg-green-400' : feature.status === 'processing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
            <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sales Pipeline & Deal Analytics Section
const SalesPipelineDealAnalytics: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { navigateToFeature } = useNavigation();
  
  const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  const stageData = stages.map(stage => ({
    stage,
    count: Object.values(deals).filter(deal => deal.stage === stage).length,
    value: Object.values(deals).filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
  }));
  
  return (
    <div id="sales-pipeline-deal-analytics" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Pipeline & Deal Analytics</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Comprehensive sales performance tracking</p>
        </div>
        <button onClick={() => navigateToFeature('sales-pipeline-deal-analytics')} className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200">
          View Full Pipeline
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stageData.map((stage, index) => (
          <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{stage.stage.replace('-', ' ')}</p>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stage.count}</p>
            <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>${stage.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Customer & Lead Management Section
const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { navigateToFeature } = useNavigation();
  
  const contactsByStatus = {
    lead: Object.values(contacts).filter(c => c.status === 'lead').length,
    prospect: Object.values(contacts).filter(c => c.status === 'prospect').length,
    customer: Object.values(contacts).filter(c => c.status === 'customer').length,
    inactive: Object.values(contacts).filter(c => c.status === 'inactive').length
  };
  
  return (
    <div id="customer-lead-management" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Manage and nurture your prospect relationships</p>
        </div>
        <button onClick={() => navigateToFeature('customer-lead-management')} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
          Manage Contacts
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(contactsByStatus).map(([status, count], index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{count}</p>
            <p className={`text-sm capitalize ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{status}s</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activities & Communications Section
const ActivitiesCommunications: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  const { navigateToFeature, openAITool } = useNavigation();
  
  const recentActivities = [
    { type: 'email', message: 'Email sent to 5 prospects', time: '10 min ago', icon: Mail },
    { type: 'call', message: 'Call completed with John Smith', time: '25 min ago', icon: Phone },
    { type: 'meeting', message: 'Demo scheduled for tomorrow', time: '1 hour ago', icon: Calendar },
    { type: 'task', message: 'Follow-up task completed', time: '2 hours ago', icon: CheckSquare }
  ];
  
  return (
    <div id="activities-communications" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Activities & Communications</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Task management and communication tracking</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => openAITool('email-composer')} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200">
            Compose
          </button>
          <button onClick={() => navigateToFeature('activities-communications')} className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
            View All
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'} flex items-center justify-center`}>
              <activity.icon className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.message}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Insights & Recommendations Section
const AIInsightsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { openAITool } = useNavigation();
  const { contacts } = useContactStore();
  
  return (
    <div id="ai-insights-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      {/* AI Pipeline Intelligence Panel */}
      <AIInsightsPanel />
      
      {/* Smart AI Controls */}
      <div className="mt-6">
        <SmartAIControls 
          contacts={Object.values(contacts)}
          onAnalysisComplete={(results) => {
            console.log('AI Analysis completed:', results);
            // Handle analysis results - could update contact store, show notifications, etc.
          }}
        />
      </div>
      

    </div>
  );
};

// Metrics Cards Section
const MetricsCardsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  
  const metrics = [
    { label: 'Conversion Rate', value: '24.5%', trend: '+2.1%', color: 'green' },
    { label: 'Avg Deal Cycle', value: '45 days', trend: '-3 days', color: 'blue' },
    { label: 'Lead Response Time', value: '2.3 hrs', trend: '-0.5 hrs', color: 'purple' },
    { label: 'Customer Satisfaction', value: '4.8/5', trend: '+0.2', color: 'orange' }
  ];
  
  return (
    <div id="metrics-cards-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{metric.value}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{metric.label}</p>
            <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-100 text-${metric.color}-800`}>
              {metric.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Activity Section
const RecentActivitySection: React.FC = () => {
  const { isDark } = useTheme();
  
  const activities = [
    { id: 1, type: 'deal', message: 'TechCorp deal moved to negotiation', time: '5 min ago', user: 'Sarah M.', icon: Target },
    { id: 2, type: 'contact', message: 'New contact added: John Smith', time: '15 min ago', user: 'You', icon: Users },
    { id: 3, type: 'email', message: 'Email campaign sent to 25 prospects', time: '1 hour ago', user: 'Marketing Team', icon: Mail },
    { id: 4, type: 'task', message: 'Follow-up call scheduled', time: '2 hours ago', user: 'Alex R.', icon: Phone }
  ];
  
  return (
    <div id="recent-activity-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={`flex items-center space-x-4 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <activity.icon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.message}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>by {activity.user} • {activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Interaction History Section
const InteractionHistorySection: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature } = useNavigation();
  
  const interactions = [
    { id: 1, contact: 'Sarah Johnson', type: 'Email', subject: 'Product Demo Follow-up', time: '2 hours ago', status: 'replied' },
    { id: 2, contact: 'Mike Chen', type: 'Call', subject: 'Discovery Call', time: '1 day ago', status: 'completed' },
    { id: 3, contact: 'Emma Davis', type: 'Meeting', subject: 'Quarterly Review', time: '2 days ago', status: 'scheduled' },
    { id: 4, contact: 'Alex Turner', type: 'SMS', subject: 'Appointment Reminder', time: '3 days ago', status: 'delivered' }
  ];
  
  return (
    <div id="interaction-history-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Interaction History</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Recent contact interactions and communications</p>
        </div>
        <button onClick={() => navigateToFeature('interaction-history')} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {interactions.map((interaction) => (
          <div key={interaction.id} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'} flex items-center justify-center`}>
                <MessageSquare className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{interaction.contact}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{interaction.type}: {interaction.subject}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{interaction.time}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                interaction.status === 'replied' ? 'bg-green-100 text-green-800' :
                interaction.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                interaction.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {interaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Customer Profile Section
const CustomerProfileSection: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  
  // Get featured customer profiles
  const featuredProfiles = Object.values(contacts).slice(0, 4);
  
  return (
    <div id="customer-profile-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Profiles</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Detailed customer information and insights</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200">
          View All Profiles
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredProfiles.map((contact) => (
          <div key={contact.id} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={contact.avatarSrc || '/api/placeholder/40/40'}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{contact.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{contact.title}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Company:</span>
                <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{contact.company}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                  contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                  contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tasks and Funnel Section
const TasksAndFunnelSection: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  const { deals } = useDealStore();
  const { navigateToFeature } = useNavigation();
  
  const funnelStages = [
    { name: 'Lead', count: Object.values(deals).filter(d => d.stage === 'lead').length, color: 'bg-blue-500' },
    { name: 'Qualified', count: Object.values(deals).filter(d => d.stage === 'qualified').length, color: 'bg-green-500' },
    { name: 'Proposal', count: Object.values(deals).filter(d => d.stage === 'proposal').length, color: 'bg-yellow-500' },
    { name: 'Negotiation', count: Object.values(deals).filter(d => d.stage === 'negotiation').length, color: 'bg-orange-500' },
    { name: 'Closed', count: Object.values(deals).filter(d => d.stage === 'closed').length, color: 'bg-purple-500' }
  ];
  
  const todayTasks = Object.values(tasks).filter(task => {
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today;
  }).slice(0, 5);
  
  return (
    <div id="tasks-and-funnel-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks & Sales Funnel</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Task management and sales pipeline visualization</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => navigateToFeature('tasks')} className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
            Tasks
          </button>
          <button onClick={() => navigateToFeature('pipeline')} className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200">
            Pipeline
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Funnel</h4>
          <div className="space-y-3">
            {funnelStages.map((stage, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{stage.name}</span>
                </div>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stage.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Today's Tasks */}
        <div>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Tasks</h4>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} py-8`}>No tasks scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Integrations System Section
const IntegrationsSystemSection: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature } = useNavigation();
  
  const integrations = [
    { name: 'Slack', status: 'connected', icon: '💬', description: 'Team communication' },
    { name: 'Salesforce', status: 'connected', icon: '☁️', description: 'CRM sync' },
    { name: 'Gmail', status: 'connected', icon: '📧', description: 'Email integration' },
    { name: 'Zoom', status: 'pending', icon: '📹', description: 'Video meetings' },
    { name: 'HubSpot', status: 'disconnected', icon: '🔗', description: 'Marketing hub' },
    { name: 'Calendly', status: 'connected', icon: '📅', description: 'Scheduling' }
  ];
  
  return (
    <div id="integrations-system" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Integrations & System Tools</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Connect with external tools and platforms</p>
        </div>
        <button onClick={() => navigateToFeature('integrations')} className="px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all duration-200">
          Manage
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{integration.name}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{integration.description}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                integration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {integration.status}
              </span>
            </div>
            <button className={`w-full py-2 px-4 rounded-lg text-sm transition-all duration-200 ${
              integration.status === 'connected' 
                ? `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}` 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}>
              {integration.status === 'connected' ? 'Configure' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Charts Section  
const ChartsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  
  // Sample chart data
  const salesData = [
    { month: 'Jan', revenue: 45000, deals: 12 },
    { month: 'Feb', revenue: 52000, deals: 15 },
    { month: 'Mar', revenue: 48000, deals: 11 },
    { month: 'Apr', revenue: 61000, deals: 18 },
    { month: 'May', revenue: 55000, deals: 16 },
    { month: 'Jun', revenue: 67000, deals: 20 }
  ];
  
  return (
    <div id="charts-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Charts & Analytics</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Visualization of key sales metrics</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200">
          View Details
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Revenue</h4>
          <div className="h-40 flex items-end space-x-2">
            {salesData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg"
                  style={{ height: `${(data.revenue / 70000) * 100}%` }}
                ></div>
                <span className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Deals Chart */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Deals Closed</h4>
          <div className="h-40 flex items-end space-x-2">
            {salesData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg"
                  style={{ height: `${(data.deals / 25) * 100}%` }}
                ></div>
                <span className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Section
const AnalyticsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature } = useNavigation();
  
  const analyticsCards = [
    { title: 'Customer Lifetime Value', value: '$12,450', change: '+8.2%', trend: 'up' },
    { title: 'Churn Rate', value: '2.4%', change: '-0.8%', trend: 'down' },
    { title: 'Lead Response Time', value: '1.2 hrs', change: '-15 min', trend: 'down' },
    { title: 'Deal Velocity', value: '32 days', change: '-5 days', trend: 'down' }
  ];
  
  return (
    <div id="analytics-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Comprehensive Analytics</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Detailed charts and performance metrics</p>
        </div>
        <button onClick={() => navigateToFeature('analytics')} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
          Full Analytics
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsCards.map((card, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{card.value}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{card.title}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              card.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {card.change}
            </span>
          </div>
        ))}
      </div>
      
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Overview</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sales Target Achievement</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-24 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Lead Conversion Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>62%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Customer Satisfaction</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-28 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Apps Section
const AppsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { navigateToFeature } = useNavigation();
  
  const connectedApps = [
    { name: 'Smart CRM Closer', description: 'AI-powered deal closing assistant', icon: '🎯', status: 'active', users: 45 },
    { name: 'FunnelCraft AI', description: 'Marketing automation platform', icon: '🚀', status: 'active', users: 32 },
    { name: 'AI Goals System', description: 'Business automation goals', icon: '🤖', status: 'active', users: 28 },
    { name: 'Document Center', description: 'File management and sharing', icon: '📁', status: 'pending', users: 15 },
    { name: 'Analytics Dashboard', description: 'Advanced business intelligence', icon: '📊', status: 'active', users: 38 },
    { name: 'Communication Hub', description: 'Multi-channel messaging', icon: '💬', status: 'active', users: 42 }
  ];
  
  return (
    <div id="apps-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Connected Apps & Integrations</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Access your entire business toolkit</p>
        </div>
        <button onClick={() => navigateToFeature('apps')} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200">
          App Store
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectedApps.map((app, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{app.icon}</div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{app.name}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{app.description}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                app.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {app.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{app.users} active users</span>
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all duration-200">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { sectionOrder, getSectionConfig } = useDashboardLayout();

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'executive-overview-section':
        return <ExecutiveOverviewSection key={sectionId} />;
      case 'kpi-cards-section':
        return <KPICardsSection key={sectionId} />;
      case 'quick-actions-section':
        return <QuickActionsSection key={sectionId} />;
      case 'ai-smart-features-hub':
        return <AISmartFeaturesHub key={sectionId} />;
      case 'sales-pipeline-deal-analytics':
        return <SalesPipelineDealAnalytics key={sectionId} />;
      case 'customer-lead-management':
        return <CustomerLeadManagement key={sectionId} />;
      case 'activities-communications':
        return <ActivitiesCommunications key={sectionId} />;
      case 'ai-insights-section':
        return <AIInsightsSection key={sectionId} />;
      case 'metrics-cards-section':
        return <MetricsCardsSection key={sectionId} />;
      case 'recent-activity-section':
        return <RecentActivitySection key={sectionId} />;
      case 'interaction-history-section':
        return <InteractionHistorySection key={sectionId} />;
      case 'customer-profile-section':
        return <CustomerProfileSection key={sectionId} />;
      case 'tasks-and-funnel-section':
        return <TasksAndFunnelSection key={sectionId} />;
      case 'integrations-system':
        return <IntegrationsSystemSection key={sectionId} />;
      case 'charts-section':
        return <ChartsSection key={sectionId} />;
      case 'analytics-section':
        return <AnalyticsSection key={sectionId} />;
      case 'apps-section':
        return <AppsSection key={sectionId} />;
      default:
        // Placeholder for other sections
        const config = getSectionConfig(sectionId);
        if (!config) return null;
        
        return (
          <div key={sectionId} id={sectionId} className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{config.description}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
              </div>
            </div>
            <div className={`p-8 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'} text-center`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {config.title} component will be implemented here
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart<span className="text-green-400">CRM</span> Dashboard
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Your comprehensive business command center
            </p>
          </div>
          <DashboardLayoutControls />
        </div>

        {/* Render all sections in configured order */}
        <div className="space-y-0">
          {sectionOrder.map(sectionId => renderSection(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;