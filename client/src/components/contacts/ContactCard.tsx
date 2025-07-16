import React from 'react';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { ModernButton } from '../modern-ui/ModernButton';
import { GlassCard } from '../modern-ui/GlassCard';
import { Mail, Phone, Building, Star, TrendingUp, Eye, Edit, MoreHorizontal, Calendar, Target } from 'lucide-react';
import { Contact } from '../../types/contact';

interface ContactCardProps {
  contact: Contact;
  onView?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onSelect?: (contact: Contact) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onView,
  onEdit,
  onSelect,
  isSelected = false,
  showActions = true
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-green-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot': return 'Hot Lead';
      case 'warm': return 'Warm';
      case 'cold': return 'Cold';
      case 'inactive': return 'Inactive';
      default: return 'Active';
    }
  };

  return (
    <GlassCard 
      className={`relative p-6 hover:shadow-lg transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
      }`}
      onClick={() => onSelect && onSelect(contact)}
    >
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <AvatarWithStatus
              src={contact.avatarSrc}
              alt={contact.name}
              name={contact.name}
              size="lg"
              status="online"
              showStatus={true}
            />
            {contact.isFavorite && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
            <p className="text-gray-600 text-sm">{contact.title}</p>
            <p className="text-gray-500 text-sm flex items-center">
              <Building className="w-3 h-3 mr-1" />
              {contact.company}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(contact.status)}`}>
            {getStatusLabel(contact.status)}
          </span>
          {contact.aiScore && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-green-600">{contact.aiScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
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
        {contact.industry && (
          <div className="flex items-center text-sm text-gray-600">
            <Target className="w-4 h-4 mr-2 text-gray-400" />
            <span>{contact.industry}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {contact.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{contact.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => onView && onView(contact)}
              className="flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>View</span>
            </ModernButton>
            
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(contact)}
              className="flex items-center space-x-1"
            >
              <Edit className="w-3 h-3" />
              <span>Edit</span>
            </ModernButton>
          </div>

          <div className="flex space-x-1">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Last Interaction */}
      {contact.lastConnected && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Last contact: {new Date(contact.lastConnected).toLocaleDateString()}
          </p>
        </div>
      )}
    </GlassCard>
  );
};