import React, { useState, useEffect } from 'react';
import { Bug, Minimize2, Maximize2, X } from 'lucide-react';
import { KimiDebugInterface } from './KimiDebugInterface';

interface FloatingDebugAssistantProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export const FloatingDebugAssistant: React.FC<FloatingDebugAssistantProps> = ({
  isOpen = false,
  onToggle
}) => {
  const [open, setOpen] = useState(isOpen);
  const [minimized, setMinimized] = useState(false);
  const [errorCaught, setErrorCaught] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    // Global error listener to catch runtime errors
    const handleError = (event: ErrorEvent) => {
      setErrorCaught(event.message);
      setErrorCode(event.filename ? `File: ${event.filename}:${event.lineno}` : '');
      setOpen(true);
      setMinimized(false);
    };

    // Promise rejection listener
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrorCaught(`Unhandled Promise Rejection: ${event.reason}`);
      setErrorCode('');
      setOpen(true);
      setMinimized(false);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const toggleOpen = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
    if (newOpen) {
      setMinimized(false);
    }
  };

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorCaught(null);
    setErrorCode(null);
    onToggle?.(false);
  };

  if (!open) {
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        title="Open Kimi Debug Assistant"
      >
        <Bug className="w-6 h-6 mx-auto" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        minimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
        {minimized ? (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
            <div className="flex items-center space-x-2">
              <Bug className="w-4 h-4" />
              <span className="font-medium text-sm">Kimi Debug Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimized}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bug className="w-4 h-4" />
                <span className="font-medium text-sm">Kimi Debug Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimized}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 h-[calc(100%-48px)]">
              <KimiDebugInterface
                initialError={errorCaught || undefined}
                initialCode={errorCode || undefined}
                onClose={handleClose}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Draggable handle */}
      <div className="absolute top-0 left-0 w-full h-12 cursor-move opacity-0" />
    </div>
  );
};
