import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardLayout {
  sidebarCollapsed: boolean;
  widgetLayout: 'grid' | 'list' | 'compact';
  activeWidgets: string[];
  customizations: {
    [key: string]: any;
  };
}

interface DashboardLayoutContextType {
  layout: DashboardLayout;
  toggleSidebar: () => void;
  setWidgetLayout: (layout: 'grid' | 'list' | 'compact') => void;
  toggleWidget: (widgetId: string) => void;
  updateCustomizations: (key: string, value: any) => void;
  resetLayout: () => void;
}

const defaultLayout: DashboardLayout = {
  sidebarCollapsed: false,
  widgetLayout: 'grid',
  activeWidgets: [
    'kpi-cards',
    'ai-insights',
    'recent-activity',
    'quick-actions',
    'pipeline-overview',
    'upcoming-tasks'
  ],
  customizations: {}
};

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const useDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext);
  if (context === undefined) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider');
  }
  return context;
};

interface DashboardLayoutProviderProps {
  children: React.ReactNode;
}

export const DashboardLayoutProvider: React.FC<DashboardLayoutProviderProps> = ({ children }) => {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Try to load saved layout from localStorage
    const savedLayout = localStorage.getItem('smart-crm-dashboard-layout');
    if (savedLayout) {
      try {
        return { ...defaultLayout, ...JSON.parse(savedLayout) };
      } catch (error) {
        console.warn('Failed to parse saved dashboard layout:', error);
      }
    }
    return defaultLayout;
  });

  const saveLayout = useCallback((newLayout: DashboardLayout) => {
    localStorage.setItem('smart-crm-dashboard-layout', JSON.stringify(newLayout));
  }, []);

  const toggleSidebar = useCallback(() => {
    setLayout(prev => {
      const newLayout = { ...prev, sidebarCollapsed: !prev.sidebarCollapsed };
      saveLayout(newLayout);
      return newLayout;
    });
  }, [saveLayout]);

  const setWidgetLayout = useCallback((widgetLayout: 'grid' | 'list' | 'compact') => {
    setLayout(prev => {
      const newLayout = { ...prev, widgetLayout };
      saveLayout(newLayout);
      return newLayout;
    });
  }, [saveLayout]);

  const toggleWidget = useCallback((widgetId: string) => {
    setLayout(prev => {
      const activeWidgets = prev.activeWidgets.includes(widgetId)
        ? prev.activeWidgets.filter(id => id !== widgetId)
        : [...prev.activeWidgets, widgetId];
      
      const newLayout = { ...prev, activeWidgets };
      saveLayout(newLayout);
      return newLayout;
    });
  }, [saveLayout]);

  const updateCustomizations = useCallback((key: string, value: any) => {
    setLayout(prev => {
      const newLayout = {
        ...prev,
        customizations: { ...prev.customizations, [key]: value }
      };
      saveLayout(newLayout);
      return newLayout;
    });
  }, [saveLayout]);

  const resetLayout = useCallback(() => {
    setLayout(defaultLayout);
    localStorage.removeItem('smart-crm-dashboard-layout');
  }, []);

  const value: DashboardLayoutContextType = {
    layout,
    toggleSidebar,
    setWidgetLayout,
    toggleWidget,
    updateCustomizations,
    resetLayout
  };

  return (
    <DashboardLayoutContext.Provider value={value}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};