import React, { useState } from 'react';
import { Brain, Sparkles, Mail, Phone, MessageSquare, FileText, BarChart3, Search, Zap, ChevronDown, Globe, TrendingUp, Clock, Shield, Layers, MoreHorizontal } from 'lucide-react';

interface CustomizableAIToolbarProps {
  entityId: string;
  entityType: 'contact' | 'deal' | 'company' | 'task';
  entity?: unknown;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'expanded' | 'grid';
  showLabels?: boolean;
  maxVisible?: number;
  onToolClick?: (toolId: string, entity: any) => void;
}

interface AITool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  category: 'analysis' | 'communication' | 'automation' | 'research' | 'content';
  description?: string;
  isQuickAction?: boolean;
  entityTypes: string[];
}

const aiTools: AITool[] = [
  // Analysis Tools
  {
    id: 'ai-analysis',
    name: 'AI Analysis',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    category: 'analysis',
    description: 'Deep AI-powered analysis',
    isQuickAction: true,
    entityTypes: ['contact', 'deal', 'company', 'task']
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
    category: 'analysis',
    description: 'Analyze sentiment and mood',
    entityTypes: ['contact', 'deal', 'task']
  },
  {
    id: 'risk-assessment',
    name: 'Risk Score',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100 hover:bg-red-200',
    category: 'analysis',
    description: 'Calculate risk factors',
    entityTypes: ['contact', 'deal', 'company']
  },

  // Communication Tools
  {
    id: 'email-composer',
    name: 'Smart Email',
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    category: 'communication',
    description: 'AI-generated emails',
    isQuickAction: true,
    entityTypes: ['contact', 'deal', 'company']
  },
  {
    id: 'call-script',
    name: 'Call Script',
    icon: Phone,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
    category: 'communication',
    description: 'Generate call scripts',
    entityTypes: ['contact', 'deal']
  },
  {
    id: 'social-message',
    name: 'Social Reach',
    icon: MessageSquare,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 hover:bg-indigo-200',
    category: 'communication',
    description: 'Social media outreach',
    entityTypes: ['contact', 'company']
  },

  // Research Tools
  {
    id: 'company-research',
    name: 'Research',
    icon: Search,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    category: 'research',
    description: 'Deep company research',
    isQuickAction: true,
    entityTypes: ['contact', 'deal', 'company']
  },
  {
    id: 'competitor-analysis',
    name: 'Competitors',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 hover:bg-orange-200',
    category: 'research',
    description: 'Competitive analysis',
    entityTypes: ['company', 'deal']
  },
  {
    id: 'news-monitoring',
    name: 'News Watch',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    category: 'research',
    description: 'Monitor news and updates',
    entityTypes: ['contact', 'company']
  },

  // Content Tools
  {
    id: 'proposal-generator',
    name: 'Proposal',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
    category: 'content',
    description: 'Generate proposals',
    entityTypes: ['deal', 'company']
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    icon: Layers,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    category: 'content',
    description: 'Create pitch presentations',
    entityTypes: ['deal', 'company']
  },

  // Automation Tools
  {
    id: 'follow-up-sequence',
    name: 'Follow-up',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200',
    category: 'automation',
    description: 'Automated follow-ups',
    entityTypes: ['contact', 'deal']
  },
  {
    id: 'task-automation',
    name: 'Auto Tasks',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
    category: 'automation',
    description: 'Automate routine tasks',
    entityTypes: ['contact', 'deal', 'task']
  }
];

