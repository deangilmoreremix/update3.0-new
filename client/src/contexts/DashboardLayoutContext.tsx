import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType | null;
  color: string;
}

interface DashboardLayoutContextType {
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  sectionVisibility: Record<string, boolean>;
  setSectionVisibility: (visibility: Record<string, boolean>) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  sectionConfigs: Record<string, SectionConfig>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedItem: string | null;
  setDraggedItem: (item: string | null) => void;
  getSectionConfig: (id: string) => SectionConfig | undefined;
  reorderSections: (startIndex: number, endIndex: number) => void;
  resetToDefault: () => void;
  isDragModeEnabled: boolean;
  setDragModeEnabled: (enabled: boolean) => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const useDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider');
  }
  return context;
};

// Default section order - simplified to avoid duplicates
const defaultSectionOrder = [
  'executive-overview-section',
  'ai-smart-features-hub',
  'sales-pipeline-deal-analytics',
  'customer-lead-management',
  'activities-communications',
  'integrations-system'
];

// Section configurations
const sectionConfigs: Record<string, SectionConfig> = {
  'executive-overview-section': {
    id: 'executive-overview-section',
    title: 'Executive Overview',
    description: 'High-level business metrics and insights',
    icon: 'BarChart3',
    component: null,
    color: 'from-blue-500 to-indigo-500'
  },
  'kpi-cards-section': {
    id: 'kpi-cards-section',
    title: 'Key Performance Indicators',
    description: 'Essential business metrics at a glance',
    icon: 'TrendingUp',
    component: null,
    color: 'from-green-500 to-emerald-500'
  },
  'quick-actions-section': {
    id: 'quick-actions-section',
    title: 'Quick Actions',
    description: 'Frequently used CRM actions',
    icon: 'Zap',
    component: null,
    color: 'from-yellow-500 to-orange-500'
  },
  'ai-smart-features-hub': {
    id: 'ai-smart-features-hub',
    title: 'AI Smart Features Hub',
    description: 'Intelligent automation and insights',
    icon: 'Brain',
    component: null,
    color: 'from-purple-500 to-pink-500'
  },
  'sales-pipeline-deal-analytics': {
    id: 'sales-pipeline-deal-analytics',
    title: 'Sales Pipeline & Deal Analytics',
    description: 'Comprehensive sales performance tracking',
    icon: 'Target',
    component: null,
    color: 'from-green-500 to-teal-500'
  },
  'customer-lead-management': {
    id: 'customer-lead-management',
    title: 'Customer & Lead Management',
    description: 'Manage and nurture your prospect relationships',
    icon: 'Users',
    component: null,
    color: 'from-blue-500 to-cyan-500'
  },
  'activities-communications': {
    id: 'activities-communications',
    title: 'Activities & Communications',
    description: 'Task management and communication tracking',
    icon: 'MessageSquare',
    component: null,
    color: 'from-indigo-500 to-purple-500'
  },
  'ai-insights-section': {
    id: 'ai-insights-section',
    title: 'AI Insights & Recommendations',
    description: 'Machine learning powered business insights',
    icon: 'Lightbulb',
    component: null,
    color: 'from-amber-500 to-yellow-500'
  },
  'metrics-cards-section': {
    id: 'metrics-cards-section',
    title: 'Performance Metrics',
    description: 'Detailed performance tracking cards',
    icon: 'BarChart3',
    component: null,
    color: 'from-cyan-500 to-blue-500'
  },
  'integrations-system': {
    id: 'integrations-system',
    title: 'Integrations & System Tools',
    description: 'Connect with external tools and platforms',
    icon: 'Settings',
    component: null,
    color: 'from-gray-500 to-slate-500'
  },
  'interaction-history-section': {
    id: 'interaction-history-section',
    title: 'Interaction History',
    description: 'Recent contact interactions and communications',
    icon: 'MessageSquare',
    component: null,
    color: 'from-purple-500 to-blue-500'
  },
  'customer-profile-section': {
    id: 'customer-profile-section',
    title: 'Customer Profile',
    description: 'Detailed customer information and insights',
    icon: 'User',
    component: null,
    color: 'from-blue-500 to-indigo-500'
  },
  'recent-activity-section': {
    id: 'recent-activity-section',
    title: 'Recent Activity',
    description: 'Latest actions and events in your CRM',
    icon: 'Clock',
    component: null,
    color: 'from-gray-500 to-gray-600'
  },
  'tasks-and-funnel-section': {
    id: 'tasks-and-funnel-section',
    title: 'Tasks & Sales Funnel',
    description: 'Task management and sales pipeline visualization',
    icon: 'Target',
    component: null,
    color: 'from-amber-500 to-orange-500'
  },
  'apps-section': {
    id: 'apps-section',
    title: 'Connected Apps & Integrations',
    description: 'Access your entire business toolkit',
    icon: 'Grid3X3',
    component: null,
    color: 'from-purple-500 to-indigo-500'
  },
  'charts-section': {
    id: 'charts-section',
    title: 'Sales Charts & Analytics',
    description: 'Visualization of key sales metrics',
    icon: 'BarChart3',
    component: null,
    color: 'from-blue-500 to-teal-500'
  },
  'analytics-section': {
    id: 'analytics-section',
    title: 'Comprehensive Analytics',
    description: 'Detailed charts and performance metrics',
    icon: 'BarChart3',
    component: null,
    color: 'from-indigo-500 to-purple-500'
  }
};

export const DashboardLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    // Load from localStorage first, then use default
    const saved = localStorage.getItem('dashboard-section-order');
    return saved ? JSON.parse(saved) : defaultSectionOrder;
  });
  
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>(() => {
    // Load visibility from localStorage
    const saved = localStorage.getItem('dashboard-section-visibility');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default all sections to visible
    const defaultVisibility: Record<string, boolean> = {};
    defaultSectionOrder.forEach(id => {
      defaultVisibility[id] = true;
    });
    return defaultVisibility;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDragModeEnabled, setDragModeEnabled] = useState(false);

  // Save to localStorage whenever order changes
  useEffect(() => {
    localStorage.setItem('dashboard-section-order', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  // Save visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard-section-visibility', JSON.stringify(sectionVisibility));
  }, [sectionVisibility]);

  const getSectionConfig = (id: string): SectionConfig | undefined => {
    return sectionConfigs[id];
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    const newOrder = Array.from(sectionOrder);
    const [removed] = newOrder.splice(startIndex, 1);
    newOrder.splice(endIndex, 0, removed);
    setSectionOrder(newOrder);
  };

  const resetToDefault = () => {
    setSectionOrder([...defaultSectionOrder]);
    const defaultVisibility: Record<string, boolean> = {};
    defaultSectionOrder.forEach(id => {
      defaultVisibility[id] = true;
    });
    setSectionVisibility(defaultVisibility);
    localStorage.removeItem('dashboard-section-order');
    localStorage.removeItem('dashboard-section-visibility');
  };

  return (
    <DashboardLayoutContext.Provider value={{
      sectionOrder,
      setSectionOrder,
      sectionVisibility,
      setSectionVisibility,
      toggleSectionVisibility,
      sectionConfigs,
      isDragging,
      setIsDragging,
      draggedItem,
      setDraggedItem,
      getSectionConfig,
      reorderSections,
      resetToDefault,
      isDragModeEnabled,
      setDragModeEnabled
    }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};