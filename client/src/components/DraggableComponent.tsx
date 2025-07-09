import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';

interface DraggableComponentProps {
  componentId: string;
  index: number;
  children: React.ReactNode;
  title?: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  componentId,
  index,
  children,
  title
}) => {
  const { isDark } = useTheme();
  const { isDragModeEnabled } = useDashboardLayout();

  return (
    <Draggable draggableId={componentId} index={index} isDragDisabled={!isDragModeEnabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
        >
          {/* Drag Handle */}
          {isDragModeEnabled && (
            <div
              {...provided.dragHandleProps}
              className={`absolute -left-10 top-4 p-2 rounded-lg cursor-move transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              } ${snapshot.isDragging ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
              aria-label={`Drag handle for ${title || componentId}`}
            >
              <GripVertical className="h-5 w-5" />
            </div>
          )}
          
          {/* Component Content */}
          <div className={`${snapshot.isDragging ? 'opacity-90' : ''} transition-opacity duration-200`}>
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableComponent;