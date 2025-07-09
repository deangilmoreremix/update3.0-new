import React from 'react';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { GlassCard } from '../modern-ui/GlassCard';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';
import { 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  UserPlus, 
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { useTheme } from '../../contexts/ThemeContext';

interface ActivityItem {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'deal' | 'contact' | 'message';
  title: string;
  description: string;
  timestamp: string;
  contactId?: string;
  dealId?: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

export const RecentActivity: React.FC = () => {
  const { contacts } = useContactStore();
  const { deals } = useDealStore();

  // Generate recent activity based on actual data
  const generateRecentActivity = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    const now = new Date();

    // Add contact activities
    Object.values(contacts).slice(0, 3).forEach((contact, index) => {
      activities.push({
        id: `contact-${contact.id}-${index}`,
        type: 'contact',
        title: 'New contact added',
        description: `${contact.name} from ${contact.company}`,
        timestamp: new Date(now.getTime() - (index + 1) * 3600000).toISOString(), // Hours ago
        contactId: contact.id,
        status: 'completed'
      });
    });

    // Add deal activities
    Object.values(deals).slice(0, 2).forEach((deal, index) => {
      const contact = contacts[deal.contactId];
      if (contact) {
        activities.push({
          id: `deal-${deal.id}-${index}`,
          type: 'deal',
          title: 'Deal updated',
          description: `${deal.title} - ${deal.stage}`,
          timestamp: new Date(now.getTime() - (index + 2) * 7200000).toISOString(), // Hours ago
          contactId: deal.contactId,
          dealId: deal.id,
          status: deal.stage === 'closed-won' ? 'completed' : 'pending'
        });
      }
    });

    // Add some communication activities
    activities.push(
      {
        id: 'email-1',
        type: 'email',
        title: 'Email sent',
        description: 'Follow-up email to Sarah Johnson',
        timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 min ago
        contactId: Object.keys(contacts)[0],
        status: 'completed'
      },
      {
        id: 'call-1',
        type: 'call',
        title: 'Call scheduled',
        description: 'Discovery call with Tech Solutions Inc',
        timestamp: new Date(now.getTime() - 5400000).toISOString(), // 1.5 hours ago
        contactId: Object.keys(contacts)[1],
        status: 'pending'
      },
      {
        id: 'meeting-1',
        type: 'meeting',
        title: 'Meeting completed',
        description: 'Product demo with Marketing Team',
        timestamp: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
        contactId: Object.keys(contacts)[2],
        status: 'completed'
      }
    );

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const activities = generateRecentActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'meeting': return Calendar;
      case 'deal': return TrendingUp;
      case 'contact': return UserPlus;
      case 'message': return MessageSquare;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'call': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'deal': return 'bg-orange-500';
      case 'contact': return 'bg-indigo-500';
      case 'message': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const { isDark } = useTheme();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Upcoming Deals */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Deals</h3>
          <TrendingUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        
        <div className="space-y-4">
          {Object.values(deals).slice(0, 3).map((deal, index) => {
            const contact = contacts[deal.contactId];
            return (
              <div key={deal.id} className={`flex items-center justify-between p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50/80 hover:bg-gray-100/80'} rounded-xl transition-colors`}>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={getAvatarByIndex(index, 'business')}
                    alt={contact?.name || 'Contact'}
                    size="sm"
                    fallback={getInitials(contact?.name || 'Contact')}
                  />
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{deal.title}</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact?.name || 'Unknown Contact'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>${deal.value.toLocaleString()}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>High • Due soon</p>
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
          {activities.slice(0, 6).map((activity, index) => {
            const contact = activity.contactId ? contacts[activity.contactId] : null;
            const ActivityIcon = getActivityIcon(activity.type);
            const activityColor = getActivityColor(activity.type);

            return (
              <div key={activity.id} className={`flex items-start space-x-3 p-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/80'} rounded-lg transition-colors`}>
                <div className={`p-2 rounded-lg ${activityColor} ${isDark ? 'bg-opacity-10' : 'bg-opacity-10'}`}>
                  <ActivityIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{activity.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{formatTimestamp(activity.timestamp)}</p>
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