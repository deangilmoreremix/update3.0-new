import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  pulsing?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  label,
  className = '',
  pulsing = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'success':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-green-700',
          label: label || 'Active'
        };
      case 'pending':
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          label: label || 'Pending'
        };
      case 'inactive':
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-gray-600',
          label: label || 'Inactive'
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-red-700',
          label: label || 'Error'
        };
      default:
        return {
          bgColor: 'bg-gray-400',
          textColor: 'text-gray-600',
          label: label || 'Unknown'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses} ${config.bgColor} rounded-full ${pulsing ? 'animate-pulse' : ''}`}
        />
        {pulsing && (
          <div 
            className={`absolute inset-0 ${sizeClasses} ${config.bgColor} rounded-full animate-ping opacity-75`}
          />
        )}
      </div>
      
      {showLabel && (
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};