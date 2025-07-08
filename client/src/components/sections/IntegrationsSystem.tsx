import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Grid3X3, Settings, Zap } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Apps */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <Grid3X3 className={`h-5 w-5 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Connected Applications</h3>
          </div>
          <ConnectedApps />
        </div>

        {/* System Settings */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <Settings className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>System Settings</h3>
          </div>
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>System configuration panel coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSystem;