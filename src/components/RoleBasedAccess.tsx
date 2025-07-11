import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'partner_admin' | 'customer_admin' | 'end_user';
  tenantId: string;
  permissions: string[];
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface RoleContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  canAccess: (resource: string) => boolean;
  isSuperAdmin: () => boolean;
  isPartnerAdmin: () => boolean;
  isCustomerAdmin: () => boolean;
  isEndUser: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [user] = useState<User>({
    id: 'demo-user',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'end_user',
    tenantId: 'default-tenant',
    permissions: ['read', 'write', 'delete'],
    lastActive: new Date().toISOString(),
    status: 'active',
  });
  
  const [isLoading] = useState(false);

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const canAccess = (resource: string) => {
    // Simple access control logic
    return user?.status === 'active';
  };

  const isSuperAdmin = () => hasRole('super_admin');
  const isPartnerAdmin = () => hasRole('partner_admin');
  const isCustomerAdmin = () => hasRole('customer_admin');
  const isEndUser = () => hasRole('end_user');

  const value = {
    user,
    isLoading,
    hasPermission,
    hasRole,
    canAccess,
    isSuperAdmin,
    isPartnerAdmin,
    isCustomerAdmin,
    isEndUser,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};