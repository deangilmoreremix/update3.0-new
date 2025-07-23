import React from 'react';

const NavigationContext = React.createContext({});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationContext.Provider value={{}}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
