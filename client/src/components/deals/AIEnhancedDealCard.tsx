import React, { useState } from 'react';
import { Deal } from '../../types';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Star, 
  StarOff, 
  TrendingUp, 
  Zap, 
  Target,
  ExternalLink,
  Users,
  Activity
} from 'lucide-react';

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

export const AIEnhancedDealCard: React.FC<AIEnhancedDealCardProps> = ({
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'discovery': return 'bg-blue-500';
      case 'qualification': return 'bg-yellow-500';
      case 'proposal': return 'bg-purple-500';
      case 'negotiation': return 'bg-orange-500';
      case 'closed-won': return 'bg-green-500';
      case 'closed-lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalyze) {
      await onAnalyze(deal);
    }
  };

  const handleAIEnrich = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAIEnrich) {
      await onAIEnrich(deal);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      await onToggleFavorite(deal);
    }
  };

  const handleFindNewImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFindNewImage) {
      await onFindNewImage(deal);
    }
  };

  return (
    <div
      className={`
        relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        ${isHovered ? 'transform scale-[1.02]' : ''}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Priority and Stage */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStageColor(deal.stage)}`} />
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(deal.priority)}`}>
            {deal.priority}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {deal.probability && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>{deal.probability}%</span>
            </div>
          )}
          
          <button
            onClick={handleToggleFavorite}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {deal.isFavorite ? (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
          {deal.title}
        </h3>

        {/* Company and Contact Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex items-center space-x-2">
            {deal.companyAvatar && !imageError ? (
              <img
                src={deal.companyAvatar}
                alt={deal.company}
                className="w-8 h-8 rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-gray-500" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {deal.company}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {deal.contact}
              </p>
            </div>
          </div>
        </div>

        {/* Value and Due Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {formatCurrency(deal.value)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(deal.expectedCloseDate)}</span>
          </div>
        </div>

        {/* Tags */}
        {deal.tags && deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {deal.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {deal.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                +{deal.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* AI Enrichment Info */}
        {deal.lastEnrichment && (
          <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-purple-700 dark:text-purple-300">
              <Zap className="w-3 h-3" />
              <span>AI Enriched - {deal.lastEnrichment.confidence}% confidence</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {deal.lastEnrichment.aiProvider}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-4">
          {showAnalyzeButton && onAnalyze && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </span>
            </button>
          )}
          
          {onAIEnrich && (
            <button
              onClick={handleAIEnrich}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Enrich</span>
            </button>
          )}
        </div>

        {/* Social Profiles */}
        {deal.socialProfiles && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {deal.socialProfiles.linkedin && (
              <a
                href={deal.socialProfiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </a>
            )}
            {deal.socialProfiles.website && (
              <a
                href={deal.socialProfiles.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
            )}
          </div>
        )}

        {/* Last Activity */}
        {deal.lastActivity && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {deal.lastActivity}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEnhancedDealCard;