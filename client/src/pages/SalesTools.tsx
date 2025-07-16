import React, { useState } from 'react';
import { Target, TrendingUp, BarChart3, Users, Phone, FileText, Calendar, Bot } from 'lucide-react';

const SalesTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const salesTools = [
    {
      name: 'Lead Scoring',
      description: 'AI-powered lead qualification and scoring system',
      icon: <Target className="h-6 w-6" />,
      category: 'Lead Management',
      color: 'bg-blue-500'
    },
    {
      name: 'Sales Forecasting',
      description: 'Predict revenue and pipeline performance',
      icon: <TrendingUp className="h-6 w-6" />,
      category: 'Analytics',
      color: 'bg-green-500'
    },
    {
      name: 'Proposal Generator',
      description: 'Create professional proposals automatically',
      icon: <FileText className="h-6 w-6" />,
      category: 'Documentation',
      color: 'bg-purple-500'
    },
    {
      name: 'Call Script Generator',
      description: 'Generate effective sales call scripts',
      icon: <Phone className="h-6 w-6" />,
      category: 'Communication',
      color: 'bg-indigo-500'
    },
    {
      name: 'Deal Pipeline',
      description: 'Visual pipeline management and tracking',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'Pipeline',
      color: 'bg-orange-500'
    },
    {
      name: 'Contact Management',
      description: 'Advanced contact and relationship management',
      icon: <Users className="h-6 w-6" />,
      category: 'CRM',
      color: 'bg-red-500'
    },
    {
      name: 'Meeting Scheduler',
      description: 'Automated meeting scheduling and reminders',
      icon: <Calendar className="h-6 w-6" />,
      category: 'Scheduling',
      color: 'bg-yellow-500'
    },
    {
      name: 'Sales AI Assistant',
      description: 'AI-powered sales coaching and recommendations',
      icon: <Bot className="h-6 w-6" />,
      category: 'AI Tools',
      color: 'bg-cyan-500'
    }
  ];

  const metrics = [
    { label: 'Monthly Revenue', value: '$125,000', change: '+12%', positive: true },
    { label: 'Active Deals', value: '47', change: '+8', positive: true },
    { label: 'Conversion Rate', value: '24%', change: '+2.3%', positive: true },
    { label: 'Average Deal Size', value: '$8,500', change: '+15%', positive: true }
  ];

  const recentActivities = [
    { action: 'Deal closed', contact: 'Acme Corp', amount: '$25,000', time: '2 hours ago' },
    { action: 'Meeting scheduled', contact: 'Tech Solutions', amount: '$45,000', time: '4 hours ago' },
    { action: 'Proposal sent', contact: 'Global Industries', amount: '$120,000', time: '1 day ago' },
    { action: 'Follow-up call', contact: 'StartupXYZ', amount: '$15,000', time: '2 days ago' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Tools</h1>
        <p className="text-gray-600 mt-2">Comprehensive sales management and automation tools</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tools' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sales Tools
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.contact}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{activity.amount}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesTools.map((tool, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.category}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{tool.description}</p>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                Launch Tool
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">$125,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm text-gray-500">75% of monthly target ($167,000)</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Qualified Leads</span>
                <span className="font-semibold text-blue-600">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Proposals</span>
                <span className="font-semibold text-orange-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Closing This Month</span>
                <span className="font-semibold text-green-600">8</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTools;