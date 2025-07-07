import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FeaturePermissions, 
  SubscriptionPlan, 
  getFeaturePermissions, 
  hasFeatureAccess, 
  isWithinLimit,
  canUpgradeFeature,
  getPlanUpgradeOptions
} from '@shared/featureControl';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'trial' | 'cancelled' | 'expired' | 'free';
  paymentStatus: 'paid' | 'unpaid' | 'overdue';
  isAdmin?: boolean;
  role?: 'super_admin' | 'admin' | 'user';
}

interface UsageStats {
  contactsCount: number;
  dealsCount: number;
  aiRequestsThisMonth: number;
  emailsSentThisMonth: number;
  smssSentThisMonth: number;
  storageUsedGB: number;
  teamMembersCount: number;
}

export function useFeatureAccess() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  const { data: usageStats, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ['/api/auth/usage-stats'],
    retry: false,
    enabled: !!user,
  });

  const isLoading = userLoading || usageLoading;
  const isAuthenticated = !!user;
  const userPlan = user?.subscriptionPlan || 'free';
  const isSubscriptionActive = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial';
  const isAdmin = user?.isAdmin || user?.role === 'super_admin' || user?.role === 'admin';

  // Get user's feature permissions
  const permissions = getFeaturePermissions(userPlan);

  // Helper functions
  const hasAccess = (featureCategory: keyof FeaturePermissions, featureName: string): boolean => {
    if (!isAuthenticated) return false;
    
    // Super admins bypass all restrictions
    if (isAdmin) return true;
    
    if (!isSubscriptionActive && userPlan !== 'free') return false;
    return hasFeatureAccess(userPlan, featureCategory, featureName, isAdmin);
  };

  const checkLimit = (limitType: keyof FeaturePermissions['limits']): {
    isWithinLimit: boolean;
    current: number;
    max: number;
    percentage: number;
  } => {
    // Super admins have unlimited access
    if (isAdmin) {
      return { isWithinLimit: true, current: 0, max: -1, percentage: 0 };
    }

    if (!usageStats) {
      return { isWithinLimit: true, current: 0, max: 0, percentage: 0 };
    }

    const limit = permissions.limits[limitType];
    let current = 0;

    switch (limitType) {
      case 'maxContacts':
        current = usageStats.contactsCount;
        break;
      case 'maxDeals':
        current = usageStats.dealsCount;
        break;
      case 'maxAIRequests':
        current = usageStats.aiRequestsThisMonth;
        break;
      case 'maxEmailsPerMonth':
        current = usageStats.emailsSentThisMonth;
        break;
      case 'maxSMSPerMonth':
        current = usageStats.smssSentThisMonth;
        break;
      case 'maxStorageGB':
        current = usageStats.storageUsedGB;
        break;
      case 'maxTeamMembers':
        current = usageStats.teamMembersCount;
        break;
    }

    const withinLimit = isWithinLimit(userPlan, limitType, current, isAdmin);
    const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);

    return {
      isWithinLimit: withinLimit,
      current,
      max: limit,
      percentage,
    };
  };

  const canUpgrade = (targetPlan: SubscriptionPlan, featureCategory: keyof FeaturePermissions, featureName: string): boolean => {
    return canUpgradeFeature(userPlan, targetPlan, featureCategory, featureName);
  };

  const getUpgradeOptions = (): SubscriptionPlan[] => {
    return getPlanUpgradeOptions(userPlan);
  };

  const getBlockedFeatureMessage = (featureCategory: keyof FeaturePermissions, featureName: string): string => {
    const upgradeOptions = getUpgradeOptions();
    const availableInPlan = upgradeOptions.find(plan => 
      hasFeatureAccess(plan, featureCategory, featureName)
    );

    if (availableInPlan) {
      return `This feature is available in the ${availableInPlan.toUpperCase()} plan. Upgrade to unlock it.`;
    }

    return 'This feature is not available in your current plan.';
  };

  const requiresUpgrade = (featureCategory: keyof FeaturePermissions, featureName: string): {
    blocked: boolean;
    message: string;
    availableInPlan?: SubscriptionPlan;
  } => {
    const hasFeature = hasAccess(featureCategory, featureName);
    
    if (hasFeature) {
      return { blocked: false, message: '' };
    }

    const upgradeOptions = getUpgradeOptions();
    const availableInPlan = upgradeOptions.find(plan => 
      hasFeatureAccess(plan, featureCategory, featureName)
    );

    return {
      blocked: true,
      message: getBlockedFeatureMessage(featureCategory, featureName),
      availableInPlan,
    };
  };

  // Specific feature checkers
  const canCreateContact = (): boolean => {
    const accessCheck = hasAccess('contacts', 'create');
    const limitCheck = checkLimit('maxContacts');
    return accessCheck && limitCheck.isWithinLimit;
  };

  const canCreateDeal = (): boolean => {
    const accessCheck = hasAccess('deals', 'create');
    const limitCheck = checkLimit('maxDeals');
    return accessCheck && limitCheck.isWithinLimit;
  };

  const canUseAI = (toolType: 'basic' | 'advanced'): boolean => {
    const accessCheck = hasAccess('aiTools', toolType === 'basic' ? 'basicAI' : 'advancedAI');
    const limitCheck = checkLimit('maxAIRequests');
    return accessCheck && limitCheck.isWithinLimit;
  };

  const canSendEmail = (): boolean => {
    const accessCheck = hasAccess('communication', 'basicEmail');
    const limitCheck = checkLimit('maxEmailsPerMonth');
    return accessCheck && limitCheck.isWithinLimit;
  };

  const canSendSMS = (): boolean => {
    const accessCheck = hasAccess('communication', 'sms');
    const limitCheck = checkLimit('maxSMSPerMonth');
    return accessCheck && limitCheck.isWithinLimit;
  };

  return {
    // User info
    user,
    isLoading,
    isAuthenticated,
    userPlan,
    isSubscriptionActive,
    usageStats,
    permissions,

    // Access checkers
    hasAccess,
    checkLimit,
    canUpgrade,
    getUpgradeOptions,
    requiresUpgrade,
    getBlockedFeatureMessage,

    // Specific feature checkers
    canCreateContact,
    canCreateDeal,
    canUseAI,
    canSendEmail,
    canSendSMS,

    // Feature categories
    contacts: {
      canView: hasAccess('contacts', 'view'),
      canCreate: canCreateContact(),
      canEdit: hasAccess('contacts', 'edit'),
      canDelete: hasAccess('contacts', 'delete'),
      canImport: hasAccess('contacts', 'import'),
      canExport: hasAccess('contacts', 'export'),
      canUseAIEnrichment: hasAccess('contacts', 'aiEnrichment'),
      canUseBulkOperations: hasAccess('contacts', 'bulkOperations'),
    },

    deals: {
      canView: hasAccess('deals', 'view'),
      canCreate: canCreateDeal(),
      canEdit: hasAccess('deals', 'edit'),
      canDelete: hasAccess('deals', 'delete'),
      canUseAdvancedAnalytics: hasAccess('deals', 'advancedAnalytics'),
      canUseForecastReports: hasAccess('deals', 'forecastReports'),
    },

    aiTools: {
      canUseBasicAI: canUseAI('basic'),
      canUseAdvancedAI: canUseAI('advanced'),
      canUseEmailComposer: hasAccess('aiTools', 'emailComposer'),
      canUseContentGenerator: hasAccess('aiTools', 'contentGenerator'),
      canUseBusinessAnalyzer: hasAccess('aiTools', 'businessAnalyzer'),
      canUseSmartSearch: hasAccess('aiTools', 'smartSearch'),
      canUseVoiceAnalysis: hasAccess('aiTools', 'voiceAnalysis'),
      canUseDocumentAnalysis: hasAccess('aiTools', 'documentAnalysis'),
      canUseGoalExecution: hasAccess('aiTools', 'goalExecution'),
    },

    communication: {
      canSendEmail: canSendEmail(),
      canSendSMS: canSendSMS(),
      canUseVideoEmail: hasAccess('communication', 'videoEmail'),
      canUseAutomatedCampaigns: hasAccess('communication', 'automatedCampaigns'),
      canUsePhoneIntegration: hasAccess('communication', 'phoneIntegration'),
    },

    analytics: {
      canUseBasicReports: hasAccess('analytics', 'basicReports'),
      canUseAdvancedReports: hasAccess('analytics', 'advancedReports'),
      canUseCustomDashboards: hasAccess('analytics', 'customDashboards'),
      canExportReports: hasAccess('analytics', 'exportReports'),
      canUseRealTimeAnalytics: hasAccess('analytics', 'realTimeAnalytics'),
    },

    system: {
      canUseAPIAccess: hasAccess('system', 'apiAccess'),
      canUseWebhooks: hasAccess('system', 'webhooks'),
      canUseIntegrations: hasAccess('system', 'integrations'),
      canUseCustomFields: hasAccess('system', 'customFields'),
      canUseWorkflowAutomation: hasAccess('system', 'workflowAutomation'),
      canUseTeamManagement: hasAccess('system', 'teamManagement'),
      canUseWhiteLabeling: hasAccess('system', 'whiteLabeling'),
    },
  };
}

// Higher-order component for feature protection
export function withFeatureAccess<T extends object>(
  Component: React.ComponentType<T>,
  featureCategory: keyof FeaturePermissions,
  featureName: string,
  fallback?: React.ComponentType<any>
) {
  return function FeatureProtectedComponent(props: T) {
    const { hasAccess, requiresUpgrade, isLoading } = useFeatureAccess();

    if (isLoading) {
      return <div className="animate-pulse bg-gray-200 h-8 rounded"></div>;
    }

    const hasFeature = hasAccess(featureCategory, featureName);
    
    if (!hasFeature) {
      const { message, availableInPlan } = requiresUpgrade(featureCategory, featureName);
      
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent message={message} availableInPlan={availableInPlan} />;
      }

      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{message}</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}