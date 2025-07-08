import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { Settings, Eye, EyeOff, Move } from 'lucide-react';

const DashboardLayoutControls: React.FC = () => {
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  const [isLayoutEditable, setIsLayoutEditable] = useState(false);
  
  const toggleLayoutEditable = () => {
    setIsLayoutEditable(!isLayoutEditable);
  };
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      {/* Layout Controls Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Smart CRM Dashboard
        </h1>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200
            ${isDark 
              ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200'
            }
          `}
        >
          <Settings size={16} />
          <span className="text-sm">Layout</span>
        </button>
      </div>

      {/* Expanded Layout Controls */}
      {isExpanded && (
        <div className={`
          ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}
          backdrop-blur-xl border rounded-xl p-4 mb-4 animate-fade-in
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLayoutEditable}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200
                  ${isLayoutEditable
                    ? (isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200')
                    : (isDark ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200')
                  }
                `}
              >
                {isLayoutEditable ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="text-sm">
                  {isLayoutEditable ? 'Exit Edit Mode' : 'Edit Layout'}
                </span>
              </button>

              {isLayoutEditable && (
                <div className="flex items-center space-x-2">
                  <Move size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Drag sections to reorder
                  </span>
                </div>
              )}
            </div>

            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {sectionOrder.length} sections active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayoutControls;