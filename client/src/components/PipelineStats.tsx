import React from 'react';
import { DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface PipelineStatsProps {
  totalValue: number;
  totalDeals: number;
}

const PipelineStats: React.FC<PipelineStatsProps> = ({ totalValue, totalDeals }) => {
  const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
  const conversionRate = 75; // Mock conversion rate
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Pipeline Value */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Pipeline Value
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {formatCompactCurrency(totalValue)}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Deals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Active Deals
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {totalDeals}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Average Deal Value */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Avg Deal Value
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {formatCompactCurrency(avgDealValue)}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Conversion Rate
              </dt>
              <dd className="text-lg font-medium text-gray-900 dark:text-white">
                {conversionRate}%
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineStats;