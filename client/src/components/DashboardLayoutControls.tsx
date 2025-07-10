import React, { useState } from 'react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { 
  Settings, 
  Grid3X3, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Info
} from 'lucide-react';

const DashboardLayoutControls: React.FC = () => {
  const { 
    sectionOrder, 
    setSectionOrder, 
    isDragging, 
    setIsDragging,
    getSectionConfig,
    resetToDefault 
  } = useDashboardLayout();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Get all available sections (including hidden ones)
  const allSectionIds = [
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
    'pipeline-section',
    'contacts-section',
    'interaction-history-section',
    'customer-profile-section',
    'recent-activity-section',
    'tasks-and-funnel-section',
    'charts-section',
    'analytics-section',
    'apps-section'
  ];

  const hiddenSections = allSectionIds.filter(id => !sectionOrder.includes(id));

  const toggleSection = (sectionId: string) => {
    if (sectionOrder.includes(sectionId)) {
      // Remove section
      setSectionOrder(sectionOrder.filter(id => id !== sectionId));
    } else {
      // Add section
      setSectionOrder([...sectionOrder, sectionId]);
    }
  };

  const toggleDragMode = () => {
    setIsDragging(!isDragging);
  };

  const handleReset = () => {
    resetToDefault();
    setIsExpanded(false);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Main control button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-900 dark:text-white"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Dashboard</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Expanded controls panel */}
        {isExpanded && (
          <div className="absolute top-12 right-0 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-2xl p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Dashboard Layout</h3>
              <button
                onClick={() => setShowTips(!showTips)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Info size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Tips panel */}
            {showTips && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Lightbulb size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Dashboard Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Enable drag mode to reorder sections</li>
                      <li>• Use visibility toggles to show/hide sections</li>
                      <li>• Changes are saved automatically</li>
                      <li>• Reset to restore default layout</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-3">
              {/* Drag & Drop Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Grid3X3 size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Drag & Drop Mode</span>
                </div>
                <button
                  onClick={toggleDragMode}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    isDragging 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isDragging ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Section Visibility */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Section Visibility</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {/* Visible sections */}
                  {sectionOrder.map((sectionId) => {
                    const config = getSectionConfig(sectionId);
                    if (!config) return null;
                    
                    return (
                      <div key={sectionId} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {config.title}
                        </span>
                        <button
                          onClick={() => toggleSection(sectionId)}
                          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye size={14} className="text-green-600 dark:text-green-400" />
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Hidden sections */}
                  {hiddenSections.map((sectionId) => {
                    const config = getSectionConfig(sectionId);
                    if (!config) return null;
                    
                    return (
                      <div key={sectionId} className="flex items-center justify-between opacity-60">
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {config.title}
                        </span>
                        <button
                          onClick={() => toggleSection(sectionId)}
                          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <EyeOff size={14} className="text-gray-400 dark:text-gray-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors"
              >
                <RotateCcw size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Reset Layout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayoutControls;