import React from 'react';
import { useVideoCall } from '../contexts/VideoCallContext';
import { Video, VideoOff, Phone, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';

const VideoCallPreviewWidget: React.FC = () => {
  const { callState, hidePreview, endCall } = useVideoCall();

  if (!callState.isPreviewVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
      <div className="w-80 h-48 relative">
        {/* Preview content */}
        <div className="w-full h-full bg-gradient-to-br from-green-800 to-blue-800 flex items-center justify-center">
          {callState.isVideoEnabled ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg mb-2">
                Me
              </div>
              <p className="text-white text-sm">Video Preview</p>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Video Off</p>
            </div>
          )}
        </div>

        {/* Controls overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={hidePreview}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-all duration-200"
              title="Minimize"
            >
              <Minimize2 size={16} />
            </button>
            
            {callState.isCallActive && (
              <button
                onClick={endCall}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all duration-200"
                title="End call"
              >
                <PhoneOff size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-medium">Live</span>
        </div>

        {/* Duration (if in call) */}
        {callState.isCallActive && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded px-2 py-1">
            <span className="text-white text-xs font-mono">
              {Math.floor(callState.callDuration / 60).toString().padStart(2, '0')}:
              {(callState.callDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPreviewWidget;