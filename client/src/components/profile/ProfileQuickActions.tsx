import React, { useState } from 'react';
import { User, Settings, Shield, CreditCard, LogOut, Edit3, Camera, Bell, Globe } from 'lucide-react';

interface ProfileQuickActionsProps {
  user: unknown;
  onEditProfile: () => void;
  onSignOut: () => void;
}

export const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({
  user,
  onEditProfile,
  onSignOut
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-500';
      case 'professional': return 'bg-blue-500';
      case 'basic': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="relative">
          <img
            src={user.profileImageUrl || '/api/placeholder/40/40'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user.fullName || user.firstName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {user.jobTitle || 'User'}
          </p>
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Profile Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user.profileImageUrl || '/api/placeholder/60/60'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <button className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getPlanColor(user.subscriptionPlan)}`}></div>
                  <span className="text-xs text-gray-500 capitalize">{user.subscriptionPlan} Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{user.loginCount || 0}</p>
                <p className="text-xs text-gray-500">Logins</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {user.subscriptionPlan === 'enterprise' ? '99' : 
                   user.subscriptionPlan === 'professional' ? '49' : 
                   user.subscriptionPlan === 'basic' ? '19' : '0'}
                </p>
                <p className="text-xs text-gray-500">$/month</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {new Date(user.createdAt).getFullYear()}
                </p>
                <p className="text-xs text-gray-500">Joined</p>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="p-2">
            <button
              onClick={onEditProfile}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Edit Profile</span>
            </button>

            <button
              onClick={() => window.location.href = '/profile-settings'}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Account Settings</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Privacy & Security</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Billing & Plans</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Notifications</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Language & Region</span>
            </button>

            <hr className="my-2" />

            <button
              onClick={onSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              Last login: {new Date(user.lastLogin).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};