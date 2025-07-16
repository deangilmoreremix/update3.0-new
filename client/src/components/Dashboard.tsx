import React, { useState, useEffect, useRef } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { Calendar, TrendingUp, Users, UserPlus, BarChart3, DollarSign, Target, Plus, Phone, Mail, MessageCircle, Settings, User, Award, Eye } from 'lucide-react';

// Import section components
import ExecutiveOverviewSection from './sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from './sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from './sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from './sections/CustomerLeadManagement';
import ActivitiesCommunications from './sections/ActivitiesCommunications';
import IntegrationsSystem from './sections/IntegrationsSystem';

// Memo Dashboard component to prevent unnecessary re-renders
const Dashboard: React.FC = React.memo(() => {
  const {
    deals,
    fetchDeals,
    isLoading,
    stageValues,
    totalPipelineValue
  } = useDealStore();

  const {
    contacts,
    fetchContacts,
    isLoading: contactsLoading
  } = useContactStore();

  const { tasks, fetchTasks } = useTaskStore();
  const { fetchAppointments } = useAppointmentStore();
  const { openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();

  const gemini = useGemini();

  // Mock contacts data for development
  const mockContacts = [
    { id: '1', name: 'Sarah Johnson', title: 'VP of Sales', company: 'TechCorp Inc.' },
    { id: '2', name: 'Michael Chen', title: 'CTO', company: 'Innovation Labs' },
    { id: '3', name: 'Emily Rodriguez', title: 'Marketing Director', company: 'Growth Solutions' },
    { id: '4', name: 'David Kim', title: 'CEO', company: 'StartupX' }
  ];

  // Use mock data if contacts is not an array
  const contactsData = Array.isArray(contacts) ? contacts : mockContacts;

  // Prevent repeated data fetching by using a ref to track initialization
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only fetch data once
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Fetch all data when component mounts
    fetchDeals();
    fetchContacts();

    // Wrap in try/catch to prevent errors from breaking the app
    try {
      fetchTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }

    try {
      fetchAppointments();
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }

    // Set up timer to refresh data periodically
    const intervalId = window.setInterval(() => {
      fetchDeals();
      fetchContacts();
    }, 300000); // Refresh every 5 minutes

    // Proper cleanup
    return () => window.clearInterval(intervalId);
  }, []);

  // Sales Conversion Metrics Component
  const SalesConversionMetrics = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales Conversion Metrics</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Lead to Opportunity</span>
            <span className="text-xs text-green-600 font-medium">+4.5%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">32%</div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Opportunity to Proposal</span>
            <span className="text-xs text-green-600 font-medium">+2.1%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">68%</div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Proposal to Win</span>
            <span className="text-xs text-red-600 font-medium">-1.2%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">45%</div>
        </div>
      </div>
    </div>
  );

  // Customer & Lead Management Component
  const CustomerLeadManagementSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500 rounded-lg mr-3">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customer & Lead Management</h2>
            <p className="text-sm text-gray-600">Manage and nurture your prospect relationships</p>
          </div>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Leads */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">New Leads</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">4 active leads</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">1 hot</span>
              <button className="ml-2 text-green-600 hover:text-green-700">
                <Plus className="h-4 w-4" />
                Add Lead
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactsData.slice(0, 4).map((contact, index) => (
              <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{contact.name}</h4>
                    <p className="text-xs text-gray-600">{contact.title}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  {contact.company}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Source: LinkedIn
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${
                    index === 0 ? 'bg-red-100 text-red-600' : 
                    index === 1 ? 'bg-blue-100 text-blue-600' : 
                    index === 2 ? 'bg-orange-100 text-orange-600' : 
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {index === 0 ? 'hot' : index === 1 ? 'cold' : 'warm'}
                  </span>
                  <div className="flex space-x-1">
                    <button className="w-6 h-6 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600">
                      <Mail className="h-3 w-3" />
                    </button>
                    <button className="w-6 h-6 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600">
                      <Phone className="h-3 w-3" />
                    </button>
                    <button className="w-6 h-6 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600">
                      <MessageCircle className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Profile */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Customer Profile</h3>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="h-4 w-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                ER
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Eva Robinson</h4>
                <p className="text-sm text-gray-600">CEO, Inc. Alabama Machinery & Supply</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <button className="flex-1 py-2 px-3 bg-white rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                <User className="h-4 w-4 mx-auto" />
              </button>
              <button className="flex-1 py-2 px-3 bg-white rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Mail className="h-4 w-4 mx-auto" />
              </button>
              <button className="flex-1 py-2 px-3 bg-white rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Phone className="h-4 w-4 mx-auto" />
              </button>
              <button className="flex-1 py-2 px-3 bg-white rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Plus className="h-4 w-4 mx-auto" />
              </button>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Detailed Information</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">First Name</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-600">Welcome back! Here's an overview of your sales performance</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          Tuesday, July 8, 2025
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">$247,890</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Growth Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">+12.5%</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">New Customers</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">34</div>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-green-600 font-medium">+12%</div>
          <div className="text-xl font-bold text-gray-900">3</div>
          <div className="text-xs text-gray-600">Active Deals</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-green-600 font-medium">+8%</div>
          <div className="text-xl font-bold text-gray-900">$245,000</div>
          <div className="text-xs text-gray-600">Pipeline Value</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-green-600 font-medium">+18%</div>
          <div className="text-xl font-bold text-gray-900">1</div>
          <div className="text-xs text-gray-600">Won Deals</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-red-600 font-medium">-3%</div>
          <div className="text-xl font-bold text-gray-900">$81,667</div>
          <div className="text-xs text-gray-600">Avg Deal Size</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-green-500 text-white rounded-lg p-4 hover:bg-green-600 transition-colors">
            <Plus className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">New Deal</div>
            <div className="text-xs opacity-90">Create a new deal</div>
          </button>
          
          <button className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition-colors">
            <UserPlus className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Add Contact</div>
            <div className="text-xs opacity-90">Add new contact</div>
          </button>
          
          <button className="bg-purple-500 text-white rounded-lg p-4 hover:bg-purple-600 transition-colors">
            <Calendar className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Schedule Meeting</div>
            <div className="text-xs opacity-90">Book a meeting</div>
          </button>
          
          <button className="bg-orange-500 text-white rounded-lg p-4 hover:bg-orange-600 transition-colors">
            <Mail className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Send Email</div>
            <div className="text-xs opacity-90">Compose email</div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SalesConversionMetrics />
        <CustomerLeadManagementSection />
        <DashboardOverview />
        <div className="mt-8">
          <ExecutiveOverviewSection />
        </div>
        <div className="mt-8">
          <AISmartFeaturesHub />
        </div>
        <div className="mt-8">
          <SalesPipelineDealAnalytics />
        </div>
        <div className="mt-8">
          <ActivitiesCommunications />
        </div>
      </div>
    </div>
  );
});

export default Dashboard;