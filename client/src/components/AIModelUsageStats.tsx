import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, Zap, BarChart3, Clock, DollarSign, TrendingUp } from 'lucide-react';

const AIModelUsageStats: React.FC = () => {
  const { isDark } = useTheme();

  const models = [
    {
      name: 'GPT-4o',
      provider: 'OpenAI',
      usage: 1250,
      cost: 8.75,
      avgResponseTime: 2.3,
      successRate: 98.5,
      color: 'text-green-500'
    },
    {
      name: 'Gemini Pro',
      provider: 'Google AI',
      usage: 890,
      cost: 4.20,
      avgResponseTime: 1.8,
      successRate: 97.2,
      color: 'text-blue-500'
    },
    {
      name: 'Claude 3',
      provider: 'Anthropic',
      usage: 640,
      cost: 6.10,
      avgResponseTime: 2.1,
      successRate: 99.1,
      color: 'text-purple-500'
    }
  ];

  const totalCost = models.reduce((sum, model) => sum + model.cost, 0);
  const totalRequests = models.reduce((sum, model) => sum + model.usage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Model Performance
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Usage statistics and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Cost</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${totalCost.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalRequests.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="space-y-4">
        {models.map((model, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <Brain className={`w-5 h-5 ${model.color}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {model.name}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {model.provider}
                  </p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs ${
                model.successRate > 98 
                  ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                  : (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
              }`}>
                {model.successRate}% success
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Usage</span>
                </div>
                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {model.usage.toLocaleString()}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Time</span>
                </div>
                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {model.avgResponseTime}s
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <DollarSign className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cost</span>
                </div>
                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${model.cost.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mt-4">
              <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full ${model.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(model.usage / Math.max(...models.map(m => m.usage))) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            This Month's Summary
          </h4>
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cost Savings vs Premium</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              $127.50
            </p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response Time</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              2.1s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelUsageStats;