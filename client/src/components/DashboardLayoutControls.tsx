import React, { useState } from 'react';
import { Settings, RotateCcw, Eye, EyeOff, Grip, Lock, Unlock } from 'lucide-react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useTheme } from '../contexts/ThemeContext';

const DashboardLayoutControls: React.FC = () => {
  const { isDark } = useTheme();
  const { 
    sectionOrder, 
    setSectionOrder, 
    resetToDefault, 
    getSectionConfig,
    isDragging,
    setIsDragging 
  } = useDashboardLayout();
  
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleResetLayout = () => {
    resetToDefault();
    setIsControlsOpen(false);
  };

  const toggleSection = (sectionId: string) => {
    const newOrder = sectionOrder.includes(sectionId)
      ? sectionOrder.filter(id => id !== sectionId)
      : [...sectionOrder, sectionId];
    setSectionOrder(newOrder);
  };

  const allSections = [
    'executive-overview-section',
    'ai-smart-features-hub', 
    'sales-pipeline-deal-analytics',
    'customer-lead-management',
    'activities-communications',
    'integrations-system',
    'kpi-cards-section',
    'quick-actions-section',
    'ai-insights-section',
    'metrics-cards-section',
    'interaction-history-section',
    'customer-profile-section',
    'recent-activity-section',
    'tasks-and-funnel-section',
    'charts-section',
    'analytics-section',
    'apps-section'
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Control Panel */}
      {isControlsOpen && (
        <div className={`absolute bottom-16 left-0 w-80 ${
          isDark ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl border ${
          isDark ? 'border-white/20' : 'border-gray-200'
        } rounded-2xl shadow-2xl overflow-hidden mb-4 transform transition-all duration-300`}>
          
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-gray-50 to-gray-100'}`}>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard Layout
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Customize your dashboard sections
            </p>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleResetLayout}
                className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  isDark 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                } transition-colors`}
              >
                <RotateCcw size={14} />
                <span className="text-xs font-medium">Reset</span>
              </button>
              
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg ${
                  isLocked
                    ? isDark 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                    : isDark 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                } transition-colors`}
              >
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                <span className="text-xs font-medium">{isLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </div>

            {/* Section Toggle List */}
            <div className="space-y-2">
              <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Sections
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {allSections.map((sectionId) => {
                  const config = getSectionConfig(sectionId);
                  const isVisible = sectionOrder.includes(sectionId);
                  
                  if (!config) return null;
                  
                  return (
                    <div
                      key={sectionId}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-center space-x-2">
                        <Grip size={12} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} ${isLocked ? 'opacity-50' : ''}`} />
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {config.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {config.description}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => !isLocked && toggleSection(sectionId)}
                        disabled={isLocked}
                        className={`p-1 rounded transition-colors ${
                          isLocked 
                            ? 'opacity-50 cursor-not-allowed'
                            : isVisible
                              ? isDark 
                                ? 'text-green-400 hover:bg-green-500/20' 
                                : 'text-green-600 hover:bg-green-100'
                              : isDark 
                                ? 'text-gray-400 hover:bg-white/10' 
                                : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drag Status */}
            {isDragging && (
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  Dragging active
                </p>
                <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Release to reorder sections
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsControlsOpen(!isControlsOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform ${
          isControlsOpen ? 'scale-110 rotate-180' : 'hover:scale-105'
        } ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
        }`}
        title="Dashboard Layout Controls"
      >
        <Settings size={20} className="text-white" />
      </button>

      {/* Status Indicator */}
      <div className={`absolute -top-1 -right-1 w-4 h-4 ${
        isLocked ? 'bg-red-400' : 'bg-green-400'
      } rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default DashboardLayoutControls;