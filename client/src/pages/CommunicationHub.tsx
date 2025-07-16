import React, { useState } from 'react';
import { MessageSquare, Video, Mail, Phone, Send, Users, Megaphone, Clock, CheckCircle } from 'lucide-react';
import VideoCallPreviewWidget from '../components/VideoCallPreviewWidget';
import { useVideoCall } from '../contexts/VideoCallContext';

const CommunicationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showVideoWidget, setShowVideoWidget] = useState(false);
  const { initiateCall } = useVideoCall();

  const communicationChannels = [
    {
      name: 'Email Campaigns',
      description: 'Automated email marketing and follow-ups',
      icon: <Mail className="h-6 w-6" />,
      count: 12,
      color: 'bg-blue-500'
    },
    {
      name: 'Text Messages',
      description: 'SMS marketing and customer notifications',
      icon: <MessageSquare className="h-6 w-6" />,
      count: 45,
      color: 'bg-green-500'
    },
    {
      name: 'Video Calls',
      description: 'Video conferencing and screen sharing',
      icon: <Video className="h-6 w-6" />,
      count: 8,
      color: 'bg-purple-500'
    },
    {
      name: 'Phone Calls',
      description: 'Voice calling and call recording',
      icon: <Phone className="h-6 w-6" />,
      count: 23,
      color: 'bg-orange-500'
    },
    {
      name: 'Team Chat',
      description: 'Internal team communication',
      icon: <Users className="h-6 w-6" />,
      count: 156,
      color: 'bg-indigo-500'
    },
    {
      name: 'Announcements',
      description: 'Company-wide announcements and updates',
      icon: <Megaphone className="h-6 w-6" />,
      count: 3,
      color: 'bg-red-500'
    }
  ];

  const recentMessages = [
    { 
      type: 'email', 
      contact: 'John Smith', 
      subject: 'Follow-up on proposal', 
      time: '2 hours ago',
      status: 'sent'
    },
    { 
      type: 'sms', 
      contact: 'Sarah Johnson', 
      subject: 'Meeting reminder', 
      time: '4 hours ago',
      status: 'delivered'
    },
    { 
      type: 'call', 
      contact: 'Mike Wilson', 
      subject: 'Sales discussion', 
      time: '1 day ago',
      status: 'completed'
    },
    { 
      type: 'email', 
      contact: 'Lisa Chen', 
      subject: 'Contract review', 
      time: '2 days ago',
      status: 'opened'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'opened': return 'text-purple-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic here
      setNewMessage('');
    }
  };

  const handleVideoCall = () => {
    // Create a generic participant for the video call
    const participant = {
      id: 'video-call-' + Date.now(),
      name: 'Video Call',
      email: 'video@example.com',
      avatar: '/api/placeholder/40/40'
    };
    
    initiateCall(participant);
    setShowVideoWidget(true);
    
    // Auto-hide after 30 seconds to prevent persistence
    setTimeout(() => {
      setShowVideoWidget(false);
    }, 30000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
        <p className="text-gray-600 mt-2">Manage all your customer communications in one place</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'channels' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'compose' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Compose
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages Today</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Megaphone className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.3h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Communications</h3>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500">
                      {getTypeIcon(message.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{message.contact}</p>
                      <p className="text-sm text-gray-600">{message.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(message.status)} capitalize`}>
                      {message.status}
                    </p>
                    <p className="text-sm text-gray-500">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communicationChannels.map((channel, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                  {channel.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                  <p className="text-sm text-gray-600">{channel.count} active</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{channel.description}</p>
              <button 
                onClick={channel.name === 'Video Calls' ? handleVideoCall : () => {}}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                {channel.name === 'Video Calls' ? 'Start Video Call' : 'Open Channel'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Video Call Widget - Temporary */}
      {showVideoWidget && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Video Call</h4>
              <button 
                onClick={() => setShowVideoWidget(false)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Close video call"
              >
                ✕
              </button>
            </div>
            <div className="relative">
              <VideoCallPreviewWidget />
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Video call will close automatically in 30 seconds
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose New Message</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Team Chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Save Draft
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationHub;