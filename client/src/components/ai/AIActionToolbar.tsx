import React from 'react';
import { Brain, Search, Mail, TrendingUp, FileText, Zap, Users, BarChart3 } from 'lucide-react';
import AIGoalsButton from './AIGoalsButton';
import QuickAIButton from './QuickAIButton';

interface AIActionToolbarProps {
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  layout?: 'horizontal' | 'vertical';
  showGoalsButton?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const AIActionToolbar: React.FC<AIActionToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  layout = 'horizontal',
  showGoalsButton = true,
  size = 'sm',
  className = ''
}) => {
  
  const getQuickActions = (type: string) => {
    switch (type) {
      case 'contact':
        return [
          { icon: TrendingUp, label: 'Lead Score', toolName: 'leadScoring', variant: 'analysis' as const },
          { icon: Mail, label: 'Personalize', toolName: 'emailPersonalization', variant: 'generation' as const },
          { icon: Search, label: 'Research', toolName: 'contactEnrichment', variant: 'research' as const }
        ];
      case 'deal':
        return [
          { icon: BarChart3, label: 'Risk Analysis', toolName: 'dealRiskAssessment', variant: 'analysis' as const },
          { icon: Zap, label: 'Next Action', toolName: 'nextBestAction', variant: 'automation' as const },
          { icon: FileText, label: 'Proposal', toolName: 'proposalGeneration', variant: 'generation' as const }
        ];
      case 'company':
        return [
          { icon: Search, label: 'Research', toolName: 'businessIntelligence', variant: 'research' as const },
          { icon: TrendingUp, label: 'Health Score', toolName: 'companyHealthScoring', variant: 'analysis' as const },
          { icon: Users, label: 'Opportunities', toolName: 'opportunityIdentification', variant: 'analysis' as const }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions(entityType);
  
  const layoutClasses = layout === 'horizontal' 
    ? 'flex items-center space-x-2' 
    : 'flex flex-col space-y-2';

  return (
    <div className={`${layoutClasses} ${className}`}>
      {showGoalsButton && (
        <AIGoalsButton
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          variant="primary"
        />
      )}
      
      {quickActions.map((action, index) => (
        <QuickAIButton
          key={index}
          icon={action.icon}
          label={action.label}
          toolName={action.toolName}
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          variant={action.variant}
        />
      ))}
    </div>
  );
};

export default AIActionToolbar;