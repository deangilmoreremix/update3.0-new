import React from 'react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';

interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  name?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  src,
  alt,
  name,
  status = 'offline',
  size = 'md',
  showStatus = true,
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusSizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  } as const;

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">
            {getInitials(name)}
          </span>
        )}
      </div>
      
      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusIndicator
            status={status}
            size={statusSizes[size]}
            pulse={status === 'online'}
          />
        </div>
      )}
    </div>
  );
};