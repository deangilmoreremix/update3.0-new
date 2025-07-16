import React from 'react';
import { useVideoCall } from '../contexts/VideoCallContext';
import { PhoneOff, Mic, MicOff, Video, VideoOff, MoreHorizontal, Maximize2 } from 'lucide-react';

const VideoCallOverlay: React.FC = () => {
  const videoCall = useVideoCall();

  if (!videoCall.currentCall || videoCall.callStatus === 'idle') {
    return null;
  }

  // Map new context to expected callState interface
  const callState = {
    isCallActive: videoCall.currentCall !== null && videoCall.callStatus === 'connected',
    connectionStatus: videoCall.callStatus,
    callDuration: videoCall.currentCall?.duration || 0,
    isVideoEnabled: videoCall.isVideoEnabled,
    isMuted: !videoCall.isMuted,
    callParticipant: videoCall.currentCall?.participant,
    callQuality: videoCall.connectionQuality
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (callState.connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'reconnecting': return 'bg-orange-500 animate-pulse';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-full max-w-4xl mx-4 shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
            <span className="text-white text-sm font-medium">
              {callState.connectionStatus === 'connected' ? 'Connected' : 
               callState.connectionStatus === 'connecting' ? 'Connecting...' :
               callState.connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
            </span>
          </div>
          
          <div className="text-white text-lg font-mono">
            {formatDuration(callState.callDuration)}
          </div>
          
          <button className="text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative bg-gray-800 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
          {callState.isVideoEnabled ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center">
                {callState.callParticipant?.avatar ? (
                  <img 
                    src={callState.callParticipant.avatar} 
                    alt={callState.callParticipant.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20">
                    {callState.callParticipant?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {callState.callParticipant?.name || 'Unknown Caller'}
                </h3>
                <p className="text-gray-300">
                  {callState.callParticipant?.email || callState.callParticipant?.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <VideoOff size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Video is turned off</p>
              </div>
            </div>
          )}

          {/* Self video preview (small overlay) */}
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-gray-500 overflow-hidden">
            {callState.isVideoEnabled ? (
              <div className="w-full h-full bg-gradient-to-br from-green-800 to-blue-800 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                  Me
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <VideoOff size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={videoCall.toggleMute}
            className={`p-4 rounded-full transition-all duration-200 ${
              callState.isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={callState.isMuted ? 'Unmute' : 'Mute'}
          >
            {callState.isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={videoCall.toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              callState.isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={callState.isVideoEnabled ? 'Turn off video' : 'Turn on video'}
          >
            {callState.isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={videoCall.endCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all duration-200 hover:scale-105"
            title="End call"
          >
            <PhoneOff size={24} />
          </button>

          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-all duration-200">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Call quality indicator */}
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1 h-3 rounded-full ${
                  callState.callQuality === 'excellent' ? 'bg-green-400' :
                  callState.callQuality === 'good' && bar <= 3 ? 'bg-green-400' :
                  callState.callQuality === 'fair' && bar <= 2 ? 'bg-yellow-400' :
                  callState.callQuality === 'poor' && bar <= 1 ? 'bg-red-400' :
                  'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-xs">
            {callState.callQuality} quality
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCallOverlay;