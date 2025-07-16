import React, { useState } from 'react';
import { Camera, Phone, Mail, MessageSquare, FileText, TrendingUp, Target, BarChart3, Zap, Video, Star, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { SalesVideoRecorder } from './SalesVideoRecorder';

interface SalesToolsPanelProps {
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface SalesTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'communication' | 'content' | 'analytics' | 'automation';
  isPremium?: boolean;
  isActive?: boolean;
}

interface QuickAction {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  shortcut?: string;
}

export const SalesToolsPanel: React.FC<SalesToolsPanelProps> = ({
  contactId,
  contactName,
  contactEmail,
  contactPhone
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'tools' | 'quick' | 'history'>('tools');
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const salesTools: SalesTool[] = [
    {
      id: 'video-recorder',
      name: 'Video Recorder',
      description: 'Record personalized sales videos for prospects',
      icon: Camera,
      category: 'communication',
      isActive: true
    },
    {
      id: 'call-scheduler',
      name: 'Call Scheduler',
      description: 'Schedule and manage sales calls',
      icon: Phone,
      category: 'communication'
    },
    {
      id: 'email-templates',
      name: 'Email Templates',
      description: 'Use proven email templates for outreach',
      icon: Mail,
      category: 'communication'
    },
    {
      id: 'proposal-generator',
      name: 'Proposal Generator',
      description: 'Create professional proposals quickly',
      icon: FileText,
      category: 'content',
      isPremium: true
    },
    {
      id: 'lead-scoring',
      name: 'Lead Scoring',
      description: 'AI-powered lead qualification and scoring',
      icon: TrendingUp,
      category: 'analytics',
      isPremium: true
    },
    {
      id: 'competitor-analysis',
      name: 'Competitor Analysis',
      description: 'Research competitor pricing and positioning',
      icon: BarChart3,
      category: 'analytics',
      isPremium: true
    },
    {
      id: 'automation-sequences',
      name: 'Follow-up Sequences',
      description: 'Automated follow-up campaigns',
      icon: Zap,
      category: 'automation',
      isPremium: true
    },
    {
      id: 'meeting-notes',
      name: 'Smart Meeting Notes',
      description: 'AI-powered meeting transcription and notes',
      icon: MessageSquare,
      category: 'content',
      isPremium: true
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'record-video',
      name: 'Record Video',
      icon: Video,
      color: 'bg-red-500',
      description: 'Record a personalized video message',
      shortcut: 'V'
    },
    {
      id: 'schedule-call',
      name: 'Schedule Call',
      icon: Phone,
      color: 'bg-green-500',
      description: 'Schedule a sales call',
      shortcut: 'C'
    },
    {
      id: 'send-email',
      name: 'Send Email',
      icon: Mail,
      color: 'bg-blue-500',
      description: 'Send a personalized email',
      shortcut: 'E'
    },
    {
      id: 'create-proposal',
      name: 'Create Proposal',
      icon: FileText,
      color: 'bg-purple-500',
      description: 'Generate a sales proposal',
      shortcut: 'P'
    },
    {
      id: 'log-activity',
      name: 'Log Activity',
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Log sales activity',
      shortcut: 'L'
    },
    {
      id: 'view-analytics',
      name: 'View Analytics',
      icon: BarChart3,
      color: 'bg-indigo-500',
      description: 'View sales analytics',
      shortcut: 'A'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'video',
      description: 'Recorded video message for John Smith',
      timestamp: '2 hours ago',
      status: 'sent'
    },
    {
      id: '2',
      type: 'call',
      description: 'Scheduled call with Sarah Johnson',
      timestamp: '4 hours ago',
      status: 'scheduled'
    },
    {
      id: '3',
      type: 'email',
      description: 'Sent follow-up email to Mike Davis',
      timestamp: '1 day ago',
      status: 'opened'
    }
  ];

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    
    switch (toolId) {
      case 'video-recorder':
        setShowVideoRecorder(true);
        break;
      case 'call-scheduler':
        // TODO: Implement call scheduling
        alert('Call scheduling feature coming soon!');
        break;
      case 'email-templates':
        // TODO: Implement email templates
        alert('Email templates feature coming soon!');
        break;
      default:
        if (salesTools.find(tool => tool.id === toolId)?.isPremium) {
          alert('This is a premium feature. Upgrade to access it.');
        }
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'record-video':
        setShowVideoRecorder(true);
        break;
      case 'schedule-call':
        alert('Call scheduling feature coming soon!');
        break;
      case 'send-email':
        alert('Email composer feature coming soon!');
        break;
      case 'create-proposal':
        alert('Proposal generator feature coming soon!');
        break;
      case 'log-activity':
        alert('Activity logging feature coming soon!');
        break;
      case 'view-analytics':
        alert('Analytics dashboard feature coming soon!');
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'opened':
        return <Mail className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div className={`h-full flex flex-col ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Target className={`w-5 h-5 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Sales Tools
                </h2>
                {contactName && (
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Working with {contactName}
                  </p>
                )}
              </div>
            </div>
            <button className={`p-2 rounded-lg hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800 text-gray-400' : 'text-gray-500'
            }`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 py-3 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex space-x-4">
            {[
              { id: 'tools', label: 'Tools', icon: Target },
              { id: 'quick', label: 'Quick Actions', icon: Zap },
              { id: 'history', label: 'History', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as unknown)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-100 text-blue-600'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-800'
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2 inline" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'tools' && (
            <div className="space-y-6">
              {/* Communication Tools */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Communication
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salesTools.filter(tool => tool.category === 'communication').map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          tool.isActive
                            ? isDark
                              ? 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20'
                              : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                            : isDark
                              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            tool.isActive
                              ? isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                              : isDark ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              tool.isActive
                                ? isDark ? 'text-blue-400' : 'text-blue-600'
                                : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {tool.name}
                              </h4>
                              {tool.isPremium && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Tools */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Content & Proposals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salesTools.filter(tool => tool.category === 'content').map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isDark
                            ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {tool.name}
                              </h4>
                              {tool.isPremium && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Analytics & Automation */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Analytics & Automation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salesTools.filter(tool => tool.category === 'analytics' || tool.category === 'automation').map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isDark
                            ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {tool.name}
                              </h4>
                              {tool.isPremium && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quick' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className={`p-6 rounded-xl border text-center transition-all ${
                      isDark
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className={`font-medium mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {action.name}
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {action.description}
                    </p>
                    {action.shortcut && (
                      <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-xs ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        ⌘{action.shortcut}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activities
                </h3>
                <button className={`text-sm text-blue-600 hover:text-blue-700 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : ''
                }`}>
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {activity.timestamp}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(activity.status)}
                            <span className={`text-xs capitalize ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Recorder Modal */}
      <SalesVideoRecorder
        isVisible={showVideoRecorder}
        contactId={contactId}
        contactName={contactName}
        contactEmail={contactEmail}
        onClose={() => setShowVideoRecorder(false)}
        onVideoRecorded={(blob, duration) => {
          console.log('Video recorded:', { blob, duration });
          // TODO: Handle video recording completion
        }}
      />
    </>
  );
};

export default SalesToolsPanel;