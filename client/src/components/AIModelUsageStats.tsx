import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { aiOrchestratorService } from '../services/aiOrchestratorService';

interface ModelPerformance {
  model: string;
  callCount: number;
  successCount: number;
  avgResponseTime: number;
  avgCost: number;
  successRate: number;
}

export const AIModelUsageStats: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<ModelPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadStats();
  }, [selectedTimeframe]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const rawStats = aiOrchestratorService.getPerformanceMetrics();
      
      const processedStats: ModelPerformance[] = Object.entries(rawStats).map(([model, data]) => ({
        model,
        callCount: data.callCount,
        successCount: data.successCount,
        avgResponseTime: data.avgResponseTime,
        avgCost: data.avgCost,
        successRate: data.callCount > 0 ? (data.successCount / data.callCount) * 100 : 0
      })).filter(stat => stat.callCount > 0);

      setStats(processedStats);
    } catch (error) {
      console.error('Failed to load AI model stats:', error);
      setStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModelDisplayName = (model: string): string => {
    const modelNames: Record<string, string> = {
      'gemini-2.5-flash': 'Gemini 2.5 Flash',
      'gemini-2.5-flash-8b': 'Gemini 2.5 Flash 8B',
      'gpt-4o-mini': 'GPT-4o Mini',
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'gemma-2-2b-it': 'Gemma 2 2B',
      'gemma-2-9b-it': 'Gemma 2 9B',
      'gemma-2-27b-it': 'Gemma 2 27B'
    };
    return modelNames[model] || model;
  };

  const getProviderColor = (model: string): string => {
    if (model.includes('gpt')) return 'bg-green-500';
    if (model.includes('gemini')) return 'bg-blue-500';
    if (model.includes('gemma')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const getTotalStats = () => {
    const totalCalls = stats.reduce((sum, stat) => sum + stat.callCount, 0);
    const totalSuccess = stats.reduce((sum, stat) => sum + stat.successCount, 0);
    const avgResponseTime = stats.length > 0 
      ? stats.reduce((sum, stat) => sum + stat.avgResponseTime, 0) / stats.length 
      : 0;
    const totalCost = stats.reduce((sum, stat) => sum + (stat.avgCost * stat.callCount), 0);

    return {
      totalCalls,
      successRate: totalCalls > 0 ? (totalSuccess / totalCalls) * 100 : 0,
      avgResponseTime,
      totalCost
    };
  };

  const totalStats = getTotalStats();

  if (isLoading) {
    return (
      <div className={`
        p-6 rounded-lg border backdrop-blur-sm
        ${isDark 
          ? 'bg-gray-900/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
        }
      `}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      p-6 rounded-lg border backdrop-blur-sm
      ${isDark 
        ? 'bg-gray-900/50 border-gray-700' 
        : 'bg-white/50 border-gray-200'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Model Performance
          </h3>
        </div>
        
        <div className="flex space-x-1">
          {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${selectedTimeframe === timeframe
                  ? 'bg-blue-500 text-white'
                  : `hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`
                }
              `}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Calls</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalStats.totalCalls.toLocaleString()}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalStats.successRate.toFixed(1)}%
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Avg Response</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalStats.avgResponseTime.toFixed(1)}s
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <DollarSign className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Cost</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${totalStats.totalCost.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Model Performance List */}
      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.model}
            className={`
              p-4 rounded-lg border transition-all duration-200 hover:shadow-md
              ${isDark 
                ? 'bg-gray-800/30 border-gray-600 hover:bg-gray-800/50' 
                : 'bg-white/50 border-gray-200 hover:bg-white/80'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getProviderColor(stat.model)}`} />
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {getModelDisplayName(stat.model)}
                </h4>
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.callCount} calls
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                    <div
                      className={`h-2 rounded-full ${
                        stat.successRate >= 95 ? 'bg-green-500' : 
                        stat.successRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(stat.successRate, 100)}%` }}
                    />
                  </div>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.successRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Response</span>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.avgResponseTime.toFixed(2)}s
                </p>
              </div>

              <div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Cost</span>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${stat.avgCost.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            No AI model usage data available
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Start using AI features to see performance metrics
          </p>
        </div>
      )}
    </div>
  );
};

export default AIModelUsageStats;