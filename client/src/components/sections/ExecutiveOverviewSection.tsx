import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import DashboardHeader from '../dashboard/DashboardHeader';
import KPICards from '../dashboard/KPICards';
import QuickActions from '../dashboard/QuickActions';
import AIGoalsCard from '../AIGoalsCard';

const ExecutiveOverviewSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-3">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Executive Overview</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Key metrics and performance indicators
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <DashboardHeader />
        <KPICards />
        <QuickActions />
        <AIGoalsCard />
      </div>
    </div>
  );
};

export default ExecutiveOverviewSection;