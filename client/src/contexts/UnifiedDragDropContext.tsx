import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface ComponentPosition {
  sectionId: string;
  componentId: string;
  order: number;
}

interface UnifiedDragDropContextType {
  componentPositions: Record<string, ComponentPosition[]>;
  moveComponent: (componentId: string, fromSection: string, toSection: string, newIndex: number) => void;
  getComponentsForSection: (sectionId: string) => ComponentPosition[];
}

const UnifiedDragDropContext = createContext<UnifiedDragDropContextType | undefined>(undefined);

export const useUnifiedDragDrop = () => {
  const context = useContext(UnifiedDragDropContext);
  if (!context) {
    throw new Error('useUnifiedDragDrop must be used within a UnifiedDragDropProvider');
  }
  return context;
};

interface UnifiedDragDropProviderProps {
  children: ReactNode;
}

// Initial component positions - components are assigned to their default sections
const initialComponentPositions: Record<string, ComponentPosition[]> = {
  'executive-overview-section': [
    { sectionId: 'executive-overview-section', componentId: 'dashboard-header', order: 0 },
    { sectionId: 'executive-overview-section', componentId: 'kpi-cards-avatars', order: 1 },
    { sectionId: 'executive-overview-section', componentId: 'quick-actions', order: 2 },
    { sectionId: 'executive-overview-section', componentId: 'metrics-cards', order: 3 }
  ],
  'ai-smart-features-hub': [
    { sectionId: 'ai-smart-features-hub', componentId: 'smart-ai-controls', order: 0 },
    { sectionId: 'ai-smart-features-hub', componentId: 'ai-model-usage', order: 1 },
    { sectionId: 'ai-smart-features-hub', componentId: 'live-deal-analysis', order: 2 },
    { sectionId: 'ai-smart-features-hub', componentId: 'smart-search', order: 3 }
  ],
  'sales-pipeline-deal-analytics': [
    { sectionId: 'sales-pipeline-deal-analytics', componentId: 'charts-section', order: 0 },
    { sectionId: 'sales-pipeline-deal-analytics', componentId: 'deal-analytics', order: 1 }
  ],
  'customer-lead-management': [
    { sectionId: 'customer-lead-management', componentId: 'new-leads', order: 0 },
    { sectionId: 'customer-lead-management', componentId: 'customer-profile', order: 1 }
  ],
  'activities-communications': [
    { sectionId: 'activities-communications', componentId: 'tasks-funnel', order: 0 },
    { sectionId: 'activities-communications', componentId: 'appointment-widget', order: 1 },
    { sectionId: 'activities-communications', componentId: 'interaction-history', order: 2 },
    { sectionId: 'activities-communications', componentId: 'recent-activity', order: 3 }
  ],
  'integrations-system': [
    { sectionId: 'integrations-system', componentId: 'connected-apps', order: 0 },
    { sectionId: 'integrations-system', componentId: 'ai-model-selector', order: 1 }
  ]
};

export const UnifiedDragDropProvider: React.FC<UnifiedDragDropProviderProps> = ({ children }) => {
  const [componentPositions, setComponentPositions] = useState(initialComponentPositions);

  const moveComponent = (componentId: string, fromSection: string, toSection: string, newIndex: number) => {
    setComponentPositions(prev => {
      const newPositions = { ...prev };
      
      // Remove component from source section
      if (fromSection && newPositions[fromSection]) {
        newPositions[fromSection] = newPositions[fromSection]
          .filter(pos => pos.componentId !== componentId)
          .map((pos, idx) => ({ ...pos, order: idx }));
      }
      
      // Add component to destination section
      if (!newPositions[toSection]) {
        newPositions[toSection] = [];
      }
      
      const newPosition: ComponentPosition = {
        sectionId: toSection,
        componentId,
        order: newIndex
      };
      
      newPositions[toSection].splice(newIndex, 0, newPosition);
      
      // Reorder components in destination section
      newPositions[toSection] = newPositions[toSection].map((pos, idx) => ({
        ...pos,
        order: idx
      }));
      
      return newPositions;
    });
  };

  const getComponentsForSection = (sectionId: string) => {
    return componentPositions[sectionId] || [];
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceDroppableId = result.source.droppableId;
    const destDroppableId = result.destination.droppableId;
    const componentId = result.draggableId;
    
    // Handle section-level drag operations (for dashboard sections)
    if (sourceDroppableId === 'dashboard-sections' && destDroppableId === 'dashboard-sections') {
      // This is handled by the dashboard's own reorderSections function
      return;
    }
    
    // Handle component-level drag operations (between sections)
    moveComponent(
      componentId,
      sourceDroppableId,
      destDroppableId,
      result.destination.index
    );
  };

  return (
    <UnifiedDragDropContext.Provider value={{
      componentPositions,
      moveComponent,
      getComponentsForSection
    }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
    </UnifiedDragDropContext.Provider>
  );
};