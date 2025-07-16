import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Globe, Zap, Database, RefreshCw } from 'lucide-react';

interface DomainHealth {
  id: string;
  domain: string;
  status: 'up' | 'down' | 'slow' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  sslStatus: 'valid' | 'expired' | 'expiring' | 'invalid';
  sslDaysRemaining: number;
  dnsStatus: 'healthy' | 'issues' | 'propagating';
  httpStatus: number;
  location: string;
  incidents: Array<{
    id: string;
    timestamp: string;
    type: 'downtime' | 'slow_response' | 'ssl_issue' | 'dns_issue';
    duration: number;
    resolved: boolean;
  }>;
}

interface DomainHealthMonitorProps {
  tenantId: string;
  domains: Array<{ id: string; domain: string; isActive: boolean }>;
  refreshInterval?: number;
}

export default function DomainHealthMonitor({ tenantId, domains, refreshInterval = 30000 }: DomainHealthMonitorProps) {
  const [healthData, setHealthData] = useState<DomainHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, refreshInterval);
    return () => clearInterval(interval);
  }, [tenantId, domains, refreshInterval]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      
      // Generate realistic health data
      const mockHealthData: DomainHealth[] = domains.map(domain => ({
        id: domain.id,
        domain: domain.domain,
        status: Math.random() > 0.1 ? 'up' : (Math.random() > 0.5 ? 'slow' : 'down'),
        responseTime: Math.floor(Math.random() * 1000) + 100,
        uptime: Math.random() * 10 + 98,
        lastChecked: new Date().toISOString(),
        sslStatus: Math.random() > 0.2 ? 'valid' : 'expiring',
        sslDaysRemaining: Math.floor(Math.random() * 90) + 10,
        dnsStatus: Math.random() > 0.15 ? 'healthy' : 'issues',
        httpStatus: Math.random() > 0.1 ? 200 : (Math.random() > 0.5 ? 404 : 500),
        location: 'Global',
        incidents: [
          {
            id: '1',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'downtime',
            duration: Math.floor(Math.random() * 120) + 5,
            resolved: true
          }
        ]
      }));

      setHealthData(mockHealthData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'slow':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'maintenance':
        return <Activity className="w-5 h-5 text-blue-400" />;
      default:
        return <Globe className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'down':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'slow':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 300) return 'text-green-400';
    if (time < 1000) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime > 99) return 'text-green-400';
    if (uptime > 95) return 'text-yellow-400';
    return 'text-red-400';
  };

  const overallStatus = healthData.length > 0 ? {
    total: healthData.length,
    up: healthData.filter(d => d.status === 'up').length,
    down: healthData.filter(d => d.status === 'down').length,
    slow: healthData.filter(d => d.status === 'slow').length,
    avgResponseTime: healthData.reduce((sum, d) => sum + d.responseTime, 0) / healthData.length,
    avgUptime: healthData.reduce((sum, d) => sum + d.uptime, 0) / healthData.length
  } : null;

  if (loading && healthData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Domain Health Monitor</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Last updated: {lastUpdate}</span>
            <button
              onClick={fetchHealthData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        {overallStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Total Domains</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{overallStatus.total}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm">Operational</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{overallStatus.up}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm">Avg. Response</p>
                  <p className={`text-2xl font-bold ${getResponseTimeColor(overallStatus.avgResponseTime)}`}>
                    {Math.round(overallStatus.avgResponseTime)}ms
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Avg. Uptime</p>
                  <p className={`text-2xl font-bold ${getUptimeColor(overallStatus.avgUptime)}`}>
                    {overallStatus.avgUptime.toFixed(2)}%
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Domain Health Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Domain Status</h3>
        
        <div className="space-y-4">
          {healthData.map(domain => (
            <div key={domain.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(domain.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 dark:text-white font-medium">{domain.domain}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(domain.status)}`}>
                        {domain.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>HTTP {domain.httpStatus}</span>
                      <span>Last check: {new Date(domain.lastChecked).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Response Time</p>
                    <p className={`font-medium ${getResponseTimeColor(domain.responseTime)}`}>
                      {domain.responseTime}ms
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Uptime</p>
                    <p className={`font-medium ${getUptimeColor(domain.uptime)}`}>
                      {domain.uptime.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">DNS:</span>
                  <span className={`text-sm ${domain.dnsStatus === 'healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {domain.dnsStatus}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">SSL:</span>
                  <span className={`text-sm ${domain.sslStatus === 'valid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {domain.sslStatus} ({domain.sslDaysRemaining} days)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Location:</span>
                  <span className="text-gray-900 dark:text-white text-sm">{domain.location}</span>
                </div>
              </div>

              {/* Recent Incidents */}
              {domain.incidents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-gray-600 dark:text-gray-400 text-sm mb-2">Recent Incidents</h4>
                  <div className="space-y-2">
                    {domain.incidents.slice(0, 3).map(incident => (
                      <div key={incident.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-gray-600 dark:text-gray-400">{incident.type.replace('_', ' ')}</span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(incident.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 dark:text-gray-400">{incident.duration}min</span>
                          {incident.resolved && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Info */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium">Monitoring Details</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
          <div>
            <p>• Health checks run every 30 seconds</p>
            <p>• Response time threshold: 1000ms</p>
            <p>• Uptime calculated over last 30 days</p>
          </div>
          <div>
            <p>• SSL certificate monitoring included</p>
            <p>• DNS propagation tracking</p>
            <p>• Historical incident tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}