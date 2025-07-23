import React from 'react';

const ThemeContext = React.createContext({});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
