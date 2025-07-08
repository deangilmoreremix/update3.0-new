import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign } from 'lucide-react';

const LiveDealAnalysis: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dealsList = Object.values(deals);
  const activeDeal = dealsList.find(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost');

  useEffect(() => {
    // Simulate live analysis
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 2000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!activeDeal) {
    return (
      <div className="p-4 text-center">
        <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No active deals to analyze
        </p>
      </div>
    );
  }

  const riskScore = Math.floor(Math.random() * 40) + 20; // 20-60%
  const opportunityScore = Math.floor(Math.random() * 40) + 60; // 60-100%
  const daysInStage = Math.floor(Math.random() * 20) + 1;

  return (
    <div className="space-y-4">
      {/* Deal Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {activeDeal.title}
          </h4>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {activeDeal.company} • {activeDeal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Analyzing</span>
            </div>
          )}
          
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            activeDeal.value > 50000 
              ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
              : (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
          }`}>
            ${activeDeal.value.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Win Probability</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {opportunityScore}%
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Risk Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {riskScore}%
            </div>
            {riskScore > 40 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
      </div>

      {/* Stage Analysis */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Time in Current Stage
          </span>
          <span className={`text-xs font-medium ${
            daysInStage > 14 
              ? (isDark ? 'text-yellow-400' : 'text-yellow-600')
              : (isDark ? 'text-green-400' : 'text-green-600')
          }`}>
            {daysInStage} days
          </span>
        </div>
        
        <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-2 rounded-full ${
              daysInStage > 14 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((daysInStage / 30) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* AI Insights */}
      <div className={`p-3 rounded-lg border ${isDark ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}>
        <div className="flex items-start space-x-2">
          <DollarSign className="w-4 h-4 text-blue-500 mt-0.5" />
          <div>
            <p className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'} mb-1`}>
              AI Recommendation
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              {daysInStage > 14 
                ? "Deal has been in current stage for extended period. Consider follow-up call to address potential concerns."
                : "Deal is progressing well. Schedule technical demo to move to next stage."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
        isDark 
          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}>
        Generate Full Analysis Report
      </button>
    </div>
  );
};

export default LiveDealAnalysis;