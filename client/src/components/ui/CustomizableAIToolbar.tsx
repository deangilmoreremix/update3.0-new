import React from 'react';
import { ModernButton } from './ModernButton';
import { Brain, Zap, MessageSquare, Target, BarChart3, Lightbulb, Search, Edit3 } from 'lucide-react';

interface QuickAIButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  toolName: string;
  entityType: string;
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

interface CustomizableAIToolbarProps {
  entityType: string;
  entityId: string;
  entityData: any;
  location: string;
  layout: 'grid' | 'row';
  size: 'sm' | 'md';
  showCustomizeButton?: boolean;
}

const QuickAIButton: React.FC<QuickAIButtonProps> = ({
  icon: Icon,
  label,
  toolName,
  entityType,
  entityId,
  entityData,
  size = 'sm',
  variant = 'secondary',
  className = '',
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      console.log(`Opening AI tool: ${toolName} for ${entityType}:`, entityId);
      // In real implementation, this would open the AI tool modal
      // with pre-populated context from entityData
    }
  };

  return (
    <ModernButton
      variant={variant === 'primary' ? 'primary' : 'outline'}
      size={size}
      onClick={handleClick}
      className={`${className} flex items-center justify-center`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
      <span className="text-xs">{label}</span>
    </ModernButton>
  );
};

export const AIGoalsButton: React.FC<{
  entityType: string;
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ entityType, entityId, entityData, size = 'sm', className = '' }) => {
  const handleAIGoalsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Opening AI Goals for ${entityType}:`, entityId);
    // In real implementation, navigate to AI Goals page with context
    // window.location.href = `/ai-goals?entity=${entityType}&id=${entityId}`;
  };

  return (
    <ModernButton
      variant="primary"
      size={size}
      onClick={handleAIGoalsClick}
      className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ${className}`}
    >
      <Brain className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
      <span className="text-xs font-medium">AI Goals & Automation</span>
    </ModernButton>
  );
};

export const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  location,
  layout,
  size,
  showCustomizeButton = false
}) => {
  // Define AI tools based on entity type and location
  const getAITools = () => {
    const commonTools = [
      { icon: Brain, label: 'Analysis', toolName: 'business-analyzer' },
      { icon: MessageSquare, label: 'Email', toolName: 'email-composer' },
      { icon: Search, label: 'Research', toolName: 'smart-search' },
    ];

    switch (entityType) {
      case 'contact':
        return [
          ...commonTools,
          { icon: Target, label: 'Lead Score', toolName: 'lead-scoring' },
          { icon: Edit3, label: 'Personalize', toolName: 'personalization' },
        ];
      case 'deal':
        return [
          ...commonTools,
          { icon: BarChart3, label: 'Forecast', toolName: 'deal-forecast' },
          { icon: Lightbulb, label: 'Insights', toolName: 'deal-insights' },
        ];
      case 'company':
        return [
          ...commonTools,
          { icon: BarChart3, label: 'Analytics', toolName: 'company-analytics' },
          { icon: Target, label: 'Opportunities', toolName: 'opportunity-finder' },
        ];
      default:
        return commonTools;
    }
  };

  const tools = getAITools();

  if (layout === 'row') {
    return (
      <div className="w-full">
        <AIGoalsButton
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          className="mb-2"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* AI Goals Button */}
      <AIGoalsButton
        entityType={entityType}
        entityId={entityId}
        entityData={entityData}
        size={size}
      />

      {/* Quick Action Tools */}
      <div className={`grid ${layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
        {tools.slice(0, 4).map((tool, index) => (
          <QuickAIButton
            key={index}
            icon={tool.icon}
            label={tool.label}
            toolName={tool.toolName}
            entityType={entityType}
            entityId={entityId}
            entityData={entityData}
            size={size}
            variant="secondary"
          />
        ))}
      </div>

      {/* Customize Button */}
      {showCustomizeButton && (
        <ModernButton
          variant="ghost"
          size="sm"
          className="w-full text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Customize AI toolbar for:', entityType);
          }}
        >
          <Edit3 className="w-3 h-3 mr-2" />
          Customize Tools
        </ModernButton>
      )}
    </div>
  );
};