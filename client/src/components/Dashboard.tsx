import React, { useState, useEffect } from 'react';
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

// Import section components
import ExecutiveOverviewSection from './sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from './sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from './sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from './sections/CustomerLeadManagement';
import ActivitiesCommunications from './sections/ActivitiesCommunications';
import IntegrationsSystem from './sections/IntegrationsSystem';



const Dashboard: React.FC = () => {
  const { 
    deals, 
    stageValues,
    totalPipelineValue 
  } = useDealStore();
  
  const { 
    contacts 
  } = useContactStore();
  
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();
  const { openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder, reorderSections } = useDashboardLayout();
  
  const gemini = useGemini();
  
  useEffect(() => {
    // All data is pre-loaded in the stores via mock data
    // Periodic refresh can be added when connecting to real APIs
    const dealsList = Object.values(deals);
    const contactsList = Object.values(contacts);
    console.log('Dashboard mounted with', dealsList.length, 'deals and', contactsList.length, 'contacts');
  }, [deals, contacts]);
  
  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
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
      case 'executive-overview-section':
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



      default:
        return null;
    }
  };

  return (
    <main className="w-full h-full overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Dashboard Layout Controls */}
      <DashboardLayoutControls />

      {/* Draggable Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-sections">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-8 pb-20"
            >
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
};

export default Dashboard;