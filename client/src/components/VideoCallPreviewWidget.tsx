import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Minimize2, X } from 'lucide-react';
import { useVideoCall } from '../contexts/VideoCallContext';
import { useTheme } from '../contexts/ThemeContext';

interface VideoCallPreviewWidgetProps {
  className?: string;
}

export const VideoCallPreviewWidget: React.FC<VideoCallPreviewWidgetProps> = ({
  className = ''
}) => {
  const { 
    isInCall, 
    currentCall, 
    endCall, 
    toggleVideo, 
    toggleMute,
    isVideoEnabled,
    isMuted 
  } = useVideoCall();
  
  const { isDark } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeInCall, setTimeInCall] = useState(0);

  // Auto-close timer (30 seconds)
  useEffect(() => {
    if (isInCall) {
      const timer = setTimeout(() => {
        endCall();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isInCall, endCall]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isInCall) {
      interval = setInterval(() => {
        setTimeInCall(prev => prev + 1);
      }, 1000);
    } else {
      setTimeInCall(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isInCall || !currentCall) {
    return null;
  }

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 transition-all duration-300
      ${isMinimized ? 'w-16 h-16' : 'w-80 h-48'}
      ${className}
    `}>
      <div className={`
        h-full rounded-lg shadow-xl border backdrop-blur-md overflow-hidden
        ${isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        }
      `}>
        {isMinimized ? (
          // Minimized view
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <Video className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
          </div>
        ) : (
          // Full view
          <>
            {/* Header */}
            <div className={`
              px-4 py-2 flex items-center justify-between border-b
              ${isDark ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  {currentCall.contactName || 'Unknown'}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTime(timeInCall)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                >
                  <Minimize2 className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
                <button
                  onClick={endCall}
                  className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                >
                  <X className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>

            {/* Video area */}
            <div className="flex-1 relative bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm">Video Preview</span>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {currentCall.contactName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Connection quality indicator */}
              <div className="absolute top-2 left-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-green-500 rounded"></div>
                  <div className="w-1 h-3 bg-green-500 rounded"></div>
                  <div className="w-1 h-3 bg-green-500 rounded"></div>
                  <div className="w-1 h-3 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className={`
              px-4 py-3 flex items-center justify-center space-x-4 border-t
              ${isDark ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <button
                onClick={toggleMute}
                className={`
                  p-2 rounded-full transition-colors
                  ${isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : `hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`
                  }
                `}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`
                  p-2 rounded-full transition-colors
                  ${!isVideoEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : `hover:bg-gray-200 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`
                  }
                `}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={endCall}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <Phone className="w-4 h-4 transform rotate-135" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPreviewWidget;