import React from 'react';
import { BarChart3 } from 'lucide-react';
import ChartsSection from '../dashboard/ChartsSection';

const SalesPipelineDealAnalytics: React.FC = () => {

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-3">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Sales Pipeline & Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive pipeline management and performance metrics
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <ChartsSection />
      </div>
      
      {/* Pipeline Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">24.5%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">+2.3% from last month</p>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Avg. Deal Size</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$12,450</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">+15.2% from last month</p>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sales Cycle</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">32 days</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">-3 days from last month</p>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelineDealAnalytics;