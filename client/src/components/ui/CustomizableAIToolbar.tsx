import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  Settings, 
  Search, 
  Mail, 
  MessageSquare,
  BarChart3,
  Target,
  Phone,
  Calendar,
  FileText,
  Zap,
  TrendingUp,
  Star,
  Heart,
  Edit,
  Copy,
  Share2,
  Download,
  Upload,
  Trash2,
  MoreHorizontal,
  Plus,
  X
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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    setIsLoading(true);
    try {
      // Handle AI tool execution
      console.log(`Executing ${toolName} for ${entityType} ${entityId}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error(`Failed to execute ${toolName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = `
    flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 
    border shadow-sm hover:shadow-md hover:scale-105 relative
    ${size === 'sm' ? 'p-1.5' : 'p-2'}
    ${className}
  `;

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-blue-300/50',
    secondary: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border-gray-200/50'
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={`${label} for ${entityType}`}
    >
      {isLoading ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mb-0.5" />
      ) : (
        <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mb-0.5`} />
      )}
      <span className="text-[10px] truncate max-w-full">{label}</span>
    </button>
  );
};

export const AIGoalsButton: React.FC<{
  entityType: string;
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
}> = ({ entityType, entityId, entityData, size = 'sm' }) => {
  return (
    <QuickAIButton
      icon={Sparkles}
      label="AI Goals"
      toolName="ai-goals"
      entityType={entityType}
      entityId={entityId}
      entityData={entityData}
      size={size}
      variant="primary"
    />
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
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [enabledTools, setEnabledTools] = useState(new Set([
    'ai-goals', 'smart-search', 'email-composer', 'lead-scorer'
  ]));

  // Available AI tools based on entity type
  const availableTools = {
    deal: [
      { id: 'ai-goals', icon: Sparkles, label: 'AI Goals', variant: 'primary' as const },
      { id: 'smart-search', icon: Search, label: 'Search', variant: 'secondary' as const },
      { id: 'email-composer', icon: Mail, label: 'Email', variant: 'secondary' as const },
      { id: 'lead-scorer', icon: Target, label: 'Score', variant: 'primary' as const },
      { id: 'insights', icon: BarChart3, label: 'Insights', variant: 'secondary' as const },
      { id: 'scheduler', icon: Calendar, label: 'Schedule', variant: 'secondary' as const },
    ],
    contact: [
      { id: 'ai-goals', icon: Sparkles, label: 'AI Goals', variant: 'primary' as const },
      { id: 'smart-search', icon: Search, label: 'Search', variant: 'secondary' as const },
      { id: 'email-composer', icon: Mail, label: 'Email', variant: 'secondary' as const },
      { id: 'contact-enricher', icon: Wand2, label: 'Enrich', variant: 'primary' as const },
      { id: 'social-finder', icon: MessageSquare, label: 'Social', variant: 'secondary' as const },
      { id: 'call-assistant', icon: Phone, label: 'Call', variant: 'secondary' as const },
    ],
    task: [
      { id: 'ai-goals', icon: Sparkles, label: 'AI Goals', variant: 'primary' as const },
      { id: 'smart-search', icon: Search, label: 'Search', variant: 'secondary' as const },
      { id: 'task-optimizer', icon: TrendingUp, label: 'Optimize', variant: 'primary' as const },
      { id: 'content-generator', icon: FileText, label: 'Content', variant: 'secondary' as const },
      { id: 'priority-scorer', icon: Star, label: 'Priority', variant: 'secondary' as const },
    ]
  };

  const tools = availableTools[entityType as keyof typeof availableTools] || availableTools.deal;
  const visibleTools = tools.filter(tool => enabledTools.has(tool.id));

  const toggleTool = (toolId: string) => {
    const newEnabledTools = new Set(enabledTools);
    if (newEnabledTools.has(toolId)) {
      newEnabledTools.delete(toolId);
    } else {
      newEnabledTools.add(toolId);
    }
    setEnabledTools(newEnabledTools);
  };

  const layoutClasses = {
    grid: 'grid grid-cols-3 gap-1',
    row: 'flex flex-wrap gap-1'
  };

  if (visibleTools.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* AI Tools Grid */}
      <div className={layoutClasses[layout]}>
        {visibleTools.map((tool) => (
          <QuickAIButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            toolName={tool.id}
            entityType={entityType}
            entityId={entityId}
            entityData={entityData}
            size={size}
            variant={tool.variant}
          />
        ))}
      </div>

      {/* Customize Button */}
      {showCustomizeButton && (
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="mt-2 p-1 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-full"
        >
          <Settings className="w-3 h-3 mr-1" />
          Customize
        </button>
      )}

      {/* Customization Panel */}
      {isCustomizing && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">AI Tools</h4>
            <button
              onClick={() => setIsCustomizing(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <label key={tool.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={enabledTools.has(tool.id)}
                  onChange={() => toggleTool(tool.id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <tool.icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{tool.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};