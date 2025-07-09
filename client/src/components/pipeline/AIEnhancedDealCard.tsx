import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Calendar, 
  TrendingUp, 
  Star, 
  StarOff,
  Brain,
  Sparkles,
  Image,
  ExternalLink,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
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
  lostReason?: string;
  products?: string[];
  competitors?: string[];
  decisionMakers?: string[];
  lastActivityDate?: string;
  assignedTo?: string;
  currency?: string;
  discountAmount?: string;
  discountPercentage?: string;
  nextSteps?: string[];
  aiInsights?: any;
  daysInStage?: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  tenantId?: string;
  contactId?: string;
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
  onClick: () => void;
  showAnalyzeButton?: boolean;
  onAnalyze?: (deal: Deal) => Promise<boolean>;
  isAnalyzing?: boolean;
  onToggleFavorite?: (deal: Deal) => void;
  onFindNewImage?: (deal: Deal) => void;
}

const AIEnhancedDealCard: React.FC<AIEnhancedDealCardProps> = ({
  deal,
  onClick,
  showAnalyzeButton = false,
  onAnalyze,
  isAnalyzing = false,
  onToggleFavorite,
  onFindNewImage
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAnalyzeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalyze) {
      await onAnalyze(deal);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(deal);
    }
  };

  const handleNewImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFindNewImage) {
      onFindNewImage(deal);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: deal.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCompanyAvatar = () => {
    if (imageError) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
    }
    return deal.companyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
  };

  const getContactAvatar = () => {
    return deal.contactAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.contact}`;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img
              src={getCompanyAvatar()}
              alt={deal.company}
              className="w-10 h-10 rounded-full border-2 border-gray-100"
              onError={() => setImageError(true)}
            />
            {isHovered && onFindNewImage && (
              <button
                onClick={handleNewImageClick}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Find new image"
              >
                <Image className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {deal.title}
              </h3>
              {deal.isFavorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <Building2 className="w-3 h-3 mr-1" />
              {deal.company}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1">
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title={deal.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {deal.isFavorite ? (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
          
          {showAnalyzeButton && onAnalyze && (
            <button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className={`p-1 rounded-full transition-colors ${
                isAnalyzing 
                  ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                  : 'hover:bg-blue-100 text-blue-600 hover:text-blue-700'
              }`}
              title="Analyze with AI"
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex items-center space-x-2 mb-3">
        <img
          src={getContactAvatar()}
          alt={deal.contact}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm text-gray-600">{deal.contact}</span>
      </div>

      {/* Deal Value */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-gray-900">
          {formatCurrency(deal.value)}
        </span>
        <span className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
          {deal.probability}%
        </span>
      </div>

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(deal.priority)}`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
        </span>
        
        {deal.daysInStage !== undefined && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {deal.daysInStage} days
          </div>
        )}
      </div>

      {/* AI Insights */}
      {deal.lastEnrichment && (
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <div className="flex items-center text-xs text-blue-700">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Enhanced ({deal.lastEnrichment.confidence}% confidence)
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {deal.lastEnrichment.aiProvider}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {deal.nextSteps && deal.nextSteps.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Next Steps:</div>
          <div className="text-xs text-gray-700">
            {deal.nextSteps[0]}
            {deal.nextSteps.length > 1 && (
              <span className="text-gray-500"> (+{deal.nextSteps.length - 1} more)</span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {deal.expectedCloseDate && new Date(deal.expectedCloseDate).toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-3 h-3" />
          <span>
            {deal.lastActivityDate && new Date(deal.lastActivityDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIEnhancedDealCard;