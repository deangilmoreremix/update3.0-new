import { useContext } from 'react';
import { VideoCallContext } from '../contexts/VideoCallContext';

// Fallback implementation for when VideoCallProvider is not available
const fallbackVideoCall = {
  // Call State
  currentCall: null,
  callStatus: 'idle' as const,
  isInCall: false,
  callDuration: 0,
  
  // Stream Management
  localStream: null,
  remoteStream: null,
  isVideoEnabled: true,
  isAudioEnabled: true,
  
  // Call Actions
  startCall: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  endCall: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  acceptCall: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  rejectCall: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  
  // Media Controls
  toggleVideo: () => {
    console.warn('VideoCall: Provider not available - using fallback');
  },
  toggleAudio: () => {
    console.warn('VideoCall: Provider not available - using fallback');
  },
  
  // Group Calls
  participants: [],
  addParticipantToCall: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  
  // Chat/Data Channel
  sendMessage: () => {
    console.warn('VideoCall: Provider not available - using fallback');
  },
  onMessageReceived: () => {
    console.warn('VideoCall: Provider not available - using fallback');
  },
  
  // Recording
  startRecording: async () => {
    console.warn('VideoCall: Provider not available - using fallback');
    return Promise.resolve();
  },
  stopRecording: () => {
    console.warn('VideoCall: Provider not available - using fallback');
  },
  isRecording: false,
};

/**
 * Safe hook that never throws context errors
 * Always returns a valid VideoCall interface, with fallback implementation when provider is missing
 */
export const useSafeVideoCall = () => {
  try {
    const context = useContext(VideoCallContext);
    if (!context) {
      console.warn('VideoCall context not found, using fallback implementation');
      return fallbackVideoCall;
    }
    return context;
  } catch (error) {
    console.warn('Error accessing VideoCall context, using fallback:', error);
    return fallbackVideoCall;
  }
};

/**
 * Hook to check if VideoCall functionality is available
 */
export const useVideoCallAvailable = () => {
  try {
    const context = useContext(VideoCallContext);
    return !!context;
  } catch {
    return false;
  }
};
