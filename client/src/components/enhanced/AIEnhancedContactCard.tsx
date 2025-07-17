import React, { useState } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { Contact } from '../../types/contact';
import { ArrowRight, Brain, Camera, Crown, Database, Facebook, Globe, Heart, Instagram, Linkedin, Loader2, Mail, MessageSquare, Phone, Plus, Sparkles, Twitter, User, UserPlus } from 'lucide-react';

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

// Social platform definitions
const socialPlatforms = [
  { icon: Linkedin, color: 'bg-blue-500', name: 'LinkedIn', key: 'linkedin' },
  { icon: Globe, color: 'bg-purple-600', name: 'Website', key: 'website' },
  { icon: Twitter, color: 'bg-blue-400', name: 'Twitter', key: 'twitter' },
  { icon: Facebook, color: 'bg-blue-700', name: 'Facebook', key: 'facebook' },
  { icon: Instagram, color: 'bg-pink-500', name: 'Instagram', key: 'instagram' },
  { icon: MessageSquare, color: 'bg-green-500', name: 'WhatsApp', key: 'whatsapp' },
];

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

  // Custom fields (mock data if not provided)
  const customFields = contact.customFields || {
    "Acquisition Channel": contact.sources?.[0] || "Direct",
    "Engagement Level": "Medium"
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative border border-gray-200 hover:border-gray-300 overflow-hidden"
    >
      {/* Selection Checkbox */}
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

      {/* Header Actions */}
      <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        {/* AI Analysis Button */}
        {onAnalyze && (
          <button 
            onClick={handleAnalyzeClick}
            disabled={analyzing}
            className={`p-2 rounded-lg transition-all duration-200 relative ${
              contact.aiScore 
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
            }`}
            title={contact.aiScore ? 'Re-analyze with AI' : 'Analyze with AI'}
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            {!contact.aiScore && !analyzing && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </button>
        )}
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button 
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-all duration-200 ${
              contact.isFavorite 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Find New Image Button */}
        {onFindNewImage && (
          <button 
            onClick={handleFindImageClick}
            disabled={isFinding}
            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-200"
            title="Find new profile image"
          >
            {isFinding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Avatar and basic info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <AvatarWithStatus
              src={contact.avatarSrc}
              alt={contact.name}
              size="lg"
              status={contact.status}
            />
            {contact.isTeamMember && (
              <div className="absolute -top-1 -right-1 p-1 bg-yellow-500 rounded-full">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {contact.name}
              </h3>
              
              {/* Interest Level Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${interestColors[contact.interestLevel]}`}>
                {interestLabels[contact.interestLevel]}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-1">{contact.title}</p>
            <p className="text-sm text-gray-500 mb-2">{contact.company}</p>
            
            {/* AI Score */}
            {contact.aiScore && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-gray-600">AI Score:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getScoreColor(contact.aiScore)}`}>
                    {contact.aiScore}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="flex items-center space-x-2 mb-4">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          
          {/* Social Profiles */}
          {socialPlatforms.map((platform) => {
            const url = socialProfiles[platform.key];
            if (!url) return null;
            
            const Icon = platform.icon;
            return (
              <a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`p-2 ${platform.color} text-white rounded-lg hover:opacity-80 transition-opacity`}
                title={`View ${platform.name} profile`}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Source Tags */}
        {contact.sources && contact.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {contact.sources.slice(0, 3).map((source, index) => (
              <span 
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${sourceColors[source] || 'bg-gray-500'}`}
              >
                {source}
              </span>
            ))}
            {contact.sources.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                +{contact.sources.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Custom Fields Toggle */}
        {Object.keys(customFields).length > 0 && (
          <div className="mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCustomFields(!showCustomFields);
              }}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Database className="w-3 h-3" />
              <span>Custom Fields</span>
              <ArrowRight className={`w-3 h-3 transition-transform ${showCustomFields ? 'rotate-90' : ''}`} />
            </button>
            
            {showCustomFields && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                {Object.entries(customFields).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Toolbar */}
        <div className="border-t border-gray-200 pt-4">
          <CustomizableAIToolbar
            entityId={contact.id}
            entityType="contact"
            entity={contact}
            size="sm"
          />
        </div>

        {/* Team Action */}
        {showTeamAction && onAddToTeam && !contact.isTeamMember && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToTeam();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add to Team</span>
            </button>
          </div>
        )}

        {/* Last Enrichment Info */}
        {lastEnrichment && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last AI Analysis</span>
              <span className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>{lastEnrichment.confidence}% confidence</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};