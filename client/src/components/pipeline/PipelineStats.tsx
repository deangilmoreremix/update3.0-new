import React from 'react';
import { TrendingUp, Target, DollarSign, Calendar, Award } from 'lucide-react';

interface PipelineStatsProps {
  stats: {
    totalValue: number;
    totalDeals: number;
    averageDealSize: number;
    conversionRate: number;
    stageValues: Record<string, number>;
  };
}

const PipelineStats: React.FC<PipelineStatsProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getWinRate = () => {
    const closedWonValue = stats.stageValues['closed-won'] || 0;
    const closedLostValue = stats.stageValues['closed-lost'] || 0;
    const totalClosed = closedWonValue + closedLostValue;
    
    if (totalClosed === 0) return 0;
    return Math.round((closedWonValue / totalClosed) * 100);
  };

  const getVelocity = () => {
    // Mock velocity calculation - in real app, this would be based on historical data
    const totalValue = stats.totalValue;
    const totalDeals = stats.totalDeals;
    if (totalDeals === 0) return 0;
    
    return Math.round(totalValue / totalDeals * 0.1); // Mock velocity per day
  };

  const winRate = getWinRate();
  const velocity = getVelocity();

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% this month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Value */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(stats.totalValue)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Value</div>
            </div>
          </div>
        </div>

        {/* Total Deals */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.totalDeals}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Total Deals</div>
            </div>
          </div>
        </div>

        {/* Average Deal Size */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(stats.averageDealSize)}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Avg Deal Size</div>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {Math.round(stats.conversionRate)}%
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {winRate}%
              </div>
              <div className="text-sm text-teal-700 dark:text-teal-300">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Sales Velocity */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                {formatCurrency(velocity)}
              </div>
              <div className="text-sm text-pink-700 dark:text-pink-300">Daily Velocity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Stage Breakdown</h3>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              style={{ 
                width: `${stats.totalValue > 0 ? (stats.stageValues['qualification'] || 0) / stats.totalValue * 100 : 0}%` 
              }}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Qualification: {formatCurrency(stats.stageValues['qualification'] || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineStats;