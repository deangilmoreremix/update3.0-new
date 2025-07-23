import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { X, Edit, Save, Trash2, Upload, FileText, Calendar, DollarSign, Building2, User, Phone, Mail, Clock, AlertCircle, CheckCircle, BarChart3, MessageSquare, Download, Eye, Activity, Target, TrendingUp, Zap, Brain, Heart, Share2 } from 'lucide-react';

export const EnhancedDealModal: FC<EnhancedDealModalProps> = ({
  deal,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'files' | 'analytics'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: deal.title,
    company: deal.company,
    contact: deal.contact || '',
    value: deal.value,
    stage: deal.stage,
    probability: deal.probability || 50,
    priority: deal.priority || 'medium',
    dueDate: deal.dueDate ? deal.dueDate.toISOString().split('T')[0] : '',
    notes: deal.notes || '',
    tags: deal.tags || [],
    isFavorite: deal.isFavorite || false
  });

  // Mock data for activities and attachments
  const [activities] = useState<DealActivity[]>([
    {
      id: '1',
      type: 'stage_change',
      title: 'Deal moved to Negotiation',
      description: 'Deal progressed from Proposal to Negotiation stage',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'call',
      title: 'Follow-up call completed',
      description: 'Discussed pricing and timeline. Customer showed strong interest.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: 'Mike Chen'
    },
    {
      id: '3',
      type: 'email',
      title: 'Proposal sent',
      description: 'Detailed proposal document sent to decision makers',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'Sarah Johnson'
    }
  ]);

  const [attachments, setAttachments] = useState<DealAttachment[]>([
    {
      id: '1',
      name: 'Proposal_Enterprise_CRM.pdf',
      type: 'application/pdf',
      size: 2.4 * 1024 * 1024,
      url: '#',
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      uploadedBy: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Contract_Template.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 156 * 1024,
      url: '#',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      uploadedBy: 'Legal Team'
    }
  ]);

  const [newActivity, setNewActivity] = useState({
    type: 'note' as DealActivity['type'],
    title: '',
    description: ''
  });

  useEffect(() => {
    setFormData({
      title: deal.title,
      company: deal.company,
      contact: deal.contact || '',
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability || 50,
      priority: deal.priority || 'medium',
      dueDate: deal.dueDate ? deal.dueDate.toISOString().split('T')[0] : '',
      notes: deal.notes || '',
      tags: deal.tags || [],
      isFavorite: deal.isFavorite || false
    });
  }, [deal]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(deal.id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        updatedAt: new Date()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update deal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(deal.id);
      onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAttachment: DealAttachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        uploadedBy: 'Current User'
      };
      setAttachments(prev => [...prev, newAttachment]);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.title.trim()) {
      const activity: DealActivity = {
        id: Date.now().toString(),
        type: newActivity.type,
        title: newActivity.title,
        description: newActivity.description,
        timestamp: new Date(),
        user: 'Current User'
      };
      setNewActivity({ type: 'note', title: '', description: '' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActivityIcon = (type: DealActivity['type']) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'stage_change': return <TrendingUp className="w-4 h-4" />;
      case 'file_upload': return <Upload className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'discovery': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-indigo-100 text-indigo-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{deal.title}</h2>
                <p className="text-sm text-gray-600">{deal.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
                {deal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                className={`p-2 rounded-full transition-colors ${
                  formData.isFavorite 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${formData.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Deal"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Deal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share Deal"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'files', label: 'Files', icon: Paperclip },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Deal Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input
                              type="text"
                              value={formData.contact}
                              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                            <input
                              type="number"
                              value={formData.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                            <select
                              value={formData.stage}
                              onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as Deal['stage'] }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="discovery">Discovery</option>
                              <option value="qualification">Qualification</option>
                              <option value="proposal">Proposal</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="closed-won">Closed Won</option>
                              <option value="closed-lost">Closed Lost</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              value={formData.priority}
                              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Deal['priority'] }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={formData.probability}
                              onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-600 mt-1">{formData.probability}%</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                              type="date"
                              value={formData.dueDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add deal notes..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Company</p>
                              <p className="font-medium">{deal.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Contact</p>
                              <p className="font-medium">{deal.contact || 'Not assigned'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Deal Value</p>
                              <p className="font-medium text-green-600">
                                ${deal.value.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className={`w-5 h-5 ${getPriorityColor(deal.priority || 'medium')}`} />
                            <div>
                              <p className="text-sm text-gray-500">Priority</p>
                              <p className={`font-medium capitalize ${getPriorityColor(deal.priority || 'medium')}`}>
                                {deal.priority || 'Medium'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Probability</p>
                              <p className="font-medium">{deal.probability || 50}%</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Due Date</p>
                              <p className="font-medium">
                                {deal.dueDate ? deal.dueDate.toLocaleDateString() : 'Not set'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                {!isEditing && deal.notes && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>Call {deal.contact || 'Contact'}</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-5 h-5 text-green-600" />
                      <span>Send Email</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span>Schedule Meeting</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Brain className="w-5 h-5 text-orange-600" />
                      <span>AI Analysis</span>
                    </button>
                  </div>
                </div>

                {/* Deal Progress */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Expected Value</span>
                      <span className="font-medium">
                        ${((deal.value * (deal.probability || 50)) / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${deal.probability || 50}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {deal.probability || 50}% probability
                    </div>
                  </div>
                </div>

                {/* Recent Activity Preview */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Add Activity */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Activity</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                      <select
                        value={newActivity.type}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as DealActivity['type'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="note">Note</option>
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Activity title..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Activity description..."
                    />
                  </div>
                  <button
                    onClick={handleAddActivity}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      {index !== activities.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                            <span className="text-xs text-gray-500">
                              {activity.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-2">by {activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* File Upload */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </div>
              </div>

              {/* File List */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments ({attachments.length})</h3>
                <div className="space-y-4">
                  {attachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • Uploaded by {file.uploadedBy} on {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Deal Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Expected Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${((deal.value * (deal.probability || 50)) / 100).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Days in Stage</p>
                      <p className="text-2xl font-bold text-blue-600">14</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Activities</p>
                      <p className="text-2xl font-bold text-purple-600">{activities.length}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 text-blue-600 mr-2" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Deal Health Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      This deal shows strong potential with good engagement and regular communication.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Schedule follow-up meeting within 3 days</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        <span>Consider offering a discount to accelerate closing</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Involve technical team in next discussion</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Deal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
