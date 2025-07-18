import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Home, Users, Calendar, Settings, TrendingUp, Phone, Mail, FileBarChart, Target, MessageSquare, ClipboardList, Bot } from 'lucide-react';

interface SidebarProps {
  // Remove the callback props since we'll use React Router
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard', key: 'dashboard' },
  { icon: Users, label: 'Contacts', path: '/contacts', key: 'contacts' },
  { icon: TrendingUp, label: 'Pipeline', path: '/pipeline', key: 'pipeline' },
  { icon: ClipboardList, label: 'Tasks', path: '/tasks', key: 'tasks' },
  { icon: Bot, label: 'AI Tools', path: '/ai-tools', key: 'ai-tools' },
  { icon: Target, label: 'Sales Tools', path: '/sales-tools', key: 'sales-tools' },
  { icon: Phone, label: 'Phone System', path: '/phone-system', key: 'phone-system' },
  { icon: Calendar, label: 'Appointments', path: '/appointments', key: 'appointments' },
  { icon: Mail, label: 'Email', path: '/video-email', key: 'video-email' },
  { icon: MessageSquare, label: 'Messages', path: '/text-messages', key: 'text-messages' },
  { icon: FileBarChart, label: 'Analytics', path: '/analytics', key: 'analytics' },
  { icon: Settings, label: 'Settings', path: '/settings', key: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  return (
    <div className="w-16 h-full flex flex-col py-6">
      <GlassCard className="flex-1 p-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path === '/dashboard' && location.pathname === '/');
              
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className={`
                    p-2 rounded-lg transition-all duration-200 group relative block
                    ${isActive 
                      ? 'bg-blue-500/20 text-blue-600' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="absolute left-12 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </GlassCard>
    </div>
  );
};