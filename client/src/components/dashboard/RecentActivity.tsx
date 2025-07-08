import React from 'react';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { GlassCard } from '../modern-ui/GlassCard';
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

  return (
    <GlassCard className="h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {activities.slice(0, 6).map((activity) => {
            const contact = activity.contactId ? contacts[activity.contactId] : null;
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status || 'pending');

            return (
              <div key={activity.id} className="flex items-start space-x-3 py-2">
                {/* Activity Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                  <ActivityIcon className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-3 h-3 ${
                        activity.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {activity.description}
                  </p>

                  {/* Contact Avatar and Info */}
                  {contact && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AvatarWithStatus
                        src={contact.avatarSrc}
                        alt={contact.name}
                        name={contact.name}
                        size="sm"
                        status="online"
                        showStatus={false}
                      />
                      <span className="text-xs text-gray-500">{contact.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};