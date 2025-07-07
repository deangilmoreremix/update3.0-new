import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationState {
  currentPage: string;
  previousPage: string | null;
  isMenuOpen: boolean;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
}

interface NavigationContextType {
  navigationState: NavigationState;
  setCurrentPage: (page: string) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  navigateBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPage: 'dashboard',
    previousPage: null,
    isMenuOpen: false,
    breadcrumbs: []
  });

  const setCurrentPage = useCallback((page: string) => {
    setNavigationState(prev => ({
      ...prev,
      previousPage: prev.currentPage,
      currentPage: page
    }));
  }, []);

  const toggleMenu = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isMenuOpen: !prev.isMenuOpen
    }));
  }, []);

  const closeMenu = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isMenuOpen: false
    }));
  }, []);

  const setBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setNavigationState(prev => ({
      ...prev,
      breadcrumbs
    }));
  }, []);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setNavigationState(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, item]
    }));
  }, []);

  const navigateBack = useCallback(() => {
    if (navigationState.previousPage) {
      window.history.back();
    }
  }, [navigationState.previousPage]);

  const value: NavigationContextType = {
    navigationState,
    setCurrentPage,
    toggleMenu,
    closeMenu,
    setBreadcrumbs,
    addBreadcrumb,
    navigateBack
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};