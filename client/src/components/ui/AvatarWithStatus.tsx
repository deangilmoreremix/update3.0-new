import React from 'react';
import { User } from 'lucide-react';

export interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'lead' | 'prospect' | 'customer' | 'inactive';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const statusIndicatorSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4'
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

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  status,
  className = '' 
}) => {
  const initials = alt ? getInitials(alt) : '';

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        overflow-hidden 
        bg-gradient-to-br from-blue-400 to-purple-500 
        flex items-center justify-center
        border-2 border-white
        shadow-sm
      `}>
        {src ? (
          <img 
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide the broken image and show initials instead
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : initials ? (
          <span className={`
            text-white font-semibold
            ${size === 'xs' ? 'text-xs' : ''}
            ${size === 'sm' ? 'text-sm' : ''}
            ${size === 'md' ? 'text-sm' : ''}
            ${size === 'lg' ? 'text-base' : ''}
            ${size === 'xl' ? 'text-lg' : ''}
          `}>
            {initials}
          </span>
        ) : (
          <User className={`
            text-white
            ${size === 'xs' ? 'w-3 h-3' : ''}
            ${size === 'sm' ? 'w-4 h-4' : ''}
            ${size === 'md' ? 'w-5 h-5' : ''}
            ${size === 'lg' ? 'w-6 h-6' : ''}
            ${size === 'xl' ? 'w-8 h-8' : ''}
          `} />
        )}
        
        {/* Fallback initials display if image fails to load */}
        {src && (
          <span className={`
            absolute inset-0 flex items-center justify-center
            text-white font-semibold bg-gradient-to-br from-blue-400 to-purple-500
            ${size === 'xs' ? 'text-xs' : ''}
            ${size === 'sm' ? 'text-sm' : ''}
            ${size === 'md' ? 'text-sm' : ''}
            ${size === 'lg' ? 'text-base' : ''}
            ${size === 'xl' ? 'text-lg' : ''}
          `} style={{ display: 'none' }}>
            {initials || <User className="w-4 h-4" />}
          </span>
        )}
      </div>
      
      {/* Status Indicator */}
      {status && (
        <div className={`
          absolute bottom-0 right-0 
          ${statusIndicatorSizes[size]} 
          ${statusColors[status]} 
          rounded-full 
          border-2 border-white
          ${status === 'online' ? 'animate-pulse' : ''}
        `} />
      )}
    </div>
  );
};