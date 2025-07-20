import React, { useContext } from 'react';

import { useContext } from 'react';

// Define the VideoCall context type to avoid import issues
interface VideoCallContextType {
  activeCall: any;
  isInCall: boolean;
  isCalling: boolean;
  callError: string | null;
  startCall: () => Promise<void>;
  endCall: () => void;
  joinCall: () => Promise<void>;
  acceptCall: () => void;
  rejectCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOn: boolean;
  localStream: any;
  remoteStream: any;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  callDuration: number;
  participants: any[];
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  sendMessage: () => void;
  messages: any[];
  shareScreen: () => Promise<void>;
  stopScreenShare: () => void;
  isScreenSharing: boolean;
}

// Fallback implementation for when context is not available
const fallbackVideoCall: VideoCallContextType = {
  activeCall: null,
  isInCall: false,
  isCalling: false,
  callError: null,
  startCall: () => Promise.resolve(),
  endCall: () => {},
  joinCall: () => Promise.resolve(),
  acceptCall: () => {},
  rejectCall: () => {},
  toggleMute: () => {},
  toggleVideo: () => {},
  isMuted: false,
  isVideoOn: true,
  localStream: null,
  remoteStream: null,
  connectionQuality: 'good' as const,
  callDuration: 0,
  participants: [],
  isRecording: false,
  startRecording: () => {},
  stopRecording: () => {},
  sendMessage: () => {},
  messages: [],
  shareScreen: () => Promise.resolve(),
  stopScreenShare: () => {},
  isScreenSharing: false,
};

// Safe hook that handles context errors gracefully
export const useSafeVideoCall = (): VideoCallContextType => {
  try {
    // Try to dynamically import and use the VideoCall context
    const { VideoCallContext } = require('../../contexts/VideoCallContext');
    const context = useContext(VideoCallContext);
    
    if (!context) {
      console.warn('VideoCall context not available, using fallback implementation');
      return fallbackVideoCall;
    }
    
    return context as VideoCallContextType;
  } catch (error) {
    console.warn('VideoCall context could not be loaded, using fallback implementation');
    return fallbackVideoCall;
  }
};

// Fallback implementation for when context is not available
const fallbackVideoCall: VideoCallContextType = {
  activeCall: null,
  isInCall: false,
  isCalling: false,
  callError: null,
  startCall: () => Promise.resolve(),
  endCall: () => {},
  joinCall: () => Promise.resolve(),
  acceptCall: () => {},
  rejectCall: () => {},
  toggleMute: () => {},
  toggleVideo: () => {},
  isMuted: false,
  isVideoOn: true,
  localStream: null,
  remoteStream: null,
  connectionQuality: 'good' as const,
  callDuration: 0,
  participants: [],
  isRecording: false,
  startRecording: () => {},
  stopRecording: () => {},
  sendMessage: () => {},
  messages: [],
  shareScreen: () => Promise.resolve(),
  stopScreenShare: () => {},
  isScreenSharing: false,
};

// Safe hook that handles context errors gracefully
export const useSafeVideoCall = (): VideoCallContextType => {
  try {
    // Try to dynamically import and use the VideoCall context
    const { VideoCallContext } = require('../../contexts/VideoCallContext');
    const context = useContext(VideoCallContext);
    
    if (!context) {
      console.warn('VideoCall context not available, using fallback implementation');
      return fallbackVideoCall;
    }
    
    return context;
  } catch (error) {
    console.warn('VideoCall context could not be loaded, using fallback implementation');
    return fallbackVideoCall;
  }
};
