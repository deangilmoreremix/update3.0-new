import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTheme } from '../../contexts/ThemeContext';
import { useAITools } from '../AIToolsProvider';
import { useDashboardLayout } from '../../contexts/DashboardLayoutContext';
import { Users, UserPlus } from 'lucide-react';

import NewLeadsSection from '../dashboard/NewLeadsSection';
import CustomerProfile from '../dashboard/CustomerProfile';
import DraggableComponent from '../DraggableComponent';
import SalesToolsLauncher from '../sales/SalesToolsLauncher';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();
  const { openTool } = useAITools();
  const { isDragModeEnabled } = useDashboardLayout();

  // Component order state
  const [componentOrder, setComponentOrder] = useState([
    'new-leads',
    'customer-profile'
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
      case 'new-leads':
        return (
          <DraggableComponent
            key={componentId}
            componentId={componentId}
            index={index}
            title="New Leads"
          >
            <div className="lg:col-span-2">
              <NewLeadsSection />
            </div>
          </DraggableComponent>
        );
      case 'customer-profile':
        return (
          <DraggableComponent
            key={componentId}
            componentId={componentId}
            index={index}
            title="Customer Profile"
          >
            <div className="lg:col-span-1">
              <CustomerProfile />
            </div>
          </DraggableComponent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and nurture your prospect relationships
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <SalesToolsLauncher
            variant="dropdown"
            className="flex items-center space-x-2"
          />
          <button 
            onClick={() => openTool('contact-manager')}
            className={`flex items-center space-x-2 px-4 py-2 ${
            isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          } rounded-lg transition-colors`}>
            <UserPlus size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="customer-lead-components" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid grid-cols-1 lg:grid-cols-3 gap-4 w-full ${isDragModeEnabled ? 'pl-12' : ''}`}
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

export default CustomerLeadManagement;