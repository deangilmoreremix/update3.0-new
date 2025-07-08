import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Zap, CheckCircle, Clock, AlertCircle, Plus, Settings } from 'lucide-react';

const IntegrationsSystem: React.FC = () => {
  const { isDark } = useTheme();

  const integrations = [
    {
      name: 'Salesforce',
      description: 'Sync contacts and deals',
      status: 'connected',
      lastSync: '2 minutes ago',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'HubSpot',
      description: 'Marketing automation',
      status: 'connected',
      lastSync: '5 minutes ago',
      icon: '🚀',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Slack',
      description: 'Team notifications',
      status: 'connected',
      lastSync: '1 minute ago',
      icon: '💬',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Gmail',
      description: 'Email integration',
      status: 'syncing',
      lastSync: 'Syncing now...',
      icon: '📧',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Zoom',
      description: 'Video meetings',
      status: 'error',
      lastSync: 'Failed 10 minutes ago',
      icon: '📹',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Calendly',
      description: 'Appointment scheduling',
      status: 'disconnected',
      lastSync: 'Never connected',
      icon: '📅',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'syncing':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'error':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      connected: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
      syncing: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700',
      error: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
      disconnected: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
    };

    return colors[status as keyof typeof colors] || colors.disconnected;
  };

  const systemStats = [
    {
      title: 'Active Integrations',
      value: integrations.filter(i => i.status === 'connected').length,
      total: integrations.length,
      icon: Zap,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Data Synced',
      value: '2.4k',
      total: 'records',
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Sync Frequency',
      value: '5',
      total: 'min avg',
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Success Rate',
      value: '98.5',
      total: '% uptime',
      icon: Settings,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Integrations & System</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Connect and sync with your favorite tools</p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
          isDark 
            ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}>
          <Plus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {stat.value}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              {stat.total && (
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stat.total}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Integrations Grid */}
      <div>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Connected Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${integration.color} flex items-center justify-center text-white text-lg`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {integration.name}
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {integration.description}
                    </p>
                  </div>
                </div>
                {getStatusIcon(integration.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(integration.status)}`}>
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </span>
                <button className={`p-1 rounded transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}>
                  <Settings className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                <p className={`text-xs ${getStatusColor(integration.status)}`}>
                  Last sync: {integration.lastSync}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}>
          Sync All Data
        </button>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}>
          Test Connections
        </button>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        }`}>
          Integration Settings
        </button>
      </div>
    </div>
  );
};

export default IntegrationsSystem;