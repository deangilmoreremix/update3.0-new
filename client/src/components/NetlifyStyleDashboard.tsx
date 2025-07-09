import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Video,
  MessageSquare,
  Clock,
  Target,
  BarChart3,
  ChevronDown,
  Filter,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Star,
  Eye,
  MoreVertical
} from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';

const NetlifyStyleDashboard: React.FC = () => {
  const { deals, totalPipelineValue } = useDealStore();
  const { contacts } = useContactStore();
  const { tasks } = useTaskStore();
  const { appointments } = useAppointmentStore();
  
  const [selectedTab, setSelectedTab] = useState('insights');
  const [selectedAnalyticsTab, setSelectedAnalyticsTab] = useState('performance');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate metrics from real data
  const dealsList = Object.values(deals);
  const contactsList = Object.values(contacts);
  const tasksList = Object.values(tasks);
  const appointmentsList = Object.values(appointments);

  // Calculate real metrics
  const monthlyRevenue = dealsList
    .filter(deal => deal.status === 'won')
    .reduce((sum, deal) => sum + deal.value, 0);

  const activeDealCount = dealsList.filter(deal => 
    deal.status === 'qualification' || deal.status === 'proposal' || deal.status === 'negotiation'
  ).length;

  const wonDealsCount = dealsList.filter(deal => deal.status === 'won').length;
  const avgDealSize = wonDealsCount > 0 ? monthlyRevenue / wonDealsCount : 0;

  // Get hot leads
  const hotLeads = contactsList.filter(contact => 
    contact.interestLevel === 'hot' || contact.status === 'lead'
  );

  // Get high priority tasks
  const highPriorityTasks = tasksList.filter(task => 
    task.priority === 'high' && task.status !== 'completed'
  );

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your sales performance</p>
            <p className="text-sm text-gray-500 mt-2">{today}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <div className="ml-2 flex items-center space-x-1">
                {contactsList.slice(0, 3).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-blue-600 font-medium">+8%</span>
              <div className="ml-2 flex items-center space-x-1">
                {contactsList.slice(0, 3).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
                <span className="text-xs text-gray-500 ml-1">{activeDealCount}</span>
              </div>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{contactsList.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-purple-600 font-medium">+15%</span>
              <div className="ml-2 flex items-center space-x-1">
                {contactsList.slice(0, 3).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
                <span className="text-xs text-gray-500 ml-1">1</span>
              </div>
            </div>
          </div>

          {/* Active Deals */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{activeDealCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-orange-600 font-medium">-3%</span>
              <div className="ml-2 flex items-center space-x-1">
                {contactsList.slice(0, 1).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* New Deal */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">New Deal</h3>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Create a new deal</p>
              <div className="flex items-center space-x-1">
                {contactsList.slice(0, 3).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
                <span className="text-xs text-gray-500 ml-1">{activeDealCount} deals</span>
              </div>
            </div>

            {/* Add Contact */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Add Contact</h3>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Add new contact</p>
              <div className="flex items-center space-x-1">
                {contactsList.slice(0, 3).map((contact, index) => (
                  <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                ))}
                <span className="text-xs text-gray-500 ml-1">+5</span>
                <span className="text-xs text-gray-500">{contactsList.length} contacts</span>
              </div>
            </div>

            {/* Schedule Meeting */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Schedule Meeting</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Book a meeting</p>
            </div>

            {/* Send Email */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Send Email</h3>
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Compose email</p>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Deals */}
            <div className="text-center">
              <div className="text-sm text-green-600 font-medium mb-1">+12%</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{activeDealCount}</div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>

            {/* Pipeline Value */}
            <div className="text-center">
              <div className="text-sm text-blue-600 font-medium mb-1">+8%</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${Math.round(totalPipelineValue / 1000)}K</div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
            </div>

            {/* Won Deals */}
            <div className="text-center">
              <div className="text-sm text-purple-600 font-medium mb-1">+15%</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{wonDealsCount}</div>
              <div className="text-sm text-gray-600">Won Deals</div>
            </div>

            {/* Avg Deal Size */}
            <div className="text-center">
              <div className="text-sm text-orange-600 font-medium mb-1">-3%</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${Math.round(avgDealSize / 1000)}K</div>
              <div className="text-sm text-gray-600">Avg Deal Size</div>
            </div>
          </div>
        </div>

        {/* AI Smart Features Hub */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Smart Features Hub</h2>
              <p className="text-sm text-gray-600">AI-powered insights and productivity tools</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {['insights', 'controls', 'performance', 'tools'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    selectedTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  AI {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* AI Pipeline Intelligence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-900">AI Pipeline Intelligence</h3>
              <p className="text-sm text-gray-600">Real-time insights powered by AI</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Generate Insights
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Pipeline Health */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">Pipeline Health</h4>
                  <span className="text-sm font-medium text-green-600">Strong</span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Your pipeline velocity has increased 23% this month with high-quality leads entering the qualification stage.
                </p>
                <div className="flex items-center space-x-1">
                  {contactsList.slice(0, 2).map((contact, index) => (
                    <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal Risk Alert */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-900">Deal Risk Alert</h4>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  1 high-value deals show stagnation in negotiation stage. Consider immediate follow-up actions.
                </p>
                <div className="flex items-center space-x-1">
                  {contactsList.slice(0, 1).map((contact, index) => (
                    <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Opportunity */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">Conversion Opportunity</h4>
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  AI identified 1 prospects with 85%+ closing probability. Prioritize these for immediate attention.
                </p>
                <div className="flex items-center space-x-1">
                  {contactsList.slice(0, 1).map((contact, index) => (
                    <div key={contact.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-2 ring-white">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Sales Pipeline & Customer Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Pipeline & Analytics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline & Analytics</h2>
                <p className="text-sm text-gray-600">Comprehensive deal performance and pipeline insights</p>
              </div>
            </div>
            
            {/* Deal Analytics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-gray-900">Deal Analytics</h3>
                <div className="flex space-x-1">
                  {['Week', 'Month', 'Quarter'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period.toLowerCase())}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        selectedPeriod === period.toLowerCase()
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Total Revenue */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                      {contactsList[0]?.firstName.charAt(0)}{contactsList[0]?.lastName.charAt(0)}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">${Math.round(monthlyRevenue / 1000)}k</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-xs text-gray-500">Revenue from closed deals</div>
                </div>

                {/* Conversion Rate */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                      {contactsList[0]?.firstName.charAt(0)}{contactsList[0]?.lastName.charAt(0)}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">25.0%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="text-xs text-gray-500">Deals won vs total deals</div>
                </div>

                {/* Total Contacts */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-600 font-medium">+15.3%</span>
                    <div className="flex items-center space-x-1">
                      {contactsList.slice(0, 3).map((contact, index) => (
                        <div key={contact.id} className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-1 ring-white">
                          {contact.firstName.charAt(0)}
                        </div>
                      ))}
                      <span className="text-xs text-gray-500">+2</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{contactsList.length}</div>
                  <div className="text-sm text-gray-600">Total Contacts</div>
                  <div className="text-xs text-gray-500">Active contacts in pipeline</div>
                </div>

                {/* Avg Deal Size */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-medium">-2.1%</span>
                    <div className="flex items-center space-x-1">
                      {contactsList.slice(0, 2).map((contact, index) => (
                        <div key={contact.id} className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-1 ring-white">
                          {contact.firstName.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">${Math.round(avgDealSize / 1000)}k</div>
                  <div className="text-sm text-gray-600">Avg Deal Size</div>
                  <div className="text-xs text-gray-500">Average revenue per deal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Lead Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Customer & Lead Management</h2>
                <p className="text-sm text-gray-600">Manage and nurture your prospect relationships</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Add Contact
              </button>
            </div>

            {/* New Leads */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900">New Leads</h3>
                  <p className="text-sm text-gray-600">{hotLeads.length} active leads</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-red-600 font-medium">1 hot</span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Add Lead</button>
                </div>
              </div>

              <div className="space-y-3">
                {contactsList.slice(0, 4).map((contact, index) => (
                  <div key={contact.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.interestLevel === 'hot' ? 'bg-red-100 text-red-800' :
                          contact.interestLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.interestLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{contact.title}</p>
                      <p className="text-sm text-gray-500">{contact.company}</p>
                      <p className="text-xs text-gray-400">Source: LinkedIn</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activities & Communications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Activities & Communications</h2>
              <p className="text-sm text-gray-600">Manage your tasks, appointments, and communications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks & Activities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900">Your Days Tasks</h3>
                  <p className="text-sm text-gray-600">{tasksList.length} active tasks</p>
                </div>
                <span className="text-sm text-red-600 font-medium">{highPriorityTasks.length} high priority</span>
              </div>

              <div className="space-y-3">
                {tasksList.slice(0, 3).map((task, index) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                      {task.assignedTo ? task.assignedTo.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">{task.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interaction History */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Interaction History</h3>
              <div className="space-y-3">
                {dealsList.slice(0, 4).map((deal, index) => (
                  <div key={deal.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">
                      Oct {12 + index}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{deal.title}</h4>
                      <p className="text-sm text-gray-600">${deal.value.toLocaleString()}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {contactsList.slice(0, 2).map((contact, cIndex) => (
                          <div key={contact.id} className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 -ml-1 first:ml-0 ring-1 ring-white">
                            {contact.firstName.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Tasks Schedule</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center text-sm font-medium text-gray-900 mb-4">October</div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`header-${index}`} className="text-xs font-medium text-gray-500 py-2">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div key={`day-${day}`} className="text-xs py-2 hover:bg-gray-200 rounded cursor-pointer">
                      {day}
                      {(day === 15 || day === 16 || day === 17) && (
                        <div className="flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-gray-300 -ml-1 first:ml-0"></div>
                          {day === 17 && <div className="w-2 h-2 rounded-full bg-gray-300 -ml-1"></div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetlifyStyleDashboard;