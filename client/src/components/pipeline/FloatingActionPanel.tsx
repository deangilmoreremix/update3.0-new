import React, { useState } from 'react';
import { Plus, List } from 'lucide-react';

interface FloatingActionPanelProps {
  onAddDeal: () => void;
  onToggleAnalytics: () => void;
  onToggleView: () => void;
  showAnalytics: boolean;
  viewMode: 'kanban' | 'list';
}

export const FloatingActionPanel: React.FC<FloatingActionPanelProps> = ({
  onAddDeal,
  onToggleAnalytics,
  onToggleView,
  showAnalytics,
  viewMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'Add Deal',
      action: onAddDeal,
      color: 'bg-blue-500 hover:bg-blue-600',
      primary: true,
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      action: onToggleAnalytics,
      color: showAnalytics ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600',
    },
    {
      icon: viewMode === 'kanban' ? List : Grid,
      label: viewMode === 'kanban' ? 'List View' : 'Kanban View',
      action: onToggleView,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Zap,
      label: 'AI Insights',
      action: () => console.log('AI Insights'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        {/* Expanded Actions */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 space-y-2 mb-2">
            {actions.slice(1).map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-lg shadow-lg text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={action.action}
                  className={`${action.color} text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110`}
                >
                  <action.icon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 relative"
        >
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`}>
            <Plus className="w-6 h-6" />
          </div>
          
          {/* Pulse animation for primary action */}
          {!isExpanded && (
            <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
          )}
        </button>

        {/* Quick Add Button (always visible) */}
        <button
          onClick={onAddDeal}
          className="absolute -top-14 left-0 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-80 hover:opacity-100"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionPanel;