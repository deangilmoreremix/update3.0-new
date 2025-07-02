import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'reseller' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);

  // For demo purposes, automatically sign in as super admin
  useEffect(() => {
    // Auto-login as super admin for development
    const demoUser: AuthUser = {
      id: '1',
      email: 'admin@smart-crm.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin'
    };
    setUser(demoUser);
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple demo authentication
    const demoUser: AuthUser = {
      id: '1',
      email: email,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin'
    };
    setUser(demoUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    isLoaded,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within an AuthProvider');
  }
  return context;
};