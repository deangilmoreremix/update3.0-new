import React, { useState } from 'react';
import { Deal } from '../../types';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { DollarSign, Edit, MoreHorizontal, Mail, Phone, Brain, Loader2, Sparkles, Heart, Camera, Calendar, TrendingUp } from 'lucide-react';

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

const stageColors: { [key: string]: string } = {
  'Qualification': 'bg-blue-500',
  'Proposal': 'bg-yellow-500',
  'Negotiation': 'bg-orange-500',
  'Closed Won': 'bg-green-500',
  'Closed Lost': 'bg-red-500'
};

const priorityColors: { [key: string]: string } = {
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-blue-500'
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

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
  const [localAnalyzing, setLocalAnalyzing] = useState(false);
  const [localEnriching, setLocalEnriching] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  
  // Track last enrichment (mock data if not provided)
  const [lastEnrichment, setLastEnrichment] = useState<any>(
    deal.aiScore ? { confidence: deal.aiScore } : null
  );

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
        confidence: Math.max(deal.aiScore || 0, 75),
        aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLocalAnalyzing(false);
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

  const handleAIEnrichClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAIEnrich || localEnriching) return;
    
    setLocalEnriching(true);
    try {
      await onAIEnrich(deal);
      setLastEnrichment({ 
        confidence: Math.min((deal.aiScore || 0) + 10, 95),
        aiProvider: 'OpenAI GPT-4o',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Enrichment failed:', error);
    } finally {
      setLocalEnriching(false);
    }
  };

  const analyzing = isAnalyzing || localAnalyzing;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative border border-gray-200 hover:border-gray-300 overflow-hidden"
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-white border-gray-300"
          />
        </div>
      )}

      {/* Header Actions */}
      <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        {/* AI Analysis Button */}
        {showAnalyzeButton && onAnalyze && (
          <button 
            onClick={handleAnalyzeClick}
            disabled={analyzing}
            className={`p-2 rounded-lg transition-all duration-200 relative ${
              deal.aiScore 
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
            }`}
            title={deal.aiScore ? 'Re-analyze with AI' : 'Analyze with AI'}
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            {!deal.aiScore && !analyzing && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </button>
        )}
        
        {/* AI Enrich Button */}
        {onAIEnrich && (
          <button 
            onClick={handleAIEnrichClick}
            disabled={localEnriching}
            className="p-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors shadow-lg"
            title="AI Enrich Deal"
          >
            {localEnriching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-colors ${
              deal.isFavorite 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={deal.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${deal.isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle edit action
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle more actions
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {/* Company Logo and AI Score Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-center flex-1">
            <div className="relative inline-block mb-3">
              {/* Company Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {deal.company.charAt(0)}
              </div>
              
              {/* Analysis Loading Indicator */}
              {analyzing && (
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Favorite Badge */}
              {deal.isFavorite && (
                <div className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                  <Heart className="w-2.5 h-2.5" />
                </div>
              )}
              
              {/* AI Enhancement Indicator */}
              {lastEnrichment && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                  <Sparkles className="w-2 h-2" />
                </div>
              )}
              
              {/* AI Image Search Button */}
              {onFindNewImage && (
                <button 
                  onClick={handleFindImageClick}
                  disabled={isFinding}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg relative"
                >
                  {isFinding ? (
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                  ) : (
                    <Camera className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
            <h3 className="text-gray-900 font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">{deal.title}</h3>
            <p className="text-gray-600 text-sm">{deal.company}</p>
            <p className="text-gray-500 text-xs">{deal.contact}</p>
          </div>

          {/* AI Score */}
          {deal.aiScore && (
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-bold ${getScoreColor(deal.aiScore)}`}>
                {deal.aiScore}
              </div>
              <p className="text-xs text-gray-500 mt-1">AI Score</p>
            </div>
          )}
        </div>

        {/* Deal Info & Stats */}
        <div className="space-y-3">
          {/* Value and Stage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-lg font-bold text-gray-900">{formatCurrency(deal.value)}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${stageColors[deal.stage] || 'bg-gray-500'}`}>
              {deal.stage}
            </span>
          </div>

          {/* Priority and Probability */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${priorityColors[deal.priority] || 'bg-gray-500'}`}>
              {deal.priority} Priority
            </span>
            {deal.probability && (
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-600">{deal.probability}%</span>
              </div>
            )}
          </div>

          {/* Due Date */}
          {deal.dueDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Due: {new Date(deal.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Contact Actions */}
          <div className="flex items-center space-x-2">
            {deal.contact && (
              <>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* AI Toolbar */}
          <div className="pt-3 border-t border-gray-100">
            <CustomizableAIToolbar
              entityType="deal"
              entityId={deal.id}
              entityData={deal}
              location="deal-card"
              layout="row"
              size="sm"
              showCustomizeButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};