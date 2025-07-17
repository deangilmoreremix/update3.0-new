import React, { useState, useMemo, memo, useCallback } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Calendar } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Deal, Contact } from '../../types';

interface KPIMetric {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  conversion: number;
}

interface PipelineStage {
  name: string;
  value: number;
  deals: number;
  color: string;
}

interface OptimizedSalesPerformanceDashboardProps {
  contacts: Contact[];
  deals: Deal[];
  isLoading?: boolean;
}

// Memoized KPI Card Component
const KPICard = memo<{ metric: KPIMetric }>(({ metric }) => {
  const Icon = metric.icon;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-600">
          {metric.title}
        </h3>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          {metric.changeType === 'increase' ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(metric.change)}%
          </span>
          <span>vs last period</span>
        </div>
        <p className="text-xs text-gray-500">{metric.description}</p>
      </div>
    </div>
  );
});

KPICard.displayName = 'KPICard';

// Memoized Chart Component
const ChartContainer = memo<{
  title: string;
  children: React.ReactElement;
  className?: string;
}>(({ title, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
));

ChartContainer.displayName = 'ChartContainer';

// Main Optimized Dashboard Component
const OptimizedSalesPerformanceDashboard = memo<OptimizedSalesPerformanceDashboardProps>(({
  contacts,
  deals,
  isLoading = false
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Memoized KPI calculations
  const kpiMetrics = useMemo((): KPIMetric[] => {
    const totalRevenue = deals
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);

    const totalDeals = deals.length;
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    const totalContacts = contacts.length;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: 12.5,
        changeType: 'increase',
        icon: DollarSign,
        description: 'Revenue from closed deals'
      },
      {
        title: 'Active Deals',
        value: totalDeals.toString(),
        change: 8.2,
        changeType: 'increase',
        icon: Target,
        description: 'Total deals in pipeline'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate.toFixed(1)}%`,
        change: conversionRate > 50 ? 5.2 : -2.1,
        changeType: conversionRate > 50 ? 'increase' : 'decrease',
        icon: TrendingUp,
        description: 'Deals won vs total deals'
      },
      {
        title: 'Total Contacts',
        value: totalContacts.toString(),
        change: 15.3,
        changeType: 'increase',
        icon: Users,
        description: 'Active contacts in CRM'
      }
    ];
  }, [contacts, deals]);

  // Memoized sales trend data
  const salesTrendData = useMemo((): SalesData[] => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return monthNames.map((month, index) => {
      const monthDeals = deals.filter(deal => {
        const dealMonth = new Date(deal.createdAt).getMonth();
        return dealMonth === index;
      });

      const revenue = monthDeals
        .filter(deal => deal.stage === 'closed-won')
        .reduce((sum, deal) => sum + deal.value, 0);

      const wonDeals = monthDeals.filter(deal => deal.stage === 'closed-won').length;
      const conversion = monthDeals.length > 0 ? (wonDeals / monthDeals.length) * 100 : 0;

      return {
        month,
        revenue: revenue / 1000, // Convert to thousands
        deals: monthDeals.length,
        conversion: Number(conversion.toFixed(1))
      };
    });
  }, [deals]);

  // Memoized pipeline stage data
  const pipelineStages = useMemo((): PipelineStage[] => {
    const stageColors = {
      'qualification': '#3B82F6',
      'initial': '#8B5CF6',
      'proposal': '#06B6D4',
      'negotiation': '#F59E0B',
      'closed-won': '#10B981',
      'closed-lost': '#EF4444'
    };

    const stages = ['qualification', 'initial', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    
    return stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage);
      const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      
      return {
        name: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
        value: totalValue,
        deals: stageDeals.length,
        color: stageColors[stage as keyof typeof stageColors]
      };
    }).filter(stage => stage.deals > 0);
  }, [deals]);

  // Memoized handlers
  const handlePeriodChange = useCallback((period: 'week' | 'month' | 'quarter') => {
    setSelectedPeriod(period);
  }, []);

  // Memoized chart formatters
  const formatCurrency = useCallback((value: number) => `$${value}k`, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Performance</h1>
          <p className="text-gray-600">Track your sales metrics and pipeline performance</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <ChartContainer title="Sales Trend">
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Revenue ($k)"
            />
            <Line
              type="monotone"
              dataKey="conversion"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              name="Conversion (%)"
            />
          </LineChart>
        </ChartContainer>

        {/* Pipeline Distribution */}
        <ChartContainer title="Pipeline Distribution">
          <PieChart>
            <Pie
              data={pipelineStages}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, deals }) => `${name} (${deals})`}
            >
              {pipelineStages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatCurrency(value), 'Value']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ChartContainer>
      </div>

      {/* Deal Volume by Stage */}
      <ChartContainer title="Deal Volume by Stage" className="col-span-full">
        <BarChart data={pipelineStages}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar
            dataKey="deals"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Number of Deals"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
});

OptimizedSalesPerformanceDashboard.displayName = 'OptimizedSalesPerformanceDashboard';

export default OptimizedSalesPerformanceDashboard;
