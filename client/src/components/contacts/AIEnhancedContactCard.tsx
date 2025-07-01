import React, { useState } from 'react';
import { Contact } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { ModernButton } from '../ui/ModernButton';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { 
  Sparkles, 
  Star, 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  Calendar,
  FileText,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';

interface AIEnhancedContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onAnalyze?: (contact: Contact) => Promise<boolean>;
  isAnalyzing?: boolean;
}

export const AIEnhancedContactCard: React.FC<AIEnhancedContactCardProps> = ({
  contact,
  isSelected,
  onSelect,
  onClick,
  onAnalyze,
  isAnalyzing = false
}) => {
  const [showInsights, setShowInsights] = useState(false);
  const [localAnalyzing, setLocalAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    
    setLocalAnalyzing(true);
    try {
      const success = await onAnalyze(contact);
      if (success) {
        setShowInsights(true);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLocalAnalyzing(false);
    }
  };

  const getInterestLevelColor = (level?: string) => {
    switch (level) {
      case 'hot':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-orange-500 bg-orange-50';
      case 'low':
        return 'text-yellow-500 bg-yellow-50';
      case 'cold':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-50';
      case 'prospect':
        return 'text-blue-500 bg-blue-50';
      case 'customer':
        return 'text-purple-500 bg-purple-50';
      case 'lead':
        return 'text-orange-500 bg-orange-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getAIScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const formatLastConnected = (date?: string) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  return (
    <GlassCard 
      className={`
        p-6 transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}
        hover:shadow-lg
      `}
      onClick={onClick}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <AvatarWithStatus
            src={contact.avatarSrc || contact.avatar || '/api/placeholder/avatar.jpg'}
            alt={contact.name}
            size="lg"
            status={contact.status === 'active' ? 'active' : 'inactive'}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {contact.firstName} {contact.lastName}
              </h3>
              {contact.isFavorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 truncate">
              {contact.title} {contact.title && contact.company && '•'} {contact.company}
            </p>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
              
              {contact.interestLevel && (
                <span className={`px-2 py-1 text-xs rounded-full ${getInterestLevelColor(contact.interestLevel)}`}>
                  {contact.interestLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {contact.aiScore && (
            <div className={`text-right ${getAIScoreColor(contact.aiScore)}`}>
              <div className="text-lg font-bold">{contact.aiScore}</div>
              <div className="text-xs text-gray-500">AI Score</div>
            </div>
          )}
          
          <ModernButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="opacity-60 hover:opacity-100"
          >
            {isSelected ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
          </ModernButton>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {contact.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        
        {contact.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{contact.phone}</span>
          </div>
        )}
        
        {contact.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{contact.location}</span>
          </div>
        )}
      </div>

      {/* Data Sources */}
      {contact.sources && contact.sources.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {contact.sources.map((source, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Profiles */}
      {contact.socialProfiles && (
        <div className="flex items-center space-x-2 mb-4">
          {contact.socialProfiles.linkedin && (
            <a
              href={contact.socialProfiles.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          
          {contact.socialProfiles.twitter && (
            <a
              href={contact.socialProfiles.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-blue-400 hover:bg-blue-50 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          
          {contact.socialProfiles.website && (
            <a
              href={contact.socialProfiles.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {contact.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Connected */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Last: {formatLastConnected(contact.lastConnected)}</span>
        </span>
        
        {contact.createdAt && (
          <span>Added: {new Date(contact.createdAt).toLocaleDateString()}</span>
        )}
      </div>

      {/* AI Analysis Section */}
      {onAnalyze && (
        <div className="border-t pt-4 space-y-3">
          <ModernButton
            variant="glass"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAnalyze();
            }}
            loading={isAnalyzing || localAnalyzing}
            disabled={isAnalyzing || localAnalyzing}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAnalyzing || localAnalyzing ? 'Analyzing...' : 'AI Analysis'}
          </ModernButton>

          {showInsights && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">AI Insights</span>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <div>• High engagement potential detected</div>
                <div>• Optimal contact time: Weekday mornings</div>
                <div>• Recommended approach: Professional email</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Action Toolbar */}
      <div className="border-t pt-4">
        <CustomizableAIToolbar
          entityType="contact"
          entityId={contact.id}
          entityData={contact}
          location="contact-card"
          layout="grid"
          size="sm"
          showCustomizeButton={false}
        />
      </div>
    </GlassCard>
  );
};