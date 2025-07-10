import React from 'react';
import { Shield, Crown, Lock, CheckCircle } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FeaturePermissions, SubscriptionPlan } from '@shared/featureControl';

interface FeatureAccessBadgeProps {
  featureCategory: keyof FeaturePermissions;
  featureName: string;
  children?: React.ReactNode;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FeatureAccessBadge: React.FC<FeatureAccessBadgeProps> = ({
  featureCategory,
  featureName,
  children,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const { hasAccess, requiresUpgrade, isAdmin, userPlan } = useFeatureAccess();

  const hasFeature = hasAccess(featureCategory, featureName);
  const upgradeInfo = requiresUpgrade(featureCategory, featureName);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (isAdmin) {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-800 ${sizeClasses[size]} ${className}`}>
        <Crown size={iconSizes[size]} />
        {showLabel && <span>Super Admin</span>}
        {children}
      </div>
    );
  }

  if (hasFeature) {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 ${sizeClasses[size]} ${className}`}>
        <CheckCircle size={iconSizes[size]} />
        {showLabel && <span>Available</span>}
        {children}
      </div>
    );
  }

  if (upgradeInfo.blocked) {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 ${sizeClasses[size]} ${className}`}>
        <Lock size={iconSizes[size]} />
        {showLabel && (
          <span>
            {upgradeInfo.availableInPlan 
              ? `Upgrade to ${upgradeInfo.availableInPlan.toUpperCase()}`
              : 'Not Available'
            }
          </span>
        )}
        {children}
      </div>
    );
  }

  return null;
};

interface FeatureGuardProps {
  featureCategory: keyof FeaturePermissions;
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeMessage?: boolean;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureCategory,
  featureName,
  children,
  fallback,
  showUpgradeMessage = true,
}) => {
  const { hasAccess, requiresUpgrade, isAdmin } = useFeatureAccess();

  const hasFeature = hasAccess(featureCategory, featureName);

  if (hasFeature || isAdmin) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradeMessage) {
    const upgradeInfo = requiresUpgrade(featureCategory, featureName);
    
    return (
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Feature Locked</h3>
        </div>
        <p className="text-sm text-blue-700 mb-3">{upgradeInfo.message}</p>
        {upgradeInfo.availableInPlan && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Upgrade to {upgradeInfo.availableInPlan.toUpperCase()}
          </button>
        )}
      </div>
    );
  }

  return null;
};

interface FeatureUsageBadgeProps {
  limitType: keyof FeaturePermissions['limits'];
  className?: string;
}

export const FeatureUsageBadge: React.FC<FeatureUsageBadgeProps> = ({
  limitType,
  className = '',
}) => {
  const { checkLimit, isAdmin } = useFeatureAccess();

  const usage = checkLimit(limitType);

  if (isAdmin) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs ${className}`}>
        <Crown size={12} />
        <span>Unlimited</span>
      </div>
    );
  }

  const getUsageColor = () => {
    if (usage.percentage < 70) return 'bg-green-100 text-green-800';
    if (usage.percentage < 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatLimit = (value: number) => {
    if (value === -1) return '∞';
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getUsageColor()} ${className}`}>
      <span>
        {formatLimit(usage.current)} / {formatLimit(usage.max)}
      </span>
      {usage.max !== -1 && (
        <span className="text-xs">
          ({Math.round(usage.percentage)}%)
        </span>
      )}
    </div>
  );
};

interface PlanComparisonProps {
  currentPlan: SubscriptionPlan;
  targetPlan: SubscriptionPlan;
  features: Array<{
    category: keyof FeaturePermissions;
    name: string;
    label: string;
  }>;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  currentPlan,
  targetPlan,
  features,
}) => {
  const { canUpgrade } = useFeatureAccess();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Upgrade from {currentPlan.toUpperCase()} to {targetPlan.toUpperCase()}
      </h3>
      
      <div className="space-y-3">
        {features.map((feature, index) => {
          const willUnlock = canUpgrade(targetPlan, feature.category, feature.name);
          
          return (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{feature.label}</span>
              {willUnlock ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} />
                  <span className="text-xs">Will unlock</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Shield size={14} />
                  <span className="text-xs">Already available</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};