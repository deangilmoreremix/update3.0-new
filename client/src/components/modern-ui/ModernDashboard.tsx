import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ArrowUpRight, Calendar, Plus, Settings, Bell, Mail, Phone } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ModernButton } from './ModernButton';
import { AvatarWithStatus } from './AvatarWithStatus';
import { FloatingActionButton } from './FloatingActionButton';
import { StatusIndicator } from './StatusIndicator';

interface ModernDashboardProps {
  metrics?: {
    totalActiveDeals: number;
    totalValue: number;
    totalContacts: number;
    completedTasks: number;
  };
  recentContacts?: Array<{
    id: string;
    name: string;
    company?: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastActive?: string;
  }>;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  metrics = {
    totalActiveDeals: 34,
    totalValue: 2850000,
    totalContacts: 156,
    completedTasks: 28
  },
  recentContacts = [
    { id: '1', name: 'Wade Warren', company: 'Zenith Operations', status: 'online', lastActive: '2min ago' },
    { id: '2', name: 'Jonah Jude', company: 'Binary Bytes', status: 'away', lastActive: '5min ago' },
    { id: '3', name: 'Jane Doe', company: 'Microsoft', status: 'online', lastActive: 'Just now' },
    { id: '4', name: 'Darlene Robertson', company: 'Ford Financial', status: 'busy', lastActive: '10min ago' }
  ]
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">WORKSPACE</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <ModernButton variant="glass" size="sm">
              <Bell className="w-4 h-4" />
            </ModernButton>
            <ModernButton variant="glass" size="sm">
              <Settings className="w-4 h-4" />
            </ModernButton>
            <AvatarWithStatus 
              name="John Smith" 
              status="online" 
              size="md"
            />
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full px-6 py-3 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <AvatarWithStatus name="Team Lead" status="online" size="sm" />
              <span className="text-sm">2:15 pm</span>
            </div>
            <div className="flex items-center gap-2">
              <AvatarWithStatus name="Sales Rep" status="online" size="sm" />
              <span className="text-sm">3:00 pm</span>
            </div>
          </div>
          <div className="text-white text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metrics.totalActiveDeals}</h3>
            <p className="text-gray-400 text-sm">Deals</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-blue-500 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(metrics.totalValue)}</h3>
            <p className="text-gray-400 text-sm">Pipeline Value</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 rotate-90" />
                +3
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">3</h3>
            <p className="text-gray-400 text-sm">lost</p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">20</h3>
            <p className="text-gray-400 text-sm">won</p>
          </GlassCard>
        </div>

        {/* Profile Card */}
        <GlassCard className="p-6">
          <div className="text-center">
            <AvatarWithStatus 
              name="Eva Robinson" 
              status="online" 
              size="xl"
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-white mb-1">Eva Robinson</h3>
            <p className="text-gray-400 text-sm mb-4">CEO, Inc. Alabama Machinery & Supply</p>
            
            <div className="flex justify-center gap-2 mb-4">
              <ModernButton variant="glass" size="sm">
                <Mail className="w-4 h-4" />
              </ModernButton>
              <ModernButton variant="glass" size="sm">
                <Phone className="w-4 h-4" />
              </ModernButton>
              <ModernButton variant="glass" size="sm">
                <Calendar className="w-4 h-4" />
              </ModernButton>
            </div>
            
            <div className="text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Email</span>
                <span className="text-white">Eva@alabamamachinery.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phone</span>
                <span className="text-white">+911 120 222 313</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Contacted</span>
                <span className="text-white">06/15/2023 at 7:16 pm</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New Leads Section */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">New Leads</h3>
            <span className="text-green-500 font-medium">7 Leads</span>
          </div>
          
          <div className="space-y-4">
            {recentContacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <AvatarWithStatus 
                    name={contact.name} 
                    status={contact.status} 
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{contact.name}</h4>
                    <p className="text-sm text-gray-400">{contact.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-400">{contact.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <ModernButton variant="glass" className="w-full mt-4">
            View All
          </ModernButton>
        </GlassCard>

        {/* Tasks Section */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Your Day's Tasks</h3>
            <span className="text-blue-500 font-medium">16 Tasks</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <AvatarWithStatus name="Google Meet" status="online" size="sm" />
                <span className="text-green-500 text-sm font-medium">35 min</span>
              </div>
              <h4 className="font-medium text-white mb-1">Google Meet Call</h4>
              <p className="text-sm text-gray-400">Call scheduled</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="font-medium text-white mb-1">Send Proposal</h4>
              <p className="text-sm text-gray-400">Zenith Exports</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="font-medium text-white mb-1">Meeting Hyacinth</h4>
              <p className="text-sm text-gray-400">New Deal</p>
            </div>
          </div>
          
          <ModernButton variant="primary" className="w-full mt-4">
            <Plus className="w-4 h-4" />
            New Task
          </ModernButton>
        </GlassCard>

        {/* Summary Card */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Summary</h3>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Documents:</span>
                <span className="text-white font-medium">315</span>
              </div>
              <div className="flex gap-2">
                <div className="bg-white/10 rounded p-2 flex-1">
                  <div className="w-full h-8 bg-gray-600 rounded mb-2"></div>
                  <span className="text-xs text-gray-400">PDF</span>
                </div>
                <div className="bg-white/10 rounded p-2 flex-1">
                  <div className="w-full h-8 bg-gray-600 rounded mb-2"></div>
                  <span className="text-xs text-gray-400">DOC</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Goals</span>
                <span className="text-white">Achievement 60%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => console.log('FAB clicked')}
        position="bottom-right"
      />
    </div>
  );
};