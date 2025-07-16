import React, { useState } from 'react';
import { Target, Users, Phone, Mail, Clock, Star, BarChart3, Settings, User } from 'lucide-react';

interface ProspectLog {
  id: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  method: 'email' | 'linkedin' | 'phone' | 'referral';
  status: 'contacted' | 'responded' | 'qualified' | 'converted' | 'declined';
  touchDate: Date;
  notes?: string;
  nextAction?: string;
  priority: 'high' | 'medium' | 'low';
}

const CircleProspecting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prospects' | 'strategies' | 'settings'>('dashboard');

  // Prospect logs data
  const [prospectLogs] = useState<ProspectLog[]>([
    {
      id: '1',
      contactName: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      email: 'sarah.j@techcorp.com',
      phone: '(555) 123-4567',
      method: 'linkedin',
      status: 'responded',
      touchDate: new Date(Date.now() - 86400000), // yesterday
      notes: 'Expressed interest in our platform. Scheduled demo for next week.',
      nextAction: 'Send demo prep materials',
      priority: 'high'
    },
    {
      id: '2',
      contactName: 'Michael Chen',
      company: 'DataFlow Inc',
      email: 'mike.chen@dataflow.io',
      phone: '(555) 987-6543',
      method: 'email',
      status: 'contacted',
      touchDate: new Date(Date.now() - 172800000), // 2 days ago
      notes: 'Cold email sent regarding automation solutions',
      nextAction: 'Follow up call in 2 days',
      priority: 'medium'
    },
    {
      id: '3',
      contactName: 'Emily Rodriguez',
      company: 'GrowthHub',
      email: 'emily.r@growthhub.com',
      phone: '(555) 456-7890',
      method: 'phone',
      status: 'qualified',
      touchDate: new Date(Date.now() - 259200000), // 3 days ago
      notes: 'Qualified lead. Budget confirmed: $50K+',
      nextAction: 'Send proposal',
      priority: 'high'
    },
    {
      id: '4',
      contactName: 'David Kim',
      company: 'Innovation Labs',
      email: 'david.kim@innovationlabs.co',
      phone: '(555) 321-7654',
      method: 'referral',
      status: 'converted',
      touchDate: new Date(Date.now() - 345600000), // 4 days ago
      notes: 'Closed deal. Referred by existing customer.',
      priority: 'high'
    },
    {
      id: '5',
      contactName: 'Lisa Wang',
      company: 'StartupXYZ',
      email: 'lisa@startupxyz.com',
      phone: '(555) 789-0123',
      method: 'email',
      status: 'declined',
      touchDate: new Date(Date.now() - 432000000), // 5 days ago
      notes: 'Not interested at this time. Follow up in Q3',
      priority: 'low'
    }
  ]);

  // Recent prospects filter
  const recentProspects = prospectLogs.filter(log => log.status !== 'declined');
  const qualifiedProspects = prospectLogs.filter(log => log.status === 'qualified' || log.status === 'converted');

  const formatDateTimeForProspectLog = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail size={16} />;
      case 'phone': return <Phone size={16} />;
      case 'linkedin': return <Users size={16} />;
      case 'referral': return <Star size={16} />;
      default: return <Target size={16} />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'email': return 'text-blue-500';
      case 'phone': return 'text-green-500';
      case 'linkedin': return 'text-purple-500';
      case 'referral': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <div className="mb-6">
              <div className="text-center bg-blue-50 rounded-lg p-4 mb-3 border border-blue-100">
                <div className="flex justify-center items-center text-blue-600 mb-2">
                  <Target size={16} className="mr-1" />
                  <Users size={16} className="mr-1" />
                  <span className="text-sm font-medium">Circle Prospecting Dashboard</span>
                </div>
                <p className="text-sm text-gray-700">
                  Track your prospecting activities across all channels and monitor conversion rates.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Focus on high-value prospects and optimize your outreach strategy.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Active Prospects</p>
                    <p className="text-2xl font-bold text-green-800">{recentProspects.length}</p>
                  </div>
                  <Target className="text-green-600" size={24} />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Qualified Leads</p>
                    <p className="text-2xl font-bold text-blue-800">{qualifiedProspects.length}</p>
                  </div>
                  <Star className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'prospects':
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Prospect Activity Log</h2>
              <button className="text-blue-600 text-sm hover:text-blue-800">
                Export Log
              </button>
            </div>
            
            <div className="space-y-4">
              {prospectLogs.map(prospect => (
                <div key={prospect.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className={`mr-2 ${getMethodColor(prospect.method)}`}>
                          {getMethodIcon(prospect.method)}
                        </span>
                        <span className="font-medium">{prospect.contactName}</span>
                      </div>
                      <p className="text-sm text-gray-500">{prospect.company}</p>
                      <p className="text-sm text-gray-500">{prospect.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDateTimeForProspectLog(prospect.touchDate)}</p>
                      <div className="flex items-center justify-end">
                        {prospect.status === 'responded' && (
                          <span className="text-xs text-green-500">Responded</span>
                        )}
                        {prospect.status === 'contacted' && (
                          <span className="text-xs text-blue-500">Contacted</span>
                        )}
                        {prospect.status === 'qualified' && (
                          <span className="text-xs text-orange-500">Qualified</span>
                        )}
                        {prospect.status === 'converted' && (
                          <span className="text-xs text-green-600">Converted</span>
                        )}
                        {prospect.status === 'declined' && (
                          <span className="text-xs text-red-500">Declined</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {prospect.notes && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {prospect.notes}
                    </div>
                  )}
                  
                  {prospect.nextAction && (
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <Clock size={14} className="mr-1" />
                        Next: {prospect.nextAction}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md">
                      Add Note
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      Follow Up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'strategies':
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Prospecting Strategies</h2>
              <span className="text-sm text-gray-500">4 active strategies</span>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-blue-500 mr-2" />
                      <span className="font-medium">Email Outreach</span>
                    </div>
                    <p className="text-sm text-gray-500">Personalized cold emails</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-500">
                      <span className="text-sm font-medium">12.5% response rate</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md">
                    View Templates
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    Configure
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Users size={16} className="text-purple-500 mr-2" />
                      <span className="font-medium">LinkedIn Outreach</span>
                    </div>
                    <p className="text-sm text-gray-500">Connection requests + messages</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-500">
                      <span className="text-sm font-medium">18.2% response rate</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md">
                    View Scripts</button>
                  <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Prospecting Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Daily Targets</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Daily Prospect Goal</p>
                      <p className="text-sm text-gray-500">Target: 10 new prospects/day</p>
                    </div>
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Auto Follow-up</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Auto Follow-up</p>
                    <p className="text-sm text-gray-500">Automatically schedule follow-ups</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <p>New responses</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <p>Daily target reminders</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Circle Prospecting</h1>
        <p className="text-gray-600 mt-1">Systematic prospecting and lead generation management</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-3 font-medium text-center ${
                  activeTab === 'dashboard' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center">
                  <BarChart3 size={18} className="mr-1" />
                  Dashboard
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('prospects')}
                className={`flex-1 py-3 font-medium text-center ${
                  activeTab === 'prospects' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center">
                  <Clock size={18} className="mr-1" />
                  Prospect Log
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('strategies')}
                className={`flex-1 py-3 font-medium text-center ${
                  activeTab === 'strategies' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center">
                  <Target size={18} className="mr-1" />
                  Strategies
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 font-medium text-center ${
                  activeTab === 'settings' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex justify-center items-center">
                  <Settings size={18} className="mr-1" />
                  Settings
                </div>
              </button>
            </div>
            
            <div className="h-[600px] overflow-y-auto">
              {renderTab()}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Prospects</h2>
            <div className="space-y-4">
              {qualifiedProspects.slice(0, 3).map((prospect, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{prospect.contactName}</p>
                      <p className="text-xs text-gray-500">{prospect.company}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prospect.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    prospect.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {prospect.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">This Month</h2>
              <span className="text-sm text-gray-500">Progress</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Prospects</span>
                <span className="font-semibold">{prospectLogs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Responded</span>
                <span className="font-semibold">{prospectLogs.filter(p => p.status === 'responded').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Qualified</span>
                <span className="font-semibold">{prospectLogs.filter(p => p.status === 'qualified').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Converted</span>
                <span className="font-semibold text-green-500">{prospectLogs.filter(p => p.status === 'converted').length}</span>
              </div>
            </div>
            <div className="mt-4">
              <button className="flex items-center text-blue-600 text-sm hover:text-blue-800">
                <BarChart3 size={16} className="mr-1" />
                View Detailed Analytics
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <p className="text-gray-600 text-sm mb-4">
              Fast access to common prospecting tasks and follow-up actions.
            </p>
            <div className="space-y-2">
              <button className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                + Add New Prospect
              </button>
              <button className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                📧 Send Follow-up Email
              </button>
              <button className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                📞 Schedule Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProspecting;