import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { useAuth } from '../hooks/useAuth';
import { Bot, Plug, Crown, Zap, Shield, MessageSquare, Target, BarChart3 } from 'lucide-react';

const FeatureAccessDemo: React.FC = () => {
  const { user } = useAuth();
  const { checkFeatureAccess, upgradePrompt, closeUpgradePrompt, handleUpgrade } = useFeatureAccess();

  const features = [
    {
      id: 'ai_tools',
      name: 'AI Tools',
      description: '29+ AI-powered business tools',
      icon: Bot,
      color: 'purple'
    },
    {
      id: 'apps_integration',
      name: 'Apps & Integration',
      description: 'Third-party app integrations and API access',
      icon: Plug,
      color: 'pink'
    },
    {
      id: 'white_label',
      name: 'White Label Access',
      description: 'Custom branding and reseller capabilities',
      icon: Crown,
      color: 'cyan'
    },
    {
      id: 'sales_tools',
      name: 'Sales Tools',
      description: 'Lead automation and territory management',
      icon: Target,
      color: 'emerald'
    },
    {
      id: 'communication_tools',
      name: 'Communication Tools',
      description: 'Email, SMS, and phone system integration',
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Advanced reporting and business insights',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  const handleFeatureClick = (featureId: string, featureName: string) => {
    const access = checkFeatureAccess(featureId, featureName);
    
    if (access.hasAccess) {
      alert(`Access granted! Opening ${featureName}...`);
    } else {
      access.showUpgradePrompt();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Access Demo</h1>
          <p className="text-gray-600">
            Current Plan: <span className="font-semibold capitalize">{user?.subscriptionPlan || 'free'}</span>
          </p>
        </div>

        {/* Current Plan Status */}
        <GlassCard className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Current Plan</h3>
                <p className="text-sm text-gray-600">
                  You're on the <span className="font-medium capitalize">{user?.subscriptionPlan || 'free'}</span> plan
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </GlassCard>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const access = checkFeatureAccess(feature.id, feature.name);
            const Icon = feature.icon;
            
            return (
              <GlassCard key={feature.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    feature.color === 'purple' ? 'bg-purple-100' :
                    feature.color === 'pink' ? 'bg-pink-100' :
                    feature.color === 'cyan' ? 'bg-cyan-100' :
                    feature.color === 'emerald' ? 'bg-emerald-100' :
                    feature.color === 'green' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      feature.color === 'purple' ? 'text-purple-600' :
                      feature.color === 'pink' ? 'text-pink-600' :
                      feature.color === 'cyan' ? 'text-cyan-600' :
                      feature.color === 'emerald' ? 'text-emerald-600' :
                      feature.color === 'green' ? 'text-green-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Required:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      access.requiredPlan === 'free' ? 'bg-gray-100 text-gray-800' :
                      access.requiredPlan === 'basic' ? 'bg-blue-100 text-blue-800' :
                      access.requiredPlan === 'professional' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {access.requiredPlan}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {access.hasAccess ? (
                      <span className="text-xs text-green-600 font-medium">✓ Available</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">⚠ Upgrade Required</span>
                    )}
                  </div>
                </div>
                
                <ModernButton
                  variant={access.hasAccess ? 'primary' : 'outline'}
                  onClick={() => handleFeatureClick(feature.id, feature.name)}
                  className="w-full"
                >
                  {access.hasAccess ? 'Access Feature' : 'Upgrade to Access'}
                </ModernButton>
              </GlassCard>
            );
          })}
        </div>

        {/* Plan Upgrade Card */}
        <GlassCard className="mt-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need More Features?</h3>
                <p className="text-sm text-gray-600">
                  Upgrade your plan to unlock all premium features
                </p>
              </div>
            </div>
            <ModernButton
              variant="primary"
              onClick={() => handleFeatureClick('ai_tools', 'AI Tools')}
              className="flex items-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>View Plans</span>
            </ModernButton>
          </div>
        </GlassCard>
      </div>

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={upgradePrompt.isOpen}
        onClose={closeUpgradePrompt}
        requiredPlan={upgradePrompt.requiredPlan}
        featureName={upgradePrompt.featureName}
        currentPlan={upgradePrompt.currentPlan}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default FeatureAccessDemo;