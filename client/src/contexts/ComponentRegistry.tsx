import React, { createContext, useContext, ReactNode } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPICards from '../components/dashboard/KPICards';
import QuickActions from '../components/dashboard/QuickActions';
import MetricsCards from '../components/dashboard/MetricsCards';
import NewLeadsSection from '../components/dashboard/NewLeadsSection';
import CustomerProfile from '../components/dashboard/CustomerProfile';
import TasksAndFunnel from '../components/dashboard/TasksAndFunnel';
import InteractionHistory from '../components/dashboard/InteractionHistory';
import AppointmentWidget from '../components/AppointmentWidget';
import RecentActivity from '../components/dashboard/RecentActivity';
// AI components with correct paths
import { SmartAIControls } from '../components/ai/SmartAIControls';
import AIModelUsageStats from '../components/AIModelUsageStats';
import LiveDealAnalysis from '../components/aiTools/LiveDealAnalysis';
import SmartSearchRealtime from '../components/aiTools/SmartSearchRealtime';
import ChartsSection from '../components/dashboard/ChartsSection';
import DealAnalytics from '../components/DealAnalytics';
import ConnectedApps from '../components/dashboard/ConnectedApps';
import AIModelSelector from '../components/AIModelSelector';

export interface ComponentConfig {
  id: string;
  component: React.ComponentType;
  title: string;
  category: string;
  defaultSection?: string;
  gridSpan?: string;
}

const componentRegistry: Record<string, ComponentConfig> = {
  'dashboard-header': {
    id: 'dashboard-header',
    component: DashboardHeader,
    title: 'Dashboard Header',
    category: 'header',
    defaultSection: 'executive-overview-section'
  },
  'kpi-cards': {
    id: 'kpi-cards',
    component: KPICards,
    title: 'KPI Cards',
    category: 'metrics',
    defaultSection: 'executive-overview-section'
  },
  'quick-actions': {
    id: 'quick-actions',
    component: QuickActions,
    title: 'Quick Actions',
    category: 'actions',
    defaultSection: 'executive-overview-section'
  },
  'metrics-cards': {
    id: 'metrics-cards',
    component: MetricsCards,
    title: 'Metrics Cards',
    category: 'metrics',
    defaultSection: 'executive-overview-section'
  },
  'new-leads': {
    id: 'new-leads',
    component: NewLeadsSection,
    title: 'New Leads',
    category: 'contacts',
    defaultSection: 'customer-lead-management',
    gridSpan: 'lg:col-span-2'
  },
  'customer-profile': {
    id: 'customer-profile',
    component: CustomerProfile,
    title: 'Customer Profile',
    category: 'contacts',
    defaultSection: 'customer-lead-management',
    gridSpan: 'lg:col-span-1'
  },
  'tasks-funnel': {
    id: 'tasks-funnel',
    component: TasksAndFunnel,
    title: 'Tasks & Funnel',
    category: 'tasks',
    defaultSection: 'activities-communications'
  },
  'interaction-history': {
    id: 'interaction-history',
    component: InteractionHistory,
    title: 'Interaction History',
    category: 'communications',
    defaultSection: 'activities-communications'
  },
  'appointment-widget': {
    id: 'appointment-widget',
    component: AppointmentWidget,
    title: 'Appointments',
    category: 'calendar',
    defaultSection: 'activities-communications'
  },
  'recent-activity': {
    id: 'recent-activity',
    component: RecentActivity,
    title: 'Recent Activity',
    category: 'activity',
    defaultSection: 'activities-communications'
  },
  'smart-ai-controls': {
    id: 'smart-ai-controls',
    component: SmartAIControls,
    title: 'AI Controls',
    category: 'ai',
    defaultSection: 'ai-smart-features-hub'
  },
  'ai-model-usage': {
    id: 'ai-model-usage',
    component: AIModelUsageStats,
    title: 'AI Model Usage',
    category: 'ai',
    defaultSection: 'ai-smart-features-hub'
  },
  'live-deal-analysis': {
    id: 'live-deal-analysis',
    component: LiveDealAnalysis,
    title: 'Live Deal Analysis',
    category: 'ai',
    defaultSection: 'ai-smart-features-hub'
  },
  'smart-search': {
    id: 'smart-search',
    component: SmartSearchRealtime,
    title: 'Smart Search',
    category: 'ai',
    defaultSection: 'ai-smart-features-hub'
  },
  'charts-section': {
    id: 'charts-section',
    component: ChartsSection,
    title: 'Charts',
    category: 'analytics',
    defaultSection: 'sales-pipeline-deal-analytics'
  },
  'deal-analytics': {
    id: 'deal-analytics',
    component: DealAnalytics,
    title: 'Deal Analytics',
    category: 'analytics',
    defaultSection: 'sales-pipeline-deal-analytics'
  },
  'connected-apps': {
    id: 'connected-apps',
    component: ConnectedApps,
    title: 'Connected Apps',
    category: 'integrations',
    defaultSection: 'integrations-system'
  },
  'ai-model-selector': {
    id: 'ai-model-selector',
    component: AIModelSelector,
    title: 'AI Model Selector',
    category: 'ai',
    defaultSection: 'integrations-system'
  }
};

interface ComponentRegistryContextType {
  getComponent: (id: string) => ComponentConfig | undefined;
  getAllComponents: () => ComponentConfig[];
  getComponentsByCategory: (category: string) => ComponentConfig[];
  getComponentsBySection: (sectionId: string) => ComponentConfig[];
}

const ComponentRegistryContext = createContext<ComponentRegistryContextType | undefined>(undefined);

export const useComponentRegistry = () => {
  const context = useContext(ComponentRegistryContext);
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider');
  }
  return context;
};

export const ComponentRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getComponent = (id: string) => componentRegistry[id];
  
  const getAllComponents = () => Object.values(componentRegistry);
  
  const getComponentsByCategory = (category: string) => 
    Object.values(componentRegistry).filter(comp => comp.category === category);
  
  const getComponentsBySection = (sectionId: string) => 
    Object.values(componentRegistry).filter(comp => comp.defaultSection === sectionId);

  return (
    <ComponentRegistryContext.Provider value={{
      getComponent,
      getAllComponents,
      getComponentsByCategory,
      getComponentsBySection
    }}>
      {children}
    </ComponentRegistryContext.Provider>
  );
};

export default componentRegistry;