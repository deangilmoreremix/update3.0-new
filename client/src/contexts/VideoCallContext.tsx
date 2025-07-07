import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface VideoCallState {
  isCallActive: boolean;
  isIncomingCall: boolean;
  isPreviewVisible: boolean;
  callDuration: number;
  isMuted: boolean;
  isVideoEnabled: boolean;
  callParticipant: CallParticipant | null;
  callQuality: 'excellent' | 'good' | 'fair' | 'poor';
  connectionStatus: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
}

interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

interface VideoCallContextType {
  callState: VideoCallState;
  startCall: (participant: CallParticipant) => void;
  endCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  showPreview: () => void;
  hidePreview: () => void;
  updateCallDuration: (duration: number) => void;
}

const defaultCallState: VideoCallState = {
  isCallActive: false,
  isIncomingCall: false,
  isPreviewVisible: false,
  callDuration: 0,
  isMuted: false,
  isVideoEnabled: true,
  callParticipant: null,
  callQuality: 'excellent',
  connectionStatus: 'disconnected'
};

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (context === undefined) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

interface VideoCallProviderProps {
  children: React.ReactNode;
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({ children }) => {
  const [callState, setCallState] = useState<VideoCallState>(defaultCallState);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCall = useCallback((participant: CallParticipant) => {
    setCallState(prev => ({
      ...prev,
      isCallActive: true,
      callParticipant: participant,
      connectionStatus: 'connecting',
      callDuration: 0
    }));

    // Simulate connection establishment
    setTimeout(() => {
      setCallState(prev => ({ ...prev, connectionStatus: 'connected' }));
      
      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setCallState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
      }, 1000);
    }, 2000);
  }, []);

  const endCall = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    setCallState(defaultCallState);
  }, []);

  const acceptCall = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isIncomingCall: false,
      isCallActive: true,
      connectionStatus: 'connected'
    }));

    // Start duration counter
    durationIntervalRef.current = setInterval(() => {
      setCallState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
    }, 1000);
  }, []);

  const rejectCall = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isIncomingCall: false,
      callParticipant: null
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleVideo = useCallback(() => {
    setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
  }, []);

  const showPreview = useCallback(() => {
    setCallState(prev => ({ ...prev, isPreviewVisible: true }));
  }, []);

  const hidePreview = useCallback(() => {
    setCallState(prev => ({ ...prev, isPreviewVisible: false }));
  }, []);

  const updateCallDuration = useCallback((duration: number) => {
    setCallState(prev => ({ ...prev, callDuration: duration }));
  }, []);

  const value: VideoCallContextType = {
    callState,
    startCall,
    endCall,
    acceptCall,
    rejectCall,
    toggleMute,
    toggleVideo,
    showPreview,
    hidePreview,
    updateCallDuration
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};