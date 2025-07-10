import React, { useState } from 'react';
import { Crown, Users, Settings, Shield, BarChart3, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FeatureAccessBadge, FeatureGuard, FeatureUsageBadge, PlanComparison } from '@/components/features/FeatureAccessBadge';
import { SubscriptionPlan, FeaturePermissions, FEATURE_PLANS } from '@shared/featureControl';

interface UserStats {
  totalUsers: number;
  activeSubscriptions: number;
  freeUsers: number;
  basicUsers: number;
  professionalUsers: number;
  enterpriseUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

export const UserManagementDashboard: React.FC = () => {
  const { isAdmin, userPlan, permissions, hasAccess } = useFeatureAccess();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('professional');

  // Mock user stats for admin dashboard
  const userStats: UserStats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    freeUsers: 355,
    basicUsers: 234,
    professionalUsers: 412,
    enterpriseUsers: 246,
    monthlyRevenue: 45620,
    churnRate: 3.2,
  };

  if (!isAdmin) {
    return (
      <div className="p-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-900">Access Denied</h2>
        </div>
        <p className="text-red-700">Only super admins can access the user management dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        </div>
        <p className="text-purple-100">Manage user features, subscriptions, and platform access control</p>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-green-600">{userStats.activeSubscriptions.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${userStats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.churnRate}%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Subscription Plan Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Free</p>
            <p className="text-xl font-bold text-gray-700">{userStats.freeUsers}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Basic</p>
            <p className="text-xl font-bold text-blue-700">{userStats.basicUsers}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600">Professional</p>
            <p className="text-xl font-bold text-purple-700">{userStats.professionalUsers}</p>
          </div>
          <div className="text-center p-4 bg-gold-50 rounded-lg">
            <p className="text-sm text-yellow-600">Enterprise</p>
            <p className="text-xl font-bold text-yellow-700">{userStats.enterpriseUsers}</p>
          </div>
        </div>
      </div>

      {/* Feature Control Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Feature Access Control Matrix</h2>
        
        {/* Plan Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Plan to View Features:
          </label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as SubscriptionPlan)}
            className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="free">Free Plan</option>
            <option value="basic">Basic Plan</option>
            <option value="professional">Professional Plan</option>
            <option value="enterprise">Enterprise Plan</option>
          </select>
        </div>

        {/* Feature Matrix */}
        <div className="space-y-6">
          {Object.entries(FEATURE_PLANS[selectedPlan]).map(([category, features]) => {
            if (category === 'limits') return null;
            
            return (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-800 mb-3 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(features as Record<string, boolean>).map(([featureName, enabled]) => (
                    <div key={featureName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 capitalize">
                        {featureName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <FeatureAccessBadge
                        featureCategory={category as keyof FeaturePermissions}
                        featureName={featureName}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Limits */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Usage Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(FEATURE_PLANS[selectedPlan].limits).map(([limitName, limitValue]) => (
              <div key={limitName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700 capitalize">
                  {limitName.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {limitValue === -1 ? 'Unlimited' : limitValue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">View, edit, and manage user accounts</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Settings className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Feature Toggles</h3>
            <p className="text-sm text-gray-600">Enable/disable features for plans</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Usage Analytics</h3>
            <p className="text-sm text-gray-600">View platform usage statistics</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Shield className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-600">Manage platform security</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Lock className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-medium text-gray-900">Access Control</h3>
            <p className="text-sm text-gray-600">Configure role-based permissions</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Crown className="w-6 h-6 text-yellow-600 mb-2" />
            <h3 className="font-medium text-gray-900">White Label</h3>
            <p className="text-sm text-gray-600">Customize platform branding</p>
          </button>
        </div>
      </div>

      {/* Current Admin Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-semibold text-purple-900">Your Admin Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-purple-700 mb-2">Access Level:</p>
            <FeatureAccessBadge
              featureCategory="system"
              featureName="whiteLabeling"
              showLabel={true}
              size="md"
            />
          </div>
          <div>
            <p className="text-sm text-purple-700 mb-2">Current Plan:</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
              {userPlan.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="text-sm text-purple-600 mt-4">
          As a super admin, you have unlimited access to all platform features and can manage user permissions.
        </p>
      </div>
    </div>
  );
};