import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useTheme } from '../contexts/ThemeContext';
import { GripVertical } from 'lucide-react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';

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
  const { isDragging, sectionConfigs, sectionVisibility } = useDashboardLayout();
  
  const config = sectionConfigs[sectionId];
  const isVisible = sectionVisibility[sectionId] !== false;
  
  if (!config || !isVisible) return null;

  return (
    <Draggable draggableId={sectionId} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative transition-all duration-300 ${snapshot.isDragging ? 'z-50' : ''}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          {/* Drag Handle */}
          <div 
            {...provided.dragHandleProps}
            className={`absolute -left-8 top-4 p-2 rounded-lg ${
              isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            } cursor-grab opacity-0 hover:opacity-100 transition-opacity ${
              isDragging ? 'opacity-100' : ''
            }`}
          >
            <GripVertical size={20} />
          </div>

          {/* Section Content with Highlighting when Dragging */}
          <div className={`transition-all duration-300 ${
            snapshot.isDragging ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-xl shadow-2xl' : ''
          }`}>
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableSection;