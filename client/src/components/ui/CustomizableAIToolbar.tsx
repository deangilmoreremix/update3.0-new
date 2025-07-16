import React, { useState } from 'react';
import { BarChart3, Mail, TrendingUp, Search, Settings } from 'lucide-react';

interface QuickAIButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  toolName: string;
  entityType: string;
  entityId: string;
  entityData: unknown;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

interface CustomizableAIToolbarProps {
  entityType: string;
  entityId: string;
  entityData: unknown;
  location: string;
  layout: 'grid' | 'row';
  size: 'sm' | 'md';
  showCustomizeButton?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  BarChart3,
  Mail,
  TrendingUp,
  AlertTriangle,
  Navigation,
  FileText,
  Send,
  Calendar,
  DollarSign,
  Heart,
  UserPlus,
  Search,
  BarChart,
  Zap,
  Clock,
  GitBranch,
  PenTool,
  Video,
  FileSearch,
  Package,
  Settings,
  Plus,
  Brain,
  Target,
  Phone,
  MessageSquare,
  Wand2,
  Database,
  Globe,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Sparkles
};

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

const defaultQuickActions = [
  { icon: 'BarChart3', label: 'Lead Score', toolName: 'leadScoring', variant: 'primary' },
  { icon: 'Mail', label: 'Email AI', toolName: 'emailPersonalization', variant: 'secondary' },
  { icon: 'Search', label: 'Enrich', toolName: 'contactEnrichment', variant: 'secondary' },
  { icon: 'TrendingUp', label: 'Insights', toolName: 'businessIntelligence', variant: 'secondary' }
];

const QuickAIButton: React.FC<QuickAIButtonProps> = ({
  icon: IconComponent,
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
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Handle AI tool execution
      console.log(`Executing ${toolName} for ${entityType} ${entityId}`, entityData);
    }
  };

  const sizeClasses = size === 'sm' ? 'p-2 text-xs' : 'p-3 text-sm';
  const variantClasses = variant === 'primary' 
    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200';

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses} 
        ${variantClasses}
        rounded-lg transition-all duration-200 shadow-sm border border-gray-200
        flex items-center space-x-1 font-medium
        ${className}
      `}
      title={`${label} for ${entityType}`}
    >
      <IconComponent className="w-3 h-3" />
      <span>{label}</span>
    </button>
  );
};

export const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  location,
  layout,
  size,
  showCustomizeButton = true
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const layoutClasses = layout === 'grid' 
    ? 'grid grid-cols-2 gap-2' 
    : 'flex flex-wrap gap-2';

  return (
    <div className="space-y-2">
      <div className={layoutClasses}>
        {defaultQuickActions.map((action, index) => {
          const IconComponent = iconMap[action.icon];
          if (!IconComponent) return null;

          return (
            <QuickAIButton
              key={index}
              icon={IconComponent}
              label={action.label}
              toolName={action.toolName}
              entityType={entityType}
              entityId={entityId}
              entityData={entityData}
              size={size}
              variant={action.variant as 'primary' | 'secondary'}
            />
          );
        })}
      </div>

      {showCustomizeButton && (
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <Settings className="w-3 h-3" />
          <span>Customize AI Tools</span>
        </button>
      )}

      {isCustomizing && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Tool Configuration</h4>
          <p className="text-xs text-gray-600 mb-3">
            Choose which AI tools appear for {entityType} cards
          </p>
          
          <div className="space-y-2">
            {defaultQuickActions.map((action, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">{action.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-3 flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
              Save
            </button>
            <button 
              onClick={() => setIsCustomizing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};