import React, { useState } from 'react';
import { Target, Video, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SalesToolsPanel } from './SalesToolsPanel';
import DevicePermissionChecker from '../DevicePermissionChecker';

interface SalesToolsLauncherProps {
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  variant?: 'button' | 'fab' | 'dropdown';
  className?: string;
}

export const SalesToolsLauncher: React.FC<SalesToolsLauncherProps> = ({
  contactId,
  contactName,
  contactEmail,
  contactPhone,
  variant = 'button',
  className = ''
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const quickActions = [
    {
      id: 'video',
      name: 'Record Video',
      icon: Video,
      color: 'bg-red-500',
      description: 'Record a personalized video message'
    },
    {
      id: 'call',
      name: 'Schedule Call',
      icon: Phone,
      color: 'bg-green-500',
      description: 'Schedule a sales call'
    },
    {
      id: 'email',
      name: 'Send Email',
      icon: Mail,
      color: 'bg-blue-500',
      description: 'Send personalized email'
    },
    {
      id: 'tools',
      name: 'All Tools',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Access all sales tools'
    }
  ];

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'tools') {
      setIsOpen(true);
    } else {
      // Open tools panel with specific tool pre-selected
      setIsOpen(true);
    }
    setShowDropdown(false);
  };

  if (variant === 'fab') {
    return (
      <>
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            {/* Quick Actions Menu */}
            {showDropdown && (
              <div className="absolute bottom-16 right-0 mb-2 w-64 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                  {contactName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      for {contactName}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                      >
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {action.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FAB Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              <Target className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Backdrop */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} ${className}`}
        >
          <Target className="w-4 h-4" />
          <span className="text-sm font-medium">Sales Tools</span>
        </button>

        {showDropdown && (
          <>
            <div className="absolute top-full right-0 mt-2 w-72 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Sales Tools
                </h3>
                {contactName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Working with {contactName}
                  </p>
                )}
              </div>
              <div className="py-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isDark
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${className}`}
      >
        <Target className="w-4 h-4" />
        <span className="text-sm font-medium">Sales Tools</span>
      </button>

      {/* Full Sales Tools Panel Modal */}
      {isOpen && (
        <>
          <DevicePermissionChecker />
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-6xl h-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <Target className={`w-5 h-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Sales Tools
                  </h2>
                  {contactName && (
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Working with {contactName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  isDark ? 'hover:bg-gray-800 text-gray-400' : 'text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sales Tools Panel Content */}
            <div className="h-full">
              <SalesToolsPanel
                contactId={contactId}
                contactName={contactName}
                contactEmail={contactEmail}
                contactPhone={contactPhone}
              />
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SalesToolsLauncher;