import React, { useState, useEffect, useMemo } from 'react';
import { useContactStore } from '../store/contactStore';
import { Contact } from '../types';
import {
  Search,
  Plus,
  Brain,
  Download,
  Upload,
  MoreHorizontal,
  Filter,
  Grid,
  List,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Users,
  Target,
  Activity,
  X,
  Settings,
  Eye,
  MessageSquare,
  Calendar,
  FileText,
  Globe,
  MapPin,
  Building,
  Briefcase,
  Clock,
  Heart,
  Zap,
  BarChart3,
  Video,
  UserPlus,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { useForm } from 'react-hook-form';
import Fuse from 'fuse.js';
import Select from 'react-select';
import CustomizableAIToolbar from '../components/ai/CustomizableAIToolbar';

interface ContactsProps {}

// Enhanced Contact Card with Glass Morphism Design
interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (contactId: string) => void;
  onViewDetails: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onToggleFavorite: (contactId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isSelected,
  onSelect,
  onViewDetails,
  onEdit,
  onToggleFavorite
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'churned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInterestLevel = (score: number) => {
    if (score >= 80) return { level: 'Hot', color: 'bg-red-500', dots: 4 };
    if (score >= 60) return { level: 'Warm', color: 'bg-orange-500', dots: 3 };
    if (score >= 40) return { level: 'Medium', color: 'bg-yellow-500', dots: 2 };
    return { level: 'Cold', color: 'bg-blue-500', dots: 1 };
  };

  const interestData = getInterestLevel(contact.score || 0);

  return (
    <div 
      className={`relative group bg-white backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(contact)}
    >
      {/* Selection Checkbox */}
      <div 
        className="absolute top-4 left-4 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(contact.id);
        }}
      >
        {isSelected ? (
          <CheckSquare className="w-5 h-5 text-blue-600" />
        ) : (
          <Square className="w-5 h-5 text-gray-400 hover:text-blue-600" />
        )}
      </div>

      {/* Favorite Toggle */}
      <div 
        className="absolute top-4 right-4 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(contact.id);
        }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            contact.isFavorite 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-4 mt-2">
        <div className="relative">
          <Avatar
            name={contact.name}
            src={contact.avatar}
            size="80"
            round
            className="shadow-md border-2 border-white"
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
            contact.lastContact && new Date(contact.lastContact).getTime() > Date.now() - 24 * 60 * 60 * 1000 
              ? 'bg-green-500' 
              : 'bg-gray-400'
          }`} />
        </div>
        
        {/* Name and Title */}
        <h3 className="font-semibold text-gray-900 text-center mt-3 mb-1">
          {contact.name}
        </h3>
        <p className="text-sm text-gray-600 text-center">
          {contact.position || 'No Title'}
        </p>
        <p className="text-xs text-gray-500 text-center">
          {contact.company || 'No Company'}
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-3">
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(contact.status)}`}>
          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
        </span>
      </div>

      {/* AI Score */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2">
          <Brain className={`w-4 h-4 mr-2 ${getScoreColor(contact.score || 0)}`} />
          <span className={`text-sm font-medium ${getScoreColor(contact.score || 0)}`}>
            AI Score: {contact.score || 0}/100
          </span>
        </div>
      </div>

      {/* Interest Level */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          <span className="text-xs text-gray-600 mr-2">{interestData.level}</span>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < interestData.dots ? interestData.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {contact.email && (
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center text-xs text-gray-600">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.location && (
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{contact.location}</span>
          </div>
        )}
      </div>

      {/* Source Tags */}
      {contact.source && (
        <div className="flex flex-wrap gap-1 mb-4">
          {Array.isArray(contact.source) ? contact.source.map((src, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {src}
            </span>
          )) : (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {contact.source}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons - Show on Hover */}
      <div className={`flex justify-center space-x-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(contact);
          }}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          title="Edit Contact"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `mailto:${contact.email}`;
          }}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          title="Send Email"
        >
          <Mail className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `tel:${contact.phone}`;
          }}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          title="Call"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(contact);
          }}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* AI Tools Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <CustomizableAIToolbar
          entityType="contact"
          entityId={contact.id}
          entityData={contact}
          location="contactCards"
          layout="horizontal"
          size="sm"
          showCustomizeButton={false}
        />
      </div>
    </div>
  );
};

