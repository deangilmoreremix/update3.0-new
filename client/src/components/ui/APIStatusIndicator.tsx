import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export const APIStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('connected');
  const [lastPing, setLastPing] = useState(Date.now());

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setStatus('connected');
          setLastPing(Date.now());
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    checkConnection(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'API Connected';
      case 'disconnected':
        return 'API Disconnected';
      case 'error':
        return 'API Error';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {getStatusText()}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Last ping: {new Date(lastPing).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};