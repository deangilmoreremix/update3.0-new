import React from 'react';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  label
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    pending: 'bg-gray-400'
  };

  const labelColors = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
    info: 'text-blue-700',
    pending: 'text-gray-700'
  };

  const defaultLabels = {
    success: 'Active',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    pending: 'Pending'
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full flex-shrink-0`}
      />
      {showLabel && (
        <span className={`text-sm ${labelColors[status]}`}>
          {label || defaultLabels[status]}
        </span>
      )}
    </div>
  );
};