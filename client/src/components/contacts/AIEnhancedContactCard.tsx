import React, { useState } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { Contact } from '../../types';
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
  Brain,
  Loader2,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

interface AIEnhancedContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onAnalyze?: (contact: Contact) => Promise<boolean>;
  isAnalyzing?: boolean;
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
  'Cold Call': 'bg-gray-500'
};

const AIEnhancedContactCard: React.FC<AIEnhancedContactCardProps> = ({ 
  contact, 
  isSelected, 
  onSelect, 
  onClick, 
  onAnalyze, 
  isAnalyzing = false 
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const handleAnalyzeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalyze && !isAnalyzing) {
      const success = await onAnalyze(contact);
      if (success) {
        // Mock AI insights for demonstration
        setAiInsights([
          `${contact.name} shows high engagement potential`,
          `Recent activity suggests active interest`,
          `Recommend personalized follow-up approach`
        ]);
        setShowInsights(true);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-500';
      case 'prospect': return 'bg-blue-500';
      case 'lead': return 'bg-yellow-500';
      case 'churned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Calculate dynamic metrics based on contact data
  const interestLevel = 'medium'; // Default since interestLevel isn't in base Contact type
  const sources = ['LinkedIn']; // Default since sources isn't in base Contact type
  const leadSource = sources?.[0] || 'Website';
  const aiScore = contact.score || 75;

  return (
    <div
      className={`
        relative group p-6 rounded-xl border transition-all duration-300 cursor-pointer
        bg-white/90 backdrop-blur-sm border-gray-200 
        hover:border-blue-300 hover:shadow-lg hover:bg-white/95
        ${isSelected ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/50' : ''}
      `}
      onClick={onClick}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>

      {/* AI Analysis Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${isAnalyzing 
              ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'
            }
          `}
          title="AI Analysis"
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Contact Header */}
      <div className="flex items-start space-x-4 mb-4 mt-8">
        <AvatarWithStatus
          src="/api/placeholder/100/100"
          alt={contact.name}
          size="lg"
          status="online"
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            {contact.favorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 truncate">
            {contact.position || 'Position not specified'} {contact.company && `at ${contact.company}`}
          </p>
          
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)} text-white`}>
              {contact.status}
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${interestColors[interestLevel as keyof typeof interestColors]} text-white`}>
              {interestLabels[interestLevel as keyof typeof interestLabels]}
            </span>
          </div>
        </div>
      </div>

      {/* AI Score and Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50/50 rounded-lg">
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(aiScore)}`}>
            {aiScore}
          </div>
          <div className="text-xs text-gray-500">AI Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {sources.length}
          </div>
          <div className="text-xs text-gray-500">Sources</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {contact.lastContact ? 
              Math.floor((Date.now() - new Date(contact.lastContact).getTime()) / (1000 * 60 * 60 * 24)) : 
              '—'
            }
          </div>
          <div className="text-xs text-gray-500">Days Ago</div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-4">
        {contact.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        
        {contact.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      {/* Sources */}
      <div className="flex flex-wrap gap-1 mb-4">
        {sources.map((source, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
              sourceColors[source] || 'bg-gray-500'
            }`}
          >
            {source}
          </span>
        ))}
      </div>

      {/* AI Insights */}
      {showInsights && aiInsights.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI Insights</span>
          </div>
          <ul className="space-y-1">
            {aiInsights.map((insight, index) => (
              <li key={index} className="text-xs text-blue-800">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle email action
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle call action
            }}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Make Call"
          >
            <Phone className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit Contact"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickActions(!showQuickActions);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Extended Quick Actions */}
      {showQuickActions && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <CustomizableAIToolbar
            contact={contact}
            onAction={(action) => {
              console.log(`Executing action: ${action} for contact: ${contact.name}`);
              setShowQuickActions(false);
            }}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

export default AIEnhancedContactCard;
export { AIEnhancedContactCard };