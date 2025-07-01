import React, { useState, useEffect } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { ModernButton } from '../ui/ModernButton';
import { CustomizableAIToolbar } from '../ui/CustomizableAIToolbar';
import { AIResearchButton } from '../ui/AIResearchButton';
import { aiEnrichmentService, ContactEnrichmentData } from '../../services/aiEnrichmentService';
import { ContactJourneyTimeline } from '../contacts/ContactJourneyTimeline';
import { AIInsightsPanel } from '../contacts/AIInsightsPanel';
import { CommunicationHub } from '../contacts/CommunicationHub';
import { AutomationPanel } from '../contacts/AutomationPanel';
import { ContactAnalytics } from '../contacts/ContactAnalytics';
import { Contact } from '../../types';
import {
  X, Edit, Mail, Phone, Plus, MessageSquare, FileText, Calendar, MoreHorizontal,
  User, Globe, Clock, Building, Tag, Star, ExternalLink, Brain, TrendingUp,
  BarChart3, Zap, Users, Activity, Settings, Database, Shield, Target,
  Smartphone, Video, Linkedin, Twitter, Facebook, Instagram, Save,
  Ambulance as Cancel, Heart, HeartOff, MapPin, Briefcase, Award,
  CheckCircle, AlertCircle, Wifi, WifiOff, Search, DollarSign, RefreshCw,
  Sparkles, Camera, Wand2
} from 'lucide-react';

interface ContactDetailViewProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (id: string, updates: Partial<Contact>) => Promise<Contact>;
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
  'Cold Call': 'bg-gray-600'
};

const socialPlatforms = [
  { icon: MessageSquare, color: 'bg-green-500', name: 'WhatsApp', key: 'whatsapp' },
  { icon: Linkedin, color: 'bg-blue-500', name: 'LinkedIn', key: 'linkedin' },
  { icon: Mail, color: 'bg-blue-600', name: 'Email', key: 'email' },
  { icon: Twitter, color: 'bg-blue-400', name: 'Twitter', key: 'twitter' },
  { icon: Facebook, color: 'bg-blue-700', name: 'Facebook', key: 'facebook' },
  { icon: Instagram, color: 'bg-pink-500', name: 'Instagram', key: 'instagram' },
];

