import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Grid3X3, Settings, Shield } from 'lucide-react';
import ConnectedApps from '../dashboard/ConnectedApps';

const IntegrationsSystem: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl mr-3">
          <Grid3X3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Integrations & System</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Connected apps and system settings
          </p>
        </div>
      </div>

      {/* Connected Apps */}
      <div className="mb-6">
        <ConnectedApps />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>System Status</h3>
            <Settings className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Database</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>API Services</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Backup Status</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Up to date</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Security</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security & Compliance</h3>
            <Shield className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>SSL Certificate</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>2FA Enabled</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GDPR Compliance</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Compliant</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Data Encryption</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 mt-6`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>API Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>OpenAI API</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Connected and operational</p>
            <div className="mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
          
          <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Gemini API</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Connected and operational</p>
            <div className="mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
          
          <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Email Service</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>SendGrid integration</p>
            <div className="mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSystem;