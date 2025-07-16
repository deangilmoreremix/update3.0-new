import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

const ChartsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Convert objects to arrays for calculations
  const dealArray = Object.values(deals);
  const contactArray = Object.values(contacts);

  // Calculate monthly data (mock data for chart simulation)
  const monthlyData = [
    { month: 'Jan', revenue: 85000, deals: 12, contacts: 45 },
    { month: 'Feb', revenue: 92000, deals: 15, contacts: 52 },
    { month: 'Mar', revenue: 78000, deals: 11, contacts: 38 },
    { month: 'Apr', revenue: 105000, deals: 18, contacts: 61 },
    { month: 'May', revenue: 125000, deals: 22, contacts: 73 },
    { month: 'Jun', revenue: 140000, deals: 25, contacts: 85 },
  ];

  // Calculate pipeline stages
  const stageData = [
    { stage: 'Discovery', value: dealArray.filter(d => d.stage === 'discovery').reduce((sum, d) => sum + d.value, 0), count: dealArray.filter(d => d.stage === 'discovery').length },
    { stage: 'Qualification', value: dealArray.filter(d => d.stage === 'qualification').reduce((sum, d) => sum + d.value, 0), count: dealArray.filter(d => d.stage === 'qualification').length },
    { stage: 'Proposal', value: dealArray.filter(d => d.stage === 'proposal').reduce((sum, d) => sum + d.value, 0), count: dealArray.filter(d => d.stage === 'proposal').length },
    { stage: 'Negotiation', value: dealArray.filter(d => d.stage === 'negotiation').reduce((sum, d) => sum + d.value, 0), count: dealArray.filter(d => d.stage === 'negotiation').length },
    { stage: 'Closed Won', value: dealArray.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.value, 0), count: dealArray.filter(d => d.stage === 'closed-won').length },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxValue = Math.max(...stageData.map(d => d.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <div className={`p-6 rounded-xl border ${
        isDark 
          ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
          : 'border-gray-200 bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar
              src={getAvatarByIndex(1, 'executives')}
              alt="Revenue Manager"
              size="sm"
              fallback="RM"
              status="online"
            />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Revenue Trend
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              +12.5%
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {monthlyData.map((month, index) => (
            <div key={month.month} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium w-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {month.month}
                </span>
                <div className="flex-1">
                  <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${(month.revenue / 1000).toFixed(0)}k
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {month.deals} deals
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${
          isDark ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10' : 'bg-gradient-to-r from-green-50 to-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total H1 Revenue
              </span>
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${monthlyData.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline Stages Chart */}
      <div className={`p-6 rounded-xl border ${
        isDark 
          ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
          : 'border-gray-200 bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar
              src={getAvatarByIndex(2, 'executives')}
              alt="Sales Manager"
              size="sm"
              fallback="SM"
              status="online"
            />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Pipeline Stages
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Target className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {dealArray.length} total deals
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {stageData.map((stage, index) => {
            const stageColors = [
              'from-blue-500 to-indigo-500',
              'from-green-500 to-emerald-500', 
              'from-yellow-500 to-orange-500',
              'from-orange-500 to-red-500',
              'from-purple-500 to-pink-500'
            ];
            
            return (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stage.stage}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stage.count} deals
                    </span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${(stage.value / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${stageColors[index]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(5, (stage.value / maxValue) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${
          isDark ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-50 to-pink-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Win Rate
              </span>
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {dealArray.length > 0 ? Math.round((stageData[4].count / dealArray.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;