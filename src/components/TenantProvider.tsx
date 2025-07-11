import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
  features: {
    aiTools: boolean;
    advancedAnalytics: boolean;
    customIntegrations: boolean;
    userLimit: number;
    storageLimit: number;
  };
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  hasFeature: (feature: keyof Tenant['features']) => boolean;
  applyBranding: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant] = useState<Tenant>({
    id: 'default-tenant',
    name: 'Smart CRM',
    subdomain: 'default',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      companyName: 'Smart CRM',
    },
    features: {
      aiTools: true,
      advancedAnalytics: true,
      customIntegrations: true,
      userLimit: 100,
      storageLimit: 1000,
    },
    plan: 'enterprise',
    status: 'active',
  });
  
  const [isLoading] = useState(false);

  const hasFeature = (feature: keyof Tenant['features']) => {
    return tenant?.features[feature] ?? false;
  };

  const applyBranding = () => {
    // Apply tenant branding to the application
    if (tenant?.branding.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', tenant.branding.primaryColor);
    }
  };

  const value = {
    tenant,
    isLoading,
    hasFeature,
    applyBranding,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};