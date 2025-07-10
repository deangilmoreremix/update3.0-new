import React, { useEffect, useState } from 'react';
import { Camera, Mic, AlertTriangle, Check, X } from 'lucide-react';

interface PermissionStatus {
  camera: 'granted' | 'denied' | 'prompt' | 'checking';
  microphone: 'granted' | 'denied' | 'prompt' | 'checking';
}

const DevicePermissionChecker: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: 'checking',
    microphone: 'checking'
  });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (!navigator.permissions) {
      // Fallback for browsers that don't support permissions API
      setPermissions({
        camera: 'prompt',
        microphone: 'prompt'
      });
      setHasChecked(true);
      return;
    }

    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

      setPermissions({
        camera: cameraPermission.state,
        microphone: microphonePermission.state
      });

      // Show modal if any permissions are denied or need to be prompted
      if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied' ||
          cameraPermission.state === 'prompt' || microphonePermission.state === 'prompt') {
        setShowPermissionModal(true);
      }

      setHasChecked(true);
    } catch (error) {
      console.warn('Permission check failed:', error);
      setPermissions({
        camera: 'prompt',
        microphone: 'prompt'
      });
      setHasChecked(true);
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop());

      setPermissions({
        camera: 'granted',
        microphone: 'granted'
      });
      setShowPermissionModal(false);
    } catch (error) {
      console.error('Permission request failed:', error);
      // Re-check permissions to get updated status
      checkPermissions();
    }
  };

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted': return <Check className="w-5 h-5 text-green-500" />;
      case 'denied': return <X className="w-5 h-5 text-red-500" />;
      case 'checking': return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPermissionText = (status: string) => {
    switch (status) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      case 'checking': return 'Checking...';
      default: return 'Required';
    }
  };

  if (!showPermissionModal || !hasChecked) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Camera & Microphone Access
          </h2>
          <p className="text-gray-600">
            Smart CRM needs access to your camera and microphone for video calls and voice features.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Camera</span>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.camera)}
              <span className="text-sm font-medium text-gray-600">
                {getPermissionText(permissions.camera)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Microphone</span>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.microphone)}
              <span className="text-sm font-medium text-gray-600">
                {getPermissionText(permissions.microphone)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowPermissionModal(false)}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={requestPermissions}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Allow Access
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change these permissions later in your browser settings.
        </p>
      </div>
    </div>
  );
};

export default DevicePermissionChecker;