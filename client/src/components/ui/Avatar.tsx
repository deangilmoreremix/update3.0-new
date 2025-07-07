import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
  showStatus?: boolean;
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  status = 'offline',
  showStatus = false,
  fallback,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm';
      case 'lg': return 'w-16 h-16 text-xl';
      case 'xl': return 'w-24 h-24 text-3xl';
      case 'md':
      default: return 'w-12 h-12 text-lg';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      case 'offline':
      default: return 'bg-gray-400';
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-4 h-4';
      case 'xl': return 'w-6 h-6';
      case 'md':
      default: return 'w-3 h-3';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${getSizeClasses()} rounded-full object-cover border-2 border-white/20 backdrop-blur-sm`}
        />
      ) : (
        <div className={`${getSizeClasses()} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white/20 backdrop-blur-sm`}>
          {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </div>
      )}
      
      {showStatus && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${getStatusSize()} ${getStatusColor()} rounded-full border-2 border-white`}>
          {status === 'online' && (
            <div className={`${getStatusSize()} ${getStatusColor()} rounded-full animate-pulse`}></div>
          )}
        </div>
      )}
    </div>
  );
};