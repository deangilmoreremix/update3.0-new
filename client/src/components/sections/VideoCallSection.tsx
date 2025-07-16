import React, { useState } from 'react';
import { Video, History } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useVideoCall } from '../../contexts/VideoCallContext';
import CallButton from '../video/CallButton';
import CallHistory from '../video/CallHistory';
import CallRecording from '../video/CallRecording';

const VideoCallSection: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'controls' | 'history' | 'recording'>('controls');
  const { localStream, remoteStream, isInCall, callStatus } = useVideoCall();

  // Demo contacts for video calling
  const demoContacts = [
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@microsoft.com',
      avatarSrc: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '2',
      name: 'Darlene Robertson',
      email: 'darlene.r@ford.com',
      avatarSrc: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '3',
      name: 'Wade Warren',
      email: 'wade.warren@zenith.com',
      avatarSrc: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  const tabs = [
    { id: 'controls', label: 'Call Controls', icon: Video },
    { id: 'history', label: 'Call History', icon: History },
    { id: 'recording', label: 'Recording', icon: Play }
  ];

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm ${
      isDark 
        ? 'bg-gray-800/50 border-white/10' 
        : 'bg-white/90 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Video className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Video Calling System
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Professional WebRTC video calls with recording
            </p>
          </div>
        </div>

        {/* Call Status Indicator */}
        {isInCall && (
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {callStatus === 'connected' ? 'In Call' : callStatus}
            </span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'controls' | 'history' | 'recording')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
            }`}
          >
            <tab.icon size={16} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'controls' && (
          <div className="space-y-6">
            {/* Quick Call Section */}
            <div>
              <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Call Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700/50 border-white/10' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={contact.avatarSrc}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {contact.name}
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <CallButton contact={contact} variant="full" size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Call Status */}
            <div className={`p-4 rounded-lg border ${
              isDark ? 'bg-gray-700/50 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                WebRTC Connection Status
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Call Status</p>
                  <p className={`font-medium capitalize ${
                    callStatus === 'connected' ? 'text-green-400' : 
                    callStatus === 'calling' || callStatus === 'ringing' ? 'text-yellow-400' : 
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {callStatus}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Local Stream</p>
                  <p className={`font-medium ${
                    localStream ? 'text-green-400' : isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {localStream ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Remote Stream</p>
                  <p className={`font-medium ${
                    remoteStream ? 'text-green-400' : isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {remoteStream ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Technology</p>
                  <p className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    Native WebRTC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <CallHistory />
        )}

        {activeTab === 'recording' && (
          <CallRecording 
            isInCall={isInCall}
            localStream={localStream}
            remoteStream={remoteStream}
          />
        )}
      </div>
    </div>
  );
};

export default VideoCallSection;