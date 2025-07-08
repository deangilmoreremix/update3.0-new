import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageSquare, Phone, Mail, Video, Calendar, Send } from 'lucide-react';

const ActivitiesCommunications: React.FC = () => {
  const { isDark } = useTheme();

  const recentActivities = [
    {
      id: 1,
      type: 'email',
      title: 'Email sent to Sarah Johnson',
      description: 'Follow-up on proposal discussion',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'call',
      title: 'Call with Mike Chen',
      description: 'Product demo and Q&A session',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Team standup meeting',
      description: 'Weekly progress review',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'video',
      title: 'Video call with prospect',
      description: 'Initial discovery call',
      time: '2 days ago',
      status: 'completed'
    }
  ];

  const communicationTools = [
    {
      name: 'Send Email',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      count: 12,
      description: 'Quick email templates'
    },
    {
      name: 'Schedule Call',
      icon: Phone,
      color: 'from-green-500 to-emerald-500',
      count: 8,
      description: 'Phone & video calls'
    },
    {
      name: 'Book Meeting',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      count: 5,
      description: 'Calendar integration'
    },
    {
      name: 'Send Message',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      count: 15,
      description: 'Instant messaging'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'call':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
      case 'meeting':
        return isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600';
      case 'video':
        return isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Activities & Communications</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Manage your customer interactions and outreach</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Send className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Communication Hub</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Tools */}
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Communication Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tool.count} today
                    </span>
                  </div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {tool.name}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </p>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.time}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 space-y-2">
            <button className={`w-full p-3 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}>
              Compose New Email
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                isDark 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}>
                Schedule Call
              </button>
              <button className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}>
                Book Meeting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>47</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Emails Sent</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>23</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Calls Made</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>12</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Meetings Held</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>89%</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Response Rate</p>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesCommunications;