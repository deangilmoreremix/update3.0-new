import React from 'react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useTheme } from '../contexts/ThemeContext';
import { Grip } from 'lucide-react';

interface DraggableSectionProps {
  sectionId: string;
  index: number;
  children: React.ReactNode;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  sectionId,
  index,
  children
}) => {
  const { isDark } = useTheme();
  const {
    sectionOrder,
    reorderSections,
    getSectionConfig,
    isDragging,
    setIsDragging,
    draggedItem,
    setDraggedItem
  } = useDashboardLayout();

  const config = getSectionConfig(sectionId);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== sectionId) {
      const draggedIndex = sectionOrder.indexOf(draggedItem);
      const targetIndex = sectionOrder.indexOf(sectionId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        reorderSections(draggedIndex, targetIndex);
      }
    }
  };

  if (!config) return null;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        group relative transition-all duration-300 
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${draggedItem === sectionId ? 'opacity-50 scale-95' : ''}
        ${isDragging && draggedItem !== sectionId ? 'transform hover:scale-[1.02]' : ''}
      `}
    >
      {/* Drag Handle */}
      <div className={`
        absolute -left-8 top-4 z-10 opacity-0 group-hover:opacity-100 
        transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2
        ${isDark ? 'text-gray-400' : 'text-gray-500'}
      `}>
        <div className={`
          w-6 h-6 rounded-lg flex items-center justify-center
          ${isDark ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-gray-100/80'}
          backdrop-blur-sm border ${isDark ? 'border-white/10' : 'border-gray-200'}
          shadow-lg cursor-grab active:cursor-grabbing
        `}>
          <Grip size={12} />
        </div>
      </div>

      {/* Section Header */}
      <div className={`
        flex items-center justify-between p-4 mb-4 rounded-xl
        ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'}
        backdrop-blur-sm border ${isDark ? 'border-white/10' : 'border-gray-200'}
        transition-all duration-300
        ${isDragging ? 'shadow-2xl' : 'shadow-sm'}
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            bg-gradient-to-r ${config.color}
          `}>
            <span className="text-white text-sm">📊</span>
          </div>
          <div>
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.title}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {config.description}
            </p>
          </div>
        </div>
        
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-600'}
        `}>
          Section {index + 1}
        </div>
      </div>

      {/* Section Content */}
      <div className={`
        transition-all duration-300
        ${isDragging && draggedItem === sectionId ? 'pointer-events-none' : ''}
      `}>
        {children}
      </div>

      {/* Drop Indicator */}
      {isDragging && draggedItem !== sectionId && (
        <div className={`
          absolute inset-0 border-2 border-dashed rounded-xl pointer-events-none
          ${isDark ? 'border-blue-400/50 bg-blue-500/10' : 'border-blue-500/50 bg-blue-100/30'}
          opacity-0 hover:opacity-100 transition-opacity duration-200
        `} />
      )}
    </div>
  );
};

export default DraggableSection;