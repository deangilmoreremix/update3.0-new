import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { useTaskStore } from '../../store/taskStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { Users, Target, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

export const KPICards: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();

  // Calculate KPI metrics
  const totalContacts = Object.keys(contacts).length;
  const activeDeals = Object.values(deals).filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').length;
  const todayAppointments = Object.values(appointments).filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.date).toDateString() === today;
  }).length;
  
  const totalRevenue = Object.values(deals)
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);

  // Get avatar stacks for visual representation
  const renderAvatarStack = (contactIds: string[], maxAvatars = 3) => {
    const validContacts = contactIds.slice(0, maxAvatars).map(id => contacts[id]).filter(Boolean);
    const remainingCount = Math.max(0, contactIds.length - maxAvatars);

    if (validContacts.length === 0) return null;

    return (
      <div className="flex -space-x-2 ml-3">
        {validContacts.map((contact, index) => (
          <div key={contact.id} style={{ zIndex: maxAvatars - index }}>
            <AvatarWithStatus
              src={contact.avatarSrc}
              alt={contact.name}
              name={contact.name}
              size="sm"
              status="online"
              showStatus={false}
              className="border-2 border-white dark:border-gray-900"
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  // Get contacts associated with active deals
  const activeDealContacts = Object.values(deals)
    .filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost')
    .map(deal => deal.contactId);

  // Get recent contacts
  const recentContactIds = Object.keys(contacts).slice(0, 5);

  const kpiData = [
    {
      title: 'Total Contacts',
      value: totalContacts.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      avatarStack: renderAvatarStack(recentContactIds)
    },
    {
      title: 'Active Deals',
      value: activeDeals.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'green',
      avatarStack: renderAvatarStack(activeDealContacts)
    },
    {
      title: 'Today\'s Meetings',
      value: todayAppointments.toLocaleString(),
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      color: 'purple',
      avatarStack: null
    },
    {
      title: 'Revenue',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'orange',
      avatarStack: null
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100 dark:bg-blue-900/20'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        icon: 'text-green-600',
        iconBg: 'bg-green-100 dark:bg-green-900/20'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100 dark:bg-purple-900/20'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100 dark:bg-orange-900/20'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {kpiData.map((kpi, index) => {
        const colorClasses = getColorClasses(kpi.color);
        const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
        const IconComponent = kpi.icon;

        return (
          <div
            key={index}
            className={`p-4 lg:p-6 rounded-2xl backdrop-blur-sm ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/90 border-gray-200 hover:bg-white'
            } border shadow-lg hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${colorClasses.iconBg}`}>
                <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span>{kpi.change}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {kpi.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {kpi.value}
                </p>
                {kpi.avatarStack}
              </div>
            </div>

            {/* Gradient accent line */}
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorClasses.bg} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;