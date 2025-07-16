import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { TrendingUp, Brain, Zap, Target, Users, DollarSign, Clock } from 'lucide-react';

interface AIPerformancePanelProps {}

const AIPerformancePanel: React.FC<AIPerformancePanelProps> = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate AI performance metrics
  const totalContacts = Object.keys(contacts).length;
  const totalDeals = Object.keys(deals).length;
  const aiScoredContacts = Object.values(contacts).filter(c => c.aiScore && c.aiScore > 0).length;
  const aiAccuracy = aiScoredContacts > 0 ? Math.round((aiScoredContacts / totalContacts) * 100) : 0;
  const avgAiScore = aiScoredContacts > 0 ? 
    Math.round(Object.values(contacts).reduce((sum, c) => sum + (c.aiScore || 0), 0) / aiScoredContacts) : 0;

  const performanceMetrics = [
    {
      title: "AI Analysis Accuracy",
      value: `${aiAccuracy}%`,
      change: "+12%",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Contacts Analyzed",
      value: aiScoredContacts.toString(),
      change: `+${Math.round(aiScoredContacts * 0.15)}`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Average AI Score",
      value: `${avgAiScore}/100`,
      change: "+8%",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Processing Time",
      value: "1.2s",
      change: "-0.3s",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const aiToolsUsage = [
    { tool: "Contact Analysis", usage: "95%", requests: 1247 },
    { tool: "Deal Intelligence", usage: "78%", requests: 892 },
    { tool: "Smart Search", usage: "65%", requests: 543 },
    { tool: "Email Composer", usage: "52%", requests: 321 },
    { tool: "Voice Analysis", usage: "34%", requests: 189 }
  ];

  const MetricCard = ({ metric }: { metric: any }) => (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/10' : metric.bgColor}`}>
          <metric.icon className={`h-6 w-6 ${metric.color}`} />
        </div>
        <span className={`text-sm font-medium ${
          metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {metric.change}
        </span>
      </div>
      <div>
        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {metric.value}
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {metric.title}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* AI Tools Usage */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center mb-6">
          <Zap className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Tools Usage Analytics
          </h3>
        </div>
        
        <div className="space-y-4">
          {aiToolsUsage.map((tool, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tool.tool}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.requests} requests
                  </span>
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : ''}`}>
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: tool.usage }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tool.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Performance Insights
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Contact analysis accuracy improved by 12%
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Processing time reduced by 0.3 seconds
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Deal intelligence usage increased by 23%
              </span>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI ROI Impact
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Saved
              </span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                24.5 hours/week
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Conversion Rate
              </span>
              <span className={`font-medium text-green-600`}>
                +18%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Cost per Lead
              </span>
              <span className={`font-medium text-green-600`}>
                -32%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPerformancePanel;