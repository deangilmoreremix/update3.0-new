import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Phone, Clock } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

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
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 mb-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Interaction History</h2>
        <div className="flex items-center space-x-2">
          <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
            <Clock className="w-4 h-4" />
          </button>
          <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interactions.map((interaction, index) => {
          const IconComponent = interaction.icon;
          const bgColor = interaction.color === 'green' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                         interaction.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                         interaction.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                         interaction.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                         interaction.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' :
                         'bg-gradient-to-br from-gray-500 to-gray-600';
          
          return (
            <div key={interaction.id} className={`${bgColor} text-white rounded-2xl p-5 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium opacity-90">{interaction.time}</span>
                <button className="p-1.5 rounded-lg transition-colors hover:bg-white/20">
                  <IconComponent className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3 leading-tight">{interaction.type}</h3>
                <p className="text-2xl font-bold">{interaction.contact}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="relative">
                    <Avatar
                      src={getAvatarByIndex(index, 'business')}
                      alt={interaction.contact}
                      size="sm"
                      fallback={getInitials(interaction.contact)}
                      className="border-3 border-white object-cover shadow-lg ring-2 ring-white/50"
                    />
                  </div>
                  {index > 0 && (
                    <div className="w-8 h-8 rounded-full border-3 border-white bg-gray-400 flex items-center justify-center shadow-lg ring-2 ring-white/50">
                      <span className="text-xs font-semibold text-white">+{index}</span>
                    </div>
                  )}
                </div>
                <IconComponent className="w-5 h-5 opacity-75" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractionHistory;