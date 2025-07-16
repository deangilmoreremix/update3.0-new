import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAITools } from '../AIToolsProvider';
import { Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

const QuickActions: React.FC = () => {
  const { isDark } = useTheme();
  const { openTool } = useAITools();

  const quickActions = [
    {
      title: 'Add Contact',
      icon: Plus,
      color: 'blue',
      onClick: () => openTool('contact-manager')
    },
    {
      title: 'Schedule Call',
      icon: Phone,
      color: 'green',
      onClick: () => openTool('meeting-scheduler')
    },
    {
      title: 'Send Email',
      icon: Mail,
      color: 'purple',
      onClick: () => openTool('email-composer')
    },
    {
      title: 'Book Meeting',
      icon: Calendar,
      color: 'orange',
      onClick: () => openTool('meeting-scheduler')
    },
    {
      title: 'Smart Search',
      icon: Search,
      color: 'indigo',
      onClick: () => openTool('smart-search')
    },
    {
      title: 'AI Assistant',
      icon: Zap,
      color: 'yellow',
      onClick: () => openTool('business-analyzer')
    },
    {
      title: 'SMS Campaign',
      icon: MessageSquare,
      color: 'pink',
      onClick: () => openTool('sms-marketing')
    },
    {
      title: 'Generate Report',
      icon: FileText,
      color: 'teal',
      onClick: () => openTool('report-generator')
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      green: isDark ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: isDark ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      orange: isDark ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      indigo: isDark ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
      yellow: isDark ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
      pink: isDark ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      teal: isDark ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30' : 'bg-teal-100 text-teal-600 hover:bg-teal-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center space-x-3 mb-4">
        <Avatar
          src={getAvatarByIndex(0, 'tech')}
          alt="AI Assistant"
          size="sm"
          fallback="AI"
          status="online"
        />
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-all duration-200 hover:scale-105 ${getColorClasses(action.color)}`}
          >
            <action.icon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-xs font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;