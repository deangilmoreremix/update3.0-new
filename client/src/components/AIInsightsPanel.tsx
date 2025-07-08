import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const AIInsightsPanel: React.FC = () => {
  const { isDark } = useTheme();

  const insights = [
    {
      id: 1,
      type: 'opportunity',
      title: 'High-Value Lead Detected',
      description: 'Sarah Johnson from TechCorp shows strong buying signals',
      confidence: 89,
      action: 'Schedule follow-up call',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Deal at Risk',
      description: 'Microsoft deal hasn\'t progressed in 14 days',
      confidence: 76,
      action: 'Send check-in email',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'insight',
      title: 'Optimal Contact Time',
      description: 'Best time to contact prospects is Tuesday 2-4 PM',
      confidence: 92,
      action: 'Schedule calls accordingly',
      priority: 'low'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Brain className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50';
      case 'medium':
        return isDark ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-yellow-200 bg-yellow-50';
      default:
        return isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Insights</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered business recommendations
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Live Analysis</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getIcon(insight.type)}
                <div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {insight.title}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {insight.description}
                  </p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                insight.confidence > 85 
                  ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                  : (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
              }`}>
                {insight.confidence}% confidence
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Recommended: {insight.action}
              </span>
              
              <button className={`px-3 py-1 text-xs rounded-full transition-colors ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}>
                Take Action
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            3 new insights this week
          </span>
        </div>
        
        <button className={`text-sm px-4 py-2 rounded-lg transition-colors ${
          isDark 
            ? 'text-blue-400 hover:bg-blue-500/20' 
            : 'text-blue-600 hover:bg-blue-100'
        }`}>
          View All Insights
        </button>
      </div>
    </div>
  );
};

export default AIInsightsPanel;