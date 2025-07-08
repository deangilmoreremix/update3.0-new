import React, { createContext, useContext, useState, useCallback } from 'react';

interface VideoCallParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface VideoCallContextType {
  callStatus: 'idle' | 'connecting' | 'connected' | 'ended';
  currentCall: {
    participant: VideoCallParticipant;
    type: 'video' | 'audio';
    startTime: Date;
    duration: number;
  } | null;
  initiateCall: (participant: VideoCallParticipant, type: 'video' | 'audio') => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoEnabled: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [currentCall, setCurrentCall] = useState<VideoCallContextType['currentCall']>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  const initiateCall = useCallback(async (participant: VideoCallParticipant, type: 'video' | 'audio') => {
    try {
      setCallStatus('connecting');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentCall({
        participant,
        type,
        startTime: new Date(),
        duration: 0
      });
      
      setCallStatus('connected');
      setIsVideoEnabled(type === 'video');
      
      // Simulate random connection quality
      const qualities: ('excellent' | 'good' | 'fair' | 'poor')[] = ['excellent', 'good', 'fair', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      
    } catch (error) {
      console.error('Failed to initiate call:', error);
      setCallStatus('idle');
      setCurrentCall(null);
    }
  }, []);

  const endCall = useCallback(() => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCall(null);
      setIsMuted(false);
      setIsVideoEnabled(true);
    }, 1000);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(!isVideoEnabled);
  }, [isVideoEnabled]);

  return (
    <VideoCallContext.Provider value={{
      callStatus,
      currentCall,
      initiateCall,
      endCall,
      toggleMute,
      toggleVideo,
      isMuted,
      isVideoEnabled,
      connectionQuality
    }}>
      {children}
    </VideoCallContext.Provider>
  );
};