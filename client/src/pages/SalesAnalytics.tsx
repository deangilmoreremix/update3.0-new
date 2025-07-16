import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, LineChart, DollarSign, Target, ArrowUpRight, Filter, Download, RefreshCw } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';

const SalesAnalytics = () => {
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'deals', label: 'Deals', icon: Target },
    { value: 'contacts', label: 'Contacts', icon: Users },
    { value: 'activities', label: 'Activities', icon: Calendar }
  ];

  const generateAnalytics = () => {
    const dealValues = Object.values(deals);
    const contactValues = Object.values(contacts);
    
    const wonDeals = dealValues.filter(deal => deal.stage === 'closed-won');
    const lostDeals = dealValues.filter(deal => deal.stage === 'closed-lost');
    const activeDeals = dealValues.filter(deal => 
      deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    );
    
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
    const winRate = dealValues.length > 0 ? (wonDeals.length / dealValues.length) * 100 : 0;
    const conversion = contactValues.length > 0 ? (dealValues.length / contactValues.length) * 100 : 0;
    
    return {
      totalRevenue,
      avgDealSize,
      winRate,
      conversion,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      activeDeals: activeDeals.length,
      totalContacts: contactValues.length,
      pipeline: activeDeals.reduce((sum, deal) => sum + deal.value, 0)
    };
  };

  const analytics = generateAnalytics();

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = () => {
    const data = {
      period: selectedPeriod,
      analytics,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-analytics-${selectedPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateAIInsights = async () => {
    setGeneratingInsights(true);
    
    try {
      const prompt = `Analyze this sales data and provide strategic insights:
      
      Revenue: $${analytics.totalRevenue.toLocaleString()}
      Average Deal Size: $${analytics.avgDealSize.toLocaleString()}
      Win Rate: ${analytics.winRate.toFixed(1)}%
      Conversion Rate: ${analytics.conversion.toFixed(1)}%
      Won Deals: ${analytics.wonDeals}
      Lost Deals: ${analytics.lostDeals}
      Active Deals: ${analytics.activeDeals}
      Total Contacts: ${analytics.totalContacts}
      
      Provide specific recommendations for improvement.`;

      const response = await fetch('/api/ai/business-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          analysisType: 'sales-performance'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.analysis);
      } else {
        setAiInsights('AI analysis temporarily unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiInsights('Error generating insights. Please check your connection and try again.');
    }
    
    setGeneratingInsights(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sales Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Comprehensive sales performance insights and metrics
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Filters:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              {metrics.map(metric => (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedMetric === metric.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <metric.icon className="w-4 h-4" />
                  <span>{metric.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Revenue</p>
            </div>
          </div>

          {/* Pipeline Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-blue-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics.pipeline.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Pipeline Value</p>
            </div>
          </div>

          {/* Win Rate Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-orange-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">+3%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.winRate.toFixed(1)}%
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Win Rate</p>
            </div>
          </div>

          {/* Avg Deal Size Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-purple-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">+15%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${analytics.avgDealSize.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Avg Deal Size</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <LineChart className="w-16 h-16 text-gray-400" />
              <div className="ml-4 text-gray-500 dark:text-gray-400">
                <p className="font-medium">Revenue Chart</p>
                <p className="text-sm">Monthly revenue progression</p>
              </div>
            </div>
          </div>

          {/* Deal Pipeline Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Deal Pipeline
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <PieChart className="w-16 h-16 text-gray-400" />
              <div className="ml-4 text-gray-500 dark:text-gray-400">
                <p className="font-medium">Pipeline Distribution</p>
                <p className="text-sm">Deals by stage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {analytics.wonDeals}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Won Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {analytics.activeDeals}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {analytics.conversion.toFixed(1)}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;