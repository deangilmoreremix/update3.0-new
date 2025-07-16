import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { TrendingUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

const RecentActivity: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { deals } = useDealStore();

  const contactList = Object.values(contacts);
  const dealList = Object.values(deals);

  // Get upcoming deals
  const upcomingDeals = dealList.filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').slice(0, 4);

  // Generate recent activities
  const recentActivities = [
    {
      id: '1',
      title: 'Meeting scheduled',
      description: 'Demo call with Microsoft team',
      time: '2 hours ago',
      color: 'bg-blue-500',
      icon: Calendar
    },
    {
      id: '2',
      title: 'Email sent',
      description: 'Follow-up proposal to Amazon',
      time: '4 hours ago',
      color: 'bg-green-500',
      icon: Mail
    },
    {
      id: '3',
      title: 'Call completed',
      description: 'Discovery call with Netflix',
      time: '1 day ago',
      color: 'bg-purple-500',
      icon: Phone
    },
    {
      id: '4',
      title: 'Deal updated',
      description: 'Moved Ford deal to negotiation',
      time: '2 days ago',
      color: 'bg-orange-500',
      icon: DollarSign
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Upcoming Deals */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Deals</h3>
          <TrendingUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        
        <div className="space-y-4">
          {upcomingDeals.map((deal) => {
            const contact = contacts[deal.contactId];
            return (
              <div key={deal.id} className={`flex items-center justify-between p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50/80 hover:bg-gray-100/80'} rounded-xl transition-colors`}>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={contact?.avatarSrc || getAvatarByIndex(parseInt(deal.id) || 0, 'business')}
                    alt={contact?.name || 'Contact'}
                    size="sm"
                    fallback={getInitials(contact?.name || 'Contact')}
                  />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{contact?.company || 'Unknown Company'}</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact?.name || 'Unknown Contact'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{deal.value}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{deal.probability}% • {deal.expectedCloseDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>24 completed</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>8 pending</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className={`flex items-start space-x-3 p-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/80'} rounded-lg transition-colors`}>
                <div className={`p-2 rounded-lg ${activity.color} ${isDark ? 'bg-opacity-10' : 'bg-opacity-10'}`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{activity.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;