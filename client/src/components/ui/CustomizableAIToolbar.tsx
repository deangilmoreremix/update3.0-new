import React from 'react';
import { Brain, Zap, Target, Mail, BarChart, Edit } from 'lucide-react';

interface CustomizableAIToolbarProps {
  entityType: 'contact' | 'deal' | 'task';
  entityId: string;
  entityData: any;
  location: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showCustomizeButton?: boolean;
}

export const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  location,
  layout = 'horizontal',
  size = 'md',
  showCustomizeButton = true
}) => {
  const handleAIAction = (action: string) => {
    console.log(`AI action: ${action} for ${entityType} ${entityId}`);
    // Implement AI action logic here
  };

  const buttonSize = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-3' : 'p-2';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const aiActions = [
    { id: 'analyze', icon: Brain, label: 'Analyze', color: 'text-purple-600' },
    { id: 'score', icon: Target, label: 'Score', color: 'text-blue-600' },
    { id: 'personalize', icon: Mail, label: 'Email', color: 'text-green-600' },
    { id: 'insights', icon: BarChart, label: 'Insights', color: 'text-orange-600' },
  ];

  const layoutClass = layout === 'grid' ? 'grid grid-cols-2 gap-1' : 
                     layout === 'vertical' ? 'flex flex-col gap-1' : 
                     'flex gap-1';

  return (
    <div className={layoutClass}>
      {aiActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => handleAIAction(action.id)}
            className={`${buttonSize} ${action.color} bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center`}
            title={action.label}
          >
            <Icon className={iconSize} />
          </button>
        );
      })}
    </div>
  );
};