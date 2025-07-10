import React from 'react';
import { User } from 'lucide-react';

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
  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5', 
    xl: 'w-4 h-4'
  };

  // Status color mappings
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    lead: 'bg-blue-500',
    prospect: 'bg-purple-500',
    customer: 'bg-green-600',
    inactive: 'bg-gray-300'
  };

  // Generate initials from alt text
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm`}>
        {src ? (
          <img 
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and show fallback
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {alt ? (
              <span className={`font-semibold text-gray-700 ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'}`}>
                {getInitials(alt)}
              </span>
            ) : (
              <User className={`${iconSizes[size]} text-gray-500`} />
            )}
          </div>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div className={`
          absolute -bottom-0.5 -right-0.5 
          ${statusSizes[size]} 
          ${statusColors[status]} 
          rounded-full border-2 border-white
          ${status === 'online' ? 'animate-pulse' : ''}
        `} />
      )}
    </div>
  );
};