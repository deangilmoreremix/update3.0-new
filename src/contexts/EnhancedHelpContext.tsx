import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EnhancedHelpContextType {
  isHelpVisible: boolean;
  setHelpVisible: (visible: boolean) => void;
  helpContent: string;
  setHelpContent: (content: string) => void;
}

const EnhancedHelpContext = createContext<EnhancedHelpContextType | undefined>(undefined);

export const useEnhancedHelp = () => {
  const context = useContext(EnhancedHelpContext);
  if (!context) {
    throw new Error('useEnhancedHelp must be used within an EnhancedHelpProvider');
  }
  return context;
};

interface EnhancedHelpProviderProps {
  children: ReactNode;
}

export const EnhancedHelpProvider: React.FC<EnhancedHelpProviderProps> = ({ children }) => {
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [helpContent, setHelpContent] = useState('');

  const value = {
    isHelpVisible,
    setHelpVisible,
    helpContent,
    setHelpContent,
  };

  return (
    <EnhancedHelpContext.Provider value={value}>
      {children}
    </EnhancedHelpContext.Provider>
  );
};