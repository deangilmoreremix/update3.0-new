import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, Clock, MapPin, Smartphone, Monitor } from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'login' | 'logout' | 'profile_update' | 'feature_access' | 'data_export' | 'security_change';
  action: string;
  timestamp: string;
  location?: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: unknown;
}

interface UserActivityTrackerProps {
  userId: string;
  className?: string;
}

export const UserActivityTracker: React.FC<UserActivityTrackerProps> = ({ userId, className = '' }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'logins' | 'security' | 'profile'>('all');

  useEffect(() => {
    fetchUserActivity();
  }, [userId]);

  const fetchUserActivity = async () => {
    try {
      // In a real implementation, this would call your API
      // For demo purposes, we'll use mock data
      const mockActivities: ActivityEvent[] = [
        {
          id: '1',
          type: 'login',
          action: 'Successful login',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'New York, NY',
          device: 'Chrome on Windows',
          ipAddress: '192.168.1.100',
          success: true
        },
        {
          id: '2',
          type: 'profile_update',
          action: 'Updated profile information',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'New York, NY',
          device: 'Chrome on Windows',
          success: true,
          details: { fields: ['firstName', 'jobTitle', 'phone'] }
        },
        {
          id: '3',
          type: 'security_change',
          action: 'Changed password',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'New York, NY',
          device: 'Safari on iPhone',
          success: true
        },
        {
          id: '4',
          type: 'feature_access',
          action: 'Accessed AI Content Creator',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'New York, NY',
          device: 'Chrome on Windows',
          success: true
        },
        {
          id: '5',
          type: 'login',
          action: 'Failed login attempt',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'San Francisco, CA',
          device: 'Unknown',
          ipAddress: '10.0.0.1',
          success: false
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
      case 'logout':
        return <Users className="w-4 h-4" />;
      case 'profile_update':
        return <TrendingUp className="w-4 h-4" />;
      case 'security_change':
        return <Activity className="w-4 h-4" />;
      case 'feature_access':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string, success: boolean) => {
    if (!success) return 'text-red-500 bg-red-50';
    
    switch (type) {
      case 'login':
        return 'text-green-500 bg-green-50';
      case 'logout':
        return 'text-gray-500 bg-gray-50';
      case 'profile_update':
        return 'text-blue-500 bg-blue-50';
      case 'security_change':
        return 'text-yellow-500 bg-yellow-50';
      case 'feature_access':
        return 'text-purple-500 bg-purple-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) {
      return <Smartphone className="w-3 h-3" />;
    }
    return <Monitor className="w-3 h-3" />;
  };

  const filteredActivities = activities.filter(activity => {
    switch (filter) {
      case 'logins':
        return activity.type === 'login' || activity.type === 'logout';
      case 'security':
        return activity.type === 'security_change';
      case 'profile':
        return activity.type === 'profile_update';
      default:
        return true;
    }
  });

  const getActivityStats = () => {
    const totalActivities = activities.length;
    const successfulActivities = activities.filter(a => a.success).length;
    const failedActivities = totalActivities - successfulActivities;
    const uniqueLocations = new Set(activities.map(a => a.location)).size;
    const uniqueDevices = new Set(activities.map(a => a.device)).size;

    return {
      totalActivities,
      successfulActivities,
      failedActivities,
      uniqueLocations,
      uniqueDevices,
      successRate: totalActivities > 0 ? Math.round((successfulActivities / totalActivities) * 100) : 0
    };
  };

  const stats = getActivityStats();

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as unknown)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="logins">Logins</option>
              <option value="security">Security</option>
              <option value="profile">Profile</option>
            </select>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total Events</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalActivities}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Successful</p>
            <p className="text-lg font-bold text-green-600">{stats.successfulActivities}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Failed</p>
            <p className="text-lg font-bold text-red-600">{stats.failedActivities}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Locations</p>
            <p className="text-lg font-bold text-blue-600">{stats.uniqueLocations}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Success Rate</p>
            <p className="text-lg font-bold text-purple-600">{stats.successRate}%</p>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type, activity.success)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  {activity.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.location}</span>
                    </div>
                  )}
                  {activity.device && (
                    <div className="flex items-center space-x-1">
                      {getDeviceIcon(activity.device)}
                      <span className="text-xs text-gray-500">{activity.device}</span>
                    </div>
                  )}
                  {activity.ipAddress && (
                    <span className="text-xs text-gray-500">IP: {activity.ipAddress}</span>
                  )}
                </div>
                {activity.details && (
                  <div className="mt-2 text-xs text-gray-600">
                    {activity.details.fields && (
                      <span>Updated: {activity.details.fields.join(', ')}</span>
                    )}
                  </div>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full mt-2 ${activity.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No activities found for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};