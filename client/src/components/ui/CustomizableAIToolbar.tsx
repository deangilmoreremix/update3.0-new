import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAITools } from '../AIToolsProvider';
import { 
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
  Phone
} from 'lucide-react';

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
  Phone
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
  const { openTool } = useAITools();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Map the tool name to actual AI tool and open modal
      const actualToolName = toolMapping[toolName] || toolName;
      console.log(`Opening AI Tool: ${actualToolName} for ${entityType}:${entityId}`, entityData);
      openTool(actualToolName);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
    secondary: 'bg-white/70 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full font-medium transition-all duration-200
        flex items-center space-x-1 backdrop-blur-sm
        ${className}
      `}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </button>
  );
};

export const AIGoalsButton: React.FC<{
  entityType: string;
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ entityType, entityId, entityData, size = 'md', className = '' }) => {
  const navigate = useNavigate();
  
  const handleGoalsClick = () => {
    // Navigate to AI Goals with pre-populated context
    console.log(`AI Goals for ${entityType}:${entityId}`, entityData);
    navigate('/ai-goals');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={handleGoalsClick}
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-r from-purple-500 to-pink-600 text-white
        hover:from-purple-600 hover:to-pink-700
        rounded-full font-medium transition-all duration-200
        flex items-center space-x-2 backdrop-blur-sm shadow-md
        hover:shadow-lg w-full justify-center
        ${className}
      `}
    >
      <Brain className="w-4 h-4" />
      <span>AI Goals</span>
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

  const layoutClasses = {
    grid: 'grid grid-cols-2 gap-2',
    row: 'flex flex-wrap gap-2'
  };

  return (
    <div className="space-y-3">
      {/* AI Goals Button - Full Width */}
      <AIGoalsButton
        entityType={entityType}
        entityId={entityId}
        entityData={entityData}
        size={size}
      />

      {/* Quick Actions - Grid Layout */}
      <div className={layoutClasses[layout]}>
        {defaultQuickActions.map((action, index) => {
          const IconComponent = iconMap[action.icon];
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

      {/* Customize Button */}
      {showCustomizeButton && (
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="w-full px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400 rounded transition-colors"
        >
          <Settings className="w-3 h-3 inline mr-1" />
          Customize Tools
        </button>
      )}

      {/* Customization Panel */}
      {isCustomizing && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Available AI Tools</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <button className="p-1 text-left hover:bg-white rounded">+ Lead Scoring</button>
            <button className="p-1 text-left hover:bg-white rounded">+ Risk Analysis</button>
            <button className="p-1 text-left hover:bg-white rounded">+ Email AI</button>
            <button className="p-1 text-left hover:bg-white rounded">+ Proposal Gen</button>
            <button className="p-1 text-left hover:bg-white rounded">+ Next Action</button>
            <button className="p-1 text-left hover:bg-white rounded">+ Insights</button>
          </div>
        </div>
      )}
    </div>
  );
};