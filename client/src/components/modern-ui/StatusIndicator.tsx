import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'online' | 'away' | 'busy' | 'offline' | 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = false,
  className
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-4 h-4';
      case 'md':
      default: return 'w-3 h-3';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'active':
      case 'success':
        return 'bg-green-400';
      case 'away':
      case 'warning':
        return 'bg-yellow-400';
      case 'busy':
      case 'error':
        return 'bg-red-400';
      case 'pending':
        return 'bg-orange-400';
      case 'offline':
      case 'inactive':
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div 
        className={cn(
          'rounded-full border-2 border-white',
          getSizeClasses(),
          getStatusColor(),
          pulse && 'animate-pulse'
        )}
      />
      {pulse && (
        <div 
          className={cn(
            'absolute inset-0 rounded-full animate-ping',
            getSizeClasses(),
            getStatusColor(),
            'opacity-75'
          )}
        />
      )}
    </div>
  );
};