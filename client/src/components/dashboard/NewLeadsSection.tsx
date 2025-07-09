import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { Users, Star, TrendingUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../services/avatarCollection';
import { ContactDetailView } from '../modals/ContactDetailView';

const NewLeadsSection: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Get hot leads (contacts with high interest level)
  const hotLeads = Object.values(contacts)
    .filter(contact => contact.interestLevel === 'hot' || contact.status === 'lead')
    .slice(0, 6); // Show top 6 hot leads

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mr-3">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>New Hot Leads</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              High-priority prospects requiring immediate attention
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          {hotLeads.length} Hot
        </div>
      </div>

      {hotLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotLeads.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setIsDetailOpen(true);
              }}
              className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <Avatar
                    src={contact.avatarSrc || contact.avatar}
                    alt={contact.name}
                    size="md"
                    fallback={getInitials(contact.name)}
                  />
                  <div className="absolute -top-1 -right-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {contact.name}
                  </p>
                  <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contact.title || contact.company || contact.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                }`}>
                  {contact.interestLevel === 'hot' ? 'Hot Lead' : 'New Lead'}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {contact.aiScore ? `${contact.aiScore}% match` : 'New'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hot leads at the moment</p>
          <p className="text-sm mt-1">New high-priority leads will appear here</p>
        </div>
      )}
      
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

export default NewLeadsSection;