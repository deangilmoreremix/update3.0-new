import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Phone, Mail, Calendar, MessageSquare, Video, Clock } from 'lucide-react';

const InteractionHistory: React.FC = () => {
  const { isDark } = useTheme();

  const interactions = [
    {
      id: 1,
      type: 'call',
      contact: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      time: '2 hours ago',
      duration: '15 min',
      status: 'completed',
      icon: Phone,
      color: 'green'
    },
    {
      id: 2,
      type: 'email',
      contact: 'Michael Chen',
      company: 'Innovate AI',
      time: '4 hours ago',
      duration: 'Sent',
      status: 'delivered',
      icon: Mail,
      color: 'blue'
    },
    {
      id: 3,
      type: 'meeting',
      contact: 'Emma Davis',
      company: 'Global Tech Industries',
      time: '6 hours ago',
      duration: '30 min',
      status: 'completed',
      icon: Video,
      color: 'purple'
    },
    {
      id: 4,
      type: 'sms',
      contact: 'David Wilson',
      company: 'Startup Ventures',
      time: '1 day ago',
      duration: 'Sent',
      status: 'read',
      icon: MessageSquare,
      color: 'orange'
    },
    {
      id: 5,
      type: 'meeting',
      contact: 'Lisa Thompson',
      company: 'Enterprise Software',
      time: '2 days ago',
      duration: '45 min',
      status: 'scheduled',
      icon: Calendar,
      color: 'indigo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'delivered':
      case 'read':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'scheduled':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      green: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600',
      blue: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
      purple: isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
      orange: isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600',
      indigo: isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Interactions
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-1" />
          Last 7 days
        </div>
      </div>
      
      <div className="space-y-4">
        {interactions.map((interaction) => (
          <div key={interaction.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <div className={`p-2 rounded-lg ${getIconColor(interaction.color)}`}>
              <interaction.icon size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {interaction.contact}
                </p>
                <span className={`text-xs ${getStatusColor(interaction.status)} capitalize`}>
                  {interaction.status}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {interaction.company}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {interaction.time}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {interaction.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
        isDark 
          ? 'bg-white/10 text-white hover:bg-white/20' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        View All Interactions
      </button>
    </div>
  );
};

export default InteractionHistory;