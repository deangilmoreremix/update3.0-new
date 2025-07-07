import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { AvatarWithStatus } from '@/components/ui/AvatarWithStatus';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { CustomizableAIToolbar } from '@/components/ui/CustomizableAIToolbar';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar,
  Star,
  StarOff,
  ExternalLink,
  Brain,
  TrendingUp,
  MessageSquare,
  Target,
  Zap
} from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  industry?: string;
  avatarSrc: string;
  sources: string[];
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  status: 'active' | 'pending' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'churned';
  lastConnected?: string;
  notes?: string;
  aiScore?: number;
  tags?: string[];
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

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
  const [isFavorite, setIsFavorite] = useState(contact.isFavorite || false);
  const [isAnalyzing_, setIsAnalyzing] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnalyzing(true);
    try {
      if (onAnalyze) {
        await onAnalyze(contact);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'hot': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      case 'cold': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      case 'lead': return 'info';
      case 'prospect': return 'warning';
      case 'customer': return 'success';
      case 'churned': return 'error';
      default: return 'info';
    }
  };

  return (
    <GlassCard 
      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <AvatarWithStatus
            src={contact.avatarSrc}
            alt={contact.name}
            size="md"
            status={getStatusColor(contact.status) as any}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-500">{contact.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {contact.aiScore && (
            <div className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
              <Brain className="w-3 h-3 mr-1" />
              {contact.aiScore}%
            </div>
          )}
          <button
            onClick={handleFavoriteToggle}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {isFavorite ? (
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Company and Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2 text-gray-400" />
          <span>{contact.company}</span>
          {contact.industry && (
            <span className="ml-2 text-gray-400">• {contact.industry}</span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{contact.email}</span>
        </div>
        
        {contact.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      {/* Status and Interest Level */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StatusIndicator status={getStatusColor(contact.status) as any} />
          <span className="text-sm text-gray-600 capitalize">{contact.status}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-4 h-4 ${getInterestLevelColor(contact.interestLevel)}`} />
          <span className={`text-sm capitalize ${getInterestLevelColor(contact.interestLevel)}`}>
            {contact.interestLevel}
          </span>
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
          {contact.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{contact.tags.length - 3} more</span>
          )}
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
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {contact.socialProfiles.twitter && (
            <a
              href={contact.socialProfiles.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {contact.socialProfiles.website && (
            <a
              href={contact.socialProfiles.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      {/* Last Connected */}
      {contact.lastConnected && (
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3 mr-1" />
          Last connected: {new Date(contact.lastConnected).toLocaleDateString()}
        </div>
      )}

      {/* AI Toolbar Footer */}
      <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
        {/* AI Goals Button - Full Width */}
        <div className="w-full">
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

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
          <ModernButton
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isAnalyzing_}
            className="w-full"
          >
            {(isAnalyzing || isAnalyzing_) ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-3 h-3 mr-2" />
                AI Analysis
              </>
            )}
          </ModernButton>
          
          <ModernButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Personalize email for:', contact.name);
            }}
            className="w-full"
          >
            <MessageSquare className="w-3 h-3 mr-2" />
            Personalize
          </ModernButton>
          
          <ModernButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Lead scoring for:', contact.name);
            }}
            className="w-full"
          >
            <Target className="w-3 h-3 mr-2" />
            Score Lead
          </ModernButton>
          
          <ModernButton
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Research contact:', contact.name);
            }}
            className="w-full"
          >
            <Zap className="w-3 h-3 mr-2" />
            Research
          </ModernButton>
        </div>
      </div>
    </GlassCard>
  );
};