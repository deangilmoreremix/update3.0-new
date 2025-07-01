import React from 'react';
import { BarChart3, Mail, Search, TrendingUp } from 'lucide-react';

interface CustomizableAIToolbarProps {
  entityType: string;
  entityId: string;
  entityData: any;
  location: string;
  layout: 'grid' | 'row';
  size: 'sm' | 'md';
  showCustomizeButton?: boolean;
}

export const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  location,
  layout,
  size,
  showCustomizeButton = true
}) => {
  const handleToolClick = (toolName: string) => {
    console.log(`Opening ${toolName} for ${entityType} ${entityId}`);
    // This would integrate with the AI tools system
  };

  const buttonSize = size === 'sm' ? 'p-1' : 'p-2';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`${layout === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex gap-1'}`}>
      <button
        onClick={() => handleToolClick('lead-scoring')}
        className={`${buttonSize} ${textSize} bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 border border-blue-200/50`}
      >
        <BarChart3 className={iconSize} />
        {layout === 'row' && 'Score'}
      </button>
      
      <button
        onClick={() => handleToolClick('email-ai')}
        className={`${buttonSize} ${textSize} bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center gap-1 border border-green-200/50`}
      >
        <Mail className={iconSize} />
        {layout === 'row' && 'Email'}
      </button>
      
      <button
        onClick={() => handleToolClick('enrich')}
        className={`${buttonSize} ${textSize} bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 border border-purple-200/50`}
      >
        <Search className={iconSize} />
        {layout === 'row' && 'Enrich'}
      </button>
      
      <button
        onClick={() => handleToolClick('insights')}
        className={`${buttonSize} ${textSize} bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors flex items-center justify-center gap-1 border border-orange-200/50`}
      >
        <TrendingUp className={iconSize} />
        {layout === 'row' && 'Insights'}
      </button>
    </div>
  );
};