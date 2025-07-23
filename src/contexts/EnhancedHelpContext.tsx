import React, { createContext, useContext, useState } from 'react';

const EnhancedHelpContext = createContext<EnhancedHelpContextType | undefined>(undefined);

export const useEnhancedHelp = () => {
  const context = useContext(EnhancedHelpContext);
  if (!context) {
    throw new Error('useEnhancedHelp must be used within an EnhancedHelpProvider');
  }
  return context;
};

export const EnhancedHelpProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTours, setShowTours] = useState(false);
  const [currentTour, setCurrentTour] = useState<string | null>(null);

  const startTour = (tourName: string) => {
    setCurrentTour(tourName);
    setShowTours(true);
  };

  const endTour = () => {
    setCurrentTour(null);
    setShowTours(false);
  };

  return (
    <EnhancedHelpContext.Provider value={{ showTours, setShowTours, currentTour, startTour, endTour }}>
      {children}
    </EnhancedHelpContext.Provider>
  );
};