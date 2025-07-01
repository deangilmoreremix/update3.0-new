
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'away' | 'busy' | 'offline';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = true,
  className
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div
      className={cn(
        'status-dot rounded-full inline-block relative',
        `status-dot--${status}`,
        sizeClasses[size],
        pulse && 'after:animate-pulse-modern',
        className
      )}
    />
  );
};

export default StatusIndicator;
