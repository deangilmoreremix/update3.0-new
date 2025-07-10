import React from 'react';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import { useTheme } from '../contexts/ThemeContext';

interface SimpleSectionProps {
  sectionId: string;
  children: React.ReactNode;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({
  sectionId,
  children
}) => {
  const { isDark } = useTheme();
  const { sectionConfigs, sectionVisibility } = useDashboardLayout();
  
  const config = sectionConfigs[sectionId];
  const isVisible = sectionVisibility[sectionId] !== false;
  
  if (!config || !isVisible) return null;

  return (
    <div className="mb-8">
      {children}
    </div>
  );
};

export default SimpleSection;