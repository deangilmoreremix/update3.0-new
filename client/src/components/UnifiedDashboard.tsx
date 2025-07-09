import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useUnifiedDragDrop } from '../contexts/UnifiedDragDropContext';
import { useComponentRegistry } from '../contexts/ComponentRegistry';
import { GripVertical } from 'lucide-react';

// Import all section components
import DashboardHeader from './dashboard/DashboardHeader';
import KPICardsWithAvatars from './dashboard/KPICardsWithAvatars';
import QuickActions from './dashboard/QuickActions';
import MetricsCards from './dashboard/MetricsCards';
import { SmartAIControls } from './ai/SmartAIControls';
import AIModelUsageStats from './AIModelUsageStats';
import LiveDealAnalysis from './aiTools/LiveDealAnalysis';
import SmartSearchRealtime from './aiTools/SmartSearchRealtime';
import ChartsSection from './dashboard/ChartsSection';
import DealAnalytics from './DealAnalytics';
import NewLeadsSection from './dashboard/NewLeadsSection';
import CustomerProfile from './dashboard/CustomerProfile';
import TasksAndFunnel from './dashboard/TasksAndFunnel';
import AppointmentWidget from './AppointmentWidget';
import InteractionHistory from './dashboard/InteractionHistory';
import RecentActivity from './dashboard/RecentActivity';
import ConnectedApps from './dashboard/ConnectedApps';
import AIModelSelector from './AIModelSelector';

interface SectionProps {
  sectionId: string;
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ sectionId, title, icon, children }) => {
  const { isDark } = useTheme();
  const { isDragModeEnabled } = useDashboardLayout();
  const { getComponentsForSection } = useUnifiedDragDrop();
  const { getComponent } = useComponentRegistry();
  
  const components = getComponentsForSection(sectionId);
  
  const renderComponent = (componentId: string) => {
    switch (componentId) {
      case 'dashboard-header':
        return <DashboardHeader />;
      case 'kpi-cards-avatars':
        return <KPICardsWithAvatars />;
      case 'quick-actions':
        return <QuickActions />;
      case 'metrics-cards':
        return <MetricsCards />;
      case 'smart-ai-controls':
        return <SmartAIControls />;
      case 'ai-model-usage':
        return <AIModelUsageStats />;
      case 'live-deal-analysis':
        return <LiveDealAnalysis />;
      case 'smart-search':
        return <SmartSearchRealtime />;
      case 'charts-section':
        return <ChartsSection />;
      case 'deal-analytics':
        return <DealAnalytics />;
      case 'new-leads':
        return <NewLeadsSection />;
      case 'customer-profile':
        return <CustomerProfile />;
      case 'tasks-funnel':
        return <TasksAndFunnel />;
      case 'appointment-widget':
        return <AppointmentWidget />;
      case 'interaction-history':
        return <InteractionHistory />;
      case 'recent-activity':
        return <RecentActivity />;
      case 'connected-apps':
        return <ConnectedApps />;
      case 'ai-model-selector':
        return <AIModelSelector />;
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {icon}
          <div className="ml-3">
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            {isDragModeEnabled && (
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Drag components here from other sections
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Droppable droppableId={sectionId} type="component">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[300px] rounded-lg p-6 transition-all duration-200
              ${snapshot.isDraggingOver 
                ? (isDark ? 'bg-blue-500/10 border-2 border-dashed border-blue-500 scale-[1.02]' : 'bg-blue-50 border-2 border-dashed border-blue-300 scale-[1.02]')
                : (isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200')
              }
            `}
          >
            <div className="flex flex-wrap gap-6">
              {components.map((component, index) => {
                const config = getComponent(component.componentId);
                if (!config) return null;
                
                // Determine component width based on type
                const isWideComponent = component.componentId === 'new-leads' || 
                                       component.componentId === 'tasks-funnel' ||
                                       component.componentId === 'charts-section' ||
                                       component.componentId === 'smart-ai-controls';
                
                return (
                  <Draggable
                    key={component.componentId}
                    draggableId={component.componentId}
                    index={index}
                    isDragDisabled={!isDragModeEnabled}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          relative transition-all
                          ${snapshot.isDragging ? 'opacity-90 scale-105 z-50' : ''}
                          ${isWideComponent ? 'w-full' : 'w-full lg:w-[calc(50%-12px)]'}
                        `}
                        style={{
                          ...provided.draggableProps.style,
                          minHeight: '200px'
                        }}
                      >
                        {isDragModeEnabled && (
                          <div
                            {...provided.dragHandleProps}
                            className={`
                              absolute left-2 top-2 p-2 rounded-lg cursor-move
                              ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                              transition-colors z-20 shadow-lg
                            `}
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                        )}
                        
                        <div className={`
                          ${isDragModeEnabled ? 'border-2 border-dashed border-blue-400 rounded-lg p-4' : ''}
                          h-full
                        `}>
                          {renderComponent(component.componentId)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
            {provided.placeholder}
            
            {/* Empty state */}
            {components.length === 0 && (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {isDragModeEnabled ? 'Drag components here' : 'No components in this section'}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const UnifiedDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  
  const sections = [
    {
      id: 'executive-overview-section',
      title: 'Executive Overview',
      icon: <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"><span className="text-white">📊</span></div>
    },
    {
      id: 'ai-smart-features-hub',
      title: 'AI Smart Features',
      icon: <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"><span className="text-white">🤖</span></div>
    },
    {
      id: 'sales-pipeline-deal-analytics',
      title: 'Sales Pipeline & Analytics',
      icon: <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl"><span className="text-white">📈</span></div>
    },
    {
      id: 'customer-lead-management',
      title: 'Customer & Lead Management',
      icon: <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"><span className="text-white">👥</span></div>
    },
    {
      id: 'activities-communications',
      title: 'Activities & Communications',
      icon: <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"><span className="text-white">📅</span></div>
    },
    {
      id: 'integrations-system',
      title: 'Integrations & System',
      icon: <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"><span className="text-white">🔧</span></div>
    }
  ];
  
  return (
    <div className="space-y-8">
      {sectionOrder.map(sectionId => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return null;
        
        return (
          <Section
            key={section.id}
            sectionId={section.id}
            title={section.title}
            icon={section.icon}
          />
        );
      })}
    </div>
  );
};

export default UnifiedDashboard;