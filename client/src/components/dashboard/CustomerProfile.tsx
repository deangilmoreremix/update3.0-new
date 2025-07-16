import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { Star, Phone, Mail, TrendingUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';
import { ContactDetailView } from '../modals/ContactDetailView';

const CustomerProfile: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Convert contacts object to array and get top contacts
  const contactArray = Object.values(contacts);
  const topContacts = contactArray
    .filter(contact => contact.aiScore && contact.aiScore > 80)
    .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
    .slice(0, 6);

  const getInterestLevelColor = (level?: string) => {
    switch (level) {
      case 'hot':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
      case 'medium':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      case 'low':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
      default:
        return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return isDark ? 'text-gray-400' : 'text-gray-600';
    if (score >= 90) return isDark ? 'text-green-400' : 'text-green-600';
    if (score >= 75) return isDark ? 'text-blue-400' : 'text-blue-600';
    if (score >= 60) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Top Prospects
        </h2>
        <div className="flex items-center space-x-2">
          <Star className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            High Priority
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {topContacts.map((contact) => (
          <div 
            key={contact.id} 
            onClick={() => {
              setSelectedContact(contact);
              setIsDetailOpen(true);
            }}
            className={`p-4 rounded-lg border cursor-pointer ${
            isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white/50'
          } hover:scale-[1.02] transition-all duration-200`}>
            <div className="flex items-start space-x-4">
              {/* Avatar with Professional Image */}
              <div className="relative">
                <Avatar
                  src={contact.avatarSrc || contact.avatar || getAvatarByIndex(parseInt(contact.id) || 0)}
                  alt={contact.name}
                  size="lg"
                  fallback={getInitials(contact.name)}
                  status={contact.interestLevel === 'hot' ? 'busy' : contact.interestLevel === 'medium' ? 'away' : 'online'}
                />
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 ${
                  contact.interestLevel === 'hot' 
                    ? 'bg-red-500 border-red-300' 
                    : contact.interestLevel === 'medium'
                    ? 'bg-yellow-500 border-yellow-300'
                    : 'bg-blue-500 border-blue-300'
                } ${isDark ? 'border-gray-800' : 'border-white'}`} />
              </div>
              
              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {contact.name}
                  </h3>
                  <span className={`text-sm font-bold ${getScoreColor(contact.aiScore)}`}>
                    {contact.aiScore}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contact.title} at {contact.company}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getInterestLevelColor(contact.interestLevel)}`}>
                    {contact.interestLevel || 'medium'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {contact.email && (
                    <div className="flex items-center space-x-1">
                      <Mail size={12} />
                      <span>{contact.email.split('@')[0]}...</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone size={12} />
                      <span>***-{contact.phone.slice(-4)}</span>
                    </div>
                  )}
                  {contact.industry && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={12} />
                      <span>{contact.industry}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags.length > 3 && (
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        +{contact.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className={`w-full mt-6 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
        isDark 
          ? 'bg-white/10 text-white hover:bg-white/20' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        View All Contacts
      </button>
      
      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailView
          contact={selectedContact}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerProfile;