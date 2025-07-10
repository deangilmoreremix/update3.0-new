import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useAITools } from '../AIToolsProvider';
import { Play, Pause, Settings, BarChart3, Users, Zap, RefreshCw, Mail, Target } from 'lucide-react';

export const SmartAIControls: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { openTool } = useAITools();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleBulkAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisProgress(i);
    }
    
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  const contactCount = Object.keys(contacts).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Smart AI Controls
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Bulk AI operations and intelligent automation
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Settings className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>

      {/* Bulk Analysis Section */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Bulk Contact Analysis
              </h4>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyze {contactCount} contacts with AI
              </p>
            </div>
          </div>
          
          <button
            onClick={handleBulkAnalysis}
            disabled={isAnalyzing}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
              ${isAnalyzing
                ? (isDark ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200')
              }
            `}
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="mb-4">
            <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Processing contact {Math.floor((analysisProgress / 100) * contactCount)} of {contactCount}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => openTool('lead-scorer')}
          className={`
          p-4 rounded-lg text-left transition-all duration-200 hover:scale-105
          ${isDark ? 'bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20' : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'}
        `}>
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Lead Scoring
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Score all leads with AI
          </p>
        </button>

        <button 
          onClick={() => openTool('sales-forecast')}
          className={`
          p-4 rounded-lg text-left transition-all duration-200 hover:scale-105
          ${isDark ? 'bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20' : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'}
        `}>
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Deal Prediction
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Predict deal closures
          </p>
        </button>

        <button 
          onClick={() => openTool('email-composer')}
          className={`
          p-4 rounded-lg text-left transition-all duration-200 hover:scale-105
          ${isDark ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20' : 'bg-green-50 border border-green-200 hover:bg-green-100'}
        `}>
          <div className="flex items-center space-x-3 mb-2">
            <Mail className="w-5 h-5 text-green-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Email Personalization
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate personalized emails
          </p>
        </button>

        <button 
          onClick={() => openTool('opportunity-finder')}
          className={`
          p-4 rounded-lg text-left transition-all duration-200 hover:scale-105
          ${isDark ? 'bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20' : 'bg-orange-50 border border-orange-200 hover:bg-orange-100'}
        `}>
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-5 h-5 text-orange-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Opportunity Analysis
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Find high-value opportunities
          </p>
        </button>
      </div>

      {/* Settings Panel */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
        <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
          AI Automation Settings
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Auto-score new leads
            </span>
            <div className={`w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-blue-500' : 'bg-blue-600'} relative`}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Daily AI insights
            </span>
            <div className={`w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-blue-500' : 'bg-blue-600'} relative`}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Smart follow-up reminders
            </span>
            <div className={`w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-gray-600' : 'bg-gray-300'} relative`}>
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};