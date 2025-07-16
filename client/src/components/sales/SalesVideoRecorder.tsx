import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Play, Pause, Square, Circle, Download, RotateCcw, X, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DevicePermissionChecker from '../DevicePermissionChecker';

interface SalesVideoRecorderProps {
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  onVideoRecorded?: (videoBlob: Blob, duration: number) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  recordedBlob: Blob | null;
  videoURL: string | null;
}

interface MediaState {
  stream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  hasVideoPermission: boolean;
  hasAudioPermission: boolean;
  permissionStatus: 'checking' | 'granted' | 'denied' | 'prompt';
}

export const SalesVideoRecorder: React.FC<SalesVideoRecorderProps> = ({
  contactId,
  contactName,
  contactEmail,
  onVideoRecorded,
  onClose,
  isVisible = false
}) => {
  const { isDark } = useTheme();
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    recordedBlob: null,
    videoURL: null
  });
  
  const [mediaState, setMediaState] = useState<MediaState>({
    stream: null,
    isVideoEnabled: true,
    isAudioEnabled: true,
    hasVideoPermission: false,
    hasAudioPermission: false,
    permissionStatus: 'checking'
  });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check and request permissions
  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions) {
      setMediaState(prev => ({ ...prev, permissionStatus: 'prompt' }));
      setShowPermissionModal(true);
      return;
    }

    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

      const hasVideo = cameraPermission.state === 'granted';
      const hasAudio = microphonePermission.state === 'granted';

      setMediaState(prev => ({
        ...prev,
        hasVideoPermission: hasVideo,
        hasAudioPermission: hasAudio,
        permissionStatus: hasVideo && hasAudio ? 'granted' : 
                         cameraPermission.state === 'denied' || microphonePermission.state === 'denied' ? 'denied' : 'prompt'
      }));

      if (!hasVideo || !hasAudio) {
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.warn('Permission check failed:', error);
      setMediaState(prev => ({ ...prev, permissionStatus: 'prompt' }));
      setShowPermissionModal(true);
    }
  }, []);

  // Request media permissions
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      setMediaState(prev => ({
        ...prev,
        stream,
        hasVideoPermission: true,
        hasAudioPermission: true,
        permissionStatus: 'granted'
      }));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setShowPermissionModal(false);
    } catch (error) {
      console.error('Permission request failed:', error);
      setMediaState(prev => ({ ...prev, permissionStatus: 'denied' }));
    }
  }, []);

  // Initialize media stream
  const initializeStream = useCallback(async () => {
    if (mediaState.permissionStatus === 'granted' && !mediaState.stream) {
      await requestPermissions();
    }
  }, [mediaState.permissionStatus, mediaState.stream, requestPermissions]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!mediaState.stream) {
      await initializeStream();
      return;
    }

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(mediaState.stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        setRecordingState(prev => ({
          ...prev,
          recordedBlob: blob,
          videoURL: url,
          isRecording: false,
          isPaused: false
        }));

        if (onVideoRecorded) {
          onVideoRecorded(blob, recordingState.duration);
        }
      };

      mediaRecorder.start(100);
      setRecordingState(prev => ({ ...prev, isRecording: true, duration: 0 }));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [mediaState.stream, initializeStream, onVideoRecorded, recordingState.duration]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recordingState.isRecording]);

  // Pause/Resume recording
  const toggleRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (recordingState.isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    setRecordingState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, [recordingState.isPaused]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (!mediaState.stream) return;

    const videoTracks = mediaState.stream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !mediaState.isVideoEnabled;
    });

    setMediaState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
  }, [mediaState.stream, mediaState.isVideoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (!mediaState.stream) return;

    const audioTracks = mediaState.stream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !mediaState.isAudioEnabled;
    });

    setMediaState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
  }, [mediaState.stream, mediaState.isAudioEnabled]);

  // Send video email
  const sendVideoEmail = useCallback(async () => {
    if (!recordingState.recordedBlob || !contactEmail) return;

    setIsSending(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', recordingState.recordedBlob, 'sales-video.webm');
      formData.append('to', contactEmail);
      formData.append('subject', emailSubject || `Personal message from ${contactName || 'Sales Team'}`);
      formData.append('message', emailMessage);
      formData.append('duration', recordingState.duration.toString());

      // TODO: Implement actual email sending API
      console.log('Sending video email:', {
        recipient: contactEmail,
        subject: emailSubject,
        message: emailMessage,
        duration: recordingState.duration
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Video email sent successfully!');
      resetRecorder();
    } catch (error) {
      console.error('Failed to send video email:', error);
      alert('Failed to send video email. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [recordingState.recordedBlob, contactEmail, emailSubject, emailMessage, recordingState.duration, contactName]);

  // Reset recorder
  const resetRecorder = useCallback(() => {
    if (recordingState.videoURL) {
      URL.revokeObjectURL(recordingState.videoURL);
    }

    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      recordedBlob: null,
      videoURL: null
    });

    setEmailSubject('');
    setEmailMessage('');
  }, [recordingState.videoURL]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingState.videoURL) {
        URL.revokeObjectURL(recordingState.videoURL);
      }
    };
  }, [recordingState.videoURL]);

  // Initialize on mount
  useEffect(() => {
    if (isVisible) {
      checkPermissions();
    }
  }, [isVisible, checkPermissions]);

  if (!isVisible) return null;

  return (
    <>
      <DevicePermissionChecker />
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl rounded-xl shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Camera className={`w-5 h-5 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Sales Video Recorder
              </h2>
              {contactName && (
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Recording for {contactName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              isDark ? 'hover:bg-gray-800 text-gray-400' : 'text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="p-6">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
            {recordingState.videoURL && !recordingState.isRecording ? (
              <video
                src={recordingState.videoURL}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {/* Recording indicator */}
            {recordingState.isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Circle className="w-3 h-3 text-red-500 fill-current animate-pulse" />
                  <span className="text-white text-sm font-medium">
                    {recordingState.isPaused ? 'PAUSED' : 'REC'}
                  </span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-mono">
                    {formatDuration(recordingState.duration)}
                  </span>
                </div>
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              {/* Video toggle */}
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full backdrop-blur-sm border ${
                  mediaState.isVideoEnabled 
                    ? 'bg-white/20 border-white/30 text-white' 
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {mediaState.isVideoEnabled ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </button>

              {/* Record button */}
              <button
                onClick={
                  recordingState.isRecording 
                    ? stopRecording 
                    : startRecording
                }
                disabled={mediaState.permissionStatus !== 'granted'}
                className={`p-4 rounded-full backdrop-blur-sm border-2 ${
                  recordingState.isRecording
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {recordingState.isRecording ? (
                  <Square className="w-6 h-6 fill-current" />
                ) : (
                  <Circle className="w-6 h-6 fill-current" />
                )}
              </button>

              {/* Pause/Resume button */}
              {recordingState.isRecording && (
                <button
                  onClick={toggleRecording}
                  className="p-3 rounded-full backdrop-blur-sm border bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {recordingState.isPaused ? (
                    <Play className="w-5 h-5 fill-current" />
                  ) : (
                    <Pause className="w-5 h-5 fill-current" />
                  )}
                </button>
              )}

              {/* Audio toggle */}
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full backdrop-blur-sm border ${
                  mediaState.isAudioEnabled 
                    ? 'bg-white/20 border-white/30 text-white' 
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {mediaState.isAudioEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Recording actions */}
          {recordingState.recordedBlob && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Recording complete ({formatDuration(recordingState.duration)})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetRecorder}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                  <a
                    href={recordingState.videoURL!}
                    download="sales-video.webm"
                    className={`px-4 py-2 rounded-lg border ${
                      isDark 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>

              {/* Email form */}
              {contactEmail && (
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder={`Personal message from ${contactName || 'Sales Team'}`}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        To: {contactEmail}
                      </label>
                      <textarea
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={sendVideoEmail}
                      disabled={isSending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Video Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Camera className={`w-8 h-8 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Camera & Microphone Access
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                To record sales videos, we need access to your camera and microphone
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Camera Access
                </span>
                <div className="flex items-center space-x-2">
                  {mediaState.hasVideoPermission ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`text-sm ${
                    mediaState.hasVideoPermission 
                      ? 'text-green-500' 
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {mediaState.hasVideoPermission ? 'Granted' : 'Required'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Microphone Access
                </span>
                <div className="flex items-center space-x-2">
                  {mediaState.hasAudioPermission ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`text-sm ${
                    mediaState.hasAudioPermission 
                      ? 'text-green-500' 
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {mediaState.hasAudioPermission ? 'Granted' : 'Required'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'border-gray-600 text-gray-400 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={requestPermissions}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default SalesVideoRecorder;