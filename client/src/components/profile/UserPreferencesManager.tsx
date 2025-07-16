import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    density: 'compact' | 'comfortable' | 'spacious';
    language: string;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    dataSharing: boolean;
    analytics: boolean;
  };
  workflow: {
    autoSave: boolean;
    defaultView: 'dashboard' | 'contacts' | 'deals' | 'tasks';
    timeFormat: '12h' | '24h';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timezone: string;
  };
  ai: {
    autoSuggestions: boolean;
    smartCompletion: boolean;
    personalization: boolean;
    modelPreference: 'balanced' | 'fast' | 'accurate';
  };
}

interface UserPreferencesManagerProps {
  userId: string;
  initialPreferences?: Partial<UserPreferences>;
  onSave: (preferences: UserPreferences) => Promise<void>;
  className?: string;
}

export const UserPreferencesManager: React.FC<UserPreferencesManagerProps> = ({
  userId,
  initialPreferences = {},
  onSave,
  className = ''
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
      ...initialPreferences.notifications
    },
    appearance: {
      theme: 'light',
      density: 'comfortable',
      language: 'en',
      ...initialPreferences.appearance
    },
    privacy: {
      profileVisibility: 'team',
      dataSharing: false,
      analytics: true,
      ...initialPreferences.privacy
    },
    workflow: {
      autoSave: true,
      defaultView: 'dashboard',
      timeFormat: '12h',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'America/New_York',
      ...initialPreferences.workflow
    },
    ai: {
      autoSuggestions: true,
      smartCompletion: true,
      personalization: true,
      modelPreference: 'balanced',
      ...initialPreferences.ai
    }
  });

  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance' | 'privacy' | 'workflow' | 'ai'>('notifications');
  const [isLoading, setSisLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(preferences) !== JSON.stringify(initialPreferences));
  }, [preferences, initialPreferences]);

  const handleSave = async () => {
    setSisLoading(true);
    try {
      await onSave(preferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSisLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences({
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      },
      appearance: {
        theme: 'light',
        density: 'comfortable',
        language: 'en'
      },
      privacy: {
        profileVisibility: 'team',
        dataSharing: false,
        analytics: true
      },
      workflow: {
        autoSave: true,
        defaultView: 'dashboard',
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'America/New_York'
      },
      ai: {
        autoSuggestions: true,
        smartCompletion: true,
        personalization: true,
        modelPreference: 'balanced'
      }
    });
  };

  const updatePreference = (category: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'workflow', label: 'Workflow', icon: Settings },
    { id: 'ai', label: 'AI Settings', icon: RefreshCw }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">User Preferences</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetPreferences}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as unknown)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-xs text-gray-500">Receive updates and alerts via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => updatePreference('notifications', 'email', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                    <p className="text-xs text-gray-500">Get important alerts via text message</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    onChange={(e) => updatePreference('notifications', 'sms', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-xs text-gray-500">Browser notifications for real-time updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={(e) => updatePreference('notifications', 'push', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Marketing Communications</label>
                    <p className="text-xs text-gray-500">Product updates and promotional content</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.marketing}
                    onChange={(e) => updatePreference('notifications', 'marketing', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Appearance Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={preferences.appearance.theme}
                    onChange={(e) => updatePreference('appearance', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Density</label>
                  <select
                    value={preferences.appearance.density}
                    onChange={(e) => updatePreference('appearance', 'density', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={preferences.appearance.language}
                    onChange={(e) => updatePreference('appearance', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Privacy Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={preferences.privacy.profileVisibility}
                    onChange={(e) => updatePreference('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="team">Team Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data Sharing</label>
                    <p className="text-xs text-gray-500">Allow data sharing for product improvement</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy.dataSharing}
                    onChange={(e) => updatePreference('privacy', 'dataSharing', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Usage Analytics</label>
                    <p className="text-xs text-gray-500">Help us improve by sharing usage data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.privacy.analytics}
                    onChange={(e) => updatePreference('privacy', 'analytics', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Workflow Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto-save</label>
                    <p className="text-xs text-gray-500">Automatically save changes as you work</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.workflow.autoSave}
                    onChange={(e) => updatePreference('workflow', 'autoSave', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                  <select
                    value={preferences.workflow.defaultView}
                    onChange={(e) => updatePreference('workflow', 'defaultView', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="contacts">Contacts</option>
                    <option value="deals">Deals</option>
                    <option value="tasks">Tasks</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                    <select
                      value={preferences.workflow.timeFormat}
                      onChange={(e) => updatePreference('workflow', 'timeFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={preferences.workflow.dateFormat}
                      onChange={(e) => updatePreference('workflow', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">AI Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto-suggestions</label>
                    <p className="text-xs text-gray-500">Get AI-powered suggestions while you work</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.ai.autoSuggestions}
                    onChange={(e) => updatePreference('ai', 'autoSuggestions', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Smart Completion</label>
                    <p className="text-xs text-gray-500">Auto-complete forms and fields</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.ai.smartCompletion}
                    onChange={(e) => updatePreference('ai', 'smartCompletion', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Personalization</label>
                    <p className="text-xs text-gray-500">Customize AI responses to your style</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.ai.personalization}
                    onChange={(e) => updatePreference('ai', 'personalization', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Model Preference</label>
                  <select
                    value={preferences.ai.modelPreference}
                    onChange={(e) => updatePreference('ai', 'modelPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="balanced">Balanced (Best overall)</option>
                    <option value="fast">Fast (Quick responses)</option>
                    <option value="accurate">Accurate (Detailed responses)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};