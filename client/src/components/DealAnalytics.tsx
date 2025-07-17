import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, PieChart, Target, TrendingUp } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  priority: 'high' | 'medium' | 'low';
  expectedCloseDate?: string;
  createdAt: string;
}

interface DealAnalyticsProps {
  deals: Record<string, Deal>;
}

const DealAnalytics: React.FC<DealAnalyticsProps> = ({ deals }) => {
  // Add null safety check
  if (!deals || typeof deals !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Deal Analytics</h2>
        <p className="text-gray-500">No deal data available</p>
      </div>
    );
  }

  const dealArray = Object.values(deals || {}).filter(deal => deal && typeof deal === 'object');

  // Calculate stage distribution
  const stageDistribution = dealArray.reduce((acc, deal) => {
    if (deal && deal.stage) {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const stageData = Object.entries(stageDistribution).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
    count,
    percentage: Math.round((count / dealArray.length) * 100)
  }));

  // Calculate value by stage
  const valueByStage = dealArray.reduce((acc, deal) => {
    if (deal && deal.stage && typeof deal.value === 'number') {
      acc[deal.stage] = (acc[deal.stage] || 0) + deal.value;
    }
    return acc;
  }, {} as Record<string, number>);

  const valueData = Object.entries(valueByStage).map(([stage, value]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
    value
  }));

  // Calculate priority distribution
  const priorityDistribution = dealArray.reduce((acc, deal) => {
    if (deal && deal.priority) {
      acc[deal.priority] = (acc[deal.priority] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const priorityData = Object.entries(priorityDistribution).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count
  }));

  // Monthly trends (mock data for demo)
  const monthlyData = [
    { month: 'Jan', deals: 12, value: 450000 },
    { month: 'Feb', deals: 15, value: 620000 },
    { month: 'Mar', deals: 18, value: 780000 },
    { month: 'Apr', deals: 14, value: 560000 },
    { month: 'May', deals: 22, value: 890000 },
    { month: 'Jun', deals: 19, value: 745000 }
  ];

  // Calculate analytics metrics
  const totalValue = dealArray.reduce((sum, deal) => {
    if (deal && typeof deal.value === 'number') {
      return sum + deal.value;
    }
    return sum;
  }, 0);
  const avgDealValue = dealArray.length > 0 ? totalValue / dealArray.length : 0;
  const highPriorityDeals = dealArray.filter(deal => deal && deal.priority === 'high').length;
  const closingSoon = dealArray.filter(deal => {
    if (!deal || !deal.expectedCloseDate) return false;
    try {
      const closeDate = new Date(deal.expectedCloseDate);
      const today = new Date();
      const diffTime = closeDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    } catch (error) {
      return false;
    }
  }).length;

  const COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6', '#F97316', '#10B981', '#EF4444'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pipeline Analytics</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Avg Deal Value
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCompactCurrency(avgDealValue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  High Priority
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {highPriorityDeals}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Closing Soon
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {closingSoon}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Win Rate
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  74%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stage Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Deals by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ stage, percentage }) => `${stage} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Value by Stage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Value by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Value']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="priority" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCompactCurrency(value)} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'value' ? formatCurrency(value as number) : value,
                  name === 'value' ? 'Pipeline Value' : 'Deal Count'
                ]}
              />
              <Bar yAxisId="left" dataKey="deals" fill="#8B5CF6" />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DealAnalytics;