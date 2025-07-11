import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { Brain, TrendingUp, Target, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

const AIInsightsPanel: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { deals } = useDealStore();

  // Convert objects to arrays for calculations
  const contactArray = Object.values(contacts);
  const dealArray = Object.values(deals);

  // Generate AI insights based on real data
  const insights = [
    {
      id: 1,
      type: 'opportunity',
      title: 'High-Value Lead Identified',
      description: `${contactArray.filter(c => c.aiScore && c.aiScore > 90).length} contacts have AI scores above 90%. Focus on these prospects for immediate follow-up.`,
      confidence: 92,
      impact: 'high',
      icon: Target,
      color: 'green',
      actionable: true,
      suggestedActions: ['Send personalized email', 'Schedule discovery call', 'Connect on LinkedIn']
    },
    {
      id: 2,
      type: 'prediction',
      title: 'Deal Velocity Trend',
      description: `Based on current pipeline, projected to close ${Math.round(dealArray.length * 0.3)} deals this month with ${Math.round(dealArray.reduce((sum, d) => sum + d.value, 0) * 0.25 / 1000)}k revenue.`,
      confidence: 87,
      impact: 'medium',
      icon: TrendingUp,
      color: 'blue',
      actionable: true,
      suggestedActions: ['Accelerate proposal stage', 'Focus on negotiation deals', 'Prepare contract templates']
    },
    {
      id: 3,
      type: 'risk',
      title: 'Stale Pipeline Alert',
      description: `${dealArray.filter(d => d.stage === 'proposal' || d.stage === 'negotiation').length} deals in proposal/negotiation stage need attention to prevent loss.`,
      confidence: 78,
      impact: 'high',
      icon: AlertTriangle,
      color: 'orange',
      actionable: true,
      suggestedActions: ['Review deal status', 'Schedule follow-up calls', 'Send decision timeline']
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Lead Source Optimization',
      description: `Top performing lead sources are generating ${Math.round(contactArray.length * 0.4)} quality contacts. Increase investment in these channels.`,
      confidence: 85,
      impact: 'medium',
      icon: Lightbulb,
      color: 'purple',
      actionable: true,
      suggestedActions: ['Analyze top channels', 'Increase budget allocation', 'A/B test messaging']
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return Target;
      case 'prediction':
        return TrendingUp;
      case 'risk':
        return AlertTriangle;
      case 'recommendation':
        return Lightbulb;
      default:
        return Brain;
    }
  };

  const getInsightColor = (color: string) => {
    const colorMap = {
      green: isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-600 border-green-200',
      blue: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-600 border-blue-200',
      orange: isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-600 border-orange-200',
      purple: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-600 border-purple-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return isDark ? 'text-green-400' : 'text-green-600';
    if (confidence >= 80) return isDark ? 'text-blue-400' : 'text-blue-600';
    if (confidence >= 70) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-purple-500/20' : 'bg-purple-100'
          }`}>
            <Brain className={`h-6 w-6 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Insights & Recommendations
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Live Analysis
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => {
          const InsightIcon = getInsightIcon(insight.type);
          return (
            <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.color)} hover:scale-[1.02] transition-all duration-200`}>
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={getAvatarByIndex(insight.id, 'tech')}
                    alt={insight.title}
                    size="sm"
                    fallback={getInitials(insight.title)}
                    status={insight.impact === 'high' ? 'busy' : insight.confidence >= 90 ? 'online' : 'away'}
                  />
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.color).replace('text-', 'bg-').replace('border-', '').replace('/20', '/10')}`}>
                    <InsightIcon className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'high' 
                          ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                          : (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
                      }`}>
                        {insight.impact} impact
                      </span>
                      <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {insight.description}
                  </p>
                  
                  {insight.actionable && insight.suggestedActions && (
                    <div className="space-y-2">
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Suggested Actions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {insight.suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            className={`text-xs px-3 py-1 rounded-full transition-colors ${
                              isDark 
                                ? 'bg-white/10 text-white hover:bg-white/20' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 p-4 rounded-lg ${
        isDark ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10' : 'bg-gradient-to-r from-purple-50 to-blue-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI Analysis Score
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
            </span>
            <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Excellent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;