// Contact Detail Modal
interface ContactDetailModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (contact: Contact) => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (contact) {
      setEditedContact({ ...contact });
    }
  }, [contact]);

  if (!isOpen || !contact || !editedContact) return null;

  const handleSave = () => {
    if (editedContact) {
      onUpdate(editedContact);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedContact({ ...contact });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                name={contact.name}
                src={contact.avatar}
                size="60"
                round
                className="border-2 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">{contact.name}</h2>
                <p className="text-blue-100">{contact.position} at {contact.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex h-[600px]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContact.name}
                        onChange={(e) => setEditedContact({...editedContact, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedContact.email}
                        onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedContact.phone || ''}
                        onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContact.company || ''}
                        onChange={(e) => setEditedContact({...editedContact, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.company || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContact.position || ''}
                        onChange={(e) => setEditedContact({...editedContact, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.position || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        value={editedContact.status}
                        onChange={(e) => setEditedContact({...editedContact, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="customer">Customer</option>
                        <option value="churned">Churned</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI Score</span>
                      <span className="text-lg font-bold text-blue-600">{contact.score || 0}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${contact.score || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Engagement Level</h4>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        {contact.score && contact.score >= 80 ? 'Hot' :
                         contact.score && contact.score >= 60 ? 'Warm' :
                         contact.score && contact.score >= 40 ? 'Medium' : 'Cold'}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              contact.score && i < Math.ceil((contact.score / 100) * 4) 
                                ? contact.score >= 80 ? 'bg-red-500' :
                                  contact.score >= 60 ? 'bg-orange-500' :
                                  contact.score >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Last Activity</h4>
                    <p className="text-sm text-gray-600">
                      {contact.lastContact 
                        ? new Date(contact.lastContact).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No recent activity'
                      }
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Source</h4>
                    <div className="flex flex-wrap gap-1">
                      {contact.source ? (
                        Array.isArray(contact.source) ? contact.source.map((src, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {src}
                          </span>
                        )) : (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {contact.source}
                          </span>
                        )
                      ) : (
                        <span className="text-sm text-gray-500">No source specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                <button className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {contact.notes ? (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-700">{contact.notes}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No notes yet. Add your first note to track important information.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Actions and AI Tools */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex flex-col items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Mail className="w-5 h-5 mb-1" />
                <span className="text-xs">Email</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Phone className="w-5 h-5 mb-1" />
                <span className="text-xs">Call</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <MessageSquare className="w-5 h-5 mb-1" />
                <span className="text-xs">Message</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-xs">Schedule</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video Call</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-xs">Proposal</span>
              </button>
            </div>

            {/* AI Assistant Tools */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center mb-4">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">AI Assistant Tools</h4>
              </div>
              
              <CustomizableAIToolbar
                entityType="contact"
                entityId={contact.id}
                entityData={contact}
                location="contactDetail"
                layout="vertical"
                size="md"
                showCustomizeButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Add Contact Modal
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contact: Partial<Contact>) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Contact>>();

  const handleFormSubmit = (data: Partial<Contact>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="w-6 h-6 mr-3" />
              <h2 className="text-2xl font-bold">Add New Contact</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                {...register('company')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                {...register('position')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                {...register('industry')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter industry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes or comments..."
            />
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Contacts Component
const ContactsNew: React.FC<ContactsProps> = () => {
  const { 
    contacts: storeContacts, 
    isLoading: storeIsLoading,
    error: storeError,
    fetchContacts, 
    createContact,
    updateContact,
    deleteContact,
    selectContact,
    importContacts
  } = useContactStore();
  
  // Local state for UI
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    status: string | null,
    industry: string | null,
    score: [number, number] | null
  }>({
    status: null,
    industry: null,
    score: null
  });

  // Load contacts from store on component mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);
  
  // Update local contacts from store
  useEffect(() => {
    if (Object.keys(storeContacts).length > 0) {
      setContacts(Object.values(storeContacts));
    }
  }, [storeContacts]);

  // Set up fuzzy search with fuse.js
  const fuse = useMemo(() => 
    new Fuse(contacts, {
      keys: ['name', 'email', 'company', 'phone'],
      threshold: 0.3
    }),
  [contacts]);
  
  // Filter contacts based on search and active filters
  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    // Apply search filter
    if (searchTerm) {
      result = fuse.search(searchTerm).map(res => res.item);
    }
    
    // Apply status filter
    if (activeFilters.status) {
      result = result.filter(contact => contact.status === activeFilters.status);
    }
    
    // Apply industry filter
    if (activeFilters.industry) {
      result = result.filter(contact => contact.industry === activeFilters.industry);
    }
    
    // Apply score filter
    if (activeFilters.score) {
      const [min, max] = activeFilters.score;
      result = result.filter(contact => 
        (contact.score || 0) >= min && (contact.score || 0) <= max
      );
    }
    
    return result;
  }, [contacts, searchTerm, activeFilters, fuse]);

  // Toggle contact selection
  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  // Select all contacts
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  // Handle contact detail view
  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  // Handle contact edit
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  // Handle toggle favorite
  const handleToggleFavorite = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
      updateContact(contactId, updatedContact);
    }
  };

  // Handle update contact
  const handleUpdateContact = (updatedContact: Contact) => {
    updateContact(updatedContact.id, updatedContact);
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setShowDetailModal(false);
  };

  // Submit form for creating a new contact
  const handleCreateContact = (data: Partial<Contact>) => {
    createContact({
      ...data,
      status: data.status || 'lead',
      score: data.score || 50
    })
      .then(() => {
        fetchContacts(); // Refresh the contacts list
      })
      .catch(error => {
        console.error('Failed to create contact:', error);
      });
  };

  // Handle AI analysis of all contacts
  const handleAnalyzeAllContacts = async () => {
    setIsAnalyzing(true);
    
    try {
      await new Promise(r => setTimeout(r, 1500));
      
      const updatedContacts = contacts.map(contact => {
        const randomAdjustment = Math.floor(Math.random() * 10) - 5;
        const newScore = Math.max(0, Math.min(100, (contact.score || 50) + randomAdjustment));
        
        updateContact(contact.id, { ...contact, score: newScore });
        
        return {
          ...contact,
          score: newScore
        };
      });
      
      setContacts(updatedContacts);
    } catch (err) {
      console.error("Error analyzing contacts:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle bulk operations
  const handleBulkDelete = () => {
    selectedContacts.forEach(contactId => {
      deleteContact(contactId);
    });
    setSelectedContacts([]);
    setShowBulkActions(false);
  };

  // Watch for selections to show/hide bulk actions
  useEffect(() => {
    setShowBulkActions(selectedContacts.length > 0);
  }, [selectedContacts]);

  // Get unique industries for filtering
  const industries = useMemo(() => 
    Array.from(new Set(contacts.map(contact => contact.industry))).filter(Boolean) as string[],
    [contacts]
  );

  const statuses = ['lead', 'prospect', 'customer', 'churned'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-white border-opacity-20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Contacts
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your contacts with AI-powered insights and glass morphism design
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium">{contacts.length}</span>
                  <span className="ml-1">Total Contacts</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="font-medium">
                    {contacts.filter(c => c.isFavorite).length}
                  </span>
                  <span className="ml-1">Favorites</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">
                    {contacts.filter(c => c.status === 'customer').length}
                  </span>
                  <span className="ml-1">Customers</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleAnalyzeAllContacts}
                disabled={isAnalyzing}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-5 h-5 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
              </button>
              
              <button 
                onClick={() => setShowAddContactModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-white border-opacity-20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contacts by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
              />
            </div>
            
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              <div className="min-w-[150px]">
                <Select
                  placeholder="Filter by Status"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={statuses.map(status => ({ 
                    value: status, 
                    label: status.charAt(0).toUpperCase() + status.slice(1) 
                  }))}
                  onChange={(selectedOption) => setActiveFilters({
                    ...activeFilters, 
                    status: selectedOption?.value || null
                  })}
                />
              </div>
              
              <div className="min-w-[150px]">
                <Select
                  placeholder="Filter by Industry"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={industries.map(industry => ({ 
                    value: industry, 
                    label: industry 
                  }))}
                  onChange={(selectedOption) => setActiveFilters({
                    ...activeFilters, 
                    industry: selectedOption?.value || null
                  })}
                />
              </div>

              {selectedContacts.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  {selectedContacts.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-blue-500 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 mr-3" />
              <span className="font-medium">
                {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedContacts([])}
                className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {storeIsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading contacts...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {storeError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">Error loading contacts: {storeError}</span>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        {!storeIsLoading && filteredContacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isSelected={selectedContacts.includes(contact.id)}
                onSelect={toggleContactSelection}
                onViewDetails={handleViewDetails}
                onEdit={handleEditContact}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!storeIsLoading && filteredContacts.length === 0 && contacts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-white border-opacity-20 p-12 max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first contact to build your network.
              </p>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl mx-auto hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Your First Contact
              </button>
            </div>
          </div>
        )}

        {/* Filtered Empty State */}
        {!storeIsLoading && filteredContacts.length === 0 && contacts.length > 0 && (
          <div className="text-center py-16">
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-white border-opacity-20 p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria to find contacts.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters({ status: null, industry: null, score: null });
                }}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <AddContactModal
          isOpen={showAddContactModal}
          onClose={() => setShowAddContactModal(false)}
          onSubmit={handleCreateContact}
        />

        <ContactDetailModal
          contact={selectedContact}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onUpdate={handleUpdateContact}
        />
      </div>
    </div>
  );
};

export default ContactsNew;