import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, TrendingUp } from 'lucide-react';
import ChartsSection from '../dashboard/ChartsSection';

const SalesPipelineDealAnalytics: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-3">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Pipeline & Analytics</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive deal performance and pipeline insights
          </p>
        </div>
      </div>

      {/* Deal Analytics */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6 mb-6`}>
        <ChartsSection />
      </div>
    </div>
  );
};

export default SalesPipelineDealAnalytics;