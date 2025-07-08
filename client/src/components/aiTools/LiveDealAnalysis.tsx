import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';

const LiveDealAnalysis: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const activeDeals = Object.values(deals).filter(deal => 
    !['closed-won', 'closed-lost'].includes(deal.stage)
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRandomInsight = () => {
    const insights = [
      "High probability deal in negotiation stage",
      "Potential risk: deal stalled for 2+ weeks",
      "Opportunity: follow up recommended within 3 days",
      "Strong pipeline momentum this quarter",
      "Competitor activity detected in 2 deals"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const analysisResults = [
    {
      type: 'opportunity',
      title: 'High-Value Opportunity',
      description: 'Deal worth $45k showing strong engagement signals',
      confidence: 87,
      action: 'Schedule follow-up call'
    },
    {
      type: 'risk',
      title: 'At-Risk Deal',
      description: 'No activity for 14 days, competitor mentioned',
      confidence: 73,
      action: 'Immediate outreach required'
    },
    {
      type: 'insight',
      title: 'Pipeline Health',
      description: 'Conversion rate 15% above average this month',
      confidence: 94,
      action: 'Continue current strategy'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Target className="w-4 h-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200';
      case 'risk':
        return isDark ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200';
      default:
        return isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Deal Analysis
          </h3>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Analyze</span>
            </div>
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {activeDeals.length}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Deals
            </p>
          </div>
          <div>
            <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              {Math.round(Math.random() * 40 + 60)}%
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Win Probability
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="space-y-3">
        {analysisResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getTypeColor(result.type)}`}
          >
            <div className="flex items-start space-x-2">
              {getTypeIcon(result.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {result.title}
                  </p>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.confidence}%
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {result.description}
                </p>
                <p className={`text-xs font-medium ${
                  result.type === 'opportunity' 
                    ? (isDark ? 'text-green-400' : 'text-green-700')
                    : result.type === 'risk'
                    ? (isDark ? 'text-red-400' : 'text-red-700')
                    : (isDark ? 'text-blue-400' : 'text-blue-700')
                }`}>
                  {result.action}
                </p>
              </div>
            </div>
            
            {/* Confidence Bar */}
            <div className={`mt-2 w-full rounded-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className={`h-1 rounded-full ${
                  result.type === 'opportunity' 
                    ? 'bg-green-500'
                    : result.type === 'risk'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Insight */}
      <div className={`p-3 rounded-lg border-l-4 ${
        isDark 
          ? 'bg-white/5 border-l-yellow-400' 
          : 'bg-yellow-50 border-l-yellow-400'
      }`}>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
            Live Insight
          </span>
        </div>
        <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {getRandomInsight()}
        </p>
      </div>
    </div>
  );
};

export default LiveDealAnalysis;