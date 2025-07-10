import React, { useState } from 'react';
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
  Phone,
  MessageSquare,
  Wand2,
  Database,
  Globe,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
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
        ${sizeClasses} ${variantClasses} ${className}
        flex flex-col items-center justify-center rounded-lg font-medium transition-all duration-200 
        border shadow-sm hover:shadow-md hover:scale-105 min-h-[3rem]
        ${variant === 'primary' ? 'border-blue-300/50' : 'border-gray-200/50'}
      `}
    >
      <IconComponent size={size === 'sm' ? 12 : 16} className="mb-1" />
      <span className="leading-tight text-center">{label}</span>
    </button>
  );
};

export const AIGoalsButton: React.FC<{
  entityType: string;
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ entityType, entityId, entityData, size = 'sm', variant = 'primary', className = '' }) => {
  return (
    <button
      className={`
        ${className}
        flex items-center justify-center py-2 px-3 
        bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
        rounded-lg hover:from-indigo-600 hover:to-purple-600 
        ${size === 'sm' ? 'text-sm' : 'text-base'} font-medium 
        transition-all duration-200 border border-indigo-300/50 shadow-sm hover:shadow-md hover:scale-105
      `}
    >
      <Target size={size === 'sm' ? 14 : 16} className="mr-2" />
      AI Goals
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
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customQuickActions, setCustomQuickActions] = useState(defaultQuickActions);

  const layoutClasses = layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-row space-x-2';

  return (
    <div className="relative">
      <div className={`${layoutClasses} flex-wrap`}>
        {customQuickActions.map((action, index) => {
          const IconComponent = iconMap[action.icon] || Brain;
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
          onClick={() => setShowCustomizeModal(true)}
          className="mt-2 p-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings size={12} />
        </button>
      )}
    </div>
  );
};