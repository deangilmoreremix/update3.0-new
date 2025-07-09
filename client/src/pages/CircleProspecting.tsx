import React, { useState } from 'react';
import { Target, TrendingUp, Users, Phone, Mail, Calendar, CheckCircle, Clock, AlertCircle, Star, ArrowRight, Filter, Search, Plus, BarChart3, DollarSign, Eye, MessageCircle, Settings, User, MapPin, Building, Briefcase, Link2, UserPlus, PhoneCall, Send, Edit, Trash2, Download, Upload, RefreshCw, Zap, Activity, Award, ChevronRight, ChevronDown, Flag, Globe, Heart, Home, Info, Lock, Minus, MoreHorizontal, Move, Navigation, Package, Percent, PlayCircle, PlusCircle, Power, Save, Share2, ShoppingBag, ShoppingCart, Smartphone, Sunrise, Sunset, Tablet, ThumbsUp, ToggleLeft, ToggleRight, Tv, Umbrella, Video, Volume2, VolumeX, Watch, Wifi, WifiOff, Wind, Zap as ZapIcon, ArrowUpRight, ArrowDownRight, Bot } from 'lucide-react';

const CircleProspecting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const prospectingData = {
    totalProspects: 145,
    convertedProspects: 32,
    activeProspects: 78,
    avgResponseTime: '2.4 hours',
    conversionRate: 22.1,
    monthlyTarget: 200,
    weeklyGoal: 50,
    completed: 28
  };

  const metrics = [
    { label: 'Total Prospects', value: '145', change: '+12%', positive: true },
    { label: 'Conversion Rate', value: '22.1%', change: '+5.2%', positive: true },
    { label: 'Active Prospects', value: '78', change: '+8', positive: true },
    { label: 'Response Time', value: '2.4h', change: '-15%', positive: true }
  ];

  const strategies = [
    {
      name: 'Cold Email Outreach',
      description: 'Personalized email campaigns to prospects',
      icon: <Mail className="h-6 w-6" />,
      category: 'Email Marketing',
      color: 'bg-blue-500',
      effectiveness: 85,
      responseRate: 12.5,
      costPerLead: 45,
      status: 'active'
    },
    {
      name: 'LinkedIn Prospecting',
      description: 'Direct outreach through LinkedIn connections',
      icon: <Users className="h-6 w-6" />,
      category: 'Social Media',
      color: 'bg-green-500',
      effectiveness: 78,
      responseRate: 18.2,
      costPerLead: 38,
      status: 'active'
    },
    {
      name: 'Phone Prospecting',
      description: 'Direct phone calls to qualified leads',
      icon: <Phone className="h-6 w-6" />,
      category: 'Phone Sales',
      color: 'bg-orange-500',
      effectiveness: 65,
      responseRate: 25.8,
      costPerLead: 67,
      status: 'paused'
    },
    {
      name: 'Content Marketing',
      description: 'Inbound prospects through valuable content',
      icon: <Target className="h-6 w-6" />,
      category: 'Content Strategy',
      color: 'bg-purple-500',
      effectiveness: 92,
      responseRate: 8.3,
      costPerLead: 23,
      status: 'active'
    },
    {
      name: 'Referral Program',
      description: 'Leverage existing customers for new leads',
      icon: <Star className="h-6 w-6" />,
      category: 'Referrals',
      color: 'bg-yellow-500',
      effectiveness: 94,
      responseRate: 35.7,
      costPerLead: 12,
      status: 'active'
    },
    {
      name: 'Event Marketing',
      description: 'Trade shows and networking events',
      icon: <Calendar className="h-6 w-6" />,
      category: 'Events',
      color: 'bg-indigo-500',
      effectiveness: 71,
      responseRate: 22.4,
      costPerLead: 89,
      status: 'active'
    }
  ];

  const recentProspects = [
    { action: 'New prospect added', contact: 'Sarah Johnson - TechCorp', amount: '$45,000', time: '2 hours ago' },
    { action: 'Follow-up scheduled', contact: 'Michael Chen - DataFlow', amount: '$67,000', time: '4 hours ago' },
    { action: 'Demo completed', contact: 'Emily Rodriguez - GrowthHub', amount: '$123,000', time: '1 day ago' },
    { action: 'Proposal sent', contact: 'David Kim - Innovation Labs', amount: '$34,000', time: '2 days ago' },
    { action: 'Meeting scheduled', contact: 'Lisa Wang - StartupXYZ', amount: '$89,000', time: '3 days ago' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Circle Prospecting</h1>
        <p className="text-gray-600 mt-2">Advanced prospecting analytics and management system</p>
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
          onClick={() => setActiveTab('strategies')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'strategies' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Strategies
        </button>
        <button
          onClick={() => setActiveTab('prospects')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'prospects' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Prospects
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

          {/* Monthly Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Target</span>
                <span className="font-semibold text-gray-900">{prospectingData.completed} / {prospectingData.monthlyTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(prospectingData.completed / prospectingData.monthlyTarget) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((prospectingData.completed / prospectingData.monthlyTarget) * 100)}% of monthly target
              </div>
            </div>
          </div>

          {/* Recent Prospecting Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Prospecting Activity</h3>
            <div className="space-y-4">
              {recentProspects.map((activity, index) => (
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

      {activeTab === 'strategies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${strategy.color} text-white`}>
                  {strategy.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{strategy.name}</h3>
                  <p className="text-sm text-gray-600">{strategy.category}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{strategy.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Effectiveness</span>
                  <span className="text-sm font-medium text-gray-900">{strategy.effectiveness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${strategy.effectiveness}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Response Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{strategy.responseRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cost per Lead</p>
                    <p className="text-lg font-semibold text-gray-900">${strategy.costPerLead}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {strategy.status}
                </div>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors text-sm">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'prospects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prospect Pipeline</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cold Prospects</span>
                <span className="font-semibold text-gray-600">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contacted</span>
                <span className="font-semibold text-blue-600">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interested</span>
                <span className="font-semibold text-orange-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Qualified</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sources</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Referrals</span>
                <span className="font-semibold text-green-600">35.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Calls</span>
                <span className="font-semibold text-blue-600">25.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Events</span>
                <span className="font-semibold text-orange-600">22.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LinkedIn</span>
                <span className="font-semibold text-purple-600">18.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircleProspecting;