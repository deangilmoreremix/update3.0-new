import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, BarChart3, Toggle, Sliders, AlertCircle, CheckCircle } from 'lucide-react';

interface AIControlsPanelProps {}

const AIControlsPanel: React.FC<AIControlsPanelProps> = () => {
  const { isDark } = useTheme();
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [autoInsights, setAutoInsights] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState(false);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [analysisFrequency, setAnalysisFrequency] = useState(30);

  const toggleSetting = (setting: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    console.log(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
        enabled ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* AI Analysis Controls */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Analysis Controls
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Real-time Contact Analysis
              </label>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Automatically analyze contact interactions and behavior
              </p>
            </div>
            <ToggleSwitch
              enabled={aiAnalysisEnabled}
              onToggle={() => toggleSetting('AI Analysis', !aiAnalysisEnabled, setAiAnalysisEnabled)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Auto-Generated Insights
              </label>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate insights from deal and contact data
              </p>
            </div>
            <ToggleSwitch
              enabled={autoInsights}
              onToggle={() => toggleSetting('Auto Insights', !autoInsights, setAutoInsights)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Smart Notifications
              </label>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Get AI-powered alerts for important opportunities
              </p>
            </div>
            <ToggleSwitch
              enabled={smartNotifications}
              onToggle={() => toggleSetting('Smart Notifications', !smartNotifications, setSmartNotifications)}
            />
          </div>
        </div>
      </div>

      {/* AI Threshold Controls */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center mb-4">
          <Sliders className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Threshold Settings
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Confidence Threshold: {aiConfidenceThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={aiConfidenceThreshold}
              onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Minimum confidence level for AI recommendations
            </p>
          </div>

          <div>
            <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Analysis Frequency: Every {analysisFrequency} minutes
            </label>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={analysisFrequency}
              onChange={(e) => setAnalysisFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              How often to run automatic analysis
            </p>
          </div>
        </div>
      </div>

      {/* AI Status */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI System Status
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Analysis: Active
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              Deal Intelligence: Active
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart Search: Active
            </span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              Voice Analysis: Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIControlsPanel;