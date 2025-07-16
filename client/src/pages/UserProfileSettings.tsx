import React, { useState, useEffect } from 'react';
import { User, Settings, Activity, ArrowLeft } from 'lucide-react';
import { UserProfileModal } from '../components/profile/UserProfileModal';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  profileImageUrl?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    darkMode: boolean;
    language: string;
    dateFormat: string;
    timeFormat: string;
    workingHours: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  accountStatus: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  paymentStatus: string;
  createdAt: string;
  lastLogin?: string;
  loginCount?: number;
  twoFactorEnabled?: boolean;
}

export const UserProfileSettings: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'activity' | 'security'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        // Enhance with default values for comprehensive profile
        const enhancedUser: UserProfile = {
          ...userData,
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            darkMode: false,
            language: 'en',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            workingHours: {
              start: '09:00',
              end: '17:00',
              timezone: userData.timezone || 'UTC'
            },
            ...userData.preferences
          },
          socialLinks: {
            linkedin: '',
            twitter: '',
            website: '',
            ...userData.socialLinks
          },
          lastLogin: new Date().toISOString(),
          loginCount: 42,
          twoFactorEnabled: false
        };
        setUser(enhancedUser);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'professional': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'basic': return 'bg-gradient-to-r from-green-500 to-teal-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trial': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load user profile</p>
          <button 
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.profileImageUrl || '/api/placeholder/128/128'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
                <p className="text-gray-600 mb-2">{user.jobTitle || 'User'}</p>
                <p className="text-sm text-gray-500 mb-4">{user.company || 'No company'}</p>
                
                {/* Subscription Badge */}
                <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium ${getSubscriptionColor(user.subscriptionPlan)} mb-4`}>
                  {user.subscriptionPlan.toUpperCase()} PLAN
                </div>

                {/* Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscriptionStatus)}`}>
                  {user.subscriptionStatus.toUpperCase()}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Logins</p>
                    <p className="text-xl font-bold text-gray-900">{user.loginCount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(user.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl mb-6">
              <nav className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'activity', label: 'Activity', icon: Activity },
                    { id: 'security', label: 'Security', icon: Shield }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as unknown)}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                        activeSection === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="p-6">
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    {/* Account Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                          <p className="text-gray-900">{user.timezone || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                          <p className="text-gray-900">{user.preferences.language}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">{user.subscriptionPlan} Plan</h4>
                            <p className="text-sm text-gray-600">
                              Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              {user.subscriptionPlan === 'enterprise' ? '$99' : 
                               user.subscriptionPlan === 'professional' ? '$49' : 
                               user.subscriptionPlan === 'basic' ? '$19' : 'Free'}
                            </p>
                            <p className="text-sm text-gray-500">/month</p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Upgrade Plan
                          </button>
                          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
                            Billing History
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">API Calls</p>
                            <p className="text-xs text-gray-500">85% used</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-1">8,500</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">Storage</p>
                            <p className="text-xs text-gray-500">24% used</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-1">2.4 GB</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">Team Members</p>
                            <p className="text-xs text-gray-500">60% used</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mt-1">3 / 5</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'activity' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {[
                          { action: 'Logged in', time: '2 hours ago', type: 'login' },
                          { action: 'Updated profile information', time: '1 day ago', type: 'update' },
                          { action: 'Changed password', time: '3 days ago', type: 'security' },
                          { action: 'Upgraded to Professional plan', time: '1 week ago', type: 'billing' },
                          { action: 'Created new contact', time: '2 weeks ago', type: 'action' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'login' ? 'bg-green-500' :
                                activity.type === 'update' ? 'bg-blue-500' :
                                activity.type === 'security' ? 'bg-red-500' :
                                activity.type === 'billing' ? 'bg-purple-500' :
                                'bg-gray-500'
                              }`}></div>
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            </div>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Login History</h3>
                      <div className="space-y-3">
                        {[
                          { location: 'New York, NY', device: 'Chrome on Windows', time: '2 hours ago', current: true },
                          { location: 'San Francisco, CA', device: 'Safari on iPhone', time: '1 day ago', current: false },
                          { location: 'London, UK', device: 'Firefox on Mac', time: '3 days ago', current: false }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{session.location}</p>
                              <p className="text-xs text-gray-500">{session.device}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{session.time}</p>
                              {session.current && (
                                <p className="text-xs text-green-600 font-medium">Current Session</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${user.twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <button
                                className={`px-3 py-1 rounded text-sm ${
                                  user.twoFactorEnabled
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Password</h4>
                              <p className="text-sm text-gray-600">Change your password regularly</p>
                            </div>
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm">
                              Change Password
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Email Notifications</h4>
                              <p className="text-sm text-gray-600">Security alerts and updates</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={user.preferences.emailNotifications}
                              onChange={(e) => handleUpdateProfile({
                                preferences: {
                                  ...user.preferences,
                                  emailNotifications: e.target.checked
                                }
                              })}
                              className="toggle-checkbox"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full p-4 bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100 text-left">
                          <h4 className="font-medium">Export Account Data</h4>
                          <p className="text-sm">Download all your data</p>
                        </button>
                        <button className="w-full p-4 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 text-left">
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm">Permanently delete your account</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
};