export const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedContact(contact);
  }, [contact]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field: keyof Contact, value: any) => {
    setEditedContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    try {
      await onUpdate(editedContact.id, editedContact);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  const handleToggleFavorite = async () => {
    if (!onUpdate) return;
    
    const updatedContact = {
      ...editedContact,
      isFavorite: !editedContact.isFavorite
    };
    
    setEditedContact(updatedContact);
    await onUpdate(editedContact.id, { isFavorite: !editedContact.isFavorite });
  };

  const handleAnalyzeContact = async () => {
    setIsAnalyzing(true);
    try {
      const insights = await aiEnrichmentService.analyzeContact(editedContact);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error analyzing contact:', error);
      setAiInsights('Error analyzing contact. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAIEnrichment = async (enrichmentData: ContactEnrichmentData) => {
    try {
      const enrichedContact = await aiEnrichmentService.enrichContact(editedContact, enrichmentData);
      setEditedContact(enrichedContact);
      
      if (onUpdate) {
        await onUpdate(editedContact.id, enrichedContact);
      }
    } catch (error) {
      console.error('Error enriching contact:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'journey', label: 'Journey', icon: Activity },
  ];

  const quickActions = [
    { label: 'Call', icon: Phone, color: 'bg-green-500', action: () => {} },
    { label: 'Email', icon: Mail, color: 'bg-blue-500', action: () => {} },
    { label: 'Message', icon: MessageSquare, color: 'bg-purple-500', action: () => {} },
    { label: 'Meeting', icon: Calendar, color: 'bg-orange-500', action: () => {} },
    { label: 'Note', icon: FileText, color: 'bg-gray-500', action: () => {} },
    { label: 'Task', icon: CheckCircle, color: 'bg-indigo-500', action: () => {} },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      inactive: 'bg-gray-500',
      lead: 'bg-blue-500',
      prospect: 'bg-purple-500',
      customer: 'bg-green-600',
      churned: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getScoreColor = (score: number = 0) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number = 0) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-2 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Enlarged Modal Container */}
      <div className="bg-white rounded-xl w-full max-w-[95vw] h-[95vh] overflow-hidden flex animate-scale-in shadow-2xl">
        {/* Enhanced Customer Profile Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200 flex flex-col h-full">
          {/* Fixed Header with AI Features */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              Customer Profile
              <Sparkles className="w-4 h-4 ml-2 text-purple-500" />
            </h2>
            <div className="flex space-x-2">
              <AIResearchButton
                searchQuery={{
                  email: editedContact.email,
                  firstName: editedContact.firstName,
                  lastName: editedContact.lastName,
                  company: editedContact.company,
                  linkedinUrl: editedContact.socialProfiles?.linkedin
                }}
                onDataFound={handleAIEnrichment}
                variant="outline"
                size="sm"
                className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
              />
              <button
                onClick={handleAnalyzeContact}
                disabled={isAnalyzing}
                className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50 relative"
                title="AI Analysis"
              >
                <Brain className="w-4 h-4" />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Profile Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Profile Header */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <AvatarWithStatus
                  src={editedContact.avatarSrc}
                  alt={editedContact.name}
                  size="xl"
                  status={editedContact.status === 'active' ? 'online' : 'offline'}
                  className="ring-4 ring-white shadow-lg"
                />
                <button
                  onClick={handleToggleFavorite}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {editedContact.isFavorite ? (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editedContact.name}</h3>
                <p className="text-gray-600 font-medium">{editedContact.title}</p>
                <p className="text-gray-500">{editedContact.company}</p>
              </div>

              {/* Status and Score */}
              <div className="flex items-center justify-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(editedContact.status)}`}>
                  {editedContact.status}
                </span>
                {editedContact.aiScore && (
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreColor(editedContact.aiScore)}`}>
                    <Star className="w-3 h-3 mr-1" />
                    {editedContact.aiScore}% {getScoreLabel(editedContact.aiScore)}
                  </div>
                )}
              </div>

              {/* Interest Level */}
              <div className="flex items-center justify-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${interestColors[editedContact.interestLevel]}`}>
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  {interestLabels[editedContact.interestLevel]}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Contact Information
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="font-medium">{editedContact.email}</span>
                </div>
                {editedContact.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{editedContact.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Building className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{editedContact.company}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{editedContact.title}</span>
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            {editedContact.socialProfiles && Object.keys(editedContact.socialProfiles).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Social Profiles
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(editedContact.socialProfiles).map(([platform, url]) => {
                    if (!url) return null;
                    const PlatformIcon = socialPlatforms.find(p => p.key === platform)?.icon || Globe;
                    const platformColor = socialPlatforms.find(p => p.key === platform)?.color || 'bg-gray-500';
                    
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center p-2 ${platformColor} text-white rounded-lg hover:opacity-80 transition-opacity`}
                      >
                        <PlatformIcon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {editedContact.sources.map((source, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                      sourceColors[source] || 'bg-gray-500'
                    }`}
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {editedContact.tags && editedContact.tags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {editedContact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Connected */}
            {editedContact.lastConnected && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Last Connected
                </h4>
                <p className="text-sm text-gray-600">{editedContact.lastConnected}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`flex items-center justify-center p-3 ${action.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Toolbar */}
            <div className="pt-4 border-t border-gray-200">
              <CustomizableAIToolbar
                context={{
                  type: 'contact',
                  data: editedContact
                }}
                size="sm"
                layout="vertical"
              />
            </div>
          </div>

          {/* Fixed Footer with Edit/Save Buttons */}
          <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <ModernButton
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </ModernButton>
                <ModernButton
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Cancel className="w-4 h-4 mr-2" />
                  Cancel
                </ModernButton>
              </div>
            ) : (
              <ModernButton
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Contact
              </ModernButton>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Contact Overview
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContact.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{editedContact.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedContact.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{editedContact.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedContact.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{editedContact.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContact.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{editedContact.company}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedContact.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{editedContact.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        {isEditing ? (
                          <select
                            value={editedContact.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                            <option value="lead">Lead</option>
                            <option value="prospect">Prospect</option>
                            <option value="customer">Customer</option>
                            <option value="churned">Churned</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(editedContact.status)}`}>
                            {editedContact.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    {isEditing ? (
                      <textarea
                        value={editedContact.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add notes about this contact..."
                      />
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {editedContact.notes || 'No notes available.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Fields */}
                {editedContact.customFields && Object.keys(editedContact.customFields).length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-blue-500" />
                      Custom Fields
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(editedContact.customFields).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="text-gray-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'communication' && (
              <CommunicationHub
                contact={editedContact}
                onContactUpdate={(updates) => {
                  setEditedContact(prev => ({ ...prev, ...updates }));
                  if (onUpdate) {
                    onUpdate(editedContact.id, updates);
                  }
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <ContactAnalytics
                contact={editedContact}
                onInsightGenerated={(insight) => {
                  setAiInsights(insight);
                }}
              />
            )}

            {activeTab === 'ai-insights' && (
              <AIInsightsPanel
                contact={editedContact}
                insights={aiInsights}
                onInsightUpdate={setAiInsights}
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyzeContact}
              />
            )}

            {activeTab === 'automation' && (
              <AutomationPanel
                contact={editedContact}
                onAutomationTriggered={(automation) => {
                  console.log('Automation triggered:', automation);
                }}
              />
            )}

            {activeTab === 'journey' && (
              <ContactJourneyTimeline
                contact={editedContact}
                onEventAdd={(event) => {
                  console.log('New event added:', event);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};