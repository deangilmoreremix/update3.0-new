import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  bgColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend, bgColor }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 animate-float-up">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} backdrop-blur-sm`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
      <p className="text-gray-300 text-sm">{title}</p>
    </div>
  );
};

interface KPICardsProps {
  metrics: {
    totalContacts: number;
    activeDeals: number;
    monthlyRevenue: number;
    conversionRate: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Contacts',
      value: metrics.totalContacts.toLocaleString(),
      change: 12,
      trend: 'up' as const,
      icon: <Users className="h-6 w-6 text-blue-300" />,
      bgColor: 'bg-blue-500/20 border border-blue-400/30'
    },
    {
      title: 'Active Deals',
      value: metrics.activeDeals,
      change: 8,
      trend: 'up' as const,
      icon: <BarChart3 className="h-6 w-6 text-emerald-300" />,
      bgColor: 'bg-emerald-500/20 border border-emerald-400/30'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(metrics.monthlyRevenue / 1000).toFixed(0)}K`,
      change: 15,
      trend: 'up' as const,
      icon: <DollarSign className="h-6 w-6 text-purple-300" />,
      bgColor: 'bg-purple-500/20 border border-purple-400/30'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      change: -3,
      trend: 'down' as const,
      icon: <TrendingUp className="h-6 w-6 text-orange-300" />,
      bgColor: 'bg-orange-500/20 border border-orange-400/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <KPICard
          key={card.title}
          title={card.title}
          value={card.value}
          change={card.change}
          trend={card.trend}
          icon={card.icon}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  );
};