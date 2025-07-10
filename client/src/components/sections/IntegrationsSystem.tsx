import React from 'react';
import { Grid3X3, Settings, Zap } from 'lucide-react';
import ConnectedApps from '../dashboard/ConnectedApps';

const IntegrationsSystem: React.FC = () => {

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl mr-3">
          <Grid3X3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Integrations & System</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connected apps and system settings
          </p>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Status</h3>
              <div className="text-sm text-green-600 dark:text-green-400">All systems operational</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Sync</h3>
              <div className="text-sm text-blue-600 dark:text-blue-400">Last sync: 5 min ago</div>
            </div>
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ready for setup</div>
            </div>
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Connected Apps */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Connected Applications</h3>
        <ConnectedApps />
      </div>
      
      {/* Environment Variables & Configuration */}
      <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Environment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">OpenAI API</div>
            <div className="text-xs text-green-600 dark:text-green-400">✓ Connected</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Gemini API</div>
            <div className="text-xs text-green-600 dark:text-green-400">✓ Connected</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</div>
            <div className="text-xs text-green-600 dark:text-green-400">✓ Connected</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Service</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">⚠ Configuration needed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSystem;