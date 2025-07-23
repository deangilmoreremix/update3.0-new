import React, { useState, useEffect, useMemo } from 'react';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { useRealTimeDashboard } from '../../hooks/useRealTimeData';
import { TrendingUp, Users, Target, DollarSign, Calendar, Phone, Mail, AlertCircle, CheckCircle, Download, RefreshCw, Settings, ChevronDown, BarChart3, Activity, Zap, Brain, Star, ArrowUp, ArrowDown, Plus, MoreHorizontal } from 'lucide-react';
import * as SafeCharts from '../charts/SafeCharts';

}

export default function EnhancedDashboard() {
  const { deals, stageValues, totalPipelineValue, fetchDeals, isLoading: dealsLoading } = useDealStore();
  const { contacts, fetchContacts, isLoading: contactsLoading } = useContactStore();

  // Use real-time dashboard data
  const { 
    metrics: realTimeMetrics, 
    activities: dashboardActivities, 
    isLoading: dashboardLoading,
    error: dashboardError,
    refreshData 
  } = useRealTimeDashboard();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (fetchDeals) fetchDeals();
    if (fetchContacts) fetchContacts();
  }, [fetchDeals, fetchContacts]);

  // Calculate metrics with real-time data taking priority
  const metrics = useMemo(() => {
    // Use real-time metrics if available, fallback to calculated metrics
    if (realTimeMetrics && realTimeMetrics.totalDeals > 0) {
      return realTimeMetrics;
    }

    // Fallback calculation
    const dealsArray = Object.values(deals || {});
    const contactsArray = Object.values(contacts || {});

    const wonDeals = dealsArray.filter(deal => deal.stage === 'closed-won');
    const lostDeals = dealsArray.filter(deal => deal.stage === 'closed-lost');

    return {
      totalDeals: dealsArray.length,
      totalDealValue: totalPipelineValue || dealsArray.reduce((sum, deal) => sum + deal.value, 0),
      avgDealSize: dealsArray.length > 0 ? Math.round((totalPipelineValue || 0) / dealsArray.length) : 0,
      winRate: (wonDeals.length + lostDeals.length) > 0 ? 
        Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0,
      conversionRate: contactsArray.length > 0 ? 
        Math.round((dealsArray.length / contactsArray.length) * 100) : 0,
      activeContacts: contactsArray.filter(c => 
        ['lead', 'prospect', 'customer'].includes(c.status || 'lead')
      ).length,
      totalContacts: contactsArray.length,
      recentActivity: dashboardActivities.length,
      monthlyGrowth: 12.5,
      quarterlyGrowth: 28.3
    };
  }, [deals, contacts, totalPipelineValue, dashboardActivities, realTimeMetrics]);

  // Chart data
  const pipelineChartData = useMemo(() => {
    const stages = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won'];
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
      value: stageValues?.[stage] || 0,
      deals: Object.values(deals || {}).filter(deal => deal.stage === stage).length
    }));
  }, [deals, stageValues]);

  const monthlyTrendData = useMemo(() => {
    // Mock monthly trend data
    return [
      { month: 'Jan', deals: 12, revenue: 150000, contacts: 45 },
      { month: 'Feb', deals: 15, revenue: 180000, contacts: 52 },
      { month: 'Mar', deals: 18, revenue: 220000, contacts: 61 },
      { month: 'Apr', deals: 22, revenue: 280000, contacts: 73 },
      { month: 'May', deals: 25, revenue: 320000, contacts: 85 },
      { month: 'Jun', deals: 28, revenue: 380000, contacts: 97 }
    ];
  }, []);

  const conversionFunnelData = useMemo(() => {
    const contactsCount = Object.values(contacts || {}).length;
    const leadsCount = Object.values(contacts || {}).filter(c => c.status === 'lead').length;
    const prospectsCount = Object.values(contacts || {}).filter(c => c.status === 'prospect').length;
    const dealsCount = Object.values(deals || {}).length;
    const wonDealsCount = Object.values(deals || {}).filter(d => d.stage === 'closed-won').length;

    return [
      { stage: 'Contacts', count: contactsCount, percentage: 100 },
      { stage: 'Leads', count: leadsCount, percentage: contactsCount > 0 ? Math.round((leadsCount / contactsCount) * 100) : 0 },
      { stage: 'Prospects', count: prospectsCount, percentage: contactsCount > 0 ? Math.round((prospectsCount / contactsCount) * 100) : 0 },
      { stage: 'Deals', count: dealsCount, percentage: contactsCount > 0 ? Math.round((dealsCount / contactsCount) * 100) : 0 },
      { stage: 'Won', count: wonDealsCount, percentage: contactsCount > 0 ? Math.round((wonDealsCount / contactsCount) * 100) : 0 }
    ];
  }, [contacts, deals]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh both store data and real-time dashboard data
      if (fetchDeals) await fetchDeals();
      if (fetchContacts) await fetchContacts();
      await refreshData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'deal_created': return <Target className="w-4 h-4 text-blue-600" />;
      case 'deal_moved': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'contact_added': return <Users className="w-4 h-4 text-purple-600" />;
      case 'meeting_scheduled': return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'email_sent': return <Mail className="w-4 h-4 text-red-600" />;
      case 'call_completed': return <Phone className="w-4 h-4 text-indigo-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sales Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Overview of your sales performance and pipeline health
            </p>
          </div>

          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalDealValue)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    +{metrics.monthlyGrowth}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalDeals}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 ml-1">
                    +{Math.round(metrics.quarterlyGrowth)}% this quarter
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.winRate}%
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600 ml-1">
                    +5.2% improvement
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.activeContacts}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 ml-1">
                    +{metrics.totalContacts - metrics.activeContacts} this month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pipeline by Stage */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pipeline by Stage
              </h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80">
              {pipelineChartData.length > 0 ? (
                <SafeCharts.ResponsiveContainer width="100%" height="100%">
                  <SafeCharts.BarChart data={pipelineChartData}>
                    <SafeCharts.CartesianGrid strokeDasharray="3 3" />
                    <SafeCharts.XAxis dataKey="name" />
                    <SafeCharts.YAxis />
                    <SafeCharts.Tooltip 
                      formatter={(value, name) => [
                        name === 'value' ? formatCurrency(value as number) : value,
                        name === 'value' ? 'Value' : 'Deals'
                      ]}
                    />
                    <SafeCharts.Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </SafeCharts.BarChart>
                </SafeCharts.ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No pipeline data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Trends
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Deals</span>
                </div>
              </div>
            </div>

            <div className="h-80">
              <SafeCharts.ResponsiveContainer width="100%" height="100%">
                <SafeCharts.LineChart data={monthlyTrendData}>
                  <SafeCharts.CartesianGrid strokeDasharray="3 3" />
                  <SafeCharts.XAxis dataKey="month" />
                  <SafeCharts.YAxis yAxisId="left" />
                  <SafeCharts.YAxis yAxisId="right" orientation="right" />
                  <SafeCharts.Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value,
                      name === 'revenue' ? 'Revenue' : 'Deals'
                    ]}
                  />
                  <SafeCharts.Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <SafeCharts.Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="deals" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </SafeCharts.LineChart>
              </SafeCharts.ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversion Funnel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Conversion Funnel
            </h3>

            <div className="space-y-4">
              {conversionFunnelData.map((item, index) => (
                <div key={item.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.stage}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-indigo-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-pink-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  {index < conversionFunnelData.length - 1 && (
                    <div className="flex justify-center mt-2">
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {dashboardActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        by {activity.user_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {activity.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Pipeline Health: Excellent
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Your win rate is 15% above industry average. Focus on qualification stage to maintain momentum.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Opportunity Alert
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      3 high-value deals have been in negotiation for over 30 days. Consider scheduling follow-ups.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Star className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Top Performer
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Sarah Johnson closed 5 deals this month, 40% above target. Consider leveraging her strategies team-wide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Zap className="w-4 h-4" />
              <span>Get More Insights</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Deal</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Contact</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Meeting</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
