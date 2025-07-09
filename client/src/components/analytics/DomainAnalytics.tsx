import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, MousePointer, Globe, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface DomainAnalyticsProps {
  domainId: string;
  domainName: string;
}

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  conversions: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number; conversions: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
  dailyStats: Array<{ date: string; visitors: number; conversions: number }>;
  browserStats: Array<{ browser: string; percentage: number }>;
  deviceStats: Array<{ device: string; percentage: number }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function DomainAnalytics({ domainId, domainName }: DomainAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'traffic']);

  useEffect(() => {
    fetchAnalytics();
  }, [domainId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Generate realistic analytics data
      const mockData: AnalyticsData = {
        visitors: Math.floor(Math.random() * 5000) + 1000,
        pageViews: Math.floor(Math.random() * 15000) + 3000,
        conversions: Math.floor(Math.random() * 200) + 50,
        avgSessionDuration: Math.floor(Math.random() * 180) + 120,
        bounceRate: Math.floor(Math.random() * 30) + 35,
        topPages: [
          { page: '/landing', views: 1247, conversions: 89 },
          { page: '/pricing', views: 892, conversions: 45 },
          { page: '/features', views: 634, conversions: 23 },
          { page: '/about', views: 456, conversions: 12 },
          { page: '/contact', views: 234, conversions: 8 }
        ],
        trafficSources: [
          { source: 'Direct', visitors: 1200, percentage: 45 },
          { source: 'Google', visitors: 800, percentage: 30 },
          { source: 'Social Media', visitors: 400, percentage: 15 },
          { source: 'Referral', visitors: 200, percentage: 8 },
          { source: 'Email', visitors: 67, percentage: 2 }
        ],
        dailyStats: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          visitors: Math.floor(Math.random() * 500) + 100,
          conversions: Math.floor(Math.random() * 30) + 5
        })).reverse(),
        browserStats: [
          { browser: 'Chrome', percentage: 65 },
          { browser: 'Safari', percentage: 20 },
          { browser: 'Firefox', percentage: 10 },
          { browser: 'Edge', percentage: 5 }
        ],
        deviceStats: [
          { device: 'Desktop', percentage: 60 },
          { device: 'Mobile', percentage: 35 },
          { device: 'Tablet', percentage: 5 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const conversionRate = analyticsData 
    ? ((analyticsData.conversions / analyticsData.visitors) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Analytics for {domainName}</h2>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Visitors</p>
                <p className="text-2xl font-bold text-white">{analyticsData.visitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-white">{analyticsData.pageViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Conversions</p>
                <p className="text-2xl font-bold text-white">{analyticsData.conversions}</p>
                <p className="text-sm text-green-400">{conversionRate}% rate</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg. Session</p>
                <p className="text-2xl font-bold text-white">{formatDuration(analyticsData.avgSessionDuration)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Trends */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => toggleSection('traffic')}
        >
          <h3 className="text-lg font-semibold text-white">Traffic Trends</h3>
          {expandedSections.includes('traffic') ? (
            <ChevronUp className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/70" />
          )}
        </div>
        
        {expandedSections.includes('traffic') && (
          <div className="px-6 pb-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-white">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{source.visitors}</p>
                  <p className="text-white/70 text-sm">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                    <span className="text-xs text-blue-400 font-medium">{index + 1}</span>
                  </div>
                  <span className="text-white">{page.page}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{page.views} views</p>
                  <p className="text-green-400 text-sm">{page.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browser & Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Browser Distribution</h3>
          <div className="space-y-3">
            {analyticsData.browserStats.map((browser, index) => (
              <div key={browser.browser} className="flex items-center justify-between">
                <span className="text-white">{browser.browser}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white/70 text-sm">{browser.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Device Distribution</h3>
          <div className="space-y-3">
            {analyticsData.deviceStats.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <span className="text-white">{device.device}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white/70 text-sm">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}