import React, { useState, useEffect } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from '../components/AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import DraggableSection from '../components/DraggableSection';
import DashboardLayoutControls from '../components/DashboardLayoutControls';

// Import section components
import ExecutiveOverviewSection from '../components/sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from '../components/sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from '../components/sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from '../components/sections/CustomerLeadManagement';
import ActivitiesCommunications from '../components/sections/ActivitiesCommunications';
import IntegrationsSystem from '../components/sections/IntegrationsSystem';

// Keep legacy components for backward compatibility
import MetricsCards from '../components/dashboard/MetricsCards';
import InteractionHistory from '../components/dashboard/InteractionHistory';
import TasksAndFunnel from '../components/dashboard/TasksAndFunnel';
import CustomerProfile from '../components/dashboard/CustomerProfile';
import RecentActivity from '../components/dashboard/RecentActivity';
import ChartsSection from '../components/dashboard/ChartsSection';
import ConnectedApps from '../components/dashboard/ConnectedApps';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import NewLeadsSection from '../components/dashboard/NewLeadsSection';
import KPICards from '../components/dashboard/KPICards';
import QuickActions from '../components/dashboard/QuickActions';

// Memo Dashboard component to prevent unnecessary re-renders
const Dashboard: React.FC = React.memo(() => {
  const { 
    deals, 
    fetchDeals, 
    isLoading,
    stageValues,
    totalPipelineValue 
  } = useDealStore();
  
  const { 
    contacts, 
    fetchContacts, 
    isLoading: contactsLoading 
  } = useContactStore();
  
  const { tasks, fetchTasks } = useTaskStore();
  const { fetchAppointments } = useAppointmentStore();
  const { _openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  
  const _gemini = useGemini();
  
  const [pipelineInsight, setPipelineInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<unknown[]>([]);
  
  useEffect(() => {
    // Fetch deals data when component mounts
    fetchDeals();
    fetchTasks();
    fetchAppointments();
    fetchContacts();
    
    // Generate AI recommendations
    generateRecommendations();
    
    // Set up timer to refresh data periodically
    const intervalId = setInterval(() => {
      fetchDeals();
    }, 300000); // refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [fetchDeals, fetchTasks, fetchAppointments, fetchContacts]);
  
  const generateRecommendations = async () => {
    // Generate sample recommendations (in production this would call Gemini API)
    setAiRecommendations([
      {
        id: 1,
        title: 'Prioritize "Cloud Migration" deal',
        description: 'This high-value deal has been in qualification for 5 days with no activity',
        type: 'deal',
        priority: 'high',
        action: 'Schedule technical discussion',
        entityId: 'deal-5'
      },
      {
        id: 2,
        title: 'Follow up with Acme Inc',
        description: 'Your proposal was sent 7 days ago with no response',
        type: 'contact',
        priority: 'medium',
        action: 'Send follow-up email',
        entityId: '1'
      }
    ]);
  };

  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'executive-overview':
        return <ExecutiveOverviewSection />;
      case 'ai-smart-features-hub':
        return <AISmartFeaturesHub />;
      case 'sales-pipeline-deal-analytics':
        return <SalesPipelineDealAnalytics />;
      case 'customer-lead-management':
        return <CustomerLeadManagement />;
      case 'activities-communications':
        return <ActivitiesCommunications />;
      case 'integrations-system':
        return <IntegrationsSystem />;
      
      // Legacy sections for backward compatibility
      case 'kpi-cards-section':
        return <KPICards />;
      case 'quick-actions-section':
        return <QuickActions />;
      case 'ai-insights-section':
        return <AIInsightsPanel />;
      case 'metrics-cards-section':
        return <MetricsCards />;
      case 'pipeline-section':
        return <ChartsSection />;
      case 'contacts-section':
        return <CustomerProfile />;
      case 'interaction-history-section':
        return <InteractionHistory />;
      case 'tasks-section':
        return <TasksAndFunnel />;
      case 'customer-profile-section':
        return <CustomerProfile />;
      case 'recent-activity-section':
        return <RecentActivity />;
      case 'tasks-and-funnel-section':
        return <TasksAndFunnel />;
      case 'apps-section':
        return <ConnectedApps />;
      case 'charts-section':
        return <ChartsSection />;
      case 'analytics-section':
        return <ChartsSection />;
      case 'new-leads-section':
        return <NewLeadsSection />;
      
      default:
        return (
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Section "{sectionId}" not implemented yet.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="w-full h-full overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Dashboard Layout Controls */}
      <DashboardLayoutControls />

      {/* Draggable Sections */}
      <div className="space-y-8 pb-20">
        {sectionOrder.map((sectionId, index) => (
          <DraggableSection
            key={sectionId}
            sectionId={sectionId}
            index={index}
          >
            <div id={sectionId}>
              {renderSectionContent(sectionId)}
            </div>
          </DraggableSection>
        ))}
      </div>
    </main>
  );
});

export default Dashboard;
