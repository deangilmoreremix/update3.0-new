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
  
  const insights = [
    { title: 'High-Value Lead Detected', description: 'TechCorp shows 85% conversion probability', confidence: 85, type: 'opportunity' },
    { title: 'Follow-up Recommended', description: '3 contacts need immediate attention', confidence: 92, type: 'action' },
    { title: 'Pipeline Risk Alert', description: '$50K deal may stall without intervention', confidence: 78, type: 'warning' },
    { title: 'Revenue Forecast', description: 'Q1 target 23% ahead of schedule', confidence: 91, type: 'success' }
  ];
  
  return (
    <div id="ai-insights-section" className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Insights & Recommendations</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Machine learning powered business insights</p>
        </div>
        <button onClick={() => openAITool('business-analyzer')} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-200">
          Generate Insights
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <Lightbulb className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <span className={`text-xs px-2 py-1 rounded-full ${
                insight.type === 'success' ? 'bg-green-100 text-green-800' :
                insight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                insight.type === 'opportunity' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {insight.confidence}% confidence
              </span>
            </div>
            <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{insight.description}</p>
          </div>
        ))}
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