import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContactStore } from '../store/contactStore';
import { Contact } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import { AvatarWithStatus } from '../components/ui/AvatarWithStatus';
import { AutomationPanel } from '../components/contacts/AutomationPanel';
import { CommunicationHub } from '../components/contacts/CommunicationHub';
import { ContactAnalytics } from '../components/contacts/ContactAnalytics';
import { ContactJourneyTimeline } from '../components/contacts/ContactJourneyTimeline';
import { 
  ArrowLeft,
  Edit,
  Save,
  Star,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  Clock,
  MapPin,
  Building,
  Users,
  DollarSign,
  Target,
  Linkedin,
  Twitter,
  ExternalLink
} from 'lucide-react';

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts: contactsRecord, updateContact, getContact } = useContactStore();
  const [contact, setContact] = useState<Contact | undefined>(
    id ? contactsRecord[id] : undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      const foundContact = contactsRecord[id];
      if (foundContact) {
        setContact(foundContact);
      } else {
        // Try to fetch the contact if not in store
        getContact(id).then((fetchedContact) => {
          if (fetchedContact) {
            setContact(fetchedContact);
          }
        });
      }
    }
  }, [id, contactsRecord, getContact]);

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Not Found</h1>
          <ModernButton onClick={() => navigate('/contacts')} variant="primary">
            Back to Contacts
          </ModernButton>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (contact) {
      await updateContact(contact.id, contact);
      setIsEditing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users, component: null },
    { id: 'automation', label: 'Automation', icon: Zap, component: <AutomationPanel contact={contact} /> },
    { id: 'communication', label: 'Communication', icon: MessageSquare, component: <CommunicationHub contact={contact} /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: <ContactAnalytics contact={contact} /> },
    { id: 'timeline', label: 'Journey', icon: Clock, component: <ContactJourneyTimeline contact={contact} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/contacts')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </ModernButton>
            <h1 className="text-3xl font-bold text-gray-900">Contact Details</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </ModernButton>
                <ModernButton
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </ModernButton>
              </>
            ) : (
              <ModernButton
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </ModernButton>
            )}
          </div>
        </div>

        {/* Contact Header Card */}
        <GlassCard className="p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <AvatarWithStatus
                  src={contact.avatarSrc || contact.avatar}
                  alt={contact.name}
                  size="xl"
                  status={contact.status === 'customer' ? 'online' : contact.status === 'prospect' ? 'away' : 'offline'}
                />
                <button className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <Star className={`w-4 h-4 ${contact.favorite || contact.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                    contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                  {contact.aiScore && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      contact.aiScore >= 80 ? 'bg-green-100 text-green-800' :
                      contact.aiScore >= 60 ? 'bg-blue-100 text-blue-800' :
                      contact.aiScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      AI Score: {contact.aiScore}%
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-gray-600 mb-4">{contact.title || contact.position}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contact.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                  {contact.leadSource && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>{contact.leadSource}</span>
                    </div>
                  )}
                  {contact.annualRevenue && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>${contact.annualRevenue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-2">
              <ModernButton variant="primary" size="sm" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </ModernButton>
              <ModernButton variant="outline" size="sm" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </ModernButton>
              <ModernButton variant="outline" size="sm" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Meet</span>
              </ModernButton>
            </div>
          </div>

          {/* Social Links */}
          {contact.socialProfiles && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Social:</span>
                {contact.socialProfiles.linkedin && (
                  <a 
                    href={contact.socialProfiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {contact.socialProfiles.twitter && (
                  <a 
                    href={contact.socialProfiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-600"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-gray-900">{contact.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                    <p className="text-gray-900">{contact.employeeCount || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Contact</label>
                    <p className="text-gray-900">
                      {contact.lastContact ? new Date(contact.lastContact).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No tags</p>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Notes */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <textarea
                      value={contact.notes || ''}
                      onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add notes about this contact..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {contact.notes || 'No notes available.'}
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>
          ) : (
            // Render the component for the active tab
            tabs.find(tab => tab.id === activeTab)?.component
          )}
        </div>
      </div>
    </div>
  );
}