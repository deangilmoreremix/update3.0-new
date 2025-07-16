import React from 'react';
import DashboardHeader from '../modules/dashboard-v3/src/components/dashboard/DashboardHeader';
import KPICards from '../modules/dashboard-v3/src/components/dashboard/KPICards';
import MetricsCards from '../modules/dashboard-v3/src/components/dashboard/MetricsCards';
import ChartsSection from '../modules/dashboard-v3/src/components/dashboard/ChartsSection';
import QuickActions from '../modules/dashboard-v3/src/components/dashboard/QuickActions';
import RecentActivity from '../modules/dashboard-v3/src/components/dashboard/RecentActivity';
import TasksAndFunnel from '../modules/dashboard-v3/src/components/dashboard/TasksAndFunnel';
import NewLeadsSection from '../modules/dashboard-v3/src/components/dashboard/NewLeadsSection';
import AIInsightsPanel from '../modules/dashboard-v3/src/components/dashboard/AIInsightsPanel';
import CustomerProfile from '../modules/dashboard-v3/src/components/dashboard/CustomerProfile';
import InteractionHistory from '../modules/dashboard-v3/src/components/dashboard/InteractionHistory';
import ConnectedApps from '../modules/dashboard-v3/src/components/dashboard/ConnectedApps';

const DashboardV3: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardHeader />
        
        {/* KPI Overview */}
        <div className="mb-8">
          <KPICards />
        </div>
        
        {/* Metrics and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MetricsCards />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
        
        {/* Charts and Analytics */}
        <div className="mb-8">
          <ChartsSection />
        </div>
        
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <TasksAndFunnel />
          </div>
          <div>
            <NewLeadsSection />
          </div>
          <div>
            <AIInsightsPanel />
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div>
            <RecentActivity />
          </div>
          <div>
            <CustomerProfile />
          </div>
          <div>
            <InteractionHistory />
          </div>
          <div>
            <ConnectedApps />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV3;
