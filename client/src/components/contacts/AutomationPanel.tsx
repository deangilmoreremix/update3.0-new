import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { Play, Pause, Settings, BarChart3, Plus, Clock, Target, Zap } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: AutomationAction[];
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
}

interface AutomationAction {
  type: 'email' | 'sms' | 'call' | 'task' | 'wait' | 'tag';
  description: string;
  delay?: string;
  template?: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  industry?: string;
  avatarSrc: string;
  sources: string[];
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  status: 'active' | 'pending' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'churned';
  lastConnected?: string;
  notes?: string;
  aiScore?: number;
  tags?: string[];
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AutomationPanelProps {
  contact: Contact;
}

const mockAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'New Lead Follow-up',
    description: 'Automatically send welcome email and schedule follow-up',
    trigger: 'Contact created',
    actions: [
      { type: 'email', description: 'Send welcome email', template: 'welcome' },
      { type: 'wait', description: 'Wait 2 days', delay: '2 days' },
      { type: 'task', description: 'Create follow-up task' }
    ],
    isActive: true,
    lastTriggered: '2024-01-15T10:30:00Z',
    triggerCount: 127,
    successRate: 85
  },
  {
    id: 'rule-2',
    name: 'Re-engagement Campaign',
    description: 'Re-engage cold contacts with personalized content',
    trigger: 'Contact inactive for 30 days',
    actions: [
      { type: 'email', description: 'Send re-engagement email', template: 're-engage' },
      { type: 'tag', description: 'Add "re-engagement" tag' }
    ],
    isActive: false,
    lastTriggered: '2024-01-10T14:20:00Z',
    triggerCount: 43,
    successRate: 62
  },
  {
    id: 'rule-3',
    name: 'Hot Lead Notification',
    description: 'Immediate notification for high-value prospects',
    trigger: 'Interest level: Hot',
    actions: [
      { type: 'sms', description: 'Send SMS to sales rep' },
      { type: 'task', description: 'Create urgent follow-up task' }
    ],
    isActive: true,
    lastTriggered: '2024-01-16T09:15:00Z',
    triggerCount: 89,
    successRate: 94
  }
];

const automationTemplates = [
  {
    name: 'Lead Nurturing',
    description: 'Standard lead nurturing sequence',
    triggers: ['New lead', 'Form submission', 'Demo request']
  },
  {
    name: 'Customer Onboarding',
    description: 'Automated onboarding workflow',
    triggers: ['Deal closed', 'Contract signed', 'Payment received']
  },
  {
    name: 'Win-back Campaign',
    description: 'Re-engage churned customers',
    triggers: ['Subscription cancelled', 'No activity 60 days', 'Negative feedback']
  }
];

export const AutomationPanel: React.FC<AutomationPanelProps> = ({ contact }) => {
  const [activeTab, setActiveTab] = useState('rules');

  const handleToggleRule = (ruleId: string) => {
    console.log('Toggle automation rule:', ruleId);
    // In real implementation, this would update the rule status
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'call': return '📞';
      case 'task': return '✓';
      case 'wait': return '⏱️';
      case 'tag': return '🏷️';
      default: return '⚡';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Automation Rules</h3>
        <ModernButton variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </ModernButton>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'rules'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Rules
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Active Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {mockAutomationRules.map((rule) => (
            <GlassCard key={rule.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{rule.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{rule.description}</p>
                  
                  {/* Trigger */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="font-medium">Trigger:</span>
                    <span className="ml-2">{rule.trigger}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      <span>{rule.triggerCount} triggers</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      <span>{rule.successRate}% success</span>
                    </div>
                    {rule.lastTriggered && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Last: {new Date(rule.lastTriggered).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRule(rule.id)}
                  >
                    {rule.isActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </ModernButton>
                  <ModernButton variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </ModernButton>
                </div>
              </div>

              {/* Actions Flow */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Actions:</p>
                <div className="flex items-center space-x-2">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
                        <span className="mr-2">{getActionIcon(action.type)}</span>
                        {action.description}
                      </div>
                      {index < rule.actions.length - 1 && (
                        <div className="mx-2 text-gray-300">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationTemplates.map((template, index) => (
            <GlassCard key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                <ModernButton variant="outline" size="sm">
                  Use Template
                </ModernButton>
              </div>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Common Triggers:</p>
                <div className="space-y-1">
                  {template.triggers.map((trigger, idx) => (
                    <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md mr-2">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Automation Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">127</div>
                <div className="text-sm text-gray-500">Total Triggers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3.2h</div>
                <div className="text-sm text-gray-500">Time Saved</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact-Specific Triggers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Welcome email sent</span>
                <span className="text-xs text-gray-500">{contact.createdAt}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Follow-up task created</span>
                <span className="text-xs text-gray-500">Pending</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};