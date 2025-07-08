import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { Target, TrendingUp, BarChart3, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import LiveDealAnalysis from '../aiTools/LiveDealAnalysis';

const SalesPipelineDealAnalytics: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  
  const dealsList = Object.values(deals);
  const stageGroups = dealsList.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stageValues = dealsList.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + deal.value;
    return acc;
  }, {} as Record<string, number>);

  const totalPipelineValue = Object.values(stageValues).reduce((sum, value) => sum + value, 0);
  const activeDeals = dealsList.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage));
  const wonDeals = dealsList.filter(deal => deal.stage === 'closed-won');
  const winRate = dealsList.length > 0 ? (wonDeals.length / dealsList.length) * 100 : 0;

  const stages = [
    { id: 'lead', name: 'Lead', color: 'from-blue-500 to-cyan-500' },
    { id: 'prospect', name: 'Prospect', color: 'from-cyan-500 to-teal-500' },
    { id: 'proposal', name: 'Proposal', color: 'from-teal-500 to-green-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'from-yellow-500 to-orange-500' },
    { id: 'closed-won', name: 'Closed Won', color: 'from-green-500 to-emerald-500' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Pipeline & Deal Analytics</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Comprehensive sales performance tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Real-time Analytics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Pipeline Overview
          </h3>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Pipeline</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${totalPipelineValue.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+15.3%</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Target className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Deals</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeDeals.length}
              </p>
              <div className="flex items-center mt-1">
                <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                <span className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Avg: ${Math.round(totalPipelineValue / Math.max(activeDeals.length, 1)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Win Rate</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {winRate.toFixed(1)}%
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+2.1%</span>
              </div>
            </div>
          </div>

          {/* Pipeline Stages */}
          <div className="space-y-3">
            {stages.map((stage) => {
              const count = stageGroups[stage.id] || 0;
              const value = stageValues[stage.id] || 0;
              const percentage = totalPipelineValue > 0 ? (value / totalPipelineValue) * 100 : 0;
              
              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${stage.color}`}></div>
                      <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stage.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {count} deals
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stage.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {percentage.toFixed(1)}% of pipeline
                    </span>
                    {count > 0 && (
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Avg: ${Math.round(value / count).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Deal Analysis */}
        <div className="lg:col-span-1">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Live Deal Analysis
          </h3>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <LiveDealAnalysis />
          </div>

          {/* Pipeline Health */}
          <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Pipeline Health
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Velocity</span>
                <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Good</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Conversion</span>
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>At Risk Deals</span>
                <span className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {Math.floor(activeDeals.length * 0.15)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelineDealAnalytics;