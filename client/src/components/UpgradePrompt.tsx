import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { Check, X, Zap, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: string;
  featureName: string;
  currentPlan: string;
  onUpgrade: (plan: string) => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  featureName,
  currentPlan,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState(requiredPlan);
  const [upgrading, setUpgrading] = useState(false);

  if (!isOpen) return null;

  const plans = {
    basic: {
      name: 'Basic',
      price: '$29/month',
      icon: Check,
      color: 'blue',
      features: [
        'Core CRM Features',
        'Sales Tools',
        'Communication Tools',
        'Task Management',
        'Content Features',
        'Email Support'
      ]
    },
    professional: {
      name: 'Professional',
      price: '$99/month',
      icon: Star,
      color: 'purple',
      features: [
        'Everything in Basic',
        'Complete AI Tools Suite (29+ tools)',
        'Advanced Analytics',
        'Priority Support',
        'Custom Integrations',
        'Advanced Reporting'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: '$299/month',
      icon: Crown,
      color: 'red',
      features: [
        'Everything in Professional',
        'White Label Solution',
        'API Access',
        'Custom Branding',
        'Dedicated Support',
        'Advanced Security'
      ]
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await onUpgrade(selectedPlan);
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <GlassCard className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upgrade Required</h2>
                <p className="text-gray-600">
                  {featureName} requires a {requiredPlan} plan or higher
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Current Plan Status */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="font-semibold text-gray-900 capitalize">{currentPlan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Required Plan</p>
                <p className="font-semibold text-purple-600 capitalize">{requiredPlan}</p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(plans).map(([planKey, plan]) => {
              const isSelected = selectedPlan === planKey;
              const isCurrentPlan = currentPlan === planKey;
              const Icon = plan.icon;

              return (
                <div
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isCurrentPlan ? 'opacity-50' : ''}`}
                >
                  {planKey === 'professional' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <Icon className={`w-8 h-8 mx-auto mb-2 text-${plan.color}-600`} />
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.price}</p>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500">Current Plan</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feature Highlight */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What you'll get with {featureName}:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {featureName === 'AI Tools' && (
                <>
                  <li>• 29+ AI-powered business tools</li>
                  <li>• Email analysis and composition</li>
                  <li>• Smart search and document analysis</li>
                  <li>• Meeting summaries and business insights</li>
                  <li>• Image generation and vision analysis</li>
                </>
              )}
              {featureName === 'Sales Tools' && (
                <>
                  <li>• Lead automation and territory management</li>
                  <li>• Advanced quote builder and invoicing</li>
                  <li>• Commission tracking and sales analytics</li>
                  <li>• Appointment scheduling and calendar sync</li>
                </>
              )}
              {featureName === 'Communication Tools' && (
                <>
                  <li>• Email composer and video email</li>
                  <li>• SMS messaging and campaigns</li>
                  <li>• Phone system integration</li>
                  <li>• Communication hub and tracking</li>
                </>
              )}
              {featureName === 'Apps & Integration' && (
                <>
                  <li>• 8+ third-party app integrations</li>
                  <li>• API access and webhook configuration</li>
                  <li>• CRM connections and data sync</li>
                  <li>• Calendar integration and automation</li>
                  <li>• Zapier and custom integrations</li>
                </>
              )}
              {featureName === 'White Label Access' && (
                <>
                  <li>• Custom branding and domain configuration</li>
                  <li>• Reseller portal and multi-tenant management</li>
                  <li>• White-label deployment capabilities</li>
                  <li>• Custom logo and color scheme</li>
                  <li>• Client management and billing tools</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <ModernButton
              variant="ghost"
              onClick={onClose}
              className="text-gray-600"
            >
              Cancel
            </ModernButton>
            <div className="flex items-center space-x-3">
              <ModernButton
                variant="outline"
                onClick={onClose}
                className="text-gray-600"
              >
                Continue with {currentPlan}
              </ModernButton>
              <ModernButton
                variant="primary"
                onClick={handleUpgrade}
                loading={upgrading}
                className="flex items-center space-x-2"
              >
                <span>Upgrade to {plans[selectedPlan as keyof typeof plans]?.name || selectedPlan}</span>
                <ArrowRight className="w-4 h-4" />
              </ModernButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};