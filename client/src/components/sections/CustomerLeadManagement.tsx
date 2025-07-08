import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Users, UserPlus } from 'lucide-react';
import CustomerProfile from '../dashboard/CustomerProfile';
import RecentActivity from '../dashboard/RecentActivity';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-3">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your customer relationships and track lead progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Profile */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <CustomerProfile />
        </div>
        
        {/* Recent Activity */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default CustomerLeadManagement;