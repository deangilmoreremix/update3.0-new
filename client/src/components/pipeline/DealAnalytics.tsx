import React from 'react';
import { X, TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DealAnalyticsProps {
  deals: Deal[];
  onClose: () => void;
}

const DealAnalytics: React.FC<DealAnalyticsProps> = ({ deals, onClose }) => {
  // Calculate metrics
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalDeals = deals.length;
  const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
  const avgProbability = totalDeals > 0 ? deals.reduce((sum, deal) => sum + deal.probability, 0) / totalDeals : 0;

  // Stage distribution
  const stageDistribution = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Priority distribution
  const priorityDistribution = deals.reduce((acc, deal) => {
    acc[deal.priority] = (acc[deal.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly trend (mock data for demonstration)
  const monthlyTrend = [
    { month: 'Jan', value: 45000, deals: 12 },
    { month: 'Feb', value: 52000, deals: 15 },
    { month: 'Mar', value: 48000, deals: 11 },
    { month: 'Apr', value: 63000, deals: 18 },
    { month: 'May', value: 58000, deals: 16 },
    { month: 'Jun', value: 71000, deals: 22 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pipeline Analytics</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Value</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Total Deals</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {totalDeals}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    ${Math.round(avgDealSize).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Avg Probability</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {Math.round(avgProbability)}%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Stage Distribution */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Stage Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stageDistribution).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {stage.replace('-', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(count / totalDeals) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(priorityDistribution).map(([priority, count]) => (
                <div key={priority} className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                    priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    <span className={`text-lg font-bold ${
                      priority === 'high' ? 'text-red-600 dark:text-red-400' :
                      priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{priority}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trend</h3>
            <div className="grid grid-cols-6 gap-4">
              {monthlyTrend.map((month, index) => (
                <div key={month.month} className="text-center">
                  <div className="mb-2">
                    <div 
                      className="bg-blue-500 mx-auto rounded-t"
                      style={{ 
                        height: `${(month.value / 80000) * 100}px`,
                        width: '20px'
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{month.month}</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    ${(month.value / 1000).toFixed(0)}k
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Deals */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Deals by Value</h3>
            <div className="space-y-2">
              {deals
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map(deal => (
                  <div key={deal.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{deal.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        ${deal.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{deal.probability}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealAnalytics;