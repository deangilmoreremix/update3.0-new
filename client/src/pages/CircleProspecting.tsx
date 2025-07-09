import React, { useState } from 'react';
import { Target, Users, Phone, Mail, MapPin, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CircleProspecting = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const prospectingStrategies = [
    {
      name: 'Warm Introductions',
      description: 'Leverage existing network for referrals',
      icon: <Users className="h-6 w-6" />,
      effectiveness: 85,
      color: 'bg-green-500'
    },
    {
      name: 'Cold Calling',
      description: 'Direct outreach to prospects',
      icon: <Phone className="h-6 w-6" />,
      effectiveness: 45,
      color: 'bg-blue-500'
    },
    {
      name: 'Email Campaigns',
      description: 'Automated email sequences',
      icon: <Mail className="h-6 w-6" />,
      effectiveness: 65,
      color: 'bg-purple-500'
    },
    {
      name: 'Social Selling',
      description: 'LinkedIn and social media outreach',
      icon: <TrendingUp className="h-6 w-6" />,
      effectiveness: 70,
      color: 'bg-orange-500'
    }
  ];

  const prospectingMetrics = [
    { label: 'Prospects Identified', value: '1,247', change: '+18%', positive: true },
    { label: 'Contacts Made', value: '324', change: '+25%', positive: true },
    { label: 'Qualified Leads', value: '87', change: '+12%', positive: true },
    { label: 'Conversion Rate', value: '26.8%', change: '+4.2%', positive: true }
  ];

  const recentProspects = [
    { name: 'TechCorp Solutions', contact: 'Sarah Johnson', status: 'Qualified', priority: 'High' },
    { name: 'Global Industries', contact: 'Mike Chen', status: 'Contacted', priority: 'Medium' },
    { name: 'StartupXYZ', contact: 'Alex Rodriguez', status: 'Researching', priority: 'High' },
    { name: 'Enterprise Co', contact: 'Lisa Wang', status: 'Qualified', priority: 'Low' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Circle Prospecting
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Systematic approach to identifying and engaging potential customers
          </p>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('strategies')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'strategies' 
                ? 'bg-blue-600 text-white' 
                : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            }`}
          >
            Strategies
          </button>
          <button
            onClick={() => setActiveTab('prospects')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'prospects' 
                ? 'bg-blue-600 text-white' 
                : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`
            }`}
          >
            Prospects
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {prospectingMetrics.map((metric, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.label}
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {metric.value}
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prospectingStrategies.map((strategy, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${strategy.color} rounded-xl`}>
                    {strategy.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {strategy.name}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {strategy.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Effectiveness
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {strategy.effectiveness}%
                    </span>
                  </div>
                  <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div 
                      className={`h-2 rounded-full ${strategy.color.replace('bg-', 'bg-')}`}
                      style={{ width: `${strategy.effectiveness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prospects' && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Recent Prospects
              </h3>
              <div className="space-y-4">
                {recentProspects.map((prospect, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 ${isDark ? 'bg-gray-600' : 'bg-white'} rounded-lg`}>
                        <Target className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {prospect.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {prospect.contact}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        prospect.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                        prospect.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prospect.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        prospect.priority === 'High' ? 'bg-red-100 text-red-800' :
                        prospect.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prospect.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleProspecting;