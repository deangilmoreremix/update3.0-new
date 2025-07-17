import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  type?: 'page' | 'component' | 'feature';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Loading...', 
  type = 'page' 
}) => {
  const getLoadingMessage = () => {
    switch (type) {
      case 'feature':
        return 'Loading AI features...';
      case 'component':
        return 'Loading component...';
      default:
        return 'Loading page...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Smart CRM</h2>
        <p className="text-gray-600 mb-4">{message || getLoadingMessage()}</p>
        
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export const ComponentLoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">{message || 'Loading component...'}</p>
    </div>
  </div>
);

export const FeatureLoadingFallback: React.FC<{ feature?: string }> = ({ feature }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </div>
      <p className="text-gray-700 font-medium">Loading {feature || 'AI Feature'}...</p>
      <p className="text-gray-500 text-sm mt-1">Preparing intelligent tools</p>
    </div>
  </div>
);

export default LoadingFallback;
