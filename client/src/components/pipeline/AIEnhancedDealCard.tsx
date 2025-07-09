import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  TrendingUp,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Target,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Loader2,
  Sparkles,
  Heart,
  Wand2,
  Camera,
  Database,
  Globe,
  ExternalLink,
  Plus,
  Search,
  ArrowRight,
  Activity
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  dueDate?: string;
  expectedCloseDate?: string;
  contactAvatar?: string;
  companyAvatar?: string;
  isFavorite?: boolean;
  lastEnrichment?: {
    confidence: number;
    aiProvider: string;
    timestamp: Date;
  };
}

interface AIEnhancedDealCardProps {
  deal: Deal;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick: () => void;
  showAnalyzeButton?: boolean;
  onAnalyze?: (deal: Deal) => Promise<boolean>;
  onAIEnrich?: (deal: Deal) => Promise<boolean>;
  isAnalyzing?: boolean;
  onToggleFavorite?: (deal: Deal) => Promise<void>;
  onFindNewImage?: (deal: Deal) => Promise<void>;
}

const AIEnhancedDealCard: React.FC<AIEnhancedDealCardProps> = ({ 
  deal, 
  isSelected = false,
  onSelect,
  onClick, 
  showAnalyzeButton = true,
  onAnalyze,
  onAIEnrich,
  isAnalyzing = false,
  onToggleFavorite,
  onFindNewImage
}) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [localAnalyzing, setLocalAnalyzing] = useState(false);
  const [localEnriching, setLocalEnriching] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // New state to track AI enrichment status
  const [lastEnrichment, setLastEnrichment] = useState<any>(
    deal.lastEnrichment || (deal.probability > 75 ? { confidence: deal.probability } : null)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const isOverdue = deal.dueDate && new Date() > new Date(deal.dueDate);
  const isDueSoon = deal.dueDate && !isOverdue && 
    (new Date(deal.dueDate).getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Normal Priority';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualification': return 'bg-blue-500';
      case 'proposal': return 'bg-indigo-500';
      case 'negotiation': return 'bg-purple-500';
      case 'closed-won': return 'bg-green-500';
      case 'closed-lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (probability: number) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-blue-500';
    if (probability >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Generate avatar URLs based on company and contact names
  const getCompanyAvatar = (companyName: string) => {
    const seed = companyName.toLowerCase().replace(/\s+/g, '');
    return deal.companyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
  };

  const getPersonAvatar = (personName: string) => {
    const seed = personName.toLowerCase().replace(/\s+/g, '');
    return deal.contactAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    onClick();
  };

  const handleAnalyzeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAnalyze || isAnalyzing || localAnalyzing) return;
    
    setLocalAnalyzing(true);
    try {
      await onAnalyze(deal);
      setLastEnrichment({ 
        confidence: Math.max(deal.probability, 75),
        aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLocalAnalyzing(false);
    }
  };

  const handleAIEnrichClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAIEnrich || localEnriching) return;
    
    setLocalEnriching(true);
    try {
      await onAIEnrich(deal);
      setLastEnrichment({ 
        confidence: Math.min(deal.probability + 10, 95),
        aiProvider: 'OpenAI GPT-4o',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Enrichment failed:', error);
    } finally {
      setLocalEnriching(false);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    
    try {
      await onToggleFavorite(deal);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleFindImageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onFindNewImage || isFinding) return;
    
    setIsFinding(true);
    try {
      await onFindNewImage(deal);
    } catch (error) {
      console.error('Failed to find new image:', error);
    } finally {
      setIsFinding(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
        hover:shadow-lg transition-all duration-200 cursor-pointer group
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${isOverdue ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : ''}
        ${isDueSoon ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10' : ''}
      `}
    >
      {/* Priority and Status Indicators */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        {deal.isFavorite && (
          <Heart className="w-4 h-4 text-red-500 fill-current" />
        )}
        <div className={`w-2 h-2 rounded-full ${getPriorityColor(deal.priority)}`} 
             title={getPriorityLabel(deal.priority)} />
      </div>

      {/* AI Enrichment Indicator */}
      {lastEnrichment && (
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs">
            <Sparkles className="w-3 h-3" />
            <span>{lastEnrichment.confidence}%</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header with Avatars */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Company Avatar */}
            <div className="relative">
              <img
                src={getCompanyAvatar(deal.company)}
                alt={deal.company}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}&backgroundColor=3b82f6&textColor=ffffff`;
                }}
              />
              <button
                onClick={handleFindImageClick}
                disabled={isFinding}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                title="Find new company image"
              >
                {isFinding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
              </button>
            </div>
            
            {/* Contact Avatar */}
            <div className="relative">
              <img
                src={getPersonAvatar(deal.contact)}
                alt={deal.contact}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.contact}&backgroundColor=8b5cf6`;
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition-colors ${
                deal.isFavorite 
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={deal.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${deal.isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAIInsights(!showAIInsights);
              }}
              className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle AI insights"
            >
              <Brain className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deal Information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {deal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{deal.company}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{deal.contact}</span>
            </div>
          </div>

          {/* Value and Probability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(deal.value)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getScoreColor(deal.probability)}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {deal.probability}%
              </span>
            </div>
          </div>

          {/* Due Date */}
          {deal.expectedCloseDate && (
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : isDueSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </span>
              {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {isDueSoon && !isOverdue && <Clock className="w-4 h-4 text-yellow-500" />}
            </div>
          )}
        </div>

        {/* AI Actions Bar */}
        {showAnalyzeButton && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing || localAnalyzing}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="AI analyze deal"
              >
                {(isAnalyzing || localAnalyzing) ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Brain className="w-3 h-3" />
                )}
                <span>Analyze</span>
              </button>

              {onAIEnrich && (
                <button
                  onClick={handleAIEnrichClick}
                  disabled={localEnriching}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-xs rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="AI enrich deal data"
                >
                  {localEnriching ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  <span>Enrich</span>
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Send email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Make call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                title="Send message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* AI Insights Panel */}
        {showAIInsights && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">AI Insights</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>High engagement detected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3 text-blue-500" />
                  <span>Recommended next action: Follow-up call</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-3 h-3 text-purple-500" />
                  <span>Deal health score: {deal.probability}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEnhancedDealCard;