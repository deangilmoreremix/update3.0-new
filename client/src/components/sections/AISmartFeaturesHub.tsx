import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, Zap, Settings, BarChart3, Search } from 'lucide-react';
import AIInsightsPanel from '../dashboard/AIInsightsPanel';

const AISmartFeaturesHub: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('insights');

  // Tab configuration
  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'controls', label: 'AI Controls', icon: Settings },
    { id: 'performance', label: 'AI Performance', icon: BarChart3 },
    { id: 'tools', label: 'AI Tools', icon: Zap }
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mr-3">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Smart Features Hub</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered insights and productivity tools
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 ${
                isActive 
                  ? (isDark ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-600 text-purple-600')
                  : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'insights' && <AIInsightsPanel />}
        
        {activeTab === 'controls' && (
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Smart AI Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Model Selection</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI model optimization controls</p>
              </div>
              <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Processing Queue</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage AI processing tasks</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>AI Performance Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Response Time</h4>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1.2s</p>
              </div>
              <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Accuracy</h4>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>94%</p>
              </div>
              <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Tasks Completed</h4>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>147</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
              <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Zap size={18} className="text-purple-600 mr-2" />
                  Live Deal Analysis
                </h3>
              </div>
              <div className="p-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time AI analysis of deal progress and recommendations
                </p>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
              <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Search size={18} className="text-blue-600 mr-2" />
                  Smart Search
                </h3>
              </div>
              <div className="p-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI-powered semantic search across all CRM data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISmartFeaturesHub;