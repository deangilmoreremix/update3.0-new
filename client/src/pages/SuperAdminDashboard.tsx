import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BulkUserUpload } from '../components/admin/BulkUserUpload';
import { MassRoleAssignment } from '../components/admin/MassRoleAssignment';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import {
  Crown, Users, Settings, Shield, BarChart3, Database, 
  Toggle, CheckCircle, XCircle, AlertTriangle, Plus,
  Search, Filter, Download, Upload, Mail, Eye, EyeOff,
  Zap, Target, Brain, Phone, MessageSquare, Calendar,
  FileText, TrendingUp, DollarSign, Globe, Lock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'user';
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  features: string[];
}

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'ai' | 'communication' | 'analytics' | 'integration';
  isEnabled: boolean;
  requiredPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  usageLimit?: number;
  icon: React.ComponentType<any>;
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bulk-upload' | 'features' | 'analytics'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Redirect if not super admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'super_admin')) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Initialize data
  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load users
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Load features
      const featuresResponse = await fetch('/api/admin/features');
      const featuresData = await featuresResponse.json();
      setFeatures(featuresData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const toggleFeature = async (featureId: string) => {
    try {
      const response = await fetch(`/api/admin/features/${featureId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setFeatures(prev => 
          prev.map(feature => 
            feature.id === featureId 
              ? { ...feature, isEnabled: !feature.isEnabled }
              : feature
          )
        );
      }
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, role: newRole as any } : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, isActive } : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const defaultFeatures: FeatureToggle[] = [
    {
      id: 'contacts',
      name: 'Contact Management',
      description: 'Core CRM contact management features',
      category: 'core',
      isEnabled: true,
      requiredPlan: 'free',
      icon: Users
    },
    {
      id: 'deals',
      name: 'Deal Pipeline',
      description: 'Sales pipeline and deal tracking',
      category: 'core',
      isEnabled: true,
      requiredPlan: 'basic',
      icon: TrendingUp
    },
    {
      id: 'ai_tools',
      name: 'AI Tools',
      description: 'AI-powered business analysis and insights',
      category: 'ai',
      isEnabled: true,
      requiredPlan: 'professional',
      usageLimit: 100,
      icon: Brain
    },
    {
      id: 'email_composer',
      name: 'AI Email Composer',
      description: 'AI-generated personalized emails',
      category: 'ai',
      isEnabled: true,
      requiredPlan: 'basic',
      usageLimit: 50,
      icon: Mail
    },
    {
      id: 'smart_search',
      name: 'Smart Search',
      description: 'AI-powered semantic search across data',
      category: 'ai',
      isEnabled: true,
      requiredPlan: 'professional',
      usageLimit: 200,
      icon: Search
    },
    {
      id: 'phone_system',
      name: 'Phone System',
      description: 'VoIP calling and call management',
      category: 'communication',
      isEnabled: false,
      requiredPlan: 'professional',
      icon: Phone
    },
    {
      id: 'sms_messaging',
      name: 'SMS Messaging',
      description: 'Text messaging and SMS campaigns',
      category: 'communication',
      isEnabled: false,
      requiredPlan: 'basic',
      usageLimit: 1000,
      icon: MessageSquare
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Business intelligence and reporting',
      category: 'analytics',
      isEnabled: true,
      requiredPlan: 'professional',
      icon: BarChart3
    },
    {
      id: 'api_access',
      name: 'API Access',
      description: 'REST API for integrations',
      category: 'integration',
      isEnabled: false,
      requiredPlan: 'enterprise',
      icon: Globe
    },
    {
      id: 'white_label',
      name: 'White Label',
      description: 'Custom branding and theming',
      category: 'integration',
      isEnabled: false,
      requiredPlan: 'enterprise',
      icon: Settings
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Platform management and feature control</p>
              </div>
            </div>
            <ModernButton 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </ModernButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload },
              { id: 'features', label: 'Features', icon: Settings },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Features</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayFeatures.filter(f => f.isEnabled).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Super Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'super_admin').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Platform Health</p>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <ModernButton
                onClick={() => navigate('/super-admin-signup')}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Super Admin</span>
              </ModernButton>
            </div>

            {/* Users Table */}
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${user.subscriptionPlan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              user.subscriptionPlan === 'professional' ? 'bg-blue-100 text-blue-800' :
                              user.subscriptionPlan === 'basic' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {user.subscriptionPlan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => updateUserStatus(user.id, !user.isActive)}
                            className={`
                              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                              ${user.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'}
                            `}
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-purple-600 hover:text-purple-900 mr-2">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Lock className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'bulk-upload' && (
          <div className="space-y-8">
            {/* Bulk User Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Bulk User Upload</h2>
                <div className="text-sm text-gray-600">
                  Upload CSV files to add multiple users at once
                </div>
              </div>
              
              <BulkUserUpload onUsersUploaded={(users) => {
                // Refresh users list after bulk upload
                loadDashboardData();
              }} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Mass Role Assignment Section */}
            <div className="space-y-6">
              <MassRoleAssignment 
                users={users}
                onRolesAssigned={(assignments) => {
                  // Refresh users list after role assignments
                  loadDashboardData();
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Feature Management</h2>
              <ModernButton variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Config</span>
              </ModernButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFeatures.map((feature) => (
                <GlassCard key={feature.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        feature.category === 'core' ? 'bg-blue-100 text-blue-600' :
                        feature.category === 'ai' ? 'bg-purple-100 text-purple-600' :
                        feature.category === 'communication' ? 'bg-green-100 text-green-600' :
                        feature.category === 'analytics' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFeature(feature.id)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${feature.isEnabled ? 'bg-green-500' : 'bg-gray-300'}
                      `}
                    >
                      <span className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${feature.isEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Required Plan:</span>
                      <span className="font-medium capitalize">{feature.requiredPlan}</span>
                    </div>
                    {feature.usageLimit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Usage Limit:</span>
                        <span className="font-medium">{feature.usageLimit}/month</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        feature.isEnabled ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {feature.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Analytics charts will be implemented here</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">Feature Usage</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Feature usage analytics will be implemented here</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;