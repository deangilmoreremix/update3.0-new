import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextType {
  currentSection: string;
  navigateToFeature: (feature: string) => void;
  openAITool: (toolName: string) => void;
  breadcrumbs: string[];
  setBreadcrumbs: (breadcrumbs: string[]) => void;
  isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('executive-overview-section');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Dashboard']);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToFeature = useCallback((feature: string) => {
    setIsNavigating(true);
    setCurrentSection(feature);
    
    // Update breadcrumbs based on feature
    const featureTitles: Record<string, string> = {
      'executive-overview-section': 'Dashboard',
      'ai-smart-features-hub': 'AI Tools',
      'sales-pipeline-deal-analytics': 'Pipeline',
      'customer-lead-management': 'Contacts',
      'activities-communications': 'Tasks',
      'integrations-system': 'Integrations'
    };
    
    const title = featureTitles[feature] || feature;
    setBreadcrumbs(['Dashboard', title]);
    
    // Scroll to section
    setTimeout(() => {
      const element = document.getElementById(feature);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsNavigating(false);
    }, 100);
  }, []);

  const openAITool = useCallback((toolName: string) => {
    // This would integrate with the AI tools system
    console.log('Opening AI tool:', toolName);
    
    // You can add AI tool opening logic here
    // For example, opening a modal or navigating to an AI tool
    const event = new CustomEvent('openAITool', { detail: { toolName } });
    window.dispatchEvent(event);
  }, []);

  return (
    <NavigationContext.Provider value={{
      currentSection,
      navigateToFeature,
      openAITool,
      breadcrumbs,
      setBreadcrumbs,
      isNavigating
    }}>
      {children}
    </NavigationContext.Provider>
  );
};