import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useVideoCall } from '../contexts/VideoCallContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { Sun, Moon, Phone, Layout, User } from 'lucide-react';

const DesignShowcase: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { startCall } = useVideoCall();
  const { layout, toggleSidebar, setWidgetLayout } = useDashboardLayout();
  const [activeTab, setActiveTab] = useState('components');

  const demoParticipant = {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  };

  const startDemoCall = () => {
    startCall(demoParticipant);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Design System Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore all the enhanced components and features in Smart CRM
          </p>
        </div>

        {/* Theme Controls */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Theme Controls</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Current theme: <span className="font-medium">{theme}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'components', label: 'Components', icon: Layout },
                { id: 'video', label: 'Video Calls', icon: Camera },
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'glass', label: 'Glass Effects', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'components' && (
          <div className="space-y-8">
            {/* Modern Buttons */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modern Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  Primary Button
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  Gradient Button
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full font-medium transition-all duration-200">
                  Outline Button
                </button>
                <button className="btn-glass">
                  Glass Button
                </button>
              </div>
            </div>

            {/* Avatar Gallery */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Avatar Components</h3>
              <div className="flex items-center space-x-6">
                {/* Small Avatar */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Small</p>
                </div>

                {/* Medium Avatar */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face"
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Medium</p>
                </div>

                {/* Large Avatar */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                      alt="User"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-400 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Large</p>
                </div>

                {/* Extra Large Avatar */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                      alt="User"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Extra Large</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">KPI Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Contacts', value: '2,547', change: '+12%', icon: User, color: 'blue' },
                  { label: 'Active Deals', value: '89', change: '+5%', icon: BarChart3, color: 'green' },
                  { label: 'Meetings Today', value: '7', change: '-2%', icon: Calendar, color: 'purple' },
                  { label: 'Emails Sent', value: '156', change: '+8%', icon: Mail, color: 'orange' }
                ].map((kpi, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                      <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Video Call System</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Test the video calling functionality with a demo call. This will show the full-screen overlay and controls.
              </p>
              <button
                onClick={startDemoCall}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Phone size={20} />
                <span>Start Demo Video Call</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard Layout Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {layout.sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Sidebar is currently {layout.sidebarCollapsed ? 'collapsed' : 'expanded'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Widget Layout:</label>
                  {(['grid', 'list', 'compact'] as const).map((layoutType) => (
                    <button
                      key={layoutType}
                      onClick={() => setWidgetLayout(layoutType)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        layout.widgetLayout === layoutType
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'glass' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Default Glass Card */}
              <div className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Default Glass</h4>
                <p className="text-white/80">This card uses the default glass morphism effect with subtle transparency.</p>
              </div>
              
              {/* Strong Glass Card */}
              <div className="glass-card-strong p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Strong Glass</h4>
                <p className="text-white/80">This card has a stronger glass effect with more opacity and blur.</p>
              </div>
              
              {/* Subtle Glass Card */}
              <div className="glass-card-subtle p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Subtle Glass</h4>
                <p className="text-white/80">This card uses a subtle glass effect for minimal distraction.</p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Glass Morphism Effects</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The glass morphism effects above demonstrate different levels of transparency and blur. 
                These effects work best over gradient backgrounds or images.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignShowcase;