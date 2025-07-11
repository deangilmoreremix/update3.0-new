import React from 'react';
import { GlassCard } from '../modern-ui/GlassCard';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { ModernButton } from '../modern-ui/ModernButton';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  MoreHorizontal,
  Crown,
  Star,
  User
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  avatarSrc: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isActive: boolean;
  performance: number;
  tasksCompleted: number;
  dealsClosed: number;
  isManager?: boolean;
  isTopPerformer?: boolean;
}

export const TeamMembers: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Sales Manager',
      department: 'Sales',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      avatarSrc: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online',
      isActive: true,
      performance: 95,
      tasksCompleted: 28,
      dealsClosed: 12,
      isManager: true,
      isTopPerformer: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Account Executive',
      department: 'Sales',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      avatarSrc: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'busy',
      isActive: true,
      performance: 88,
      tasksCompleted: 24,
      dealsClosed: 8,
      isTopPerformer: true
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Marketing Specialist',
      department: 'Marketing',
      email: 'emily.rodriguez@company.com',
      avatarSrc: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online',
      isActive: true,
      performance: 92,
      tasksCompleted: 31,
      dealsClosed: 5
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Customer Success',
      department: 'Support',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      avatarSrc: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'away',
      isActive: true,
      performance: 85,
      tasksCompleted: 19,
      dealsClosed: 3
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Business Development',
      department: 'Sales',
      email: 'lisa.thompson@company.com',
      avatarSrc: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'online',
      isActive: true,
      performance: 79,
      tasksCompleted: 16,
      dealsClosed: 6
    },
    {
      id: '6',
      name: 'Robert Wilson',
      role: 'Senior Developer',
      department: 'Engineering',
      email: 'robert.wilson@company.com',
      avatarSrc: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'offline',
      isActive: false,
      performance: 90,
      tasksCompleted: 22,
      dealsClosed: 0
    }
  ];

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 bg-green-100';
    if (performance >= 80) return 'text-blue-600 bg-blue-100';
    if (performance >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Sales': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Support': 'bg-green-100 text-green-800',
      'Engineering': 'bg-orange-100 text-orange-800'
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-600 mt-1">Active team performance and status</p>
        </div>
        <ModernButton variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Manage Team
        </ModernButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <AvatarWithStatus
                    src={member.avatarSrc}
                    alt={member.name}
                    name={member.name}
                    size="md"
                    status={member.status}
                    showStatus={true}
                  />
                  {member.isManager && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {member.isTopPerformer && !member.isManager && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{member.role}</p>
                </div>
              </div>
              
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Department Badge */}
            <div className="mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                {member.department}
              </span>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Performance</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                  {member.performance}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tasks</span>
                  <p className="font-medium text-gray-900">{member.tasksCompleted}</p>
                </div>
                <div>
                  <span className="text-gray-600">Deals</span>
                  <p className="font-medium text-gray-900">{member.dealsClosed}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Mail className="w-4 h-4 mx-auto" />
              </button>
              {member.phone && (
                <button className="flex-1 p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 mx-auto" />
                </button>
              )}
              <button className="flex-1 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4 mx-auto" />
              </button>
              <button className="flex-1 p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <Calendar className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.isActive).length}</p>
            <p className="text-sm text-gray-600">Active Members</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'online').length}</p>
            <p className="text-sm text-gray-600">Online Now</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)}%
            </p>
            <p className="text-sm text-gray-600">Avg Performance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {teamMembers.reduce((sum, m) => sum + m.dealsClosed, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Deals</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};