
import React from 'react';
import { cn } from '@/lib/utils';
import StatusIndicator from './StatusIndicator';

type StatusType = 'online' | 'away' | 'busy' | 'offline';

interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: StatusType;
  showStatus?: boolean;
  fallback?: string;
  className?: string;
}

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  src,
  alt = '',
  size = 'md',
  status = 'offline',
  showStatus = true,
  fallback,
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const statusSizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  } as const;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('avatar-with-status', className)}>
      <div
        className={cn(
          'avatar rounded-full flex items-center justify-center font-medium',
          'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
          'border-2 border-white/20 transition-all duration-300',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{fallback ? getInitials(fallback) : '?'}</span>
        )}
      </div>
      
      {showStatus && (
        <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
          <StatusIndicator
            status={status}
            size={statusSizes[size]}
            className="border-2 border-slate-900"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarWithStatus;
