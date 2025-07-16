import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, Zap, Search, Video } from 'lucide-react';
import AIInsightsPanel from '../dashboard/AIInsightsPanel';

const AISmartFeaturesHub: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'insights' | 'controls' | 'performance' | 'tools' | 'video'>('insights');

  // Tab configuration
  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'controls', label: 'AI Controls', icon: Settings },
    { id: 'performance', label: 'AI Performance', icon: BarChart3 },
    { id: 'tools', label: 'AI Tools', icon: Zap },
    { id: 'video', label: 'Video Calls', icon: Video }
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
              onClick={() => setActiveTab(tab.id as unknown)}
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
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Controls</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI control settings will be displayed here.</p>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Performance</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI performance metrics will be displayed here.</p>
          </div>
        )}
        
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
              <h3 className={`font-semibold flex items-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Zap size={18} className="text-purple-600 mr-2" />
                Live Deal Analysis
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI-powered deal analysis tools.</p>
            </div>
            
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
              <h3 className={`font-semibold flex items-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Search size={18} className="text-blue-600 mr-2" />
                Smart Search
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Intelligent search across all data.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'video' && (
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Video Calls</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Video call features and controls.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISmartFeaturesHub;