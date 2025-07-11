import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Loader2, Brain, Zap, Settings } from 'lucide-react';
import { validateAPIConfig, isAIConfigured } from '../../config/apiConfig';

export const APIStatusIndicator: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<{
    configured: string[];
    missing: string[];
    isLoading: boolean;
  }>({
    configured: [],
    missing: [],
    isLoading: true
  });

  useEffect(() => {
    const checkAPIStatus = () => {
      const { configured, missing } = validateAPIConfig();
      setApiStatus({
        configured,
        missing,
        isLoading: false
      });
    };

    checkAPIStatus();
    
    // Check API status every 30 seconds
    const interval = setInterval(checkAPIStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (apiStatus.isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    if (apiStatus.missing.length === 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (apiStatus.configured.length > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (apiStatus.isLoading) return 'border-blue-200 bg-blue-50';
    if (apiStatus.missing.length === 0) return 'border-green-200 bg-green-50';
    if (apiStatus.configured.length > 0) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  const getStatusText = () => {
    if (apiStatus.isLoading) return 'Checking API status...';
    if (apiStatus.missing.length === 0) return 'All AI services configured';
    if (apiStatus.configured.length > 0) {
      return `${apiStatus.configured.length} of ${apiStatus.configured.length + apiStatus.missing.length} services configured`;
    }
    return 'No AI services configured';
  };

  const getRouteInfo = () => {
    if (!isAIConfigured()) {
      return (
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1 mb-1">
            <Settings className="w-3 h-3" />
            <span>Add API keys to enable AI features</span>
          </div>
          <div className="text-gray-500">
            Go to Settings → API Configuration
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex items-center space-x-1 mb-1">
          <Brain className="w-3 h-3" />
          <span>AI features available:</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-gray-500">
          <div>• Content Generation</div>
          <div>• Smart Analysis</div>
          <div>• Contact Enrichment</div>
          <div>• Deal Intelligence</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-lg border p-3 transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            AI Services Status
          </div>
          <div className="text-xs text-gray-600">
            {getStatusText()}
          </div>
        </div>
        <Zap className="w-4 h-4 text-gray-400" />
      </div>

      {/* Configured Services */}
      {apiStatus.configured.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-gray-700 mb-1">
            Configured:
          </div>
          <div className="flex flex-wrap gap-1">
            {apiStatus.configured.map((service) => (
              <span
                key={service}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Services */}
      {apiStatus.missing.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-gray-700 mb-1">
            Missing:
          </div>
          <div className="flex flex-wrap gap-1">
            {apiStatus.missing.map((service) => (
              <span
                key={service}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800"
              >
                <XCircle className="w-3 h-3 mr-1" />
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {getRouteInfo()}
    </div>
  );
};