import React, { useState } from 'react';
import { Brain, Zap, Settings, BarChart3 } from 'lucide-react';
import AIInsightsPanel from '../dashboard/AIInsightsPanel';

const AISmartFeaturesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'controls' | 'performance' | 'tools'>('insights');

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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Smart Features Hub</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 ${
                isActive 
                  ? 'border-b-2 border-purple-500 text-purple-400 dark:border-purple-500 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
          <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Controls</h3>
              <p className="text-gray-600 dark:text-gray-400">Configure AI model preferences and settings</p>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">Monitor AI model usage and performance metrics</p>
            </div>
          </div>
        )}
        
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 dark:border-white/10 flex justify-between items-center">
                <h3 className="font-semibold flex items-center text-gray-900 dark:text-white">
                  <Zap size={18} className="text-purple-600 mr-2" />
                  Live Deal Analysis
                </h3>
                <button className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30">
                  Open Tool
                </button>
              </div>
              <div className="p-4">
                <div className="text-center py-8">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time AI analysis of deal progression</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 dark:border-white/10 flex justify-between items-center">
                <h3 className="font-semibold flex items-center text-gray-900 dark:text-white">
                  <Brain size={18} className="text-blue-600 mr-2" />
                  Smart Search
                </h3>
                <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
                  Open Tool
                </button>
              </div>
              <div className="p-4">
                <div className="text-center py-8">
                  <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered semantic search across CRM data</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISmartFeaturesHub;