import React, { useState, useEffect } from 'react';
import { Contact } from '../../types/contact';
import { MessageSquare, Phone, Mail, Calendar, Video, Search, Download, Clock, CheckCircle, AlertCircle, User, Paperclip, Edit, Trash2, Send, Mic, FileText, Star, ArrowRight, TrendingUp, Target, Zap } from 'lucide-react';

interface CommunicationRecord {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'sms' | 'video' | 'note';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  timestamp: Date;
  duration?: number; // for calls/meetings in minutes
  status: 'completed' | 'scheduled' | 'missed' | 'cancelled';
  participants?: string[];
  attachments?: { id: string; name: string; type: string; url: string }[];
  dealId?: string;
  outcome?: string;
  nextSteps?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

export const ContactCommunicationHistory: FC<ContactCommunicationHistoryProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'analytics' | 'compose'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | CommunicationRecord['type']>('all');
  const [filterDirection, setFilterDirection] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | CommunicationRecord['status']>('all');

  // Mock communication data
  const [communications] = useState<CommunicationRecord[]>([
    {
      id: '1',
      type: 'call',
      direction: 'outbound',
      subject: 'Follow-up on proposal discussion',
      content: 'Discussed pricing options and implementation timeline. Customer interested in premium package.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 25,
      status: 'completed',
      dealId: 'deal-123',
      outcome: 'Positive - moving to proposal stage',
      nextSteps: ['Send detailed proposal', 'Schedule technical demo'],
      sentiment: 'positive',
      tags: ['proposal', 'pricing']
    },
    {
      id: '2',
      type: 'email',
      direction: 'inbound',
      subject: 'Re: Enterprise CRM Pricing',
      content: 'Thank you for the detailed explanation. We would like to proceed with the demo next week.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed',
      attachments: [
        { id: 'att-1', name: 'requirements.pdf', type: 'application/pdf', url: '#' }
      ],
      sentiment: 'positive',
      tags: ['demo', 'requirements']
    },
    {
      id: '3',
      type: 'meeting',
      direction: 'outbound',
      subject: 'Technical Demo - Enterprise CRM',
      content: 'Comprehensive product demonstration focusing on automation features and integrations.',
      timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: 'scheduled',
      participants: ['john.doe@company.com', 'sarah.johnson@ourcrm.com'],
      dealId: 'deal-123',
      tags: ['demo', 'technical']
    },
    {
      id: '4',
      type: 'email',
      direction: 'outbound',
      subject: 'Welcome to CRM Demo Process',
      content: 'Initial outreach email with product overview and demo scheduling options.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      sentiment: 'neutral',
      tags: ['initial-contact', 'welcome']
    }
  ]);

  // New communication form state
  const [newComm, setNewComm] = useState({
    type: 'email' as CommunicationRecord['type'],
    direction: 'outbound' as CommunicationRecord['direction'],
    subject: '',
    content: '',
    scheduledTime: '',
    duration: 30,
    participants: '',
    tags: ''
  });

  // Filter communications
  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesDirection = filterDirection === 'all' || comm.direction === filterDirection;
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;

    return matchesSearch && matchesType && matchesDirection && matchesStatus;
  });

  // Communication statistics
  const stats = {
    total: communications.length,
    calls: communications.filter(c => c.type === 'call').length,
    emails: communications.filter(c => c.type === 'email').length,
    meetings: communications.filter(c => c.type === 'meeting').length,
    lastContact: communications.reduce((latest, comm) => 
      comm.timestamp > latest ? comm.timestamp : latest, new Date(0)
    ),
    responseRate: Math.round((communications.filter(c => c.direction === 'inbound').length / 
                             communications.filter(c => c.direction === 'outbound').length) * 100),
    avgResponseTime: '4.2 hours'
  };

  const getTypeIcon = (type: CommunicationRecord['type']) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: CommunicationRecord['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      case 'video': return 'bg-red-100 text-red-600';
      case 'sms': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: CommunicationRecord['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'missed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAddCommunication = () => {
    // Implementation for adding new communication
    console.log('Adding communication:', newComm);
    setNewComm({
      type: 'email',
      direction: 'outbound',
      subject: '',
      content: '',
      scheduledTime: '',
      duration: 30,
      participants: '',
      tags: ''
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'call':
        window.open(`tel:${contact.phone}`);
        break;
      case 'email':
        window.open(`mailto:${contact.email}`);
        break;
      case 'sms':
        window.open(`sms:${contact.phone}`);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                <p className="text-sm text-gray-600">{contact.title} at {contact.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {contact.status?.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Score: {contact.aiScore || contact.score || 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickAction('call')}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleQuickAction('email')}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleQuickAction('sms')}
              className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
              title="SMS"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Interactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.calls}</p>
              <p className="text-xs text-gray-500">Phone Calls</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.emails}</p>
              <p className="text-xs text-gray-500">Emails</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.meetings}</p>
              <p className="text-xs text-gray-500">Meetings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.responseRate}%</p>
              <p className="text-xs text-gray-500">Response Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.avgResponseTime}</p>
              <p className="text-xs text-gray-500">Avg Response</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'analytics', label: 'Analytics', icon: Target },
              { id: 'compose', label: 'Compose', icon: Plus }
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
        <div className="p-6 max-h-[calc(95vh-300px)] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Recent Communications */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Communications</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search communications..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="call">Calls</option>
                      <option value="email">Emails</option>
                      <option value="meeting">Meetings</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredCommunications.map(comm => (
                    <div key={comm.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-2 rounded-lg ${getTypeColor(comm.type)}`}>
                            {getTypeIcon(comm.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                              {comm.sentiment && getSentimentIcon(comm.sentiment)}
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                comm.direction === 'inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {comm.direction}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{comm.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{comm.timestamp.toLocaleString()}</span>
                              {comm.duration && <span>{comm.duration} min</span>}
                              <span className={getStatusColor(comm.status)}>{comm.status}</span>
                              {comm.attachments && comm.attachments.length > 0 && (
                                <span className="flex items-center space-x-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{comm.attachments.length}</span>
                                </span>
                              )}
                            </div>
                            {comm.tags && comm.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {comm.tags.map(tag => (
                                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            {comm.nextSteps && comm.nextSteps.length > 0 && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-1">Next Steps:</p>
                                <ul className="text-sm text-blue-800 space-y-1">
                                  {comm.nextSteps.map((step, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                      <ArrowRight className="w-3 h-3" />
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Last contact: {stats.lastContact.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('compose')}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>Send Email</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span>Schedule Meeting</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Add Note</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <span>AI Analysis</span>
                    </button>
                  </div>
                </div>

                {/* Communication Frequency */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Pattern</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="text-sm font-medium">3 interactions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Week</span>
                      <span className="text-sm font-medium">2 interactions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg per week</span>
                      <span className="text-sm font-medium">2.5 interactions</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📈 Engagement is above average. Consider scheduling a follow-up meeting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Communication Timeline</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterDirection}
                    onChange={(e) => setFilterDirection(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Directions</option>
                    <option value="inbound">Inbound</option>
                    <option value="outbound">Outbound</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="missed">Missed</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {filteredCommunications.map((comm, index) => (
                    <div key={comm.id} className="relative flex items-start space-x-6">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(comm.type)}`}>
                        {getTypeIcon(comm.type)}
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                          <span className="text-sm text-gray-500">
                            {comm.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{comm.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`px-2 py-1 rounded-full ${
                              comm.direction === 'inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {comm.direction}
                            </span>
                            <span className={getStatusColor(comm.status)}>
                              {comm.status}
                            </span>
                            {comm.duration && (
                              <span className="text-gray-500">{comm.duration} min</span>
                            )}
                          </div>
                          {comm.sentiment && (
                            <div className="flex items-center space-x-1">
                              {getSentimentIcon(comm.sentiment)}
                              <span className="text-sm text-gray-500 capitalize">{comm.sentiment}</span>
                            </div>
                          )}
                        </div>
                        {comm.attachments && comm.attachments.length > 0 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-2">Attachments</p>
                            <div className="space-y-1">
                              {comm.attachments.map(att => (
                                <div key={att.id} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{att.name}</span>
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Communication Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Response Rate</p>
                      <p className="text-2xl font-bold text-green-600">{stats.responseRate}%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Avg Response Time</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Engagement Score</p>
                      <p className="text-2xl font-bold text-purple-600">8.7</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Next Follow-up</p>
                      <p className="text-2xl font-bold text-orange-600">2 days</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Types</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Email', count: stats.emails, color: 'bg-green-500' },
                      { type: 'Phone', count: stats.calls, color: 'bg-blue-500' },
                      { type: 'Meeting', count: stats.meetings, color: 'bg-purple-500' },
                      { type: 'SMS', count: 1, color: 'bg-yellow-500' }
                    ].map(item => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm text-gray-600">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{item.count}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${(item.count / stats.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                  <div className="space-y-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 w-10">{day}</span>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">
                          {Math.floor(Math.random() * 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Compose New Communication</h3>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Communication Type</label>
                    <select
                      value={newComm.type}
                      onChange={(e) => setNewComm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="call">Phone Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="note">Note</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                    <select
                      value={newComm.direction}
                      onChange={(e) => setNewComm(prev => ({ ...prev, direction: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="outbound">Outbound</option>
                      <option value="inbound">Inbound</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newComm.subject}
                    onChange={(e) => setNewComm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Communication subject..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newComm.content}
                    onChange={(e) => setNewComm(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your message..."
                  />
                </div>

                {(newComm.type === 'meeting' || newComm.type === 'call') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                      <input
                        type="datetime-local"
                        value={newComm.scheduledTime}
                        onChange={(e) => setNewComm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newComm.duration}
                        onChange={(e) => setNewComm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Paperclip className="w-4 h-4" />
                      <span>Attach File</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Mic className="w-4 h-4" />
                      <span>Voice Note</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Save Draft
                    </button>
                    <button
                      onClick={handleAddCommunication}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
