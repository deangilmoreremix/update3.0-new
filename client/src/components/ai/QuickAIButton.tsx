import React, { useState } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { useAITools } from '../AIToolsProvider';

interface QuickAIButtonProps {
  icon: LucideIcon;
  label: string;
  toolName: string;
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  variant?: 'default' | 'analysis' | 'generation' | 'research' | 'automation';
  className?: string;
  onResult?: (result: any) => void;
}

const QuickAIButton: React.FC<QuickAIButtonProps> = ({
  icon: Icon,
  label,
  toolName,
  entityType,
  entityId,
  entityData,
  size = 'sm',
  variant = 'default',
  className = '',
  onResult
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openTool } = useAITools();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);
    
    try {
      // Store entity context in sessionStorage for AI tools to use
      sessionStorage.setItem('currentEntityContext', JSON.stringify({
        entityType,
        entityId,
        entityData
      }));
      
      // Map tool names to existing AI tools
      const toolMapping: Record<string, string> = {
        'leadScoring': 'business-analyzer',
        'emailPersonalization': 'email-composer',
        'contactEnrichment': 'smart-search',
        'dealRiskAssessment': 'business-analyzer',
        'nextBestAction': 'business-analyzer',
        'proposalGeneration': 'proposal-generator',
        'businessIntelligence': 'smart-search',
        'companyHealthScoring': 'business-analyzer',
        'opportunityIdentification': 'business-analyzer'
      };
      
      const mappedTool = toolMapping[toolName] || toolName;
      openTool(mappedTool as any);
      
      if (onResult) {
        onResult({ status: 'opened', tool: mappedTool });
      }
    } catch (error) {
      console.error(`Error executing ${toolName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
    analysis: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
    generation: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200',
    research: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200',
    automation: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
  };

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center font-medium rounded-md transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      title={`${label} for ${entityType}`}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="animate-spin mr-1" />
      ) : (
        <Icon size={iconSize} className="mr-1" />
      )}
      {label}
    </button>
  );
};

export default QuickAIButton;