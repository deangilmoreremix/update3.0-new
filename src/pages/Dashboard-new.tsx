import React, { useEffect } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';

// Import section components
import ExecutiveOverviewSection from '../components/sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from '../components/sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from '../components/sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from '../components/sections/CustomerLeadManagement';
import ActivitiesCommunications from '../components/sections/ActivitiesCommunications';
import IntegrationsSystem from '../components/sections/IntegrationsSystem';

// Dashboard component
const Dashboard: React.FC = React.memo(() => {
  // Get store data
  const { fetchDeals } = useDealStore();
  const { fetchContacts } = useContactStore();
  const { fetchTasks } = useTaskStore();
  const { fetchAppointments } = useAppointmentStore();

  // Theme and layout
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();

  // Initialize data
  useEffect(() => {
    fetchDeals();
    fetchContacts();
    fetchTasks();
    fetchAppointments();
  }, [fetchDeals, fetchContacts, fetchTasks, fetchAppointments]);

  // Define sections
  const sections = [
    { id: 'executive-overview', component: <ExecutiveOverviewSection /> },
    { id: 'ai-smart-features-hub', component: <AISmartFeaturesHub /> },
    { id: 'sales-pipeline-deal-analytics', component: <SalesPipelineDealAnalytics /> },
    { id: 'customer-lead-management', component: <CustomerLeadManagement /> },
    { id: 'activities-communications', component: <ActivitiesCommunications /> },
    { id: 'integrations-system', component: <IntegrationsSystem /> }
  ];

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Dashboard Sections */}
      <div className="space-y-6 p-6">
        {sections.map((section) => (
          <div key={section.id} className="w-full">
            {section.component}
          </div>
        ))}
      </div>
    </main>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
