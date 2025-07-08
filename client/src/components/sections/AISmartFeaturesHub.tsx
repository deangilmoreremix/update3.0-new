import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, Zap, Target, Search, Mail, BarChart3, Users, Lightbulb } from 'lucide-react';
import AIModelSelector from '../AIModelSelector';
import { SmartAIControls } from '../ai/SmartAIControls';

const AISmartFeaturesHub: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o');

  const aiFeatures = [
    {
      id: 'lead-scoring',
      title: 'AI Lead Scoring',
      description: 'Automatically score and prioritize leads',
      icon: Target,
      color: 'from-blue-500 to-indigo-500',
      usage: '89%',
      status: 'active'
    },
    {
      id: 'email-assistant',
      title: 'Email Assistant',
      description: 'Generate personalized emails with AI',
      icon: Mail,
      color: 'from-green-500 to-emerald-500',
      usage: '76%',
      status: 'active'
    },
    {
      id: 'deal-intelligence',
      title: 'Deal Intelligence',
      description: 'AI-powered deal analysis and insights',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      usage: '82%',
      status: 'active'
    },
    {
      id: 'smart-search',
      title: 'Smart Search',
      description: 'Semantic search across all your data',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      usage: '67%',
      status: 'active'
    }
  ];

  const getUsageColor = (usage: string) => {
    const percent = parseInt(usage);
    if (percent >= 80) return 'text-green-500';
    if (percent >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Smart Features Hub</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Intelligent automation and insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Model Selection */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              AI Model Selection
            </h3>
            <AIModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>

          {/* AI Performance Metrics */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Performance
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</span>
                <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Response Time</span>
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1.8s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cost Savings</span>
                <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>67%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="lg:col-span-2">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Active AI Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        feature.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                      } animate-pulse`}></div>
                      <span className={`text-xs ${getUsageColor(feature.usage)}`}>
                        {feature.usage} active
                      </span>
                    </div>
                  </div>
                  
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {feature.title}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    {feature.description}
                  </p>
                  
                  <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}
                      style={{ width: feature.usage }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smart AI Controls */}
      <div className="mt-6">
        <SmartAIControls />
      </div>
    </div>
  );
};

export default AISmartFeaturesHub;