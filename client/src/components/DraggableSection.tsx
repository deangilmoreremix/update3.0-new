import React, { useRef } from 'react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

interface DraggableSectionProps {
  sectionId: string;
  children: React.ReactNode;
  index: number;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({ sectionId, children, index }) => {
  const { 
    isDragging, 
    setIsDragging, 
    draggedItem, 
    setDraggedItem, 
    sectionOrder,
    setSectionOrder,
    getSectionConfig
  } = useDashboardLayout();
  
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const sectionConfig = getSectionConfig(sectionId);
  
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
    
    // Add drag image
    if (dragRef.current) {
      const dragImage = dragRef.current.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(2deg)';
      dragImage.style.opacity = '0.8';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set dragOver to false if we're actually leaving the section
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const draggedSectionId = e.dataTransfer.getData('text/plain');
    if (draggedSectionId && draggedSectionId !== sectionId) {
      // Find the current indices
      const draggedIndex = sectionOrder.indexOf(draggedSectionId);
      const targetIndex = sectionOrder.indexOf(sectionId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Create new order array
        const newOrder = [...sectionOrder];
        
        // Remove the dragged item from its current position
        const [draggedSection] = newOrder.splice(draggedIndex, 1);
        
        // Insert it at the target position
        newOrder.splice(targetIndex, 0, draggedSection);
        
        // Update the section order
        setSectionOrder(newOrder);
      }
    }
  };

  const handleRemoveSection = () => {
    const newOrder = sectionOrder.filter(id => id !== sectionId);
    setSectionOrder(newOrder);
  };

  const isBeingDragged = draggedItem === sectionId;
  const showDropZone = isDragging && !isBeingDragged;

  return (
    <div className="relative">
      {/* Drop zone indicator */}
      {showDropZone && (
        <div 
          className={`absolute inset-0 border-2 border-dashed rounded-xl transition-all duration-200 z-10 ${
            dragOver 
              ? 'border-blue-500 bg-blue-500/10 scale-105' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center h-full">
            <div className={`text-sm font-medium ${
              dragOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Drop here to reorder
            </div>
          </div>
        </div>
      )}
      
      {/* Main section */}
      <div
        ref={dragRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`relative transition-all duration-200 ${
          isBeingDragged 
            ? 'opacity-50 scale-95 rotate-1' 
            : 'opacity-100 scale-100'
        } ${
          isDragging && !isBeingDragged 
            ? 'hover:scale-105 hover:shadow-lg' 
            : ''
        }`}
      >
        {/* Drag handle */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemoveSection}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Hide section"
            >
              <EyeOff size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
            <div className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-grab active:cursor-grabbing">
              <GripVertical size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Section content */}
        <div className="group">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DraggableSection;