export const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityId,
  entityType,
  entity,
  size = 'md',
  variant = 'compact',
  showLabels = true,
  maxVisible = 6,
  onToolClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Filter tools based on entity type
  const availableTools = aiTools.filter(tool => 
    tool.entityTypes.includes(entityType)
  );

  // Get quick action tools
  const quickTools = availableTools.filter(tool => tool.isQuickAction);
  const otherTools = availableTools.filter(tool => !tool.isQuickAction);

  // Tools to show based on variant and maxVisible
  const visibleTools = variant === 'expanded' 
    ? availableTools 
    : quickTools.slice(0, maxVisible);
  
  const hiddenTools = variant === 'expanded' 
    ? [] 
    : availableTools.slice(maxVisible);

  const handleToolClick = (tool: AITool) => {
    console.log(`AI Tool clicked: ${tool.name} for ${entityType} ${entityId}`);
    
    // Handle AI Goals navigation
    if (tool.id === 'ai-analysis' && entity) {
      // Store context for AI Goals page
      sessionStorage.setItem('aiGoalsContext', JSON.stringify({
        entityType,
        entityId,
        entityData: entity,
        suggestedCategories: getCategoriesForEntity(entityType)
      }));
      
      // Navigate to AI Goals page
      window.location.href = '/ai-goals';
      return;
    }
    
    if (onToolClick) {
      onToolClick(tool.id, entity);
    }
  };

  const getCategoriesForEntity = (type: string): string[] => {
    switch (type) {
      case 'contact':
        return ['Contact Research', 'Email Outreach', 'Lead Scoring'];
      case 'deal':
        return ['Deal Analysis', 'Proposal Generation', 'Revenue Forecasting'];
      case 'company':
        return ['Company Research', 'Competitive Analysis', 'Market Intelligence'];
      case 'task':
        return ['Task Automation', 'Priority Scoring', 'Workflow Optimization'];
      default:
        return ['AI Analysis', 'Smart Automation', 'Intelligence Gathering'];
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      button: 'p-1.5',
      icon: 'w-3 h-3',
      text: 'text-xs',
      grid: 'grid-cols-4 gap-1'
    },
    md: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-sm',
      grid: 'grid-cols-3 gap-2'
    },
    lg: {
      button: 'p-3',
      icon: 'w-5 h-5',
      text: 'text-base',
      grid: 'grid-cols-2 gap-3'
    }
  };

  if (variant === 'grid') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
            AI Tools
          </h3>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            {showAllCategories ? 'Show Less' : 'Show All'}
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`grid ${sizeClasses[size].grid}`}>
          {(showAllCategories ? availableTools : visibleTools).map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className={`
                  ${sizeClasses[size].button} ${tool.bgColor} 
                  rounded-lg transition-all duration-200 
                  flex flex-col items-center justify-center
                  hover:scale-105 active:scale-95
                  border border-transparent hover:border-gray-300
                `}
                title={tool.description}
              >
                <IconComponent className={`${sizeClasses[size].icon} ${tool.color} mb-1`} />
                {showLabels && (
                  <span className={`${sizeClasses[size].text} ${tool.color} font-medium text-center`}>
                    {tool.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {/* Visible Tools */}
      {visibleTools.map((tool) => {
        const IconComponent = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className={`
              ${sizeClasses[size].button} ${tool.bgColor} 
              rounded-lg transition-all duration-200 
              flex items-center space-x-1
              hover:scale-105 active:scale-95
            `}
            title={tool.description}
          >
            <IconComponent className={`${sizeClasses[size].icon} ${tool.color}`} />
            {showLabels && size !== 'sm' && (
              <span className={`${sizeClasses[size].text} ${tool.color} font-medium whitespace-nowrap`}>
                {tool.name}
              </span>
            )}
          </button>
        );
      })}

      {/* More Tools Button */}
      {hiddenTools.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              ${sizeClasses[size].button} 
              bg-gray-100 hover:bg-gray-200 
              rounded-lg transition-all duration-200 
              flex items-center space-x-1
            `}
            title="More AI Tools"
          >
            <MoreHorizontal className={`${sizeClasses[size].icon} text-gray-600`} />
            {showLabels && size !== 'sm' && (
              <span className={`${sizeClasses[size].text} text-gray-600 font-medium`}>
                +{hiddenTools.length}
              </span>
            )}
          </button>

          {/* Expanded Menu */}
          {isExpanded && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-48">
              {hiddenTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      handleToolClick(tool);
                      setIsExpanded(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`p-1.5 ${tool.bgColor} rounded`}>
                      <IconComponent className={`w-3 h-3 ${tool.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                      {tool.description && (
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};