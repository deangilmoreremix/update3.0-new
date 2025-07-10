import React from 'react';

export interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'lead' | 'prospect' | 'customer' | 'inactive';
  className?: string;
}

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  status,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  };

  const statusPositionClasses = {
    xs: '-bottom-0 -right-0',
    sm: '-bottom-0.5 -right-0.5',
    md: '-bottom-0.5 -right-0.5',
    lg: '-bottom-1 -right-1',
    xl: '-bottom-1 -right-1'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    lead: 'bg-blue-500',
    prospect: 'bg-purple-500',
    customer: 'bg-green-500',
    inactive: 'bg-gray-400'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initialsTextSize = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-gradient-to-br from-blue-500 to-purple-600 
          flex items-center justify-center 
          text-white font-semibold
          ${initialsTextSize[size]}
          border-2 border-white shadow-sm
        `}>
          {alt ? getInitials(alt) : '?'}
        </div>
      )}
      
      {status && (
        <div 
          className={`
            absolute ${statusPositionClasses[size]} 
            ${statusSizeClasses[size]} 
            ${statusColors[status]} 
            rounded-full border-2 border-white
            ${status === 'online' ? 'animate-pulse' : ''}
          `}
        />
      )}
    </div>
  );
};