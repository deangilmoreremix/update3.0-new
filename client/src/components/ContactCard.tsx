import React from 'react';
import { Mail, Phone, Building2, Star, MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  avatarSrc?: string;
  status: 'active' | 'pending' | 'inactive';
  rating?: number;
}

interface ContactCardProps {
  contact: Contact;
  onClick?: (contact: Contact) => void;
  showActions?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onClick, 
  showActions = true 
}) => {
  const getStatusColor = () => {
    switch (contact.status) {
      case 'active': return 'bg-green-400';
      case 'pending': return 'bg-yellow-400';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div 
      onClick={() => onClick?.(contact)}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-pointer animate-float-up"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {contact.avatarSrc ? (
              <img 
                src={contact.avatarSrc} 
                alt={`${contact.firstName} ${contact.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-white/20">
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white/20`}></div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg">{contact.firstName} {contact.lastName}</h3>
            <p className="text-gray-300 text-sm">{contact.title}</p>
          </div>
        </div>
        
        {showActions && (
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Company */}
      <div className="flex items-center space-x-2 mb-4">
        <Building2 size={16} className="text-gray-400" />
        <span className="text-gray-300 text-sm">{contact.company}</span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Mail size={14} className="text-gray-400" />
          <span className="text-gray-300 text-sm truncate">{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center space-x-2">
            <Phone size={14} className="text-gray-400" />
            <span className="text-gray-300 text-sm">{contact.phone}</span>
          </div>
        )}
      </div>

      {/* Rating */}
      {contact.rating && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {renderStars(contact.rating)}
          </div>
          <span className="text-gray-400 text-xs">({contact.rating}/5)</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t border-white/10 flex space-x-2">
        <button className="flex-1 py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm font-medium transition-all duration-200">
          Message
        </button>
        <button className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-lg text-emerald-300 text-sm font-medium transition-all duration-200">
          Call
        </button>
      </div>
    </div>
  );
};