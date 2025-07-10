import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTheme } from '../../contexts/ThemeContext';
import { useDashboardLayout } from '../../contexts/DashboardLayoutContext';
import DashboardHeader from '../dashboard/DashboardHeader';
import KPICards from '../dashboard/KPICards';
import QuickActions from '../dashboard/QuickActions';
import DraggableComponent from '../DraggableComponent';

const ExecutiveOverviewSection: React.FC = () => {
  const { isDark } = useTheme();
  const { isDragModeEnabled } = useDashboardLayout();
  
  // Component order state for this section
  const [componentOrder, setComponentOrder] = useState([
    'dashboard-header',
    'kpi-cards',
    'quick-actions'
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(componentOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setComponentOrder(items);
  };

  const renderComponent = (componentId: string, index: number) => {
    switch (componentId) {
      case 'dashboard-header':
        return (
          <DraggableComponent
            key={componentId}
            componentId={componentId}
            index={index}
            title="Dashboard Header"
          >
            <DashboardHeader />
          </DraggableComponent>
        );
      case 'kpi-cards':
        return (
          <DraggableComponent
            key={componentId}
            componentId={componentId}
            index={index}
            title="KPI Cards"
          >
            <div className="mb-8">
              <KPICards />
            </div>
          </DraggableComponent>
        );
      case 'quick-actions':
        return (
          <DraggableComponent
            key={componentId}
            componentId={componentId}
            index={index}
            title="Quick Actions"
          >
            <div className="mb-8">
              <QuickActions />
            </div>
          </DraggableComponent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="executive-overview-components">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`w-full ${isDragModeEnabled ? 'pl-12' : ''}`}
            >
              {componentOrder.map((componentId, index) => 
                renderComponent(componentId, index)
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ExecutiveOverviewSection;