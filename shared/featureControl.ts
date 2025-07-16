export interface FeaturePermissions {
  // Core CRM Features
  contacts: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    import: boolean;
    export: boolean;
    aiEnrichment: boolean;
    bulkOperations: boolean;
  };
  
  // Deals & Pipeline
  deals: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    advancedAnalytics: boolean;
    forecastReports: boolean;
  };
  
  // AI Tools & Features
  aiTools: {
    basicAI: boolean;
    advancedAI: boolean;
    emailComposer: boolean;
    contentGenerator: boolean;
    businessAnalyzer: boolean;
    smartSearch: boolean;
    voiceAnalysis: boolean;
    documentAnalysis: boolean;
    goalExecution: boolean;
  };
  
  // Communication Features
  communication: {
    basicEmail: boolean;
    sms: boolean;
    videoEmail: boolean;
    automatedCampaigns: boolean;
    phoneIntegration: boolean;
  };
  
  // Analytics & Reporting
  analytics: {
    basicReports: boolean;
    advancedReports: boolean;
    customDashboards: boolean;
    exportReports: boolean;
    realTimeAnalytics: boolean;
  };
  
  // System Features
  system: {
    apiAccess: boolean;
    webhooks: boolean;
    integrations: boolean;
    customFields: boolean;
    workflowAutomation: boolean;
    teamManagement: boolean;
    whiteLabeling: boolean;
  };
  
  // Usage Limits
  limits: {
    maxContacts: number;
    maxDeals: number;
    maxAIRequests: number;
    maxEmailsPerMonth: number;
    maxSMSPerMonth: number;
    maxStorageGB: number;
    maxTeamMembers: number;
  };
}

export type SubscriptionPlan = 'free' | 'basic' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'cancelled' | 'expired' | 'free';

export const FEATURE_PLANS: Record<SubscriptionPlan, FeaturePermissions> = {
  free: {
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      import: false,
      export: false,
      aiEnrichment: false,
      bulkOperations: false,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      advancedAnalytics: false,
      forecastReports: false,
    },
    aiTools: {
      basicAI: true,
      advancedAI: false,
      emailComposer: false,
      contentGenerator: false,
      businessAnalyzer: false,
      smartSearch: false,
      voiceAnalysis: false,
      documentAnalysis: false,
      goalExecution: false,
    },
    communication: {
      basicEmail: true,
      sms: false,
      videoEmail: false,
      automatedCampaigns: false,
      phoneIntegration: false,
    },
    analytics: {
      basicReports: true,
      advancedReports: false,
      customDashboards: false,
      exportReports: false,
      realTimeAnalytics: false,
    },
    system: {
      apiAccess: false,
      webhooks: false,
      integrations: false,
      customFields: false,
      workflowAutomation: false,
      teamManagement: false,
      whiteLabeling: false,
    },
    limits: {
      maxContacts: 100,
      maxDeals: 25,
      maxAIRequests: 10,
      maxEmailsPerMonth: 100,
      maxSMSPerMonth: 0,
      maxStorageGB: 1,
      maxTeamMembers: 1,
    },
  },
  
  basic: {
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      aiEnrichment: true,
      bulkOperations: false,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      advancedAnalytics: true,
      forecastReports: false,
    },
    aiTools: {
      basicAI: true,
      advancedAI: true,
      emailComposer: true,
      contentGenerator: true,
      businessAnalyzer: true,
      smartSearch: true,
      voiceAnalysis: false,
      documentAnalysis: false,
      goalExecution: false,
    },
    communication: {
      basicEmail: true,
      sms: true,
      videoEmail: false,
      automatedCampaigns: true,
      phoneIntegration: false,
    },
    analytics: {
      basicReports: true,
      advancedReports: true,
      customDashboards: false,
      exportReports: true,
      realTimeAnalytics: false,
    },
    system: {
      apiAccess: false,
      webhooks: false,
      integrations: true,
      customFields: true,
      workflowAutomation: false,
      teamManagement: false,
      whiteLabeling: false,
    },
    limits: {
      maxContacts: 1000,
      maxDeals: 250,
      maxAIRequests: 100,
      maxEmailsPerMonth: 1000,
      maxSMSPerMonth: 100,
      maxStorageGB: 5,
      maxTeamMembers: 3,
    },
  },
  
  professional: {
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      aiEnrichment: true,
      bulkOperations: true,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      advancedAnalytics: true,
      forecastReports: true,
    },
    aiTools: {
      basicAI: true,
      advancedAI: true,
      emailComposer: true,
      contentGenerator: true,
      businessAnalyzer: true,
      smartSearch: true,
      voiceAnalysis: true,
      documentAnalysis: true,
      goalExecution: true,
    },
    communication: {
      basicEmail: true,
      sms: true,
      videoEmail: true,
      automatedCampaigns: true,
      phoneIntegration: true,
    },
    analytics: {
      basicReports: true,
      advancedReports: true,
      customDashboards: true,
      exportReports: true,
      realTimeAnalytics: true,
    },
    system: {
      apiAccess: true,
      webhooks: true,
      integrations: true,
      customFields: true,
      workflowAutomation: true,
      teamManagement: true,
      whiteLabeling: false,
    },
    limits: {
      maxContacts: 10000,
      maxDeals: 2500,
      maxAIRequests: 1000,
      maxEmailsPerMonth: 10000,
      maxSMSPerMonth: 1000,
      maxStorageGB: 25,
      maxTeamMembers: 10,
    },
  },
  
  enterprise: {
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      aiEnrichment: true,
      bulkOperations: true,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      advancedAnalytics: true,
      forecastReports: true,
    },
    aiTools: {
      basicAI: true,
      advancedAI: true,
      emailComposer: true,
      contentGenerator: true,
      businessAnalyzer: true,
      smartSearch: true,
      voiceAnalysis: true,
      documentAnalysis: true,
      goalExecution: true,
    },
    communication: {
      basicEmail: true,
      sms: true,
      videoEmail: true,
      automatedCampaigns: true,
      phoneIntegration: true,
    },
    analytics: {
      basicReports: true,
      advancedReports: true,
      customDashboards: true,
      exportReports: true,
      realTimeAnalytics: true,
    },
    system: {
      apiAccess: true,
      webhooks: true,
      integrations: true,
      customFields: true,
      workflowAutomation: true,
      teamManagement: true,
      whiteLabeling: true,
    },
    limits: {
      maxContacts: -1, // Unlimited
      maxDeals: -1,
      maxAIRequests: -1,
      maxEmailsPerMonth: -1,
      maxSMSPerMonth: -1,
      maxStorageGB: -1,
      maxTeamMembers: -1,
    },
  },
};

export function getFeaturePermissions(plan: SubscriptionPlan): FeaturePermissions {
  return FEATURE_PLANS[plan];
}

export function hasFeatureAccess(
  userPlan: SubscriptionPlan,
  featureCategory: keyof FeaturePermissions,
  featureName: string,
  isAdmin: boolean = false
): boolean {
  // Super admins have access to everything
  if (isAdmin) return true;
  
  const permissions = getFeaturePermissions(userPlan);
  const categoryPermissions = permissions[featureCategory] as any;
  
  if (!categoryPermissions) return false;
  
  return categoryPermissions[featureName] || false;
}

export function isWithinLimit(
  userPlan: SubscriptionPlan,
  limitType: keyof FeaturePermissions['limits'],
  currentUsage: number,
  isAdmin: boolean = false
): boolean {
  // Super admins have unlimited access
  if (isAdmin) return true;
  
  const permissions = getFeaturePermissions(userPlan);
  const limit = permissions.limits[limitType];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  return currentUsage < limit;
}

export function canUpgradeFeature(
  currentPlan: SubscriptionPlan,
  targetPlan: SubscriptionPlan,
  featureCategory: keyof FeaturePermissions,
  featureName: string
): boolean {
  const currentPermissions = getFeaturePermissions(currentPlan);
  const targetPermissions = getFeaturePermissions(targetPlan);
  
  const currentFeature = (currentPermissions[featureCategory] as unknown)[featureName];
  const targetFeature = (targetPermissions[featureCategory] as unknown)[featureName];
  
  return !currentFeature && targetFeature;
}

export const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  free: 0,
  basic: 1,
  professional: 2,
  enterprise: 3,
};

export function getPlanUpgradeOptions(currentPlan: SubscriptionPlan): SubscriptionPlan[] {
  const currentLevel = PLAN_HIERARCHY[currentPlan];
  return Object.keys(PLAN_HIERARCHY)
    .filter(plan => PLAN_HIERARCHY[plan as SubscriptionPlan] > currentLevel)
    .map(plan => plan as SubscriptionPlan);
}