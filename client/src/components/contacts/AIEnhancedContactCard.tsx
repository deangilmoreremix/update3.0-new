import React, { useState } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { Contact } from '../../types/contact';
import { Brain, Camera, Edit, Facebook, Globe, Heart, Instagram, Linkedin, Loader2, Mail, MessageSquare, MoreHorizontal, Phone, Plus, Sparkles, Twitter, User, UserPlus } from 'lucide-react';

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
            className={`p-2 rounded-lg transition-colors ${
              contact.isFavorite 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {showTeamAction && onAddToTeam && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToTeam();
            }}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Add to team"
          >
            <UserPlus className="w-4 h-4" />
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
        {/* Avatar and AI Score Section */}
        <div className="flex items-start justify-between mb-4 mt-4">
          <div className="text-center flex-1">
            <div className="relative inline-block mb-3">
              <AvatarWithStatus
                src={contact.avatarSrc}
                alt={contact.name}
                size="lg"
                status={contact.status}
              />
              
              {/* Analysis Loading Indicator */}
              {analyzing && (
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Favorite Badge */}
              {contact.isFavorite && (
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
            <h3 className="text-gray-900 font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">{contact.name}</h3>
            <p className="text-gray-600 text-sm">{contact.title}</p>
            <p className="text-gray-500 text-xs">{contact.company}</p>
          </div>

          {/* AI Score */}
          {contact.aiScore && (
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-bold ${getScoreColor(contact.aiScore)}`}>
                {contact.aiScore}
              </div>
              <p className="text-xs text-gray-500 mt-1">AI Score</p>
            </div>
          )}
        </div>

        {/* Contact Info & Stats */}
        <div className="space-y-3">
          {/* Interest Level */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Interest:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${interestColors[contact.interestLevel]}`}>
              {interestLabels[contact.interestLevel]}
            </span>
          </div>

          {/* Contact Actions */}
          <div className="flex items-center space-x-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Sources */}
          {contact.sources && contact.sources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contact.sources.slice(0, 3).map((source, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${sourceColors[source] || 'bg-gray-500'}`}
                >
                  {source}
                </span>
              ))}
              {contact.sources.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                  +{contact.sources.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Social Profiles */}
          {socialProfiles && Object.keys(socialProfiles).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socialPlatforms.map((platform) => {
                const url = socialProfiles[platform.key];
                if (!url) return null;
                
                const IconComponent = platform.icon;
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-lg text-white hover:opacity-80 transition-opacity ${platform.color}`}
                    title={`View ${platform.name} profile`}
                  >
                    <IconComponent className="w-3 h-3" />
                  </a>
                );
              })}
            </div>
          )}

          {/* AI Toolbar */}
          <div className="pt-3 border-t border-gray-100">
            <CustomizableAIToolbar
              entityType="contact"
              entityId={contact.id}
              entityData={contact}
              location="contact-card"
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