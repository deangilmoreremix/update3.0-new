import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import DraggableSection from './DraggableSection';
import DashboardLayoutControls from './DashboardLayoutControls';
import SalesToolsLauncher from './sales/SalesToolsLauncher';

// Import section components
import ExecutiveOverviewSection from './sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from './sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from './sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from './sections/CustomerLeadManagement';
import ActivitiesCommunications from './sections/ActivitiesCommunications';
import IntegrationsSystem from './sections/IntegrationsSystem';
import UnifiedDashboard from './UnifiedDashboard';

// Keep legacy components for backward compatibility
import MetricsCards from './dashboard/MetricsCards';
import InteractionHistory from './dashboard/InteractionHistory';
import TasksAndFunnel from './dashboard/TasksAndFunnel';
import CustomerProfile from './dashboard/CustomerProfile';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
import ChartsSection from './dashboard/ChartsSection';
import ConnectedApps from './dashboard/ConnectedApps';
import AIInsightsPanel from './dashboard/AIInsightsPanel';
import NewLeadsSection from './dashboard/NewLeadsSection';
import KPICards from './dashboard/KPICards';
import QuickActions from './dashboard/QuickActions';



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
  const { openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder, reorderSections, isDragModeEnabled } = useDashboardLayout();
  
  const gemini = useGemini();
  
  // Prevent repeated data fetching by using a ref to track initialization
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Only fetch data once
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // Fetch all data when component mounts
    fetchDeals();
    fetchContacts();
    
    // Wrap in try/catch to prevent errors from breaking the app
    try {
      fetchTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    
    try {
      fetchAppointments();
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    
    // Set up timer to refresh data periodically
    const intervalId = window.setInterval(() => {
      fetchDeals();
      fetchContacts();
    }, 300000); // Refresh every 5 minutes

    // Proper cleanup
    return () => window.clearInterval(intervalId);
  }, []);
  
  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result);
    
    if (!result.destination) {
      return;
    }
    
    if (result.destination.index === result.source.index) {
      return;
    }
    
    reorderSections(result.source.index, result.destination.index);
  };
  
  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      // Check if section component exists before rendering
      case 'executive-overview-section':
        return typeof ExecutiveOverviewSection === 'function' ? <ExecutiveOverviewSection /> : null;

      case 'ai-smart-features-hub':
        return typeof AISmartFeaturesHub === 'function' ? <AISmartFeaturesHub /> : null;

      case 'sales-pipeline-deal-analytics':
        return typeof SalesPipelineDealAnalytics === 'function' ? <SalesPipelineDealAnalytics /> : null;

      case 'customer-lead-management':
        return typeof CustomerLeadManagement === 'function' ? <CustomerLeadManagement /> : null;

      case 'activities-communications':
        return typeof ActivitiesCommunications === 'function' ? <ActivitiesCommunications /> : null;

      case 'integrations-system':
        return typeof IntegrationsSystem === 'function' ? <IntegrationsSystem /> : null;

      // Legacy sections (kept for backward compatibility)
      case 'metrics-cards-section':
        return <MetricsCards />;

      case 'kpi-cards-section':
        return <KPICards />;

      case 'quick-actions-section':
        return <QuickActions />;
        
      case 'ai-insights-section':
        return <AIInsightsPanel />;

      case 'interaction-history-section':
        return <InteractionHistory />;

      case 'customer-profile-section':
        return <CustomerProfile />;

      case 'recent-activity-section':
        return <RecentActivity />;

      case 'tasks-and-funnel-section':
        return <TasksAndFunnel />;

      case 'charts-section':
        return <ChartsSection />;

      case 'analytics-section':
        return <ChartsSection />;

      case 'apps-section':
        return <ConnectedApps />;

      default:
        return null;
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-900">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Layout Controls */}
        <DashboardLayoutControls />
        
        {/* Drag Mode Indicator */}
        {isDragModeEnabled && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              🔄 <strong>Drag Mode Active:</strong> You can now drag individual components between sections
            </p>
          </div>
        )}

        {/* Render UnifiedDashboard in drag mode for cross-section dragging */}
        {isDragModeEnabled ? (
          <UnifiedDashboard />
        ) : (
          /* Normal Dashboard Sections (no cross-section dragging) */
          <DragDropContext 
            onDragEnd={handleDragEnd}
            onDragStart={() => console.log('Drag started!')}
          >
            <Droppable droppableId="dashboard-sections">
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-6 pb-20`}
                >
                  {sectionOrder.map((sectionId, index) => (
                    <DraggableSection
                      key={sectionId}
                      sectionId={sectionId}
                      index={index}
                    >
                      <div id={sectionId} className="w-full">
                        {renderSectionContent(sectionId)}
                      </div>
                    </DraggableSection>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        {/* Sales Tools Floating Action Button */}
        <SalesToolsLauncher variant="fab" />
      </div>
    </main>
  );
});

export default Dashboard;