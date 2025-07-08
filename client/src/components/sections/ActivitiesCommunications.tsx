import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckSquare, Calendar, MessageSquare } from 'lucide-react';
import TasksAndFunnel from '../dashboard/TasksAndFunnel';
import InteractionHistory from '../dashboard/InteractionHistory';
import RecentActivity from '../dashboard/RecentActivity';

const ActivitiesCommunications: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Activities & Communications</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Task management and communication tracking
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Tasks & Funnel */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <CheckSquare className={`h-5 w-5 mr-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks & Funnel</h3>
          </div>
          <TasksAndFunnel />
        </div>

        {/* Interaction History */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <MessageSquare className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Interaction History</h3>
          </div>
          <InteractionHistory />
        </div>

        {/* Recent Activity */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <Calendar className={`h-5 w-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          </div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default ActivitiesCommunications;