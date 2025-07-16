import React from 'react';
import { UserManagementDashboard } from '@/components/admin/UserManagementDashboard';
import { FeatureAccessBadge, FeatureGuard, FeatureUsageBadge } from '@/components/features/FeatureAccessBadge';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Crown, Users, Mail, Brain, Phone, Video, Settings } from 'lucide-react';

export const FeatureTestPage: React.FC = () => {
  const featureAccess = useFeatureAccess();

  if (featureAccess.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Feature Access Control System</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Current User</h3>
              <p className="text-blue-700">{featureAccess.user?.email}</p>
              {featureAccess.isAdmin && (
                <div className="flex items-center gap-2 mt-2">
                  <Crown className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 font-medium">Super Admin</span>
                </div>
              )}
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Subscription Plan</h3>
              <p className="text-purple-700 font-medium">{featureAccess.userPlan.toUpperCase()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Status</h3>
              <p className="text-green-700">{featureAccess.isSubscriptionActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Contact Management</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>View Contacts</span>
                <FeatureAccessBadge featureCategory="contacts" featureName="view" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Create Contacts</span>
                <FeatureAccessBadge featureCategory="contacts" featureName="create" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>AI Enrichment</span>
                <FeatureAccessBadge featureCategory="contacts" featureName="aiEnrichment" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Bulk Operations</span>
                <FeatureAccessBadge featureCategory="contacts" featureName="bulkOperations" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Contact Limit</span>
                <FeatureUsageBadge limitType="maxContacts" />
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">AI Tools</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Basic AI</span>
                <FeatureAccessBadge featureCategory="aiTools" featureName="basicAI" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Advanced AI</span>
                <FeatureAccessBadge featureCategory="aiTools" featureName="advancedAI" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Email Composer</span>
                <FeatureAccessBadge featureCategory="aiTools" featureName="emailComposer" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Business Analyzer</span>
                <FeatureAccessBadge featureCategory="aiTools" featureName="businessAnalyzer" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Requests/Month</span>
                <FeatureUsageBadge limitType="maxAIRequests" />
              </div>
            </div>
          </div>

          {/* Communication */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">Communication</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Basic Email</span>
                <FeatureAccessBadge featureCategory="communication" featureName="basicEmail" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>SMS</span>
                <FeatureAccessBadge featureCategory="communication" featureName="sms" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Video Email</span>
                <FeatureAccessBadge featureCategory="communication" featureName="videoEmail" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Phone Integration</span>
                <FeatureAccessBadge featureCategory="communication" featureName="phoneIntegration" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Emails/Month</span>
                <FeatureUsageBadge limitType="maxEmailsPerMonth" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SMS/Month</span>
                <FeatureUsageBadge limitType="maxSMSPerMonth" />
              </div>
            </div>
          </div>

          {/* System Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold">System Features</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>API Access</span>
                <FeatureAccessBadge featureCategory="system" featureName="apiAccess" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Webhooks</span>
                <FeatureAccessBadge featureCategory="system" featureName="webhooks" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Team Management</span>
                <FeatureAccessBadge featureCategory="system" featureName="teamManagement" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>White Labeling</span>
                <FeatureAccessBadge featureCategory="system" featureName="whiteLabeling" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Members</span>
                <FeatureUsageBadge limitType="maxTeamMembers" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Guard Examples */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Guard Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Advanced AI Features</h3>
              <FeatureGuard featureCategory="aiTools" featureName="advancedAI">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Brain className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-green-900">Advanced AI Tools Available</h4>
                  <p className="text-sm text-green-700">You can access advanced AI features like business analysis and predictive insights.</p>
                </div>
              </FeatureGuard>
            </div>

            <div>
              <h3 className="font-medium mb-3">White Label Features</h3>
              <FeatureGuard featureCategory="system" featureName="whiteLabeling">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Crown className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900">White Label Access</h4>
                  <p className="text-sm text-purple-700">You can customize the platform branding and appearance.</p>
                </div>
              </FeatureGuard>
            </div>

            <div>
              <h3 className="font-medium mb-3">Video Email</h3>
              <FeatureGuard featureCategory="communication" featureName="videoEmail">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-blue-900">Video Email Available</h4>
                  <p className="text-sm text-blue-700">Send personalized video messages to your contacts.</p>
                </div>
              </FeatureGuard>
            </div>

            <div>
              <h3 className="font-medium mb-3">Phone Integration</h3>
              <FeatureGuard featureCategory="communication" featureName="phoneIntegration">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Phone className="w-6 h-6 text-orange-600 mb-2" />
                  <h4 className="font-medium text-orange-900">Phone System Ready</h4>
                  <p className="text-sm text-orange-700">Make and receive calls directly from the platform.</p>
                </div>
              </FeatureGuard>
            </div>
          </div>
        </div>

        {/* Admin Dashboard (Only for Super Admins) */}
        <FeatureGuard featureCategory="system" featureName="whiteLabeling" showUpgradeMessage={false}>
          <UserManagementDashboard />
        </FeatureGuard>
      </div>
    </div>
  );
};