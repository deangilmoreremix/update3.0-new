import React, { useState } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { Contact } from '../../types/contact';
import { 
  Edit, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  User, 
  BarChart, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  Star,
  UserPlus,
  Crown,
  Target,
  Zap,
  Brain,
  Loader2,
  Sparkles,
  Heart,
  Camera,
  Wand2,
  Database,
  Globe,
  Plus,
  Search,
  ArrowRight,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface AIEnhancedContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onAddToTeam?: () => void;
  showTeamAction?: boolean;
  onAnalyze?: (contact: Contact) => Promise<boolean>;
  isAnalyzing?: boolean;
  onToggleFavorite?: (contact: Contact) => Promise<void>;
  onFindNewImage?: (contact: Contact) => Promise<void>;
}

const interestColors = {
  hot: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
  cold: 'bg-gray-400'
};

const interestLabels = {
  hot: 'Hot Client',
  medium: 'Medium Interest',
  low: 'Low Interest',
  cold: 'Non Interest'
};

const sourceColors: { [key: string]: string } = {
  'LinkedIn': 'bg-blue-600',
  'Facebook': 'bg-blue-500',
  'Email': 'bg-green-500',
  'Website': 'bg-purple-500',
  'Referral': 'bg-orange-500',
  'Typeform': 'bg-pink-500',
  'Cold Call': 'bg-gray-600',
  'Twitter': 'bg-sky-500',
  'Instagram': 'bg-pink-600',
  'YouTube': 'bg-red-600',
  'TikTok': 'bg-gray-900',
  'Webinar': 'bg-indigo-500',
  'Conference': 'bg-yellow-600'
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const AIEnhancedContactCard: React.FC<AIEnhancedContactCardProps> = ({
  contact,
  isSelected,
  onSelect,
  onClick,
  onAddToTeam,
  showTeamAction = false,
  onAnalyze,
  isAnalyzing = false,
  onToggleFavorite,
  onFindNewImage
}) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [localAnalyzing, setLocalAnalyzing] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [localEnriching, setLocalEnriching] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  
  // Track last enrichment (mock data if not provided)
  const [lastEnrichment, setLastEnrichment] = useState<any>(
    contact.aiScore ? { confidence: contact.aiScore } : null
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
      await onAnalyze(contact);
      setLastEnrichment({ 
        confidence: Math.max(contact.aiScore || 0, 75),
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
      await onToggleFavorite(contact);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  
  const handleFindImageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onFindNewImage || isFinding) return;
    
    setIsFinding(true);
    try {
      await onFindNewImage(contact);
    } catch (error) {
      console.error('Failed to find new image:', error);
    } finally {
      setIsFinding(false);
    }
  };

  const handleAIEnrichClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localEnriching) return;
    
    setLocalEnriching(true);
    try {
      // In a real implementation, this would call an AI enrichment service
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastEnrichment({ 
        confidence: Math.min((contact.aiScore || 0) + 10, 95),
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

  // Get social profiles 
  const socialProfiles = contact.socialProfiles || {};

  return (
    <div 
      className={`
        relative group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
        shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 border-blue-300' : ''}
        hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1
      `}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Favorite Star */}
      {contact.isFavorite && (
        <div className="absolute top-3 right-3 z-10">
          <div className="p-1 bg-yellow-100 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </div>
        </div>
      )}

      {/* Team Member Crown */}
      {contact.isTeamMember && (
        <div className="absolute top-3 right-12 z-10">
          <div className="p-1 bg-purple-100 rounded-full">
            <Crown className="w-4 h-4 text-purple-600" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <AvatarWithStatus
              src={contact.avatarSrc || contact.avatar}
              alt={contact.name}
              size="lg"
              status={contact.status as any}
              className="border-2 border-white shadow-sm"
            />
            
            {/* Find new image button */}
            <button
              onClick={handleFindImageClick}
              disabled={isFinding}
              className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors"
              title="Find new profile image"
            >
              {isFinding ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Camera className="w-3 h-3" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              
              {/* AI Score Badge */}
              {contact.aiScore && (
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getScoreColor(contact.aiScore)}`}>
                  {contact.aiScore}% AI
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {contact.title} {contact.title && contact.company && '•'} {contact.company}
            </p>
            
            {contact.industry && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {contact.industry}
              </p>
            )}
          </div>
        </div>

        {/* Interest Level and Sources */}
        <div className="flex items-center justify-between mb-4">
          {contact.interestLevel && (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${interestColors[contact.interestLevel]}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {interestLabels[contact.interestLevel]}
              </span>
            </div>
          )}
          
          {/* Sources */}
          {contact.sources && contact.sources.length > 0 && (
            <div className="flex items-center space-x-1">
              {contact.sources.slice(0, 2).map((source, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs text-white rounded-full ${sourceColors[source] || 'bg-gray-500'}`}
                >
                  {source}
                </span>
              ))}
              {contact.sources.length > 2 && (
                <span className="text-xs text-gray-500">+{contact.sources.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 mr-2" />
            <span className="truncate">{contact.email}</span>
          </div>
          
          {contact.phone && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4 mr-2" />
              <span>{contact.phone}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {contact.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* AI Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {/* AI Analyze Button */}
            <button
              onClick={handleAnalyzeClick}
              disabled={analyzing}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-70"
            >
              {analyzing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Brain className="w-3 h-3" />
              )}
              <span>{analyzing ? 'Analyzing...' : 'AI Analyze'}</span>
            </button>

            {/* AI Enrich Button */}
            <button
              onClick={handleAIEnrichClick}
              disabled={localEnriching}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-70"
            >
              {localEnriching ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              <span>{localEnriching ? 'Enriching...' : 'AI Enrich'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Favorite Toggle */}
            <button
              onClick={handleFavoriteClick}
              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
              title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${contact.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
            </button>

            {/* Team Action */}
            {showTeamAction && onAddToTeam && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToTeam();
                }}
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Add to team"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            )}

            {/* More Options */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Last Enrichment Info */}
        {lastEnrichment && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-700 dark:text-blue-300">
                Last enriched: {lastEnrichment.confidence}% confidence
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                {lastEnrichment.aiProvider || 'AI Enhanced'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};