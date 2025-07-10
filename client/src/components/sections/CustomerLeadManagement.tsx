import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Users, Plus } from 'lucide-react';
import NewLeadsSection from '../dashboard/NewLeadsSection';
import CustomerProfile from '../dashboard/CustomerProfile';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Contact profiles and lead nurturing tools
            </p>
          </div>
        </div>
        <button className={`flex items-center px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors`}>
          <Plus size={16} className="mr-2" />
          Add Contact
        </button>
      </div>

      {/* Three column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Leads Section - 2 columns */}
        <div className="lg:col-span-2">
          <NewLeadsSection />
        </div>
        
        {/* Customer Profile Section - 1 column */}
        <div className="lg:col-span-1">
          <CustomerProfile />
        </div>
      </div>

      {/* Lead Sources and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-4`}>
          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Website Leads</h4>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>45%</p>
          <p className="text-sm text-green-600">+5% this month</p>
        </div>
        
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-4`}>
          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Referrals</h4>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>30%</p>
          <p className="text-sm text-blue-600">+2% this month</p>
        </div>
        
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-4`}>
          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Social Media</h4>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>25%</p>
          <p className="text-sm text-purple-600">+3% this month</p>
        </div>
        
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-4`}>
          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Total Contacts</h4>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1,247</p>
          <p className="text-sm text-green-600">+87 this month</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLeadManagement;