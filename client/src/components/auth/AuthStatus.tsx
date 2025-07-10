import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Shield, Crown } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  subscriptionPlan: string;
  profileImageUrl?: string;
}

interface AuthStatusProps {
  user: User | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ 
  user, 
  isAuthenticated, 
  onLogout 
}) => {
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/signin"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <User className="w-3 h-3 mr-1" />
            User
          </span>
        );
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
        )}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-gray-500">
            {user.subscriptionPlan} plan
          </div>
        </div>
        {getRoleIcon(user.role)}
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="mt-1">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>
        </div>

        <div className="py-2">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-3" />
            Profile Settings
          </Link>
          
          {user.role === 'super_admin' && (
            <Link
              to="/super-admin-dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Crown className="w-4 h-4 mr-3" />
              Super Admin Dashboard
            </Link>
          )}
          
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-3" />
            Account Settings
          </Link>
        </div>

        <div className="border-t border-gray-200 py-2">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};