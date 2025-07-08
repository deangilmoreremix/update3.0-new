import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

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

  return (
    <div 
      className={`
        transition-all duration-300 ease-in-out
        ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}
        rounded-lg p-4 -m-4
      `}
      data-section-id={sectionId}
      data-index={index}
    >
      {children}
    </div>
  );
};

export default DraggableSection;