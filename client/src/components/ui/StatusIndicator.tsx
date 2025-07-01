import React from 'react';

export type StatusType = 'online' | 'away' | 'offline' | 'busy' | 'dnd';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: 'bg-green-500',
    label: 'Online',
    animation: 'animate-pulse'
  },
  away: {
    color: 'bg-yellow-500',
    label: 'Away',
    animation: ''
  },
  offline: {
    color: 'bg-gray-400',
    label: 'Offline',
    animation: ''
  },
  busy: {
    color: 'bg-red-500',
    label: 'Busy',
    animation: ''
  },
  dnd: {
    color: 'bg-red-600',
    label: 'Do Not Disturb',
    animation: ''
  }
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className={`${sizeClass} ${config.color} ${config.animation} rounded-full border-2 border-white shadow-sm`}
        title={config.label}
      />
      {showLabel && (
        <span className="text-xs text-gray-600 font-medium">
          {config.label}
        </span>
      )}
    </div>
  );
};