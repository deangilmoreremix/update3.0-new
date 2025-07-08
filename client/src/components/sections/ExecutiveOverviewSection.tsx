import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { useTaskStore } from '../../store/taskStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { DollarSign, Users, Target, TrendingUp, BarChart3, Activity } from 'lucide-react';

const ExecutiveOverviewSection: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();
  
  const totalRevenue = Object.values(deals).reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = totalRevenue / Math.max(Object.keys(deals).length, 1);
  const pipelineValue = Object.values(deals).filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).reduce((sum, deal) => sum + deal.value, 0);
  const contactCount = Object.keys(contacts).length;
  const taskCount = Object.keys(tasks).length;
  const appointmentCount = Object.keys(appointments).length;
  
  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Executive Overview</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>High-level business metrics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Live Data</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} border ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+12.5% from last month</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' : 'bg-gradient-to-r from-green-50 to-emerald-50'} border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>Active Pipeline</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${pipelineValue.toLocaleString()}</p>
            </div>
            <Target className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
          </div>
          <div className="mt-2 flex items-center">
            <BarChart3 className="w-4 h-4 text-blue-500 mr-1" />
            <span className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{Object.keys(deals).length} deals in pipeline</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50'} border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Total Contacts</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{contactCount}</p>
            </div>
            <Users className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+{Math.floor(contactCount * 0.08)} this week</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' : 'bg-gradient-to-r from-orange-50 to-red-50'} border ${isDark ? 'border-orange-800' : 'border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>Avg Deal Size</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${avgDealSize.toLocaleString()}</p>
            </div>
            <Activity className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+8.2% improvement</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} text-center`}>
          <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{taskCount}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Tasks</p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} text-center`}>
          <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{appointmentCount}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming Meetings</p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} text-center`}>
          <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round((pipelineValue / (totalRevenue + pipelineValue)) * 100)}%
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pipeline Conversion</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOverviewSection;