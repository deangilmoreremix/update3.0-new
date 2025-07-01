import React, { useState, useEffect, createContext, useContext } from 'react';

export type UserRole = 'super_admin' | 'reseller' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

// Simple authentication context
interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
      email,
      firstName: 'Demo',
      lastName: 'User',
      role: 'super_admin'
    };
    setUser(demoUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      'user': 1,
      'reseller': 2,
      'super_admin': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      isSignedIn: !!user,
      signIn,
      signOut,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { user, isLoaded, isSignedIn, signIn, signOut, hasPermission } = context;

  // Role checking functions
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isReseller = () => user?.role === 'reseller' || user?.role === 'super_admin';
  const isUser = () => user ? ['user', 'reseller', 'super_admin'].includes(user.role) : false;

  return {
    user,
    isLoaded,
    isSignedIn,
    role: user?.role || 'user',
    isSuperAdmin,
    isReseller,
    isUser,
    hasPermission,
    signIn,
    signOut
  };
}