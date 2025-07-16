import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import { Shield, Globe, Github, Mail, Apple, Settings, Check, X, Key, Users, AlertCircle, Info } from 'lucide-react';

interface AuthProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  configured: boolean;
  description: string;
  setupUrl?: string;
  color: string;
}

export const SSOConfiguration: React.FC = () => {
  const [providers, setProviders] = useState<AuthProvider[]>([
    {
      id: 'google',
      name: 'Google',
      icon: Globe,
      enabled: true,
      configured: true,
      description: 'Sign in with Google accounts',
      color: 'bg-red-500'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      enabled: true,
      configured: true,
      description: 'Sign in with GitHub accounts',
      color: 'bg-gray-900'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: Apple,
      enabled: false,
      configured: false,
      description: 'Sign in with Apple ID',
      color: 'bg-black'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: X,
      enabled: false,
      configured: false,
      description: 'Sign in with X accounts',
      color: 'bg-black'
    },
    {
      id: 'email',
      name: 'Email/Password',
      icon: Mail,
      enabled: true,
      configured: true,
      description: 'Traditional email and password authentication',
      color: 'bg-blue-500'
    }
  ]);

  const [ssoSettings, setSsoSettings] = useState({
    enableSSO: true,
    requireSSO: false,
    allowEmailFallback: true,
    sessionTimeout: 24, // hours
    enforceEmailVerification: true
  });

  const toggleProvider = (providerId: string) => {
    setProviders(providers.map(provider => 
      provider.id === providerId 
        ? { ...provider, enabled: !provider.enabled }
        : provider
    ));
  };

  const handleSettingChange = (setting: keyof typeof ssoSettings, value: boolean | number) => {
    setSsoSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/sso-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers, settings: ssoSettings })
      });

      if (response.ok) {
        alert('SSO configuration saved successfully!');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving SSO config:', error);
      alert('Failed to save SSO configuration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SSO Configuration
          </h1>
          <p className="text-gray-600">
            Configure Single Sign-On providers for your multi-app ecosystem
          </p>
        </div>

        {/* SSO Benefits Card */}
        <GlassCard className="mb-8 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-lg">
                <Info className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Single Sign-On Benefits
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Users sign in once and access all your applications</li>
                <li>• Improved security with centralized authentication</li>
                <li>• Better user experience with seamless app switching</li>
                <li>• Reduced password fatigue and support tickets</li>
                <li>• Enterprise-grade security with provider compliance</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Authentication Providers */}
        <GlassCard className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Authentication Providers
          </h2>
          
          <div className="space-y-4">
            {providers.map((provider) => {
              const Icon = provider.icon;
              return (
                <div key={provider.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-200/50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${provider.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{provider.name}</h3>
                        {provider.configured ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{provider.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {!provider.configured && (
                      <ModernButton
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </ModernButton>
                    )}
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provider.enabled}
                        onChange={() => toggleProvider(provider.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* SSO Settings */}
        <GlassCard className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            SSO Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Enable SSO</h3>
                <p className="text-sm text-gray-500">Allow users to sign in with external providers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ssoSettings.enableSSO}
                  onChange={(e) => handleSettingChange('enableSSO', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Require SSO</h3>
                <p className="text-sm text-gray-500">Force users to use SSO (disable email/password)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ssoSettings.requireSSO}
                  onChange={(e) => handleSettingChange('requireSSO', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Allow Email Fallback</h3>
                <p className="text-sm text-gray-500">Allow email/password when SSO fails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ssoSettings.allowEmailFallback}
                  onChange={(e) => handleSettingChange('allowEmailFallback', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Session Timeout</h3>
                <p className="text-sm text-gray-500">Hours before requiring re-authentication</p>
              </div>
              <select
                value={ssoSettings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 hour</option>
                <option value={8}>8 hours</option>
                <option value={24}>24 hours</option>
                <option value={168}>7 days</option>
                <option value={720}>30 days</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Multi-App SSO Status */}
        <GlassCard className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Multi-App SSO Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Smart CRM</h3>
                  <p className="text-sm text-gray-500">Main application - SSO enabled</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Partner Portal</h3>
                  <p className="text-sm text-gray-500">Reseller management - SSO ready</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-medium">Ready</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Admin Console</h3>
                  <p className="text-sm text-gray-500">System administration - SSO ready</p>
                </div>
              </div>
              <span className="text-sm text-purple-600 font-medium">Ready</span>
            </div>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <ModernButton
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Reset Changes
          </ModernButton>
          <ModernButton
            variant="primary"
            onClick={saveConfiguration}
          >
            <Key className="w-4 h-4 mr-2" />
            Save SSO Configuration
          </ModernButton>
        </div>
      </div>
    </div>
  );
};