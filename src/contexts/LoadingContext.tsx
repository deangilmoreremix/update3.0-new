import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Loader2, Brain, Zap } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  loadingType: 'default' | 'ai' | 'data' | 'upload';
  setLoading: (loading: boolean, message?: string, type?: 'default' | 'ai' | 'data' | 'upload') => void;
  startLoading: (message?: string, type?: 'default' | 'ai' | 'data' | 'upload') => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingType, setLoadingType] = useState<'default' | 'ai' | 'data' | 'upload'>('default');

  const setLoading = (
    loading: boolean, 
    message: string = 'Loading...', 
    type: 'default' | 'ai' | 'data' | 'upload' = 'default'
  ) => {
    setIsLoading(loading);
    setLoadingMessage(message);
    setLoadingType(type);
  };

  const startLoading = (
    message: string = 'Loading...', 
    type: 'default' | 'ai' | 'data' | 'upload' = 'default'
  ) => {
    setLoading(true, message, type);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const getLoadingIcon = () => {
    switch (loadingType) {
      case 'ai':
        return <Brain className="h-8 w-8 text-purple-600 animate-pulse" />;
      case 'data':
        return <Zap className="h-8 w-8 text-blue-600 animate-pulse" />;
      case 'upload':
        return <Loader2 className="h-8 w-8 text-green-600 animate-spin" />;
      default:
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />;
    }
  };

  const getLoadingColor = () => {
    switch (loadingType) {
      case 'ai':
        return 'from-purple-500 to-indigo-600';
      case 'data':
        return 'from-blue-500 to-cyan-600';
      case 'upload':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      loadingType,
      setLoading,
      startLoading,
      stopLoading
    }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4 text-center">
            <div className="flex justify-center mb-4">
              {getLoadingIcon()}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loadingType === 'ai' && 'AI Processing'}
              {loadingType === 'data' && 'Loading Data'}
              {loadingType === 'upload' && 'Uploading'}
              {loadingType === 'default' && 'Please Wait'}
            </h3>
            
            <p className="text-gray-600 mb-4">{loadingMessage}</p>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getLoadingColor()} animate-pulse`}
                style={{
                  width: '100%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </div>
            
            {loadingType === 'ai' && (
              <p className="text-xs text-gray-500 mt-3">
                AI is analyzing your request...
              </p>
            )}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

// Hook for easy loading management in components
export const useLoadingState = () => {
  const { startLoading, stopLoading } = useLoading();
  
  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    message: string = 'Processing...',
    type: 'default' | 'ai' | 'data' | 'upload' = 'default'
  ): Promise<T> => {
    try {
      startLoading(message, type);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return { withLoading, startLoading, stopLoading };
};
