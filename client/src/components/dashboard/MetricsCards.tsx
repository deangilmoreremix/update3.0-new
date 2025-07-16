import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex } from '../../services/avatarCollection';

const MetricsCards: React.FC = () => {
  const { isDark } = useTheme();

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$1,245,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+3.1%',
      trend: 'up',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Growth Rate',
      value: '15.7%',
      change: '+5.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl border ${
            isDark 
              ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
              : 'border-gray-200 bg-white/50 backdrop-blur-sm'
          } hover:scale-105 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                metric.color === 'blue' ? (isDark ? 'bg-blue-500/20' : 'bg-blue-100') :
                metric.color === 'green' ? (isDark ? 'bg-green-500/20' : 'bg-green-100') :
                metric.color === 'purple' ? (isDark ? 'bg-purple-500/20' : 'bg-purple-100') :
                (isDark ? 'bg-orange-500/20' : 'bg-orange-100')
              }`}>
                <metric.icon className={`h-6 w-6 ${
                  metric.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                  metric.color === 'green' ? (isDark ? 'text-green-400' : 'text-green-600') :
                  metric.color === 'purple' ? (isDark ? 'text-purple-400' : 'text-purple-600') :
                  (isDark ? 'text-orange-400' : 'text-orange-600')
                }`} />
              </div>
              <Avatar
                src={getAvatarByIndex(index, 'executives')}
                alt={metric.title}
                size="sm"
                status="online"
              />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
              {metric.change}
            </span>
          </div>
          
          <div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
              {metric.title}
            </h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {metric.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;