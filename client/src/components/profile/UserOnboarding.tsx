import React, { useState } from 'react';
import { Check, User, Building, Sparkles, Target, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  action: () => void;
  importance: 'high' | 'medium' | 'low';
}

interface UserOnboardingProps {
  user: unknown;
  onComplete: (step: string) => void;
  className?: string;
}

export const UserOnboarding: React.FC<UserOnboardingProps> = ({
  user,
  onComplete,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your photo, job title, and company information',
      icon: User,
      completed: !!(user.profileImageUrl && user.jobTitle && user.company),
      action: () => onComplete('profile'),
      importance: 'high'
    },
    {
      id: 'preferences',
      title: 'Set Your Preferences',
      description: 'Configure notifications, timezone, and working hours',
      icon: Settings,
      completed: !!(user.preferences?.timezone && user.preferences?.workingHours),
      action: () => onComplete('preferences'),
      importance: 'high'
    },
    {
      id: 'contacts',
      title: 'Import Your Contacts',
      description: 'Upload your existing contacts or connect your email',
      icon: Building,
      completed: false, // This would check if user has contacts
      action: () => onComplete('contacts'),
      importance: 'medium'
    },
    {
      id: 'ai-tools',
      title: 'Explore AI Tools',
      description: 'Try our AI-powered features to boost your productivity',
      icon: Sparkles,
      completed: false, // This would check if user has used AI tools
      action: () => onComplete('ai-tools'),
      importance: 'medium'
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      description: 'Define your sales targets and business objectives',
      icon: Target,
      completed: false, // This would check if user has set goals
      action: () => onComplete('goals'),
      importance: 'low'
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high': return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">High Priority</span>;
      case 'medium': return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Medium Priority</span>;
      case 'low': return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Low Priority</span>;
      default: return null;
    }
  };

  if (completedSteps === totalSteps) {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Welcome to Smart CRM!</h3>
              <p className="text-sm text-gray-600">Your account is fully set up and ready to use</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">100%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
            <p className="text-sm text-gray-600">Complete your setup to unlock the full potential of Smart CRM</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Setup Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {completedSteps} of {totalSteps} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                step.completed
                  ? 'border-green-200 bg-green-50'
                  : getImportanceColor(step.importance)
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      {!step.completed && getImportanceBadge(step.importance)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <span className="text-sm font-medium text-green-600">Completed</span>
                  ) : (
                    <button
                      onClick={step.action}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Complete Profile</span>
              </div>
            </button>
            <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Import Contacts</span>
              </div>
            </button>
            <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Try AI Tools</span>
              </div>
            </button>
            <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Set Goals</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};