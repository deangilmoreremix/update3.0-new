import React, { createContext, useContext, useState, useEffect } from 'react';

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ReactNode;
  color: string;
}

interface DashboardLayoutContextType {
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedItem: string | null;
  setDraggedItem: (item: string | null) => void;
  getSectionConfig: (id: string) => SectionConfig | undefined;
  reorderSections: (startIndex: number, endIndex: number) => void;
  resetToDefault: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const useDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider');
  }
  return context;
};

// Updated defaultSectionOrder with new sections
const defaultSectionOrder = [
  'executive-overview-section',
  'ai-smart-features-hub',
  'sales-pipeline-deal-analytics',
  'customer-lead-management', 
  'activities-communications',
  'integrations-system'
];

// Updated sectionConfigs with new sections
const sectionConfigs: Record<string, SectionConfig> = {
  // New main sections
  'executive-overview-section': {
    id: 'executive-overview-section',
    title: 'Executive Overview',
    description: 'High-level dashboard with KPIs and quick actions',
    icon: 'BarChart3',
    component: null,
    color: 'from-blue-500 to-green-500'
  },
  'ai-smart-features-hub': {
    id: 'ai-smart-features-hub',
    title: 'AI Smart Features Hub',
    description: 'AI-powered insights and tools for enhanced productivity',
    icon: 'Brain',
    component: null,
    color: 'from-purple-500 to-indigo-500'
  },
  'sales-pipeline-deal-analytics': {
    id: 'sales-pipeline-deal-analytics',
    title: 'Sales Pipeline & Analytics',
    description: 'Comprehensive pipeline management and performance metrics',
    icon: 'BarChart3',
    component: null,
    color: 'from-green-500 to-emerald-500'
  },
  'customer-lead-management': {
    id: 'customer-lead-management',
    title: 'Customer & Lead Management',
    description: 'Contact profiles and lead nurturing tools',
    icon: 'Users',
    component: null,
    color: 'from-blue-500 to-cyan-500'
  },
  'activities-communications': {
    id: 'activities-communications',
    title: 'Activities & Communications',
    description: 'Task management and communication tracking',
    icon: 'CheckSquare',
    component: null,
    color: 'from-orange-500 to-red-500'
  },
  'integrations-system': {
    id: 'integrations-system',
    title: 'Integrations & System',
    description: 'Connected apps and system settings',
    icon: 'Grid3X3',
    component: null,
    color: 'from-gray-500 to-gray-700'
  },
  
  // Original sections (kept for backward compatibility)
  'kpi-cards-section': {
    id: 'kpi-cards-section',
    title: 'Key Performance Indicators',
    description: 'High-level business metrics overview',
    icon: 'BarChart3',
    component: null,
    color: 'from-blue-500 to-green-500'
  },
  'quick-actions-section': {
    id: 'quick-actions-section',
    title: 'Quick Actions',
    description: 'Fast access to common tasks',
    icon: 'Zap',
    component: null,
    color: 'from-green-500 to-teal-500'
  },
  'ai-insights-section': {
    id: 'ai-insights-section',
    title: 'AI Pipeline Intelligence',
    description: 'AI-powered analysis and recommendations',
    icon: 'Brain',
    component: null,
    color: 'from-purple-500 to-indigo-500'
  },
  'metrics-cards-section': {
    id: 'metrics-cards-section',
    title: 'Key Performance Metrics',
    description: 'Overview of critical business metrics',
    icon: 'BarChart3',
    component: null,
    color: 'from-green-500 to-blue-500'
  },
  'pipeline-section': {
    id: 'pipeline-section',
    title: 'Pipeline & Deal Analytics',
    description: 'Comprehensive deal performance and pipeline health',
    icon: 'BarChart3',
    component: null,
    color: 'from-green-500 to-emerald-500'
  },
  'contacts-section': {
    id: 'contacts-section',
    title: 'Contacts & Leads Management',
    description: 'Manage and nurture your prospect relationships',
    icon: 'Users',
    component: null,
    color: 'from-blue-500 to-cyan-500'
  },
  'interaction-history-section': {
    id: 'interaction-history-section',
    title: 'Interaction History',
    description: 'Recent contact interactions and communications',
    icon: 'MessageSquare',
    component: null,
    color: 'from-blue-500 to-purple-500'
  },
  'customer-profile-section': {
    id: 'customer-profile-section',
    title: 'Customer Profile Overview',
    description: 'Detailed customer insights and profile management',
    icon: 'User',
    component: null,
    color: 'from-indigo-500 to-purple-500'
  },
  'recent-activity-section': {
    id: 'recent-activity-section',
    title: 'Recent Activity Feed',
    description: 'Latest updates and activity across the system',
    icon: 'Activity',
    component: null,
    color: 'from-orange-500 to-red-500'
  },
  'tasks-and-funnel-section': {
    id: 'tasks-and-funnel-section',
    title: 'Tasks & Funnel Tracking',
    description: 'Task management and sales funnel optimization',
    icon: 'CheckSquare',
    component: null,
    color: 'from-green-500 to-teal-500'
  },
  'charts-section': {
    id: 'charts-section',
    title: 'Analytics & Charts',
    description: 'Visual data representation and performance charts',
    icon: 'BarChart3',
    component: null,
    color: 'from-blue-500 to-indigo-500'
  },
  'analytics-section': {
    id: 'analytics-section',
    title: 'Business Analytics',
    description: 'Comprehensive business performance analysis',
    icon: 'TrendingUp',
    component: null,
    color: 'from-purple-500 to-pink-500'
  },
  'apps-section': {
    id: 'apps-section',
    title: 'Connected Apps',
    description: 'Integrated third-party applications and tools',
    icon: 'Grid3X3',
    component: null,
    color: 'from-gray-500 to-gray-700'
  }
};

export const DashboardLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboardSectionOrder');
    return saved ? JSON.parse(saved) : defaultSectionOrder;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Save to localStorage whenever order changes
  useEffect(() => {
    localStorage.setItem('dashboardSectionOrder', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const getSectionConfig = (id: string): SectionConfig | undefined => {
    return sectionConfigs[id];
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(startIndex, 1);
    newOrder.splice(endIndex, 0, removed);
    setSectionOrder(newOrder);
  };

  const resetToDefault = () => {
    setSectionOrder(defaultSectionOrder);
    localStorage.removeItem('dashboardSectionOrder');
  };

  const value: DashboardLayoutContextType = {
    sectionOrder,
    setSectionOrder,
    isDragging,
    setIsDragging,
    draggedItem,
    setDraggedItem,
    getSectionConfig,
    reorderSections,
    resetToDefault
  };

  return (
    <DashboardLayoutContext.Provider value={value}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};