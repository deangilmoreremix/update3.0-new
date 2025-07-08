import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, AlertCircle, Clock, ExternalLink, Settings, Zap } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex } from '../../services/avatarCollection';

const ConnectedApps: React.FC = () => {
  const { isDark } = useTheme();

  const connectedApps = [
    {
      name: 'Gmail Integration',
      description: 'Email tracking and automation',
      status: 'connected',
      lastSync: '2 minutes ago',
      icon: '📧',
      color: 'red'
    },
    {
      name: 'Zoom Meetings',
      description: 'Video conferencing and recordings',
      status: 'connected',
      lastSync: '5 minutes ago',
      icon: '📹',
      color: 'blue'
    },
    {
      name: 'LinkedIn Sales Navigator',
      description: 'Lead generation and outreach',
      status: 'connected',
      lastSync: '10 minutes ago',
      icon: '💼',
      color: 'blue'
    },
    {
      name: 'Slack Notifications',
      description: 'Team collaboration and alerts',
      status: 'connected',
      lastSync: '1 hour ago',
      icon: '💬',
      color: 'purple'
    },
    {
      name: 'HubSpot CRM',
      description: 'Customer data synchronization',
      status: 'syncing',
      lastSync: 'Syncing...',
      icon: '🔄',
      color: 'orange'
    },
    {
      name: 'Calendly Scheduling',
      description: 'Automated meeting booking',
      status: 'error',
      lastSync: '2 hours ago',
      icon: '📅',
      color: 'red'
    },
    {
      name: 'Salesforce Integration',
      description: 'Enterprise CRM synchronization',
      status: 'connected',
      lastSync: '30 minutes ago',
      icon: '☁️',
      color: 'blue'
    },
    {
      name: 'Stripe Payments',
      description: 'Payment processing and invoicing',
      status: 'connected',
      lastSync: '15 minutes ago',
      icon: '💳',
      color: 'green'
    },
    {
      name: 'DocuSign',
      description: 'Digital document signing',
      status: 'connected',
      lastSync: '1 hour ago',
      icon: '📝',
      color: 'yellow'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />;
      case 'syncing':
        return <Clock className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />;
      case 'error':
        return <AlertCircle className={`h-5 w-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />;
      default:
        return <AlertCircle className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
      case 'syncing':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      case 'error':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const connectedCount = connectedApps.filter(app => app.status === 'connected').length;
  const errorCount = connectedApps.filter(app => app.status === 'error').length;
  const syncingCount = connectedApps.filter(app => app.status === 'syncing').length;

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Connected Applications
        </h2>
        <button className={`p-2 rounded-lg transition-colors ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
        }`}>
          <Settings className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-3 rounded-lg text-center ${
          isDark ? 'bg-green-500/10' : 'bg-green-50'
        }`}>
          <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {connectedCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            Connected
          </div>
        </div>
        <div className={`p-3 rounded-lg text-center ${
          isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
        }`}>
          <div className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {syncingCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
            Syncing
          </div>
        </div>
        <div className={`p-3 rounded-lg text-center ${
          isDark ? 'bg-red-500/10' : 'bg-red-50'
        }`}>
          <div className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {errorCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Issues
          </div>
        </div>
      </div>
      
      {/* Apps List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {connectedApps.map((app, index) => (
          <div key={index} className={`p-4 rounded-lg border ${
            isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white/50'
          } hover:scale-[1.02] transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{app.icon}</div>
                  <Avatar
                    src={getAvatarByIndex(index, 'tech')}
                    alt={app.name}
                    size="sm"
                    status={app.status === 'connected' ? 'online' : app.status === 'syncing' ? 'away' : 'offline'}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {app.name}
                    </h3>
                    {getStatusIcon(app.status)}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {app.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {app.lastSync}
                  </p>
                </div>
                <button className={`p-1 rounded transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}>
                  <ExternalLink className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isDark 
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}>
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Add Integration</span>
        </button>
        
        <button className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
          View All Apps
        </button>
      </div>
    </div>
  );
};

export default ConnectedApps;